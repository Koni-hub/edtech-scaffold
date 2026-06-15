import Link from "next/link"
import { BrainCircuit } from "lucide-react"

export const metadata = {
  title: "Privacy Policy",
  description: "Syntra Privacy Policy — how we collect, use, and protect your data.",
}

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: June 2026</p>
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account, uploading study materials, and using our platform. This includes your name, email address, and the content you upload.</p>
          <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>Your information is used to provide and improve our services, generate AI-powered quizzes and flashcards from your materials, and analyze learning patterns to offer personalized insights.</p>
          <h2 className="text-lg font-semibold text-foreground">3. Data Security</h2>
          <p>All data is encrypted in transit and at rest. We use industry-standard security practices to protect your information from unauthorized access.</p>
          <h2 className="text-lg font-semibold text-foreground">4. Third-Party Services</h2>
          <p>We use Supabase for authentication and data storage, and Google&apos;s Generative AI for content processing. These services adhere to their own privacy policies.</p>
          <h2 className="text-lg font-semibold text-foreground">5. Contact</h2>
          <p>If you have questions about this policy, please contact us through our support channels.</p>
        </div>
      </main>
    </div>
  )
}
