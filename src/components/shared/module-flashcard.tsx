"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Shuffle, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface FlashCard {
  id: number
  question: string
  answer: string
}

function splitSentences(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .flatMap((p) => p.trim().split(/(?<=[.!?])\s+/))
    .map((s) => s.trim())
    .filter((s) => s.length > 30 && s.length < 500)
}

function extractTerm(phrase: string): string | null {
  const words = phrase.split(/\s+/).filter((w) => /^[A-Z]/.test(w) && w.length > 2)
  if (words.length > 0) return words[Math.floor(Math.random() * words.length)]
  const longWords = phrase.split(/\s+/).filter((w) => w.length > 6 && /^[a-zA-Z]/.test(w))
  if (longWords.length > 0) return longWords[Math.floor(Math.random() * longWords.length)]
  return null
}

function generateFlashcards(text: string): FlashCard[] {
  const cards: FlashCard[] = []
  let id = 0

  const definitionPatterns = /\b(is|are|was|were|refers to|means|defined as|involves|consists of|comprises|includes|describes|represents|occurs when|happens when|can be)\b/i

  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 50)
  const seen = new Set<string>()

  for (const para of paragraphs) {
    if (cards.length >= 30) break

    const clean = para.replace(/\n/g, " ").replace(/\s+/g, " ").trim()
    const match = clean.match(
      /([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)*)\s+(is|are|was|were|refers to|means|defined as|involves|consists of|comprises|includes|describes|represents)\s+(.+)/i
    )

    if (match) {
      const term = match[1].trim()
      const def = match[3].trim().replace(/[.!;]+$/, "")
      const key = term.toLowerCase()
      if (!seen.has(key) && term.length > 1) {
        seen.add(key)
        cards.push({
          id: id++,
          question: `What is ${term}?`,
          answer: `${term} ${match[2]} ${def}.`,
        })
        continue
      }
    }

    const sentences = splitSentences(clean)
    for (const sentence of sentences) {
      if (cards.length >= 30) break
      if (definitionPatterns.test(sentence)) {
        const term = extractTerm(sentence)
        if (term) {
          const key = term.toLowerCase()
          if (!seen.has(key)) {
            seen.add(key)
            cards.push({
              id: id++,
              question: `What is ${term}?`,
              answer: sentence.replace(/[.!;]+$/, "") + ".",
            })
          }
        }
      }
    }
  }

  if (cards.length === 0) {
    const sentences = splitSentences(text)
    for (const sentence of sentences) {
      if (cards.length >= 10) break
      const term = extractTerm(sentence)
      cards.push({
        id: id++,
        question: term
          ? `Explain: ${sentence.replace(new RegExp(`\\b${term}\\b`, "i"), "______________")}`
          : "What is this module about?",
        answer: term ? `${term}: ${sentence}` : text.length > 200 ? text.slice(0, 200) + "..." : text,
      })
    }
  }

  return cards
}

interface ModuleFlashcardProps {
  moduleId: string
}

export function ModuleFlashcard({ moduleId }: ModuleFlashcardProps) {
  const [cards, setCards] = useState<FlashCard[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [knownCount, setKnownCount] = useState(0)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: mod } = await supabase
        .from("modules")
        .select("raw_text")
        .eq("id", moduleId)
        .single()

      if (mod?.raw_text) {
        setCards(generateFlashcards(mod.raw_text))
      }
      setLoading(false)
    }
    load()
  }, [moduleId])

  const current = cards[index]
  const total = cards.length

  function goNext() { setFlipped(false); setIndex((i) => Math.min(total - 1, i + 1)) }
  function goPrev() { setFlipped(false); setIndex((i) => Math.max(0, i - 1)) }

  function shuffleCards() {
    setFlipped(false)
    setCards((prev) => {
      const a = [...prev]
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
      }
      return a
    })
    setIndex(0)
    setKnownCount(0)
  }

  function markKnown() {
    setKnownCount((c) => c + 1)
    goNext()
  }

  if (loading) {
    return <div className="flex items-center justify-center py-16 text-muted-foreground">Loading flashcards...</div>
  }

  if (cards.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
        No content to create flashcards from.
      </div>
    )
  }

  const progress = total > 0 ? knownCount / total : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={shuffleCards}>
          <Shuffle size={14} />
          Shuffle
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{index + 1} / {total}</span>
          <span className="text-xs">Known: {knownCount}</span>
        </div>
      </div>

      <div className="relative" style={{ minHeight: 300 }}>
        <div
          className="absolute inset-0 cursor-pointer select-none"
          onClick={() => setFlipped((f) => !f)}
          style={{ perspective: "1000px" }}
        >
          <div
            className="h-full w-full rounded-xl border bg-card p-6 sm:p-10 transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateX(180deg)" : "rotateX(0deg)",
            }}
          >
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10"
              style={{ backfaceVisibility: "hidden" }}
            >
              <p className="mb-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Question</p>
              <p className="text-center text-base leading-relaxed whitespace-pre-wrap">{current.question}</p>
              <p className="mt-8 text-xs text-muted-foreground">Click to reveal answer</p>
            </div>
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10"
              style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
            >
              <p className="mb-4 text-xs font-medium text-green-600 uppercase tracking-wider">Answer</p>
              <p className="text-center text-base leading-relaxed whitespace-pre-wrap">{current.answer}</p>
              <p className="mt-8 text-xs text-muted-foreground">Click to flip back</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex h-2 w-full max-w-xs gap-1">
          {cards.slice(0, Math.min(total, 20)).map((_, i) => (
            <div
              key={i}
              className="h-full flex-1 rounded-full transition-colors"
              style={{
                backgroundColor: i <= index && cards[i] && i <= index
                  ? i === index
                    ? "hsl(var(--primary))"
                    : "hsl(var(--primary) / 0.4)"
                  : "hsl(var(--muted))",
              }}
            />
          ))}
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={goPrev} disabled={index === 0}>
            <ChevronLeft size={16} />
            Previous
          </Button>
          {flipped ? (
            <Button variant="default" size="sm" onClick={markKnown} disabled={index === total - 1}>
              <ThumbsUp size={16} />
              Got it
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setFlipped(true)}>
              Flip
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={goNext} disabled={index === total - 1}>
            Next
            <ChevronRight size={16} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {progress === 0 ? "Flip a card to start" : `${Math.round(progress * 100)}% complete`}
        </p>
      </div>
    </div>
  )
}
