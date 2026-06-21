"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Link2, ClipboardCheck, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const steps = [
  { id: "upload", icon: Upload, title: "Upload Content", desc: "Upload a PDF, paste text, or import from a URL" },
  { id: "quiz", icon: ClipboardCheck, title: "Generate Quiz", desc: "AI creates questions from your material" },
  { id: "review", icon: ArrowRight, title: "Review & Learn", desc: "Use flashcards and spaced repetition to retain knowledge" },
]

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={`flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 h-0.5 ${i < step ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-3">
            {(() => {
              const Icon = steps[step].icon
              return <Icon size={24} className="text-primary" />
            })()}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{steps[step].title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{steps[step].desc}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          <div className="flex gap-2">
            {step < steps.length - 1 ? (
              <>
                <Button
                  size="sm"
                  onClick={() => {
                    if (step === 0) router.push("/modules/upload")
                    else if (step === 1) router.push("/quizzes/generate")
                    else setStep((s) => s + 1)
                  }}
                >
                  Get Started
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setStep((s) => s + 1)}
                >
                  Skip
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => router.push("/modules")}>
                Go to Modules
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
