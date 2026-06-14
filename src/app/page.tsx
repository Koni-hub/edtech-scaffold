"use client"

import Link from "next/link"
import { BrainCircuit, BookOpen, BarChart3, Sparkles, Upload, Target, ArrowRight, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { useState } from "react"

const features = [
  {
    icon: Upload,
    title: "Upload Learning Materials",
    description: "Upload PDFs, notes, and documents. Our AI automatically processes and chunks them into structured modules.",
  },
  {
    icon: Sparkles,
    title: "AI-Generated Quizzes",
    description: "Generate custom quizzes from your materials with adaptive difficulty. Choose from multiple question formats.",
  },
  {
    icon: BarChart3,
    title: "Learning Analytics",
    description: "Track understanding scores, retention rates, and topic mastery over time with detailed visualizations.",
  },
  {
    icon: Target,
    title: "Personalized Review",
    description: "Get smart recommendations on topics to review based on your performance data and learning patterns.",
  },
  {
    icon: BrainCircuit,
    title: "Flashcard Mode",
    description: "Reinforce knowledge with AI-powered flashcards generated from your course materials.",
  },
  {
    icon: BookOpen,
    title: "Multi-Subject Support",
    description: "Organize modules by subject, track progress across topics, and manage your entire learning journey.",
  },
]

const steps = [
  { number: "01", title: "Upload", description: "Upload your course materials — PDFs, notes, or documents." },
  { number: "02", title: "Process", description: "AI analyzes and chunks content into structured, digestible modules." },
  { number: "03", title: "Learn", description: "Take quizzes, review flashcards, and track your progress in real time." },
  { number: "04", title: "Improve", description: "Identify weak areas and reinforce knowledge with targeted practice." },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="size-7 text-primary" />
            <span className="text-lg font-bold">LearnHealth</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
            <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Docs</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium whitespace-nowrap transition-all hover:bg-muted hover:text-foreground">Sign In</Link>
            <Link href="/register" className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-primary px-2.5 text-sm font-medium whitespace-nowrap text-primary-foreground transition-all hover:bg-primary/80">Get Started</Link>
          </div>

          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t bg-background md:hidden">
            <div className="space-y-2 px-4 py-4">
              <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">Features</Link>
              <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">How It Works</Link>
              <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">Docs</Link>
              <hr className="my-2" />
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">Sign In</Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border bg-muted px-3 py-1 text-xs font-medium">
                <Sparkles className="size-3.5 text-primary" />
                AI-Powered Learning Analytics
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Transform Your Learning with{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">AI-Powered Insights</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                Upload your materials, generate intelligent quizzes, and track your understanding over time.
                LearnHealth adapts to your pace and helps you master any subject.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/register" className="inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-primary px-8 text-base font-medium whitespace-nowrap text-primary-foreground transition-all hover:bg-primary/80">
                  Start Learning Free
                  <ArrowRight className="ml-2 size-4" />
                </Link>
                <Link href="#features" className="inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-8 text-base font-medium whitespace-nowrap text-foreground transition-all hover:bg-muted hover:text-foreground">See How It Works</Link>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
              {[
                { value: "10K+", label: "Quizzes Generated" },
                { value: "5K+", label: "Active Learners" },
                { value: "50+", label: "Subjects Covered" },
                { value: "92%", label: "Satisfaction Rate" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border bg-card p-4 text-center">
                  <div className="text-2xl font-bold sm:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="border-b py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need to Learn Smarter</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                AI-powered tools that turn your study materials into an adaptive learning experience.
              </p>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="group rounded-xl border bg-card p-6 transition-shadow hover:shadow-md">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-b py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Get started in minutes. From upload to mastery in four simple steps.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  {index < steps.length - 1 && (
                    <div className="absolute left-8 top-12 hidden h-0.5 w-[calc(100%-4rem)] bg-border lg:block" />
                  )}
                  <div className="relative flex flex-col items-center text-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                      {step.number}
                    </div>
                    <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-16">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary" />
              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Transform Your Learning?</h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                  Join thousands of learners using LearnHealth to master new subjects faster and more effectively.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/register" className="inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-secondary px-8 text-base font-medium whitespace-nowrap text-secondary-foreground transition-all hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]">
                    Get Started Free
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                  <Link href="/docs" className="inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-lg px-8 text-base font-medium whitespace-nowrap text-primary-foreground transition-all hover:bg-primary-foreground/10">Read the Docs</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <BrainCircuit className="size-6 text-primary" />
                <span className="font-bold">LearnHealth</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                AI-powered learning analytics platform for modern education.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Getting Started</Link></li>
                <li><Link href="/docs#faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LearnHealth. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
