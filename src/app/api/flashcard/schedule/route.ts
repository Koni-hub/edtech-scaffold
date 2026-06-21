import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { computeNextSR } from "@/lib/sm2"

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

  let body: { moduleId?: string; term?: string; question?: string; answer?: string; correct?: boolean }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const moduleId = body.moduleId
  const term = body.term
  const question = body.question ?? ""
  const answer = body.answer ?? ""
  const correct = body.correct

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
