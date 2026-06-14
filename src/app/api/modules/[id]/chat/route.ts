import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

function getGenAI() {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error("GEMINI_API_KEY is not set")
  return new GoogleGenerativeAI(key)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 })
    }

    const { data: mod, error: modError } = await supabase
      .from("modules")
      .select("raw_text, title")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (modError || !mod) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    const MAX_CHARS = 8000
    const content = mod.raw_text.length > MAX_CHARS
      ? mod.raw_text.slice(0, MAX_CHARS) + "\n\n[Content truncated. Ask about specific sections for more detail.]"
      : mod.raw_text

    const genAI = getGenAI()
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      systemInstruction: `You are a strict "Handout-Based AI Assistant." Answer questions BASED ONLY on the uploaded document content. If the answer is not in the document, respond with: "I'm sorry, but this information is not available in the uploaded handout."`,
    })

    const result = await model.generateContent(
      `Module content:\n${content}\n\nUser question: ${message}`
    )

    const reply = result.response.text()

    return NextResponse.json({ reply })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("Chat API error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
