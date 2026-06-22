import { NextRequest, NextResponse } from "next/server"
import { geminiFetch, parseGeminiResponse, isQuotaError } from "@/lib/ai/gemini-client"
import { createClient } from "@/lib/supabase/server"
import { checkQuota, incrementUsage } from "@/lib/quota-check"

const FORMAT_PROMPT = `You are an expert study note formatter. Given a raw transcript or article text, rewrite it as a well-structured study document.

Rules:
1. Organize the content into clear sections with markdown headings (##, ###)
2. Highlight key concepts, definitions, and important terms with **bold**
3. Break long paragraphs into shorter, scannable paragraphs
4. Add bullet points or numbered lists where appropriate
5. Remove filler words, repetition, and verbal stutters
6. Keep all factual information — do not summarize away important details
7. Use a clean, academic-but-readable tone
8. If the content has code examples, format them in \`\`\` code blocks with language
9. Start with a brief overview paragraph
10. Output ONLY the formatted markdown — no introduction, no explanation`

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

  const content = (body.content as string)?.trim()
  if (!content || content.length < 20) {
    return NextResponse.json({ error: "Content too short" }, { status: 400 })
  }

  const quota = await checkQuota(user.id, "enhance_content")
  if (!quota.allowed) {
    return NextResponse.json({
      error: quota.reason ?? "Daily limit reached",
      remaining: quota.remaining,
      resetAt: quota.resetAt,
      tier: quota.tier,
    }, { status: 429 })
  }

  try {
    await incrementUsage(user.id, "enhance_content")
    const raw = await geminiFetch("gemini-2.5-flash", [
      { role: "user", parts: [{ text: content }] },
    ], {
      systemInstruction: FORMAT_PROMPT,
      temperature: 0.3,
      responseMimeType: "text/plain",
    })

    const { content: formatted } = parseGeminiResponse(raw)
    return NextResponse.json({ formatted })
  } catch (err) {
    if (isQuotaError(err)) {
      return NextResponse.json({ error: "API quota exceeded. Try again later." }, { status: 503 })
    }
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Formatting failed: ${msg}` }, { status: 500 })
  }
}

