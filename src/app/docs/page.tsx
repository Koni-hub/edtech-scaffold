"use client"

import { useState, useEffect, useRef, useMemo, useCallback, Fragment } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  BrainCircuit, BookOpen, BarChart3, Sparkles, Upload, Target,
  ArrowRight, Search, ChevronRight, Menu, X, GraduationCap, Bot,
  Copy, Check, ThumbsUp, ThumbsDown, ArrowUp, Link2, Flame,
  ClipboardCheck, Globe, FileText, Youtube,
} from "lucide-react"

const sidebarNav = [
  {
    category: "Get started",
    items: [
      { href: "/docs#overview", label: "Overview" },
      { href: "/docs#quickstart", label: "Quickstart" },
      { href: "/docs#pricing", label: "Pricing" },
    ],
  },
  {
    category: "Core concepts",
    items: [
      { href: "/docs#modules", label: "Modules" },
      { href: "/docs#quizzes", label: "Quizzes" },
      { href: "/docs#flashcards", label: "Flashcards" },
      { href: "/docs#analytics", label: "Analytics" },
      { href: "/docs#spaced-repetition", label: "Spaced Repetition" },
    ],
  },
  {
    category: "Guides",
    items: [
      { href: "/docs#upload", label: "Uploading materials" },
      { href: "/docs#import-url", label: "Importing from URLs" },
      { href: "/docs#generate", label: "Generating quizzes" },
      { href: "/docs#generate-flashcards", label: "Generating flashcards" },
      { href: "/docs#review", label: "Reviewing results" },
      { href: "/docs#track", label: "Tracking progress" },
    ],
  },
  {
    category: "Resources",
    items: [
      { href: "/docs#faq", label: "FAQ" },
      { href: "/docs#support", label: "Support" },
    ],
  },
]

const quickstartCode = `// 1. Sign up or log in
// Visit /register to create an account
// or /login if you already have one`

const quickstartCode2 = `// 2. Upload a module (PDF, text, or URL)
const formData = new FormData()
formData.append("file", pdfFile)      // for PDF uploads
formData.append("title", "Cell Biology")
formData.append("category", "Science")

const res = await fetch("/api/modules/upload", {
  method: "POST",
  body: formData,
})
const { moduleId } = await res.json()`

const quickstartCode3 = `// 3. Generate a quiz from your module
const res = await fetch("/api/quiz/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    moduleId: "module_123",
    topic: "Cell Biology",
    questionCount: 10,
  }),
})

const { quizId, questions } = await res.json()
// Questions are AI-generated from your content
// Multiple-choice, true/false, and short-answer`

const quickstartCode4 = `// 4. Generate flashcards with spaced repetition
const res = await fetch("/api/flashcard/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    moduleId: "module_123",
    count: 20,
  }),
})

const { flashcards } = await res.json()
// Each card has: front, back, difficulty
// Review schedule computed server-side via SM-2`

const buildPaths = [
  {
    icon: BrainCircuit,
    title: "Syntra Dashboard",
    description: "Interactive dashboard with progress rings, sparklines, streak tracking, and analytics at a glance.",
    href: "/dashboard",
    cta: "Go to Dashboard",
  },
  {
    icon: Bot,
    title: "AI Quiz Engine",
    description: "Gemini 2.5 Flash generates diverse, accurate quizzes with adaptive difficulty and instant feedback.",
    href: "/quizzes/generate",
    cta: "Generate a Quiz",
  },
]

