import Link from "next/link"
import { BrainCircuit, ArrowRight } from "lucide-react"

export const metadata = {
  title: "About",
  description: "Learn about Syntra — the AI-powered learning platform that helps students and professionals master new subjects faster.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary">
              <BrainCircuit className="size-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold">Syntra</span>
          </Link>
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Back to Home</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">About Syntra</h1>
        <p className="mt-2 text-sm text-muted-foreground">Study Your Notes with Tracking, Review, and Adaptation.</p>
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Syntra is an AI-powered learning analytics platform designed to help students and professionals
            master new subjects faster. Upload your study materials, generate intelligent quizzes, track your
            understanding with deep analytics, and reinforce knowledge with spaced repetition flashcards.
          </p>
          <p>
            Our mission is to make personalized, adaptive learning accessible to everyone. By combining
            artificial intelligence with proven learning science principles, we help learners identify their
            weak areas, focus their study time effectively, and retain information longer.
          </p>
          <p>
            Whether you&apos;re a medical student reviewing lecture notes, a computer science major
            preparing for exams, or a professional learning new skills, Syntra adapts to your unique
            learning journey.
          </p>
        </div>
        <div className="mt-10 flex gap-3">
          <Link href="/register" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/80">
            Get Started Free <ArrowRight className="size-3.5" />
          </Link>
          <Link href="/docs" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border px-4 text-xs font-medium hover:bg-muted">
            Read Docs
          </Link>
        </div>
      </main>
    </div>
  )
}
