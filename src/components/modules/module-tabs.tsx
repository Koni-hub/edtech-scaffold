"use client";

import { useState } from "react";
import { PdfViewer } from "./pdf-viewer";
import { ContentViewer } from "./content-viewer";
import { ModuleChat } from "./module-chat";
import { ModuleAiQuiz } from "./module-ai-quiz";
import { ModuleFlashcard } from "./module-flashcard";
import { ModuleSpacedReview } from "./module-spaced-review";

interface ModuleTabsProps {
  moduleId: string;
  rawPdf: string | null;
  rawText: string | null;
  title: string;
}

type Tab = "handout" | "ai-quiz" | "flashcard" | "spaced-review";

export function ModuleTabs({
  moduleId,
  rawPdf,
  rawText,
  title,
}: ModuleTabsProps) {
  const [tab, setTab] = useState<Tab>("handout");

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex gap-1 rounded-lg border bg-muted p-1 shrink-0">
        {(["handout", "ai-quiz", "flashcard", "spaced-review"] as Tab[]).map(
          (t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "handout"
                ? "Handout & Chat"
                : t === "ai-quiz"
                  ? "AI Quiz"
                  : t === "flashcard"
                    ? "Flashcard"
                    : "Spaced Review"}
            </button>
          ),
        )}
      </div>

      {tab === "handout" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 flex-1 min-h-0 mt-4">
          {rawPdf ? (
            <PdfViewer dataUrl={rawPdf} title={title} />
          ) : rawText ? (
            <ContentViewer content={rawText} title={title} />
          ) : (
            <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
              No content available for this module.
            </div>
          )}
          <ModuleChat moduleId={moduleId} />
        </div>
      )}

      {tab === "ai-quiz" && (
        <div className="max-w-2xl mx-auto flex-1 min-h-0 overflow-y-auto mt-4">
          <ModuleAiQuiz moduleId={moduleId} />
        </div>
      )}

      {tab === "flashcard" && (
        <div className="max-w-2xl mx-auto flex-1 min-h-0 overflow-y-auto mt-4">
          <ModuleFlashcard moduleId={moduleId} />
        </div>
      )}

      {tab === "spaced-review" && (
        <div className="max-w-2xl mx-auto flex-1 min-h-0 overflow-y-auto mt-4">
          <ModuleSpacedReview moduleId={moduleId} />
        </div>
      )}
    </div>
  );
}
