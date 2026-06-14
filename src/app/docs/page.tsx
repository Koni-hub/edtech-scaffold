"use client"

import { useState, useEffect, useRef, useMemo, useCallback, Fragment } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  BrainCircuit, BookOpen, BarChart3, Sparkles, Upload, Target,
  ArrowRight, Search, ChevronRight, Menu, X, GraduationCap, Bot,
  Copy, Check, ThumbsUp, ThumbsDown, ArrowUp,
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
      { href: "/docs#analytics", label: "Analytics" },
      { href: "/docs#flashcards", label: "Flashcards" },
    ],
  },
  {
    category: "Guides",
    items: [
      { href: "/docs#upload", label: "Uploading materials" },
      { href: "/docs#generate", label: "Generating quizzes" },
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

const quickstartCode = `import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

// Sign in to your account
const { data, error } = await supabase.auth.signInWithPassword({
  email: "student@example.com",
  password: "your-password",
})`

const quickstartCode2 = `// Upload a module
const formData = new FormData()
formData.append("file", pdfFile)
formData.append("title", "Cell Biology")

const { data: module } = await fetch("/api/modules/upload", {
  method: "POST",
  body: formData,
}).then(r => r.json())`

const quickstartQuiz = `// Generate a quiz from module content
const response = await fetch("/api/quiz/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    moduleId: "module_123",
    topic: "Cell Biology",
    questionCount: 5,
  }),
})

const quiz = await response.json()
console.log(quiz.questions)`

const buildPaths = [
  {
    icon: BrainCircuit,
    title: "Syntra Dashboard",
    description: "Use the interactive dashboard to manage modules, take quizzes, and track your analytics in real time.",
    href: "/dashboard",
    cta: "Go to Dashboard",
  },
  {
    icon: Bot,
    title: "AI Quiz Engine",
    description: "Generate intelligent quizzes from your uploaded materials with adaptive difficulty and instant feedback.",
    href: "/quizzes/generate",
    cta: "Generate a Quiz",
  },
]

const startBuilding = [
  {
    icon: Upload,
    title: "Upload modules",
    description: "Upload PDFs and documents. AI automatically processes them into structured learning modules.",
    href: "/modules/upload",
  },
  {
    icon: Sparkles,
    title: "Generate quizzes",
    description: "Create custom quizzes from your materials with multiple question formats.",
    href: "/quizzes/generate",
  },
  {
    icon: BarChart3,
    title: "Track analytics",
    description: "Monitor understanding scores, retention rates, and topic mastery over time.",
    href: "/analytics",
  },
  {
    icon: Target,
    title: "Review weak areas",
    description: "Identify topics that need more attention with data-driven insights.",
    href: "/dashboard",
  },
  {
    icon: GraduationCap,
    title: "Study flashcards",
    description: "Reinforce knowledge with AI-generated flashcards using spaced repetition.",
    href: "/modules",
  },
  {
    icon: BookOpen,
    title: "Browse modules",
    description: "Organize and explore all your learning modules by subject and topic.",
    href: "/modules",
  },
]

const faqItems = [
  { q: "What file formats are supported?", a: "Currently we support PDF files for module uploads. Support for DOCX, TXT, and Markdown is coming soon." },
  { q: "Is my data secure?", a: "Yes. All data is encrypted in transit and at rest. We use Supabase for secure authentication and data storage." },
  { q: "How accurate is AI quiz generation?", a: "The AI generates questions based on your content. Quality depends on the clarity of your source materials." },
  { q: "Is there a limit on modules or quizzes?", a: "Free accounts have a reasonable usage limit. Check your account settings for specific limits." },
]

const codeBlocks = [
  { label: "Authentication", code: quickstartCode },
  { label: "Upload Module", code: quickstartCode2 },
  { label: "Quiz Generation", code: quickstartQuiz },
]

interface SearchIndexEntry {
  id: string
  title: string
  text: string
}

function buildSearchIndex(): SearchIndexEntry[] {
  return [
    { id: "overview", title: "Overview", text: "Everything you need to get started with Syntra from uploading your first module to tracking your learning analytics documentation" },
    { id: "quickstart", title: "Quickstart", text: "Get started with Syntra in minutes authentication upload module quiz generation import createClient signInWithPassword fetch api" },
    { id: "pricing", title: "Pricing", text: "Free to start affordable to scale Free plan includes modules quizzes basic analytics flashcard review Pro plan unlimited modules quizzes advanced analytics priority support per month" },
    { id: "build-paths", title: "Build paths", text: "Choose your path to start learning effectively Syntra Dashboard AI Quiz Engine interactive dashboard manage modules take quizzes track analytics adaptive difficulty instant feedback" },
    { id: "start-building", title: "Start building", text: "Explore what you can do with Syntra upload modules generate quizzes track analytics review weak areas study flashcards browse modules PDF AI processes" },
    { id: "modules", title: "Modules", text: "Upload your learning materials Syntra turns them into structured interactive modules AI automatically parses PDFs and documents into topics extracts key concepts creates navigable learning modules foundation for quizzes flashcards and analytics" },
    { id: "quizzes", title: "Quizzes", text: "Generate AI powered quizzes from your module content multiple choice true false fill in the blank control question count difficulty and topics instant feedback with correct answers and explanations" },
    { id: "analytics", title: "Analytics", text: "Track your learning performance with data driven insights understanding score retention trends topic mastery breakdown recent quiz performance focus study time on weak areas" },
    { id: "flashcards", title: "Flashcards", text: "Reinforce knowledge with AI generated flashcards and spaced repetition review cards shuffled mark confidence levels track which cards need more practice optimal intervals" },
    { id: "upload", title: "Uploading materials", text: "Supported formats PDF DOCX TXT Markdown best practices for uploading learning materials files up to 50 MB supported on all plans use clear headings for best AI processing" },
    { id: "generate", title: "Generating quizzes", text: "Create custom quizzes from your uploaded modules in seconds select module choose question count pick topics click generate quiz ready in seconds" },
    { id: "review", title: "Reviewing results", text: "Understand your quiz performance breakdown of correct and incorrect answers explanations for every question track scores over time highlights topics needing more practice" },
    { id: "track", title: "Tracking progress", text: "Monitor your learning journey over time dashboard aggregates modules created quizzes taken average scores retention trends analytics page for topic radar charts and score trends" },
    { id: "faq", title: "Frequently asked questions", text: "Common questions about using Syntra file formats supported PDF DOCX TXT Markdown data secure encrypted Supabase authentication AI quiz generation accuracy content limits free accounts" },
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
                Everything you need to get started with Syntra — from uploading your first module to tracking your learning analytics.
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
              <section
                id="quickstart"
                className="mt-12 scroll-mt-20"
              >
                <h2 className="mb-1 text-lg font-semibold">Quickstart</h2>
                <p className="mb-5 text-xs text-muted-foreground">Get started with Syntra in minutes.</p>

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
                        Upload PDFs or documents in the Modules section. Syntra&rsquo;s AI automatically parses the content into structured topics, extracts key concepts, and creates a navigable learning module. Each module becomes the foundation for quizzes, flashcards, and analytics.
                      </p>
                      <Link href="/modules/upload" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
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
                      <h3 className="text-sm font-semibold">Quiz formats</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Quizzes include multiple-choice, true-or-false, and fill-in-the-blank questions. You control the number of questions, difficulty level, and specific topics. After submission, receive instant feedback with correct answers and explanations.
                      </p>
                      <Link href="/quizzes/generate" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                        Try a quiz <ArrowRight className="size-3" />
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
                        The Analytics dashboard shows your overall understanding score, retention trends over time, topic-by-topic mastery breakdown, and recent quiz performance. Use these insights to focus your study time on weak areas.
                      </p>
                      <Link href="/analytics" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                        View analytics <ArrowRight className="size-3" />
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
                      <h3 className="text-sm font-semibold">Built-in review system</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Every module generates a flashcard deck. Review cards in order or shuffled, mark confidence levels, and track which cards need more practice. Spaced repetition scheduling ensures you review concepts at optimal intervals.
                      </p>
                      <Link href="/modules" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                        Start reviewing <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </SectionFadeIn>

            <SectionFadeIn>
              <section id="upload" className="mt-12 scroll-mt-20">
                <h2 className="mb-1 text-lg font-semibold">Uploading materials</h2>
                <p className="mb-4 text-xs text-muted-foreground">Supported formats and best practices for uploading learning materials.</p>
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="text-sm font-semibold">Supported formats</h3>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary shrink-0" /> <strong>PDF</strong> &mdash; Best for lecture notes, textbooks, and articles</li>
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary shrink-0" /> <strong>DOCX</strong> &mdash; Word documents</li>
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary shrink-0" /> <strong>TXT</strong> &mdash; Plain text files</li>
                    <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary shrink-0" /> <strong>Markdown</strong> &mdash; Structured text with headings</li>
                  </ul>
                  <p className="mt-3 text-xs text-muted-foreground">
                    For best results, use clear headings and structured content. Files up to 50 MB are supported on all plans.
                  </p>
                  <Link href="/modules/upload" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    Upload now <ArrowRight className="size-3" />
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
                    <li>Choose the number of questions (5&ndash;20)</li>
                    <li>Pick specific topics or let AI cover the full module</li>
                    <li>Click <strong>Generate</strong> &mdash; your quiz is ready in seconds</li>
                  </ol>
                  <Link href="/quizzes/generate" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    Generate a quiz <ArrowRight className="size-3" />
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
                        After each quiz, view a breakdown of correct and incorrect answers, see explanations for every question, and track how your score compares to previous attempts. The system highlights topics where you need more practice.
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
                        The dashboard aggregates all your activity: modules created, quizzes taken, average scores, and retention trends. Use the analytics page for deeper insights including topic-radar charts and score trends over days and weeks.
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
                  <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
                  <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
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
