import Link from "next/link"
import { Plus, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/modules/empty-state"
import { ModuleList } from "@/components/modules/module-list"
import { createClient } from "@/lib/supabase/server"

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
        <ModuleList modules={modules} />
      )}
    </div>
  )
}