const startBuilding = [
  {
    icon: Upload,
    title: "Upload PDFs",
    description: "Upload PDFs with tiered extraction: spatial text analysis, table detection, and OCR fallback for scanned documents.",
    href: "/modules/upload",
  },
  {
    icon: Link2,
    title: "Import from URL",
    description: "Paste a YouTube video URL or any website link. AI extracts transcript or readable content automatically.",
    href: "/modules/upload",
  },
  {
    icon: ClipboardCheck,
    title: "Generate quizzes",
    description: "AI creates diverse questions with few-shot examples, retry logic, and answer normalization.",
    href: "/quizzes/generate",
  },
  {
    icon: GraduationCap,
    title: "Study flashcards",
    description: "AI-generated flashcards with SM-2 spaced repetition. Review schedule adapts to your confidence.",
    href: "/modules",
  },
  {
    icon: BarChart3,
    title: "Track analytics",
    description: "EWMA-based understanding scores, retention trends, topic mastery, and daily streaks.",
    href: "/analytics",
  },
  {
    icon: Target,
    title: "Review weak areas",
    description: "Data-driven insights highlight topics needing more practice. Focus your study time effectively.",
    href: "/dashboard",
  },
]

const faqItems = [
  { q: "What file formats are supported?", a: "PDF (with OCR fallback for scanned documents), plain text, and pasted content. You can also import from YouTube video URLs and any website URL." },
  { q: "How does PDF extraction work?", a: "Syntra uses a tiered approach: first, spatial-aware text extraction with pdfjs-dist (detects tables, headings, multi-column layouts). If extraction is poor, it falls back to Tesseract.js OCR for scanned/image-heavy PDFs. Files up to 10MB are supported." },
  { q: "Is my data secure?", a: "Yes. All data is encrypted in transit and at rest via Supabase. API keys are passed via secure headers, not URL parameters. Row Level Security (RLS) ensures users can only access their own data." },
  { q: "How accurate is AI quiz generation?", a: "Syntra uses Gemini 2.5 Flash with enhanced prompts including few-shot examples, question diversity rules, and distractor quality guidelines. Questions are validated against source content, and the system retries with adjusted instructions if quality is low." },
  { q: "What is spaced repetition?", a: "Spaced repetition (SM-2 algorithm) schedules flashcard reviews at optimal intervals. Cards you find easy are shown less frequently, while difficult cards appear more often. The schedule is computed server-side based on your responses." },
  { q: "How does the streak work?", a: "Your daily streak tracks consecutive days of learning activity. Generate a quiz, review flashcards, or upload a module to maintain your streak. The dashboard shows your current streak with a flame icon." },
  { q: "Can I import from YouTube?", a: "Yes. Paste a YouTube video URL and Syntra will extract the English transcript (if available) and create a module from the video content. Great for lecture videos and educational content." },
  { q: "Is there a limit on modules or quizzes?", a: "Free accounts have a reasonable usage limit. Check your account settings for specific limits. Pro users get unlimited modules, quizzes, and advanced analytics." },
]

const codeBlocks = [
  { label: "Step 1: Account", code: quickstartCode },
  { label: "Step 2: Upload", code: quickstartCode2 },
  { label: "Step 3: Quiz", code: quickstartCode3 },
  { label: "Step 4: Flashcards", code: quickstartCode4 },
]

interface SearchIndexEntry {
  id: string
  title: string
  text: string
}

