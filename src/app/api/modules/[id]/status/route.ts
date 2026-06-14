import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const { data: module } = await supabase
    .from("modules")
    .select("status")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!module) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({ status: module.status })
}
