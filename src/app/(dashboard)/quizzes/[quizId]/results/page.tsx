"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { CheckCircle2, XCircle, BrainCircuit, BarChart3, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScoreBadge } from "@/components/modules/score-badge"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface QuestionResult {
  id: string
  question_text: string
  question_type: string
  options: { label: string; text: string }[] | null
  correct_answer: string
  explanation: string | null
  topic: string
  attempt: {
    given_answer: string
    is_correct: boolean
  } | null
}

interface ResultData {
  quizId: string
  quizTitle: string
  totalQuestions: number
  correctAnswers: number
  score: number
  questions: QuestionResult[]
  topicScores: { topic: string; correct: number; total: number; pct: number }[]
}

export default function QuizResultsPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadResults() {
      const { data: quizData } = await supabase
        .from("quizzes")
        .select("id, title")
        .eq("id", params.quizId)
        .single()

      if (!quizData) return

      const { data: questions } = await supabase
        .from("questions")
        .select("*")
        .eq("quiz_id", params.quizId)
        .order("order_index", { ascending: true })

      if (!questions) return

      const { data: attempts } = await supabase
        .from("quiz_attempts")
        .select("question_id, given_answer, is_correct")
        .eq("quiz_id", params.quizId)

      const attemptMap: Record<string, { given_answer: string; is_correct: boolean }> = {}
      for (const a of attempts ?? []) {
        attemptMap[a.question_id] = { given_answer: a.given_answer, is_correct: a.is_correct }
      }

      const questionsWithResults: QuestionResult[] = questions.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        topic: q.topic,
        attempt: attemptMap[q.id] ?? null,
      }))

      const correctCount = questionsWithResults.filter((q) => q.attempt?.is_correct).length
      const total = questionsWithResults.length
      const score = total > 0 ? Math.round((correctCount / total) * 100) : 0

      const topicMap: Record<string, { correct: number; total: number }> = {}
      for (const q of questionsWithResults) {
        if (!topicMap[q.topic]) topicMap[q.topic] = { correct: 0, total: 0 }
        topicMap[q.topic].total++
        if (q.attempt?.is_correct) topicMap[q.topic].correct++
      }
      const topicScores = Object.entries(topicMap).map(([topic, v]) => ({
        topic,
        correct: v.correct,
        total: v.total,
        pct: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
      }))

      setResult({
        quizId: params.quizId as string,
        quizTitle: quizData.title,
        totalQuestions: total,
        correctAnswers: correctCount,
        score,
        questions: questionsWithResults,
        topicScores,
      })
      setLoading(false)
    }
    loadResults()
  }, [supabase, params.quizId])

  if (loading || !result) {
    return (
      <div className="flex items-center justify-center py-20">
        <BarChart3 size={24} className="animate-pulse text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{result.quizTitle} - Results</h1>
        <div className="mt-4">
          <span className="text-6xl font-bold">{result.score}%</span>
        </div>
        <p className="mt-2 text-muted-foreground">
          {result.correctAnswers} of {result.totalQuestions} correct
        </p>
        <div className="mt-2">
          <ScoreBadge score={result.score} size="lg" />
        </div>
      </div>

      {result.topicScores.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <BrainCircuit size={18} />
            Topic Scores
          </h2>
          <div className="space-y-2">
            {result.topicScores.map((ts) => (
              <div key={ts.topic} className="flex items-center justify-between text-sm">
                <span>{ts.topic}</span>
                <ScoreBadge score={ts.pct} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <BarChart3 size={18} />
          Question Breakdown
        </h2>
        {result.questions.map((q, i) => (
          <div
            key={q.id}
            className={cn(
              "rounded-xl border p-4",
              q.attempt?.is_correct
                ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {q.attempt?.is_correct ? (
                  <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle size={18} className="text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {i + 1}. {q.question_text}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {q.attempt?.is_correct
                    ? `Correct: ${q.correct_answer}`
                    : `Your answer: ${q.attempt?.given_answer ?? "None"} | Correct: ${q.correct_answer}`}
                </p>
                {q.explanation && (
                  <p className="mt-1 text-xs italic text-muted-foreground">{q.explanation}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={() => router.push(`/modules`)}>
          <BrainCircuit size={16} />
          Review Module
        </Button>
        <Button onClick={() => router.push("/quizzes")}>
          <RotateCcw size={16} />
          Take Another Quiz
        </Button>
      </div>
    </div>
  )
}

