import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { chunkText } from "@/lib/ai/chunker"

const YT_API_KEY = process.env.YOUTUBE_API_KEY

interface YouTubeVideoSnippet {
  title: string
  description: string
  channelTitle: string
}

async function fetchYouTubeMetadata(videoId: string): Promise<YouTubeVideoSnippet | null> {
  if (!YT_API_KEY) return null
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YT_API_KEY}`,
    { signal: AbortSignal.timeout(5000) }
  )
  if (!res.ok) return null
  const data = await res.json()
  const item = data.items?.[0]
  if (!item?.snippet) return null
  return item.snippet
}

async function fetchYouTubeTranscript(videoId: string): Promise<string> {
  const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
      "Cookie": "CONSENT=YES+cb.20210328-17-p0.en+FX+{}",
    },
    signal: AbortSignal.timeout(8000),
    redirect: "follow",
  })
  if (!res.ok) return ""

  const html = await res.text()

  const captionMatch = html.match(/"captionTracks":\[([\s\S]*?)\]/)
  if (!captionMatch) return ""

  const tracks: { url: string; lang: string }[] = []
  const urlPattern = /"baseUrl":"([^"]+)"/g
  const langPattern = /"languageCode":"([^"]+)"/g

  const urls: string[] = []
  const langs: string[] = []
  let m: RegExpExecArray | null

  while ((m = urlPattern.exec(captionMatch[1])) !== null) {
    urls.push(m[1].replace(/\\u0026/g, "&"))
  }
  while ((m = langPattern.exec(captionMatch[1])) !== null) {
    langs.push(m[1])
  }
  for (let i = 0; i < urls.length; i++) {
    tracks.push({ url: urls[i], lang: langs[i] || "en" })
  }

  const enTrack = tracks.find((t) => t.lang === "en") || tracks[0]
  if (!enTrack) return ""

  const captionRes = await fetch(enTrack.url + "&fmt=srv3", {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(8000),
  })
  if (!captionRes.ok) return ""

  const xml = await captionRes.text()
  const segments: string[] = []

  const textRegex = /<text[^>]*>([\s\S]*?)<\/text>/g
  let textMatch: RegExpExecArray | null
  while ((textMatch = textRegex.exec(xml)) !== null) {
    const text = textMatch[1]
      .replace(/&amp;#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .trim()
    if (text) segments.push(text)
  }

  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/g
  let pMatch: RegExpExecArray | null
  while ((pMatch = pRegex.exec(xml)) !== null) {
    const inner = pMatch[1]
    const words: string[] = []
    const sRegex = /<s[^>]*>([\s\S]*?)<\/s>/g
    let sMatch: RegExpExecArray | null
    while ((sMatch = sRegex.exec(inner)) !== null) {
      const text = sMatch[1]
        .replace(/&amp;#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;/g, "'")
        .trim()
      if (text) words.push(text)
    }
    if (words.length > 0) segments.push(words.join(" "))
  }

  return segments.join(" ")
}

async function extractWebPageContent(url: string): Promise<{ title: string; text: string }> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SyntraBot/1.0)",
      "Accept": "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status}`)

  const html = await res.text()

  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : new URL(url).hostname

  const cleaned = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.length > 20 && s.length < 500)
    .slice(0, 500)

  if (sentences.length === 0) throw new Error("No readable content found on the page")

  return { title, text: sentences.join(" ") }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let body: { url?: string; category?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const url = body.url?.trim()
  const category = body.category || null
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 })

  try {
    new URL(url)
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
  }

  try {
    const videoId = extractVideoId(url)
    let title: string
    let rawText: string

    if (videoId) {
      title = `YouTube: ${videoId}`
      rawText = ""

      const [snippet, transcript] = await Promise.all([
        fetchYouTubeMetadata(videoId),
        fetchYouTubeTranscript(videoId).catch(() => ""),
      ])

      if (snippet) {
        title = `YouTube: ${snippet.title} by ${snippet.channelTitle}`
      }

      if (transcript && transcript.length > 30) {
        rawText = `${title}\n\nTranscript:\n${transcript}`.trim()
      }

      if ((!rawText || rawText.length < 30) && snippet?.description) {
        const desc = snippet.description.replace(/\n/g, " ").trim()
        if (desc.length > 30) {
          rawText = `${title}\n\n${desc}`.trim()
        }
      }

      if (!rawText || rawText.length < 30) {
        rawText = `${title}\n\nVideo content could not be automatically extracted. Please add your notes manually.`
      }
    } else {
      const page = await extractWebPageContent(url)
      title = page.title
      rawText = page.text
    }

    if (!rawText || rawText.length < 30) {
      return NextResponse.json({ error: "Could not extract enough content from the URL" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("modules")
      .insert({
        user_id: user.id,
        title,
        content_type: "text",
        storage_path: null,
        raw_text: rawText,
        raw_pdf: null,
        status: "processing",
        topic_labels: [],
        category,
      })
      .select("id")
      .single()

    if (error) return NextResponse.json({ error: `DB: ${error.message}` }, { status: 500 })

    const textChunks = chunkText(rawText)
    const { data: inserted } = await supabase
      .from("module_chunks")
      .insert(
        textChunks.map((c) => ({
          module_id: data.id,
          chunk_index: c.index,
          content: c.content,
          token_count: c.tokenCount,
        }))
      )
      .select()

    await supabase.from("modules").update({ status: "ready" }).eq("id", data.id)

    if (inserted && process.env.GEMINI_API_KEY) {
      try {
        const { generateEmbeddings } = await import("@/lib/ai/embedder")
        const chunkContents = inserted.map((c: { content: string }) => c.content)
        const embeddings = await generateEmbeddings(chunkContents)
        for (let i = 0; i < inserted.length; i++) {
          await supabase
            .from("module_chunks")
            .update({ embedding: embeddings[i] })
            .eq("id", inserted[i].id)
        }
      } catch (e) {
        console.warn("Embedding generation skipped:", e)
      }
    }

    return NextResponse.json({ moduleId: data.id })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Import failed: ${msg}` }, { status: 500 })
  }
}
