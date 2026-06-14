import Link from "next/link"
import { BrainCircuit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentation - LearnHealth",
  description: "LearnHealth documentation and user guide",
}

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    content: [
      {
        heading: "Create an Account",
        text: "Sign up for a free account using your email address. You'll receive a confirmation email to verify your account before you can start using the platform.",
      },
      {
        heading: "Upload Your First Module",
        text: "Navigate to the Modules section and click 'Upload'. You can upload PDF files containing course materials, lecture notes, or study guides. Our AI will automatically process and chunk the content into structured learning modules.",
      },
      {
        heading: "Generate a Quiz",
        text: "Once your module is processed, go to the Quizzes section and select 'Generate Quiz'. Choose the module and topic you want to be tested on. The AI will create a set of questions tailored to your learning materials.",
      },
      {
        heading: "Review Your Results",
        text: "After completing a quiz, review your answers and track your understanding score. The analytics dashboard will show your progress over time and highlight areas that need more attention.",
      },
    ],
  },
  {
    id: "features",
    title: "Features",
    content: [
      {
        heading: "AI Quiz Generation",
        text: "Our AI analyzes your uploaded materials and generates relevant quiz questions across multiple formats — multiple choice, true/false, and open-ended. Questions are designed to test both recall and comprehension.",
      },
      {
        heading: "Learning Analytics",
        text: "The analytics dashboard provides insights into your learning patterns. Track understanding scores, retention rates, quiz performance trends, and topic mastery through interactive charts and visualizations.",
      },
      {
        heading: "Flashcard Reviews",
        text: "Each module includes a flashcard review mode that helps reinforce key concepts. Flashcards are automatically generated from your materials using spaced repetition principles.",
      },
      {
        heading: "Topic Mastery Tracking",
        text: "Monitor your progress across different topics and subjects. The system identifies weak areas and recommends targeted review to help you improve your understanding.",
      },
    ],
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    content: [
      {
        heading: "What file formats are supported?",
        text: "Currently we support PDF files for module uploads. Support for additional formats like DOCX, TXT, and Markdown is coming soon.",
      },
      {
        heading: "Is my data secure?",
        text: "Yes. All data is encrypted in transit and at rest. We use Supabase for secure authentication and data storage. Your learning materials and performance data are private to your account.",
      },
      {
        heading: "How accurate is the AI quiz generation?",
        text: "The AI generates questions based on the content you provide. Quality depends on the clarity and structure of your source materials. We recommend uploading well-organized PDFs for best results.",
      },
      {
        heading: "Can I use LearnHealth offline?",
        text: "LearnHealth is a web-based platform and requires an internet connection. We are exploring offline capabilities for future releases.",
      },
      {
        heading: "Is there a limit on modules or quizzes?",
        text: "Free accounts have a reasonable usage limit. Check the pricing section or your account settings for specific limits. We offer higher limits for educational institutions.",
      },
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="size-7 text-primary" />
            <span className="text-lg font-bold">LearnHealth</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="/login" className="inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-lg border border-border bg-background px-2.5 text-[0.8rem] font-medium whitespace-nowrap transition-all hover:bg-muted hover:text-foreground">Sign In</Link>
            <Link href="/register" className="inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-lg border border-transparent bg-primary px-2.5 text-[0.8rem] font-medium whitespace-nowrap text-primary-foreground transition-all hover:bg-primary/80">Get Started</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-12">
          <nav className="mb-8 lg:mb-0">
            <div className="lg:sticky lg:top-24 lg:space-y-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Documentation</p>
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={`/docs#${section.id}`}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {section.title}
                </Link>
              ))}
            </div>
          </nav>

          <div className="min-w-0">
            <div className="mb-10">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Documentation</h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Everything you need to know about getting started with LearnHealth and making the most of its features.
              </p>
            </div>

            {sections.map((section) => (
              <section key={section.id} id={section.id} className="mb-16 scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold tracking-tight">{section.title}</h2>
                <div className="space-y-6">
                  {section.content.map((item) => (
                    <Card key={item.heading}>
                      <CardHeader>
                        <CardTitle className="text-lg">{item.heading}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm leading-relaxed">{item.text}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}

            <div className="rounded-2xl border bg-card p-8 text-center">
              <h2 className="text-xl font-bold">Still Have Questions?</h2>
              <p className="mt-2 text-muted-foreground">
                Get started today and explore all features hands-on.
              </p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <Link href="/register" className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-primary px-2.5 text-sm font-medium whitespace-nowrap text-primary-foreground transition-all hover:bg-primary/80">Get Started Free</Link>
                <Link href="/" className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium whitespace-nowrap text-foreground transition-all hover:bg-muted hover:text-foreground">Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} LearnHealth. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
