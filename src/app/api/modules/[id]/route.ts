import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params

    const { data: mod } = await supabase
      .from("modules")
      .select("user_id")
      .eq("id", id)
      .single()

    if (!mod) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (mod.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { error } = await supabase.from("modules").delete().eq("id", id).eq("user_id", user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}