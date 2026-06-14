import { notFound, redirect } from "next/navigation"
import { ArrowLeft, BookOpen, FileText, FileCode, Loader2, CheckCircle2, AlertCircle, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DeleteButton } from "@/components/shared/delete-button"
import { createClient } from "@/lib/supabase/server"

const statusIcon: Record<string, React.ReactNode> = {
  processing: <Loader2 size={14} className="animate-spin text-amber-500" />,
  ready: <CheckCircle2 size={14} className="text-green-500" />,
  failed: <AlertCircle size={14} className="text-red-500" />,
}

const statusLabel: Record<string, string> = {
  processing: "Processing",
  ready: "Ready",
  failed: "Failed",
}

const typeIcon: Record<string, React.ReactNode> = {
  pdf: <FileText size={20} />,
  markdown: <FileCode size={20} />,
  text: <FileCode size={20} />,
}

async function deleteModule(moduleId: string) {
  "use server"
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from("module_chunks").delete().eq("module_id", moduleId)
  await supabase.from("modules").delete().eq("id", moduleId).eq("user_id", user.id)
  redirect("/modules")
}

export default async function ModuleDetailPage({ params, searchParams }: {
  params: Promise<{ moduleId: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { moduleId } = await params
  const { q } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return notFound()

  const { data: mod } = await supabase
    .from("modules")
    .select("*")
    .eq("id", moduleId)
    .eq("user_id", user.id)
    .single()

  if (!mod) return notFound()

  let { data: chunks } = await supabase
    .from("module_chunks")
    .select("content, chunk_index, token_count")
    .eq("module_id", moduleId)
    .order("chunk_index", { ascending: true })

  if (q && chunks) {
    const lower = q.toLowerCase()
    chunks = chunks.filter((c) => c.content.toLowerCase().includes(lower))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/modules" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
          Back
        </Link>
        <DeleteButton action={deleteModule.bind(null, moduleId)} label="Module" />
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              {typeIcon[mod.content_type] ?? <BookOpen size={20} />}
            </div>
            <div>
              <h1 className="text-xl font-bold">{mod.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-xs">
                  {statusIcon[mod.status]}
                  <span>{statusLabel[mod.status]}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(mod.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {mod.description && (
          <p className="mt-4 text-sm text-muted-foreground">{mod.description}</p>
        )}

        {mod.topic_labels?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {mod.topic_labels.map((topic: string) => (
              <span key={topic} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={`/quizzes/generate?moduleId=${moduleId}`}>
          <Button>AI Quiz</Button>
        </Link>
        <Link href={`/quizzes/generate-local?moduleId=${moduleId}`}>
          <Button variant="secondary">Local Quiz</Button>
        </Link>
        <Link href={`/modules/${moduleId}/flashcards`}>
          <Button variant="outline">Flashcards</Button>
        </Link>
      </div>

      <div>
        <form className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search within module..."
            className="pl-9"
          />
        </form>
      </div>

      {chunks && chunks.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-3">Content ({chunks.length} chunks{q ? ` matching "${q}"` : ""})</h2>
          <div className="space-y-3">
            {chunks.map((chunk) => {
              const lowerQ = q?.toLowerCase()
              const escapedQ = q?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
              const content = lowerQ && escapedQ
                ? chunk.content.replace(new RegExp(`(${escapedQ})`, "gi"), "<mark>$1</mark>")
                : chunk.content
              return (
                <details key={chunk.chunk_index} className="rounded-xl border bg-card">
                  <summary className="cursor-pointer px-4 py-3 text-sm font-medium hover:bg-accent/50 rounded-xl">
                    Chunk {chunk.chunk_index + 1}
                    <span className="ml-2 text-xs text-muted-foreground">(~{chunk.token_count} tokens)</span>
                  </summary>
                  <div className="border-t px-4 py-3 text-sm text-muted-foreground whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content }} />
                </details>
              )
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-4 text-center">
          {q ? `No chunks match "${q}"` : "No content chunks found."}
        </p>
      )}
    </div>
  )
}