import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: authError?.message ?? "Unauthorized" }, { status: 401 })
    }

    // Ensure profile exists for FK constraint (modules.user_id -> profiles.id)
    // Silently ignore if profile already exists (trigger should handle it)
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ id: user.id, display_name: user.user_metadata?.display_name ?? user.email ?? "" })

    if (profileError && !profileError.message.includes("duplicate key")) {
      return NextResponse.json({ error: `Profile: ${profileError.message}` }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const title = formData.get("title") as string | null
    if (!file || !title) {
      return NextResponse.json({ error: "file and title are required" }, { status: 400 })
    }

    const isPdf = file.name.toLowerCase().endsWith(".pdf")

    let rawText = ""
    if (isPdf) {
      try {
        const { PDFParse } = await import("pdf-parse")
        const pdf = new PDFParse({ data: await file.arrayBuffer() })
        const result = await pdf.getText()
        rawText = result.text
      } catch {
        rawText = "[PDF content extraction pending]"
      }
    } else {
      rawText = await file.text()
    }

    const { data: module, error: insertError } = await supabase
      .from("modules")
      .insert({
        user_id: user.id,
        title,
        content_type: isPdf ? "pdf" : "text",
        storage_path: null,
        raw_text: rawText,
        status: "processing",
        topic_labels: [],
      })
      .select("id")
      .single()

    if (insertError) {
      return NextResponse.json({ error: `DB: ${insertError.message}` }, { status: 500 })
    }
    if (!module) {
      return NextResponse.json({ error: "No module returned" }, { status: 500 })
    }

    return NextResponse.json({ moduleId: module.id })
  } catch (err) {
    return NextResponse.json({ error: `Upload failed: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 })
  }
}