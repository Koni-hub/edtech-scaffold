"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCw, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface Chunk {
  content: string
  chunk_index: number
  token_count: number
}

export default function FlashcardsPage() {
  const params = useParams()
  const router = useRouter()
  const [chunks, setChunks] = useState<Chunk[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("module_chunks")
        .select("content, chunk_index, token_count")
        .eq("module_id", params.moduleId)
        .order("chunk_index", { ascending: true })
      if (data) setChunks(data)
      setLoading(false)
    }
    load()
  }, [params.moduleId])

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
  }

  if (chunks.length === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-8 text-center">
        <p className="text-muted-foreground">No content chunks found.</p>
        <Button variant="outline" onClick={() => router.push(`/modules/${params.moduleId}`)}>Back</Button>
      </div>
    )
  }

  const current = chunks[index]
  const total = chunks.length

  function goNext() { setFlipped(false); setIndex((i) => Math.min(total - 1, i + 1)) }
  function goPrev() { setFlipped(false); setIndex((i) => Math.max(0, i - 1)) }
  function shuffleCards() {
    setFlipped(false)
    setChunks((prev) => {
      const a = [...prev]
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
      }
      return a
    })
    setIndex(0)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/modules/${params.moduleId}`)}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={shuffleCards}>
            <Shuffle size={14} />
            Shuffle
          </Button>
          <span className="text-sm text-muted-foreground">{index + 1} / {total}</span>
        </div>
      </div>

      <div
        className="cursor-pointer select-none"
        onClick={() => setFlipped((f) => !f)}
        style={{ perspective: "1000px", minHeight: "300px" }}
      >
        <div
          className={cn(
            "relative h-full min-h-[300px] transition-transform duration-500",
            "rounded-xl border bg-card"
          )}
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateX(180deg)" : "none" }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden" style={{ backfaceVisibility: "hidden" }}>
            <p className="text-sm text-muted-foreground mb-2">Chunk {current.chunk_index + 1}</p>
            <p className="text-base leading-relaxed text-center">{current.content}</p>
            <p className="mt-4 text-xs text-muted-foreground">Click to flip</p>
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden"
            style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
          >
            <p className="text-sm text-muted-foreground mb-4">~{current.token_count} tokens</p>
            <p className="text-xs text-muted-foreground mt-4">Click to flip back</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" onClick={goPrev} disabled={index === 0}>
          <ChevronLeft size={16} />
          Previous
        </Button>
        <Button variant="outline" onClick={() => setFlipped((f) => !f)}>
          <RotateCw size={16} />
          Flip
        </Button>
        <Button variant="outline" onClick={goNext} disabled={index === total - 1}>
          Next
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}