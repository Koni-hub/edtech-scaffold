"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Flame, Target, TrendingUp, Loader2, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface DailyGoalData {
  goal_quizzes: number
  goal_flashcards: number
  quizzes_today: number
  flashcards_today: number
}

export function DailyGoalCard() {
  const [goal, setGoal] = useState<DailyGoalData | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [goalQuizzes, setGoalQuizzes] = useState(3)
  const [goalFlashcards, setGoalFlashcards] = useState(10)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date().toISOString().split("T")[0]

      const [quizzesRes, flashcardsRes, settingsRes] = await Promise.all([
        supabase
          .from("quiz_attempts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("attempted_at", today),
        supabase
          .from("flashcard_schedule")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("updated_at", today),
        supabase
          .from("profiles")
          .select("goal_quizzes, goal_flashcards")
          .eq("id", user.id)
          .maybeSingle(),
      ])

      const gq = settingsRes.data?.goal_quizzes ?? 3
      const gf = settingsRes.data?.goal_flashcards ?? 10
      setGoalQuizzes(gq)
      setGoalFlashcards(gf)

      setGoal({
        goal_quizzes: gq,
        goal_flashcards: gf,
        quizzes_today: quizzesRes.count ?? 0,
        flashcards_today: flashcardsRes.count ?? 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  const handleSaveGoal = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from("profiles")
      .update({
        goal_quizzes: goalQuizzes,
        goal_flashcards: goalFlashcards,
      } as never)
      .eq("id", user.id)

    setGoal((prev) => prev ? {
      ...prev,
      goal_quizzes: goalQuizzes,
      goal_flashcards: goalFlashcards,
    } : prev)
    setEditMode(false)
    toast.success("Daily goal updated!")
  }, [goalQuizzes, goalFlashcards])

  if (loading || !goal) {
    return (
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Loading goals...</span>
        </div>
      </div>
    )
  }

  const quizProgress = Math.min(100, Math.round((goal.quizzes_today / goal.goal_quizzes) * 100))
  const flashcardProgress = Math.min(100, Math.round((goal.flashcards_today / goal.goal_flashcards) * 100))
  const overallProgress = Math.round((quizProgress + flashcardProgress) / 2)
  const allDone = quizProgress >= 100 && flashcardProgress >= 100

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-primary" />
          <h3 className="text-sm font-semibold">Daily Goal</h3>
        </div>
        {allDone && (
          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <CheckCircle2 size={14} />
            Complete!
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Overall</span>
          <span className="font-medium">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Quizzes: {goal.quizzes_today}/{goal.goal_quizzes}</span>
            <span className={`font-medium ${quizProgress >= 100 ? "text-green-600" : ""}`}>{quizProgress}%</span>
          </div>
          <Progress value={quizProgress} className="h-1.5" />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Flashcards: {goal.flashcards_today}/{goal.goal_flashcards}</span>
            <span className={`font-medium ${flashcardProgress >= 100 ? "text-green-600" : ""}`}>{flashcardProgress}%</span>
          </div>
          <Progress value={flashcardProgress} className="h-1.5" />
        </div>
      </div>

      {editMode ? (
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-muted-foreground">Quizzes/day</label>
              <Input
                type="number"
                min={1}
                max={50}
                value={goalQuizzes}
                onChange={(e) => setGoalQuizzes(Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-muted-foreground">Flashcards/day</label>
              <Input
                type="number"
                min={1}
                max={100}
                value={goalFlashcards}
                onChange={(e) => setGoalFlashcards(Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditMode(false)} className="h-7 text-xs">Cancel</Button>
            <Button size="sm" onClick={handleSaveGoal} className="h-7 text-xs">Save</Button>
          </div>
        </div>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setEditMode(true)}
          className="mt-3 w-full text-xs text-muted-foreground"
        >
          Edit goal
        </Button>
      )}
    </div>
  )
}
