import Link from "next/link"
import { BookOpen, Plus, Upload, Inbox, Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
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

export default async function ModulesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id

  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Modules</h1>
          <p className="text-muted-foreground">Upload and manage your learning materials.</p>
        </div>
        <Link href="/modules/upload">
          <Button>
            <Plus size={16} />
            Upload Module
          </Button>
        </Link>
      </div>

      {!modules || modules.length === 0 ? (
        <EmptyState
          icon={<Inbox size={48} />}
          title="No modules yet"
          description="Upload your first learning module to get started with quizzes and analytics."
          action={{ label: "Upload Module", href: "/modules/upload" }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <Link key={mod.id} href={`/modules/${mod.id}`} className="block">
              <div className="group rounded-xl border bg-card p-5 transition-colors hover:bg-accent/50">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <BookOpen size={20} />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium">
                    {statusIcon[mod.status]}
                    <span>{statusLabel[mod.status]}</span>
                  </div>
                </div>
                <h3 className="mt-3 font-semibold group-hover:text-primary">{mod.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {mod.description ?? "No description"}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {mod.topic_labels?.map((topic: string) => (
                    <span
                      key={topic}
                      className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={12} />
                  {new Date(mod.created_at).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
