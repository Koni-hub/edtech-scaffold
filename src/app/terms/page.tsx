import Link from "next/link"
import { BrainCircuit } from "lucide-react"

export const metadata = {
  title: "Terms of Service",
  description: "Syntra Terms of Service — the terms governing your use of the Syntra platform.",
}

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: June 2026</p>
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>By using Syntra, you agree to these Terms of Service. If you do not agree, do not use the platform.</p>
          <h2 className="text-lg font-semibold text-foreground">2. Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>
          <h2 className="text-lg font-semibold text-foreground">3. Acceptable Use</h2>
          <p>You agree not to misuse the platform, upload harmful content, or attempt to disrupt our services.</p>
          <h2 className="text-lg font-semibold text-foreground">4. Intellectual Property</h2>
          <p>Your uploaded content remains yours. Syntra claims no ownership over your study materials.</p>
          <h2 className="text-lg font-semibold text-foreground">5. Limitation of Liability</h2>
          <p>Syntra is provided &quot;as is&quot; without warranties. We are not liable for damages arising from your use of the platform.</p>
          <h2 className="text-lg font-semibold text-foreground">6. Changes</h2>
          <p>We may update these terms. Continued use after changes constitutes acceptance of the new terms.</p>
        </div>
      </main>
    </div>
  )
}
