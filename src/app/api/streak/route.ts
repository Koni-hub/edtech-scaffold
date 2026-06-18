import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const today = new Date().toISOString().split("T")[0]

  const { data: existing } = await supabase
    .from("analytics_snapshots")
    .select("id, streak_days, snapshot_date")
    .eq("user_id", user.id)
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing && existing.snapshot_date === today) {
    return NextResponse.json({ streak: existing.streak_days })
  }

  let newStreak = 1
  if (existing) {
    const lastDate = new Date(existing.snapshot_date)
    const todayDate = new Date(today)
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      newStreak = (existing.streak_days ?? 0) + 1
    } else if (diffDays > 1) {
      newStreak = 1
    } else {
      newStreak = existing.streak_days ?? 1
    }
  }

  if (existing && existing.snapshot_date === today) {
    await supabase
      .from("analytics_snapshots")
      .update({ streak_days: newStreak })
      .eq("id", existing.id)
  } else {
    await supabase
      .from("analytics_snapshots")
      .upsert({
        user_id: user.id,
        snapshot_date: today,
        streak_days: newStreak,
        overall_understanding: existing ? Number(existing.snapshot_date) === 0 ? 0 : 0 : 0,
        overall_retention: 0,
        topics_covered: 0,
        quizzes_taken: 0,
        total_questions_answered: 0,
      }, { onConflict: "user_id,snapshot_date" })
  }

  return NextResponse.json({ streak: newStreak })
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data } = await supabase
    .from("analytics_snapshots")
    .select("streak_days")
    .eq("user_id", user.id)
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .maybeSingle()

  return NextResponse.json({ streak: data?.streak_days ?? 0 })
}
