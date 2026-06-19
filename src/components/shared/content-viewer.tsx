"use client"

import { useState, useCallback } from "react"
import { Sparkles, Copy, Check, Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface ContentViewerProps {
  content: string
  title?: string
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

function charCount(text: string): number {
  return text.length
}

function MarkdownText({ text }: { text: string }) {
  const lines = text.split("\n")
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return <h2 key={i} className="text-lg font-bold mt-6 mb-2">{line.slice(3)}</h2>
        }
        if (line.startsWith("### ")) {
          return <h3 key={i} className="text-base font-semibold mt-4 mb-1">{line.slice(4)}</h3>
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i} className="font-bold text-sm">{line.slice(2, -2)}</p>
        }
        if (line.startsWith("- ")) {
          return <li key={i} className="text-sm ml-4 list-disc">{line.slice(2)}</li>
        }
        if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
          return <li key={i} className="text-sm ml-4 list-decimal">{line.replace(/^\d+\.\s*/, "")}</li>
        }
        if (line.startsWith("```")) {
          return null
        }
        if (line.trim() === "") {
          return <div key={i} className="h-2" />
        }
        const withBold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        return <p key={i} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: withBold }} />
      })}
    </div>
  )
}

export function ContentViewer({ content, title }: ContentViewerProps) {
  const [enhanced, setEnhanced] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showEnhanced, setShowEnhanced] = useState(false)
  const [copied, setCopied] = useState(false)

  const displayText = showEnhanced && enhanced ? enhanced : content

  const handleEnhance = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/modules/format-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Enhancement failed")
      setEnhanced(data.formatted)
      setShowEnhanced(true)
      toast.success("Content enhanced", { id: "enhance" })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Enhancement failed"
      toast.error(msg, { id: "enhance" })
    } finally {
      setLoading(false)
    }
  }, [content])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(displayText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }, [displayText])

  return (
    <div className="rounded-xl border bg-card flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-2 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium truncate max-w-[200px]">
            {title ?? "Content"}
          </span>
          {enhanced && (
            <button
              onClick={() => setShowEnhanced(!showEnhanced)}
              className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors ${
                showEnhanced
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {showEnhanced ? <Eye size={12} /> : <EyeOff size={12} />}
              {showEnhanced ? "Enhanced" : "Raw"}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {wordCount(displayText)} words
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            · {charCount(displayText)} chars
          </span>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEnhance}
            disabled={loading}
            className="h-7 px-2 text-xs gap-1"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            {loading ? "Enhancing..." : "Enhance"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {showEnhanced && enhanced ? (
          <MarkdownText text={enhanced} />
        ) : (
          <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
            {content}
          </pre>
        )}
      </div>
    </div>
  )
}
