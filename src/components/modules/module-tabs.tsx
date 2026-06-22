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

const tabs: { value: Tab; label: string }[] = [
  { value: "handout", label: "Handout & Chat" },
  { value: "ai-quiz", label: "AI Quiz" },
  { value: "flashcard", label: "Flashcard" },
  { value: "spaced-review", label: "Spaced Review" },
];

export function ModuleTabs({
  moduleId,
  rawPdf,
  rawText,
  title,
}: ModuleTabsProps) {
  const [tab, setTab] = useState<Tab>("handout");

  return (
    <div className="flex h-[calc(100vh-200px)] min-w-0 flex-col">
      <div className="w-full overflow-x-auto">
        <div className="flex w-max min-w-full shrink-0 gap-1 rounded-lg border bg-muted p-1">
          {tabs.map((item) => (
            <button
              key={item.value}
              onClick={() => setTab(item.value)}
              className={`shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === item.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "handout" && (
        <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="min-w-0">
            {rawPdf ? (
              <PdfViewer dataUrl={rawPdf} title={title} />
            ) : rawText ? (
              <ContentViewer content={rawText} title={title} />
            ) : (
              <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
                No content available for this module.
              </div>
            )}
          </div>

          <div className="min-w-0">
            <ModuleChat moduleId={moduleId} />
          </div>
        </div>
      )}

      {tab === "ai-quiz" && (
        <div className="mx-auto mt-4 min-h-0 w-full max-w-2xl flex-1 overflow-y-auto">
          <ModuleAiQuiz moduleId={moduleId} />
        </div>
      )}

      {tab === "flashcard" && (
        <div className="mx-auto mt-4 min-h-0 w-full max-w-2xl flex-1 overflow-y-auto">
          <ModuleFlashcard moduleId={moduleId} />
        </div>
      )}

      {tab === "spaced-review" && (
        <div className="mx-auto mt-4 min-h-0 w-full max-w-2xl flex-1 overflow-y-auto">
          <ModuleSpacedReview moduleId={moduleId} />
        </div>
      )}
    </div>
  );
}