function buildSearchIndex(): SearchIndexEntry[] {
  return [
    { id: "overview", title: "Overview", text: "Everything you need to get started with Syntra from uploading your first module to tracking your learning analytics documentation" },
    { id: "quickstart", title: "Quickstart", text: "Get started with Syntra in minutes authentication upload module quiz generation flashcard generation import createClient" },
    { id: "pricing", title: "Pricing", text: "Free plan includes modules quizzes basic analytics flashcard review Pro plan unlimited modules quizzes advanced analytics priority support per month" },
    { id: "build-paths", title: "Build paths", text: "Choose your path to start learning effectively Syntra Dashboard AI Quiz Engine progress rings sparklines streak tracking adaptive difficulty" },
    { id: "start-building", title: "Start building", text: "Explore what you can do with Syntra upload PDFs import URL generate quizzes study flashcards track analytics review weak areas" },
    { id: "modules", title: "Modules", text: "Upload your learning materials PDF text YouTube URL website content Syntra turns them into structured interactive modules AI automatically parses extracts key concepts creates navigable learning modules" },
    { id: "quizzes", title: "Quizzes", text: "Generate AI powered quizzes from your module content using Gemini 2.5 Flash multiple choice true false short answer control question count difficulty and topics instant feedback with correct answers and explanations retry logic deduplication" },
    { id: "flashcards", title: "Flashcards", text: "Reinforce knowledge with AI generated flashcards term validation source text verification spaced repetition SM-2 algorithm review schedule adapts to confidence level" },
    { id: "analytics", title: "Analytics", text: "Track your learning performance EWMA based understanding scores retention trends topic mastery breakdown daily streaks recent quiz performance focus study time on weak areas" },
    { id: "spaced-repetition", title: "Spaced Repetition", text: "SM-2 algorithm schedules flashcard reviews at optimal intervals cards you find easy shown less frequently difficult cards appear more often server side computation" },
    { id: "upload", title: "Uploading materials", text: "Supported formats PDF with OCR fallback plain text pasted content files up to 10MB table detection heading detection spatial awareness scanned documents" },
    { id: "import-url", title: "Importing from URLs", text: "YouTube video URL website URL paste link AI extracts transcript or readable content automatically creates module from web content" },
    { id: "generate", title: "Generating quizzes", text: "Create custom quizzes from your uploaded modules in seconds select module choose question count pick topics Gemini 2.5 Flash generates questions with few shot examples diversity rules distractor quality" },
    { id: "generate-flashcards", title: "Generating flashcards", text: "Create AI flashcards from module content term validation source text verification count control difficulty assessment" },
    { id: "review", title: "Reviewing results", text: "Understand your quiz performance breakdown of correct and incorrect answers explanations for every question answer normalization track scores over time highlights topics needing more practice" },
    { id: "track", title: "Tracking progress", text: "Monitor your learning journey over time dashboard aggregates modules created quizzes taken average scores retention trends daily streaks analytics page for topic radar charts and score trends" },
    { id: "faq", title: "Frequently asked questions", text: "Common questions about using Syntra file formats supported PDF text URL data secure encrypted Supabase authentication AI quiz generation accuracy spaced repetition streak tracking" },
    { id: "support", title: "Support", text: "Still have questions get started today explore all features hands on free" },
  ]
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const q = query.toLowerCase()
  const lower = text.toLowerCase()
  const idx = lower.indexOf(q)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-foreground rounded-sm px-0.5">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  )
}

function SectionFadeIn({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handle = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)
    }
    window.addEventListener("scroll", handle, { passive: true })
    return () => window.removeEventListener("scroll", handle)
  }, [])
  return progress
}

