"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Link2, Loader2, Video, Globe, FileText, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export function UrlImport() {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [moduleId, setModuleId] = useState<string | null>(null)

  const isYouTube = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/.test(url)

  const handleImport = useCallback(async () => {
    if (!url.trim()) return
    setLoading(true)
    setSuccess(false)

    try {
      const res = await fetch("/api/modules/import-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), category: category || null }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Import failed")

      setModuleId(data.moduleId)
      setSuccess(true)
      toast.success("Content imported! Processing...", { id: "url-import" })

      setTimeout(() => {
        router.push(`/modules/${data.moduleId}`)
      }, 1500)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Import failed"
      toast.error(msg, { id: "url-import" })
    } finally {
      setLoading(false)
    }
  }, [url, category, router])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 size={18} />
          Import from URL
        </CardTitle>
        <CardDescription>
          Paste a YouTube video link or any website URL to import content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">URL</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              {isYouTube ? (
                <Video size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
              ) : url ? (
                <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
              ) : (
                <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              )}
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or https://example.com/article"
                className="pl-10"
                disabled={loading || success}
                onKeyDown={(e) => e.key === "Enter" && handleImport()}
              />
            </div>
            <Button
              onClick={handleImport}
              disabled={!url.trim() || loading || success}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : success ? <CheckCircle2 size={16} /> : "Import"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category (optional)</label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Science, History, CS..."
            disabled={loading || success}
          />
        </div>

        <div className="flex gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Video size={12} className="text-red-500" />
            YouTube transcripts
          </div>
          <div className="flex items-center gap-1.5">
            <Globe size={12} className="text-blue-500" />
            Website articles
          </div>
          <div className="flex items-center gap-1.5">
            <FileText size={12} className="text-green-500" />
            Blog posts & docs
          </div>
        </div>

        {isYouTube && !success && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-xs text-red-700 dark:text-red-400">
            YouTube import extracts the English transcript. Make sure the video has captions enabled.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
