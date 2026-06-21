import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateAIFlashcards } from "@/lib/ai/ai-flashcard-generator"
import { generateEmbedding } from "@/lib/ai/embedder"
import { cosineSimilarity } from "@/lib/ai/similarity"
import type { Module } from "@/lib/types/database"

const MAX_COUNT = 30

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const moduleId = body.moduleId as string | undefined
  const count = Math.min(Number(body.count) || 10, MAX_COUNT)

  if (!moduleId) {
    return NextResponse.json({ error: "moduleId is required" }, { status: 400 })
  }

  const { data: mod, error: moduleError } = await supabase
    .from("modules")
    .select("*")
    .eq("id", moduleId)
    .single()

  if (moduleError || !mod) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 })
  }

  if ((mod as Module).user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const rawText = (mod as Module).raw_text
  if (!rawText) {
    return NextResponse.json({ error: "Module has no content" }, { status: 400 })
  }

  const { data: chunkRows } = await supabase
    .from("module_chunks")
    .select("content, embedding, token_count")
    .eq("module_id", moduleId)
    .order("chunk_index", { ascending: true })

  let contextText = rawText

  if (chunkRows && chunkRows.length > 0) {
    const hasEmbeddings = chunkRows.some((c) => c.embedding && Array.isArray(c.embedding) && c.embedding.length > 0)
    if (hasEmbeddings) {
      try {
        const queryText = `${(mod as Module).title} ${(mod as Module).raw_text?.slice(0, 500) ?? ""}`
        const queryEmbedding = await generateEmbedding(queryText)
        const scored = chunkRows
          .filter((c) => c.embedding && Array.isArray(c.embedding) && c.embedding.length > 0)
          .map((c) => ({
            content: c.content,
            tokenCount: c.token_count,
            similarity: cosineSimilarity(queryEmbedding, c.embedding as unknown as number[]),
          }))
          .sort((a, b) => b.similarity - a.similarity)

        const MAX_TOKENS = 8000
        const selectedTexts: string[] = []
        let totalTokens = 0
        for (const sc of scored) {
          if (totalTokens + sc.tokenCount > MAX_TOKENS) break
          selectedTexts.push(sc.content)
          totalTokens += sc.tokenCount
        }
        if (selectedTexts.length >= 1) {
          contextText = selectedTexts.join("\n\n")
        }
      } catch {
        // fall through to rawText
      }
    }
  }

  try {
    const flashcards = await generateAIFlashcards({
      moduleTitle: (mod as Module).title,
      content: contextText,
      count,
    })
    return NextResponse.json({ flashcards })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: `AI flashcard generation failed: ${msg}. Please try again later.` },
      { status: 503 }
    )
  }
}

