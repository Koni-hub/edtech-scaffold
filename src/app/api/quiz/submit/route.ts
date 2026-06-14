import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { calculateUnderstandingScore } from "@/lib/analytics/understanding-score"
import { calculateRetentionScore } from "@/lib/analytics/retention-score"
import type { Quiz, Question, QuizAttempt, TopicMastery } from "@/lib/types/database"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { quizId, answers }: { quizId: string; answers: { questionId: string; givenAnswer: string }[] } = body

  if (!quizId || !answers || !Array.isArray(answers)) {
    return NextResponse.json({ error: "quizId and answers are required" }, { status: 400 })
  }

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", quizId)
    .single()

  if (quizError || !quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
  }

  if ((quiz as Quiz).user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .in("id", answers.map((a) => a.questionId))

  if (questionsError || !questions) {
    return NextResponse.json({ error: "Questions not found" }, { status: 404 })
  }

  const questionMap = new Map(questions.map((q) => [q.id, q as Question]))

  const attemptResults: {
    questionId: string
    givenAnswer: string
    correctAnswer: string
    isCorrect: boolean
    explanation: string | null
  }[] = []

  const attemptInserts: Omit<QuizAttempt, "id" | "attempted_at">[] = []

  for (const answer of answers) {
    const question = questionMap.get(answer.questionId)
    if (!question) continue

    const isCorrect = question.correct_answer === answer.givenAnswer

    attemptInserts.push({
      quiz_id: quizId,
      user_id: user.id,
      question_id: answer.questionId,
      given_answer: answer.givenAnswer,
      is_correct: isCorrect,
      time_spent_ms: 0,
    })

    attemptResults.push({
      questionId: answer.questionId,
      givenAnswer: answer.givenAnswer,
      correctAnswer: question.correct_answer,
      isCorrect,
      explanation: question.explanation,
    })
  }

  const { error: insertError } = await supabase
    .from("quiz_attempts")
    .insert(attemptInserts)

  if (insertError) {
    return NextResponse.json({ error: "Failed to record attempts" }, { status: 500 })
  }

  const topicGroups: Record<string, { questionId: string; isCorrect: boolean }[]> = {}
  for (const attempt of attemptResults) {
    const question = questionMap.get(attempt.questionId)
    if (!question) continue
    const topic = question.topic || "general"
    if (!topicGroups[topic]) topicGroups[topic] = []
    topicGroups[topic].push({ questionId: attempt.questionId, isCorrect: attempt.isCorrect })
  }

  const now = new Date().toISOString()

  for (const [topic, attempts] of Object.entries(topicGroups)) {
    const correctCount = attempts.filter((a) => a.isCorrect).length

    const { data: existing } = await supabase
      .from("topic_mastery")
      .select("*")
      .eq("user_id", user.id)
      .eq("topic", topic)
      .single()

    if (existing) {
      const tm = existing as TopicMastery
      const newTotal = tm.total_attempts + attempts.length
      const newCorrect = tm.correct_attempts + correctCount

      const { data: recentRaw } = await supabase
        .from("quiz_attempts")
        .select("is_correct, attempted_at")
        .eq("user_id", user.id)
        .in("question_id", attempts.map((a) => a.questionId))
        .order("attempted_at", { ascending: false })
        .limit(20)

      const recentAttempts = (recentRaw ?? []).map((r) => ({
        isCorrect: r.is_correct,
        attemptedAt: new Date(r.attempted_at),
      }))

      const understanding = calculateUnderstandingScore([
        { topic, totalAttempts: newTotal, correctAttempts: newCorrect, recentAttempts },
      ])

      // Get question IDs for this topic to filter attempts
      const { data: topicQ } = await supabase
        .from("questions")
        .select("id")
        .eq("topic", topic)
      const topicQIds = (topicQ ?? []).map((q) => q.id)

      const { data: sessionRaw } = await supabase
        .from("quiz_attempts")
        .select("attempted_at, is_correct")
        .eq("user_id", user.id)
        .in("question_id", topicQIds.length > 0 ? topicQIds : [""])
        .order("attempted_at", { ascending: true })

      const sessionMap = new Map<string, { correct: number; total: number }>()
      if (sessionRaw) {
        for (const s of sessionRaw) {
          const day = s.attempted_at.split("T")[0]
          const entry = sessionMap.get(day) ?? { correct: 0, total: 0 }
          entry.total++
          if (s.is_correct) entry.correct++
          sessionMap.set(day, entry)
        }
      }

      const sessions = Array.from(sessionMap.entries()).map(([date, stats]) => ({
        sessionDate: new Date(date),
        accuracy: stats.total > 0 ? stats.correct / stats.total : 0,
      }))

      const retention = calculateRetentionScore([{ topic, sessions }])

      await supabase
        .from("topic_mastery")
        .update({
          total_attempts: newTotal,
          correct_attempts: newCorrect,
          understanding_score: understanding.topicScores[topic],
          retention_score: retention.topicRetention[topic],
          last_assessed_at: now,
          updated_at: now,
        })
        .eq("id", existing.id)
    } else {
      const understanding = calculateUnderstandingScore([
        { topic, totalAttempts: attempts.length, correctAttempts: correctCount, recentAttempts: attempts.map((a) => ({ isCorrect: a.isCorrect, attemptedAt: new Date() })) },
      ])

      await supabase
        .from("topic_mastery")
        .insert({
          user_id: user.id,
          topic,
          total_attempts: attempts.length,
          correct_attempts: correctCount,
          understanding_score: understanding.topicScores[topic],
          retention_score: 0,
          last_assessed_at: now,
        })
    }
  }

  const correctTotal = attemptResults.filter((r) => r.isCorrect).length
  const score = answers.length > 0 ? Math.round((correctTotal / answers.length) * 10000) / 100 : 0

  const { data: masteries } = await supabase
    .from("topic_mastery")
    .select("*")
    .eq("user_id", user.id)

  const topicScores: Record<string, number> = {}
  if (masteries) {
    for (const m of masteries) {
      topicScores[m.topic] = m.understanding_score
    }
  }

  const allScores = Object.values(topicScores)
  const overallUnderstanding = allScores.length > 0
    ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 100) / 100
    : 0

  return NextResponse.json({
    score,
    totalCorrect: correctTotal,
    totalQuestions: answers.length,
    answers: attemptResults,
    topicScores,
    overallUnderstanding,
  })
}
