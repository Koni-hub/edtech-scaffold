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
    { id: "overview", title: "Overview", text: "Everything you need to get started with Syntra — from uploading your first module to tracking your learning analytics. Documentation." },
    { id: "quickstart", title: "Quickstart", text: "Get started with Syntra in minutes. Authentication Upload Module Quiz Generation  import createClient signInWithPassword upload fetch module quiz generate api" },
    { id: "build-paths", title: "Build paths", text: "Choose your path to start learning effectively. Syntra Dashboard AI Quiz Engine interactive dashboard manage modules take quizzes track analytics Generate quizzes from uploaded materials adaptive difficulty instant feedback." },
    { id: "start-building", title: "Start building", text: "Explore what you can do with Syntra. Upload modules Generate quizzes Track analytics Review weak areas Study flashcards Browse modules Upload PDFs AI processes Generate custom quizzes question formats Monitor understanding scores retention topic mastery Identify weak areas data insights Spaced repetition Organize learning modules by subject topic." },
    { id: "faq", title: "Frequently asked questions", text: "Common questions about using Syntra. file formats supported PDF DOCX TXT Markdown data secure encrypted Supabase authentication AI quiz generation accuracy content limits Free accounts usage limit" },
    { id: "support", title: "Support", text: "Still have questions? Get started today explore all features hands-on free." },
    { id: "modules", title: "Modules", text: "Upload and manage learning modules. AI processes PDF documents into structured learning modules." },
    { id: "quizzes", title: "Quizzes", text: "Generate and take quizzes with multiple question formats. AI-generated questions from your content." },
    { id: "analytics", title: "Analytics", text: "Track analytics monitor understanding scores retention rates topic mastery over time." },
    { id: "flashcards", title: "Flashcards", text: "Study flashcards reinforce knowledge with spaced repetition." },
    { id: "upload", title: "Uploading materials", text: "Upload PDFs and documents. AI automatically processes them into structured learning modules." },
    { id: "generate", title: "Generating quizzes", text: "Create custom quizzes from your materials with multiple question formats." },
    { id: "review", title: "Reviewing results", text: "Review quiz results and identify areas for improvement with data-driven insights." },
    { id: "track", title: "Tracking progress", text: "Track your learning progress understanding scores retention and topic mastery over time." },
    { id: "pricing", title: "Pricing", text: "Free accounts available with reasonable usage limits." },
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
