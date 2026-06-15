import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { chunkText } from "@/lib/llm/chunker"
import { generateQuiz, type GeneratedQuiz } from "@/lib/llm/quiz-generator"
import type { Module, ModuleChunk } from "@/lib/types/database"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { moduleId, questionCount = 5, difficulty = "medium", quizMode } = body

  if (!moduleId) {
    return NextResponse.json({ error: "moduleId is required" }, { status: 400 })
  }

  const { data: module, error: moduleError } = await supabase
    .from("modules")
    .select("*")
    .eq("id", moduleId)
    .single()

  if (moduleError || !module) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 })
  }

  if ((module as Module).user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let chunks = await supabase
    .from("module_chunks")
    .select("*")
    .eq("module_id", moduleId)
    .order("chunk_index", { ascending: true })

  let chunkRows: ModuleChunk[]

  if (!chunks.data || chunks.data.length === 0) {
    const rawText = (module as Module).raw_text
    if (!rawText) {
      return NextResponse.json({ error: "Module has no content" }, { status: 400 })
    }

    const textChunks = chunkText(rawText)
    const { data: inserted, error: insertError } = await supabase
      .from("module_chunks")
      .insert(
        textChunks.map((c) => ({
          module_id: moduleId,
          chunk_index: c.index,
          content: c.content,
          token_count: c.tokenCount,
        }))
      )
      .select()

    if (insertError) {
      return NextResponse.json({ error: "Failed to create chunks" }, { status: 500 })
    }

    chunkRows = (inserted ?? []) as ModuleChunk[]
  } else {
    chunkRows = chunks.data as ModuleChunk[]
  }

  let generated: GeneratedQuiz
  try {
    generated = await generateQuiz({
      moduleTitle: (module as Module).title,
      chunks: chunkRows.map((c) => ({ content: c.content, tokenCount: c.token_count })),
      questionCount,
      difficulty,
      quizMode: quizMode ?? "mixed",
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Quiz generation failed: ${msg}` }, { status: 503 })
  }

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .insert({
      module_id: moduleId,
      user_id: user.id,
      title: generated.title,
      quiz_type: "initial",
      difficulty,
      topic_focus: generated.topic_focus,
      question_ids: [],
    })
    .select()
    .single()

  if (quizError || !quiz) {
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
  }

  const questionInserts = generated.questions.map((q, i) => ({
    quiz_id: quiz.id,
    topic: q.topic,
    question_text: q.question_text,
    question_type: q.question_type,
    options: q.options,
    correct_answer: q.correct_answer,
    explanation: q.explanation,
    difficulty: q.difficulty,
    order_index: i,
  }))

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .insert(questionInserts)
    .select()

  if (questionsError || !questions) {
    await supabase.from("quizzes").delete().eq("id", quiz.id)
    return NextResponse.json({ error: "Failed to create questions" }, { status: 500 })
  }

  const questionIds = questions.map((q: { id: string }) => q.id)
  await supabase.from("quizzes").update({ question_ids: questionIds }).eq("id", quiz.id)

  return NextResponse.json({ quizId: quiz.id, questions })
}
