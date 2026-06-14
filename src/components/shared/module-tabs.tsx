"use client"

import { useState } from "react"
import { PdfViewer } from "./pdf-viewer"
import { ModuleChat } from "./module-chat"
import { ModuleLocalQuiz } from "./module-local-quiz"

interface ModuleTabsProps {
  moduleId: string
  rawPdf: string | null
  title: string
}

export function ModuleTabs({ moduleId, rawPdf, title }: ModuleTabsProps) {
  const [tab, setTab] = useState<"handout" | "quiz">("handout")

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-lg border bg-muted p-1">
        <button
          onClick={() => setTab("handout")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            tab === "handout" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Handout & Chat
        </button>
        <button
          onClick={() => setTab("quiz")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            tab === "quiz" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Local Quiz
        </button>
      </div>

      {tab === "handout" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 h-[calc(100vh-300px)]">
          {rawPdf ? (
            <PdfViewer dataUrl={rawPdf} title={title} />
          ) : (
            <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
              No PDF preview available for this module.
            </div>
          )}
          <ModuleChat moduleId={moduleId} />
        </div>
      )}

      {tab === "quiz" && (
        <div className="max-w-2xl mx-auto">
          <ModuleLocalQuiz moduleId={moduleId} />
        </div>
      )}
    </div>
  )
}