export default function DocsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<Record<string, "up" | "down" | null>>({})
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [focusedResult, setFocusedResult] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set())
  const scrollProgress = useScrollProgress()

  const searchIndex = useMemo(() => buildSearchIndex(), [])

  useEffect(() => {
    const handle = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener("scroll", handle, { passive: true })
    return () => window.removeEventListener("scroll", handle)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === "Escape") {
        setSearchQuery("")
        searchInputRef.current?.blur()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
    return () => { document.documentElement.style.scrollBehavior = "" }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    )
    const sections = document.querySelectorAll("section[id]")
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null
    const q = searchQuery.toLowerCase()
    const results: (SearchIndexEntry & { score: number })[] = []
    for (const entry of searchIndex) {
      const titleScore = entry.title.toLowerCase().includes(q) ? 10 : 0
      const textScore = entry.text.toLowerCase().includes(q) ? 1 : 0
      const total = titleScore + textScore
      if (total > 0) results.push({ ...entry, score: total })
    }
    return results.sort((a, b) => b.score - a.score)
  }, [searchQuery, searchIndex])

  useEffect(() => { setFocusedResult(0) }, [searchQuery])

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const id = href.replace("/docs#", "")
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }, [])

  const copyCode = useCallback(async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }, [])

  const toggleFaq = useCallback((idx: number) => {
    setOpenFaqs((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const searchResultCount = searchResults ? searchResults.length : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-muted">
        <motion.div
          className="h-full bg-primary"
          style={{ scaleX: scrollProgress, transformOrigin: "left" }}
        />
      </div>

      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="lg:hidden p-1.5 -ml-1.5 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary">
                <BrainCircuit className="size-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold">Syntra</span>
            </Link>
            <nav className="hidden md:flex items-center gap-5">
              <Link href="/" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link href="/docs" className="text-xs font-medium text-foreground">Docs</Link>
              <Link href="/docs#faq" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="inline-flex h-7 shrink-0 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium transition-all hover:bg-muted">Sign In</Link>
            <Link href="/register" className="inline-flex h-7 shrink-0 items-center justify-center gap-1.5 rounded-md border border-transparent bg-primary px-2.5 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/80">Sign Up</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
          <aside className="hidden lg:block pt-8">
            <nav className="sticky top-20 space-y-6">
              {sidebarNav.map((group) => (
                <div key={group.category}>
                  <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{group.category}</h4>
                  <ul className="space-y-0.5">
                    {group.items.map((item) => {
                      const id = item.href.replace("/docs#", "")
                      const isActive = activeSection === id
                      return (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item.href)}
                            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-all ${
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <ChevronRight className={`size-2.5 shrink-0 transition-all ${
                              isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                            }`} />
                            {item.label}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          <main className="min-w-0 pt-8 pb-16">
            <section id="overview" className="scroll-mt-20">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium">
                <BookOpen className="size-3 text-primary" />
                Documentation
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Syntra Docs</h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Everything you need to get started with Syntra — from uploading your first module to mastering spaced repetition. Powered by Gemini 2.5 Flash.
              </p>

              <div className="relative mt-6 max-w-md">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search docs...  (press / to focus)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full rounded-md border bg-background pl-9 pr-8 text-xs outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); searchInputRef.current?.focus() }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {searchQuery && searchResults && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-2 max-w-md rounded-lg border bg-card shadow-lg"
                  >
                    {searchResults.length === 0 ? (
                      <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                        No results found for &ldquo;{searchQuery}&rdquo;
                      </div>
                    ) : (
                      <ul className="py-1">
                        {searchResults.map((result, idx) => (
                          <li key={result.id}>
                            <a
                              href={`/docs#${result.id}`}
                              onClick={(e) => {
                                e.preventDefault()
                                document.getElementById(result.id)?.scrollIntoView({ behavior: "smooth" })
                                setSearchQuery("")
                              }}
                              onMouseEnter={() => setFocusedResult(idx)}
                              className={`flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                                idx === focusedResult ? "bg-muted" : ""
                              }`}
                            >
                              <ChevronRight className="size-2.5 shrink-0 text-primary" />
                              <div>
                                <span className="font-medium text-foreground">{highlightMatch(result.title, searchQuery)}</span>
                                <span className="ml-1.5 text-muted-foreground">
                                  {highlightMatch(
                                    result.text.slice(0, 80) + (result.text.length > 80 ? "..." : ""),
                                    searchQuery,
                                  )}
                                </span>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <SectionFadeIn>
              <section id="quickstart" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Quickstart</h2>
                <p className="mb-5 text-xs text-muted-foreground">Get started with Syntra in 4 steps.</p>

                {codeBlocks.map((block, idx) => (
                  <div key={idx} className={`rounded-lg border group/code ${idx > 0 ? "mt-4" : ""}`}>
                    <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="size-2 rounded-full bg-red-400" />
                          <div className="size-2 rounded-full bg-yellow-400" />
                          <div className="size-2 rounded-full bg-green-400" />
                        </div>
                        <span className="text-[11px] font-medium text-muted-foreground">{block.label}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyCode(block.code, idx)}
                        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground opacity-0 group-hover/code:opacity-100 hover:bg-muted transition-all focus:opacity-100"
                      >
                        {copiedIdx === idx ? (
                          <><Check className="size-3 text-green-500" /> Copied</>
                        ) : (
                          <><Copy className="size-3" /> Copy</>
                        )}
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <pre className="p-3 text-[11px] leading-relaxed"><code>{block.code.split("\n").map((line, li) => (
                        <span key={li} className="block">
                          <span className="inline-block w-6 mr-3 text-right text-muted-foreground/40 select-none">{li + 1}</span>
                          {line || " "}
                        </span>
                      ))}</code></pre>
                    </div>
                  </div>
                ))}
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="pricing" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Pricing</h2>
                <p className="mb-5 text-xs text-muted-foreground">Free to start, affordable to scale.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border bg-card p-5">
                    <h3 className="text-sm font-semibold">Free</h3>
                    <p className="mt-1 text-2xl font-bold">$0</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">forever</p>
                    <ul className="mt-4 space-y-2 text-xs">
                      <li className="flex items-center gap-2"><Check className="size-3 text-primary shrink-0" /> Up to 3 modules</li>
                      <li className="flex items-center gap-2"><Check className="size-3 text-primary shrink-0" /> 10 quizzes per month</li>
                      <li className="flex items-center gap-2"><Check className="size-3 text-primary shrink-0" /> Basic analytics</li>
                      <li className="flex items-center gap-2"><Check className="size-3 text-primary shrink-0" /> Flashcard review</li>
                      <li className="flex items-center gap-2"><Check className="size-3 text-primary shrink-0" /> YouTube URL import</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-card p-5">
                    <div className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">Most popular</div>
                    <h3 className="mt-1 text-sm font-semibold">Pro</h3>
                    <p className="mt-1 text-2xl font-bold">$12</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">per month</p>
                    <ul className="mt-4 space-y-2 text-xs">
                      <li className="flex items-center gap-2"><Check className="size-3 text-primary shrink-0" /> Unlimited modules</li>
                      <li className="flex items-center gap-2"><Check className="size-3 text-primary shrink-0" /> Unlimited quizzes</li>
                      <li className="flex items-center gap-2"><Check className="size-3 text-primary shrink-0" /> Advanced analytics & insights</li>
                      <li className="flex items-center gap-2"><Check className="size-3 text-primary shrink-0" /> Priority support</li>
                      <li className="flex items-center gap-2"><Check className="size-3 text-primary shrink-0" /> All import sources</li>
                    </ul>
                  </div>
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="build-paths" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Build paths</h2>
                <p className="mb-5 text-xs text-muted-foreground">Choose your path to start learning effectively.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {buildPaths.map((path) => {
                    const Icon = path.icon
                    return (
                      <Link key={path.title} href={path.href} className="group rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
                        <div className="flex items-start gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background group-hover:bg-primary/5 transition-colors">
                            <Icon className="size-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold">{path.title}</h3>
                            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{path.description}</p>
                            <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
                              {path.cta}
                              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="start-building" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Start building</h2>
                <p className="mb-5 text-xs text-muted-foreground">Explore what you can do with Syntra.</p>
                <div className="grid gap-px overflow-hidden rounded-lg border sm:grid-cols-2 lg:grid-cols-3">
                  {startBuilding.map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <Link key={item.title} href={item.href} className="block bg-card p-4 transition-all hover:bg-muted/50 hover:-translate-y-0.5 active:translate-y-0">
                        <motion.div
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          className="flex size-7 items-center justify-center rounded-md border bg-background mb-2.5"
                        >
                          <Icon className="size-3.5 text-primary" />
                        </motion.div>
                        <h3 className="text-sm font-semibold">{item.title}</h3>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                      </Link>
                    )
                  })}
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="modules" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Modules</h2>
                <p className="mb-4 text-xs text-muted-foreground">Upload your learning materials and Syntra turns them into structured, interactive modules.</p>
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                      <BookOpen className="size-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">How modules work</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Upload PDFs, paste text, or import from YouTube/website URLs. Syntra&rsquo;s AI automatically parses the content into structured topics, extracts key concepts, and creates a navigable learning module. PDFs use tiered extraction: spatial-aware text analysis with table detection, falling back to OCR for scanned documents.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-2 py-0.5 text-[10px] font-medium">
                          <FileText className="size-2.5" /> PDF with OCR
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-2 py-0.5 text-[10px] font-medium">
                          <FileText className="size-2.5" /> Plain text
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-2 py-0.5 text-[10px] font-medium">
                          <Youtube className="size-2.5" /> YouTube
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-2 py-0.5 text-[10px] font-medium">
                          <Globe className="size-2.5" /> Website URLs
                        </span>
                      </div>
                      <Link href="/modules/upload" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                        Upload a module <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="quizzes" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Quizzes</h2>
                <p className="mb-4 text-xs text-muted-foreground">Generate AI-powered quizzes from your module content to test your understanding.</p>
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                      <BrainCircuit className="size-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">AI-powered quiz generation</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Powered by <strong>Gemini 2.5 Flash</strong> with enhanced prompts including few-shot examples, question diversity rules, and distractor quality guidelines. Quizzes include multiple-choice, true/false, and short-answer questions. Questions are validated against source content, deduplicated across retries, and scored with answer normalization (A/a/True/true all work).
                      </p>
                      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <li className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-primary" /> Adaptive difficulty (upgrades after 3 correct, downgrades after 2 wrong)</li>
                        <li className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-primary" /> Auto-retry with adjusted instructions on low quality</li>
                        <li className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-primary" /> Question deduplication across retries</li>
                        <li className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-primary" /> Input caps: max 30 questions per request</li>
                      </ul>
                      <Link href="/quizzes/generate" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                        Try a quiz <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="flashcards" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Flashcards</h2>
                <p className="mb-4 text-xs text-muted-foreground">Reinforce knowledge with AI-generated flashcards and spaced repetition.</p>
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                      <GraduationCap className="size-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">AI flashcards with SM-2 scheduling</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        AI generates flashcards with term validation and source-text verification. Each card includes a difficulty rating. The <strong>SM-2 spaced repetition algorithm</strong> computes optimal review intervals server-side — cards you find easy are shown less frequently, while difficult cards appear more often.
                      </p>
                      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <li className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-primary" /> AI validates terms against source content</li>
                        <li className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-primary" /> Server-side SM-2 scheduling (not client-computed)</li>
                        <li className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-primary" /> Easiness factor, interval, and repetition tracking</li>
                        <li className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-primary" /> Input caps: max 30 flashcards per request</li>
                      </ul>
                      <Link href="/modules" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                        Start reviewing <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="analytics" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Analytics</h2>
                <p className="mb-4 text-xs text-muted-foreground">Track your learning performance with data-driven insights.</p>
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                      <BarChart3 className="size-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Understanding at a glance</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        The Analytics dashboard uses <strong>EWMA (Exponentially Weighted Moving Average)</strong> for understanding scores and tracks retention ratios over time. View topic-by-topic mastery breakdown, recent quiz performance, and daily streaks. Use these insights to focus your study time on weak areas.
                      </p>
                      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <li className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-primary" /> EWMA-based understanding scores (not simple averages)</li>
                        <li className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-primary" /> Retention ratio tracking over time</li>
                        <li className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-primary" /> Topic mastery radar charts</li>
                        <li className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-primary" /> Progress rings and sparklines on dashboard</li>
                        <li className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-primary" /> Daily streak tracking with flame icon</li>
                      </ul>
                      <Link href="/analytics" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                        View analytics <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="spaced-repetition" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Spaced Repetition</h2>
                <p className="mb-4 text-xs text-muted-foreground">How Syntra schedules your flashcard reviews for optimal retention.</p>
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                      <Flame className="size-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">SM-2 Algorithm</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Syntra implements the classic <strong>SM-2 spaced repetition algorithm</strong>. When you review a flashcard, you indicate your confidence (0-5). The algorithm computes the next review interval based on your response, easiness factor, and repetition count. All scheduling is computed server-side for accuracy.
                      </p>
                      <div className="mt-3 rounded-md bg-muted/50 p-3 text-xs font-mono text-muted-foreground">
                        <div>EF&rsquo; = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))</div>
                        <div className="mt-1">If q &lt; 3: reset repetition, interval = 1</div>
                        <div>Else: interval = prev * EF</div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Where <strong>q</strong> = your quality rating (0-5), <strong>EF</strong> = easiness factor (min 1.3), and <strong>interval</strong> = days until next review.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="upload" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Uploading materials</h2>
                <p className="mb-4 text-xs text-muted-foreground">Supported formats and how PDF extraction works.</p>
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="text-sm font-semibold">Tiered PDF extraction</h3>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Syntra uses a multi-stage approach to extract content from PDFs:
                  </p>
                  <ol className="mt-2 space-y-2 text-xs text-muted-foreground list-decimal list-inside">
                    <li><strong>Spatial text extraction</strong> — pdfjs-dist with positional analysis detects tables (column gaps), headings (font size/bold), and multi-column layouts</li>
                    <li><strong>OCR fallback</strong> — If extraction is poor (scanned/image-heavy PDFs), Tesseract.js runs OCR entirely in the browser (WASM, no server needed)</li>
                    <li><strong>Table detection</strong> — Tables are detected via coordinate analysis and preserved as structured content</li>
                    <li><strong>Section-aware chunking</strong> — Text is split at section boundaries, preserving table blocks as whole units</li>
                  </ol>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-md bg-muted/50 p-2 text-xs">
                      <span className="font-medium">Max file size:</span> 10 MB
                    </div>
                    <div className="rounded-md bg-muted/50 p-2 text-xs">
                      <span className="font-medium">Chunk size:</span> 2000 tokens
                    </div>
                  </div>
                  <Link href="/modules/upload" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    Upload now <ArrowRight className="size-3" />
                  </Link>
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="import-url" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Importing from URLs</h2>
                <p className="mb-4 text-xs text-muted-foreground">Import content from YouTube videos and websites.</p>
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="text-sm font-semibold">Supported URL sources</h3>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-red-500/10">
                        <Youtube className="size-3.5 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-xs font-medium">YouTube Videos</h4>
                        <p className="text-xs text-muted-foreground">Paste any YouTube video URL. Syntra extracts the English transcript (if available) and creates a module from the video content. Supports standard YouTube URLs, youtu.be links, and embed URLs.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-500/10">
                        <Globe className="size-3.5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-xs font-medium">Website URLs</h4>
                        <p className="text-xs text-muted-foreground">Paste any website URL. Syntra fetches the page, strips navigation/ads/scripts, and extracts readable content using sentence quality filtering. Great for articles, blog posts, and documentation.</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/modules/upload" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    Try URL import <ArrowRight className="size-3" />
                  </Link>
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="generate" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Generating quizzes</h2>
                <p className="mb-4 text-xs text-muted-foreground">Create custom quizzes from your uploaded modules in seconds.</p>
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="text-sm font-semibold">How to generate a quiz</h3>
                  <ol className="mt-2 space-y-2 text-xs text-muted-foreground list-decimal list-inside">
                    <li>Navigate to the <strong>Generate</strong> page from the sidebar</li>
                    <li>Select a module you&rsquo;ve uploaded</li>
                    <li>Choose the number of questions (5&ndash;30)</li>
                    <li>Pick specific topics or let AI cover the full module</li>
                    <li>Click <strong>Generate</strong> &mdash; your quiz is ready in seconds</li>
                  </ol>
                  <div className="mt-3 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                    <strong>How it works:</strong> Gemini 2.5 Flash generates questions using few-shot examples and diversity rules. Each question is validated against the source content. If too many questions are filtered out, the system retries with adjusted instructions. Duplicate questions are removed across retries.
                  </div>
                  <Link href="/quizzes/generate" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    Generate a quiz <ArrowRight className="size-3" />
                  </Link>
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="generate-flashcards" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Generating flashcards</h2>
                <p className="mb-4 text-xs text-muted-foreground">Create AI flashcards from your module content.</p>
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="text-sm font-semibold">How to generate flashcards</h3>
                  <ol className="mt-2 space-y-2 text-xs text-muted-foreground list-decimal list-inside">
                    <li>Open a module from the <strong>Modules</strong> page</li>
                    <li>Click the <strong>Flashcards</strong> tab</li>
                    <li>Choose how many flashcards to generate (5&ndash;30)</li>
                    <li>Click <strong>Generate</strong> &mdash; AI creates term/definition pairs</li>
                  </ol>
                  <div className="mt-3 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                    <strong>Quality checks:</strong> Each flashcard term is validated against the source content. Terms that are too short (&lt;3 chars), too long (&gt;100 chars), or not found in the source text are filtered out. Difficulty is rated 1-5 based on content complexity.
                  </div>
                  <Link href="/modules" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    Start generating <ArrowRight className="size-3" />
                  </Link>
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="review" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Reviewing results</h2>
                <p className="mb-4 text-xs text-muted-foreground">Understand your quiz performance and identify areas for improvement.</p>
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                      <Target className="size-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Detailed feedback</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        After each quiz, view a breakdown of correct and incorrect answers, see explanations for every question, and track how your score compares to previous attempts. Answer normalization means A, a, True, true all work interchangeably. The system highlights topics where you need more practice.
                      </p>
                      <Link href="/quizzes" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                        View past results <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="track" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Tracking progress</h2>
                <p className="mb-4 text-xs text-muted-foreground">Monitor your learning journey over time with comprehensive tracking.</p>
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                      <BarChart3 className="size-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Your learning dashboard</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        The dashboard aggregates all your activity: modules created, quizzes taken, average scores, retention trends, and daily streaks. Visual progress rings show understanding and retention at a glance. Sparkline charts display score trends over time. Use the analytics page for deeper insights including topic-radar charts.
                      </p>
                      <Link href="/dashboard" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                        Go to dashboard <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="faq" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Frequently asked questions</h2>
                <p className="mb-5 text-xs text-muted-foreground">Common questions about using Syntra.</p>
                <div className="space-y-2">
                  {faqItems.map((faq, idx) => {
                    const isOpen = openFaqs.has(idx)
                    return (
                      <div key={idx} className="rounded-lg border bg-card overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleFaq(idx)}
                          className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50 min-h-[44px]"
                        >
                          {faq.q}
                          <motion.div
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground ml-2" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="border-t px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section
                id="support"
                className="mt-12 scroll-mt-20 rounded-lg border bg-card p-6 text-center"
              >
                <div className="mx-auto max-w-sm">
                  <h2 className="text-sm font-semibold">Still have questions?</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Get started today and explore all features hands-on.</p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <Link href="/register" className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md border border-transparent bg-primary px-3 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/80 active:scale-95">Get Started Free</Link>
                    <Link href="/" className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-all hover:bg-muted active:scale-95">Back to Home</Link>
                  </div>
                </div>
              </section>
            </SectionFadeIn>

            <footer className="mt-12 border-t pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex size-5 items-center justify-center rounded bg-primary">
                    <BrainCircuit className="size-3 text-primary-foreground" />
                  </div>
                  Syntra Docs
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                  <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                  <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                </div>
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground">&copy; {new Date().getFullYear()} Syntra. All rights reserved.</p>
            </footer>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 flex size-10 items-center justify-center rounded-full border bg-background shadow-lg hover:bg-muted transition-colors active:scale-95"
            aria-label="Back to top"
          >
            <ArrowUp className="size-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background lg:hidden"
          >
            <div className="flex h-14 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-primary">
                  <BrainCircuit className="size-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-bold">Syntra</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-1.5 hover:bg-muted transition-colors"
                aria-label="Close navigation"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              {sidebarNav.map((group) => (
                <div key={group.category} className="mb-5">
                  <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{group.category}</h4>
                  <ul className="space-y-0.5">
                    {group.items.map((item) => {
                      const id = item.href.replace("/docs#", "")
                      const isActive = activeSection === id
                      return (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item.href)}
                            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            {item.label}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </nav>
            <div className="border-t p-4">
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </div>
  )
}
