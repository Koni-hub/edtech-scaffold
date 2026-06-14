import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { calculateUnderstandingScore } from "@/lib/analytics/understanding-score"
import { calculateRetentionScore } from "@/lib/analytics/retention-score"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: masteries } = await supabase
    .from("topic_mastery")
    .select("*")
    .eq("user_id", user.id)

  const topics = masteries ?? []
  const topicsCovered = topics.length

  const { count: quizzesTaken } = await supabase
    .from("quizzes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: totalQuestionsAnswered } = await supabase
    .from("quiz_attempts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const topicInputs = topics.map((t) => {
    const sessionsMap = new Map<string, { correct: number; total: number }>()
    return {
      topic: t.topic,
      totalAttempts: t.total_attempts,
      correctAttempts: t.correct_attempts,
      recentAttempts: [] as { isCorrect: boolean; attemptedAt: Date }[],
      sessions: [] as { sessionDate: Date; accuracy: number }[],
    }
  })

  const understandingResult = calculateUnderstandingScore(
    topicInputs.map((t) => ({
      topic: t.topic,
      totalAttempts: t.totalAttempts,
      correctAttempts: t.correctAttempts,
      recentAttempts: t.recentAttempts,
    }))
  )

  const { data: attemptData } = await supabase
    .from("quiz_attempts")
    .select("attempted_at, is_correct")
    .eq("user_id", user.id)
    .order("attempted_at", { ascending: true })

  const dayGroups = new Map<string, { correct: number; total: number }>()
  if (attemptData) {
    for (const a of attemptData) {
      const day = a.attempted_at.split("T")[0]
      const entry = dayGroups.get(day) ?? { correct: 0, total: 0 }
      entry.total++
      if (a.is_correct) entry.correct++
      dayGroups.set(day, entry)
    }
  }

  const retentionInputs = topics.map((t) => {
    const sessions = Array.from(dayGroups.entries())
      .filter(([_, stats]) => stats.total > 0)
      .map(([date, stats]) => ({
        sessionDate: new Date(date),
        accuracy: stats.correct / stats.total,
      }))

    return { topic: t.topic, sessions }
  })

  const retentionResult = calculateRetentionScore(retentionInputs)

  let streakDays = 0
  if (dayGroups.size > 0) {
    const sortedDays = Array.from(dayGroups.keys()).sort().reverse()
    const today = new Date().toISOString().split("T")[0]
    let checkDate = new Date(today)

    for (const day of sortedDays) {
      const expected = checkDate.toISOString().split("T")[0]
      if (day === expected) {
        streakDays++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
  }

  const snapshot = {
    user_id: user.id,
    snapshot_date: new Date().toISOString().split("T")[0],
    overall_understanding: understandingResult.understandingScore,
    overall_retention: retentionResult.retentionScore,
    topics_covered: topicsCovered,
    quizzes_taken: quizzesTaken ?? 0,
    total_questions_answered: totalQuestionsAnswered ?? 0,
    streak_days: streakDays,
  }

  const { data: existing } = await supabase
    .from("analytics_snapshots")
    .select("id")
    .eq("user_id", user.id)
    .eq("snapshot_date", snapshot.snapshot_date)
    .single()

  if (existing) {
    await supabase
      .from("analytics_snapshots")
      .update(snapshot)
      .eq("id", existing.id)
  } else {
    await supabase
      .from("analytics_snapshots")
      .insert(snapshot)
  }

  return NextResponse.json({
    overallUnderstanding: snapshot.overall_understanding,
    overallRetention: snapshot.overall_retention,
    topicsCovered: snapshot.topics_covered,
    quizzesTaken: snapshot.quizzes_taken,
    totalQuestionsAnswered: snapshot.total_questions_answered,
    streakDays: snapshot.streak_days,
    topicScores: topics.map((t) => ({
      topic: t.topic,
      understanding: understandingResult.topicScores[t.topic] ?? t.understanding_score,
      retention: retentionResult.topicRetention[t.topic] ?? t.retention_score,
    })),
  })
}
