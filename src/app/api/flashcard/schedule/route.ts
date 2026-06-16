import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

function computeNextSR(
  current: { easiness: number; interval: number; repetitions: number },
  correct: boolean
): { easiness: number; interval: number; repetitions: number; due_at: string } {
  let { easiness, interval, repetitions } = current

  if (correct) {
    repetitions++
    if (repetitions === 1) interval = 1
    else if (repetitions === 2) interval = 6
    else interval = Math.round(interval * easiness)
    easiness = easiness + (0.1 - (1 - 0.8) * (0.28 + 0.1 * (5 - easiness)))
    if (easiness < 1.3) easiness = 1.3
  } else {
    repetitions = 0
    interval = 1
  }

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + interval)

  return {
    easiness: Math.round(easiness * 100) / 100,
    interval,
    repetitions,
    due_at: dueDate.toISOString(),
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const moduleId = searchParams.get("moduleId")

  let query = supabase
    .from("flashcard_schedule")
    .select("*")
    .eq("user_id", user.id)

  if (moduleId) {
    query = query.eq("module_id", moduleId)
  }

  const { data, error } = await query.order("due_at", { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ flashcards: data ?? [] })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const moduleId = body.moduleId as string | undefined
  const term = body.term as string | undefined
  const question = (body.question as string) ?? ""
  const answer = (body.answer as string) ?? ""
  const correct = body.correct as boolean | undefined

  if (!moduleId || !term) {
    return NextResponse.json({ error: "moduleId and term are required" }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from("flashcard_schedule")
    .select("*")
    .eq("user_id", user.id)
    .eq("module_id", moduleId)
    .eq("term", term)
    .maybeSingle()

  if (existing) {
    const sr = computeNextSR(
      {
        easiness: existing.easiness ?? 2.5,
        interval: existing.interval ?? 0,
        repetitions: existing.repetitions ?? 0,
      },
      correct ?? false
    )

    const { error } = await supabase
      .from("flashcard_schedule")
      .update({
        easiness: sr.easiness,
        interval: sr.interval,
        repetitions: sr.repetitions,
        due_at: sr.due_at,
        question,
        answer,
      })
      .eq("id", existing.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ saved: true })
  }

  const sr = computeNextSR({ easiness: 2.5, interval: 0, repetitions: 0 }, correct ?? false)

  const { error } = await supabase
    .from("flashcard_schedule")
    .insert({
      user_id: user.id,
      module_id: moduleId,
      term,
      question,
      answer,
      easiness: sr.easiness,
      interval: sr.interval,
      repetitions: sr.repetitions,
      due_at: sr.due_at,
    })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ saved: true })
}
