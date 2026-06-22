"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { BookOpen, Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Module {
  id: string
  title: string
  description: string | null
  category: string | null
  topic_labels: string[]
  status: string
  created_at: string
}

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

interface ModuleListProps {
  modules: Module[]
}

export function ModuleList({ modules }: ModuleListProps) {
  const [filter, setFilter] = useState<string | null>(null)

  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const m of modules) {
      if (m.category) set.add(m.category)
    }
    return [...set].sort()
  }, [modules])

  const filtered = useMemo(() => {
    if (!filter) return modules
    return modules.filter((m) => m.category === filter)
  }, [modules, filter])

  return (
    <div className="space-y-6">
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter(null)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              !filter
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background hover:bg-accent"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                filter === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background hover:bg-accent"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((mod) => (
          <Link key={mod.id} href={`/modules/${mod.id}`} className="block">
            <div className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-colors hover:bg-accent/50">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <BookOpen size={20} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium">
                  {statusIcon[mod.status]}
                  <span>{statusLabel[mod.status]}</span>
                </div>
              </div>
              <h3 className="mt-3 line-clamp-1 font-semibold group-hover:text-primary">{mod.title}</h3>
              {mod.category && (
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{mod.category}</p>
              )}
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {mod.description ?? "No description"}
              </p>
              {mod.topic_labels?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {mod.topic_labels.map((topic: string) => (
                    <span
                      key={topic}
                      className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-auto pt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={12} />
                {new Date(mod.created_at).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filter && filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">No modules in this category.</p>
      )}
    </div>
  )
}
