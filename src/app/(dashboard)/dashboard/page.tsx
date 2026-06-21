import Link from "next/link"
import { BrainCircuit, BookOpen, Target, ClipboardCheck, Upload, ArrowRight, Flame } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ProgressRing } from "@/components/ui/progress-ring"
import { Sparkline } from "@/components/ui/sparkline"
import { Button } from "@/components/ui/button"
import { OnboardingFlow } from "@/components/modules/onboarding-flow"
import { DailyGoalCard } from "@/components/modules/daily-goal-card"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id

  const [snapshotsRes, topicsRes, attemptsRes, modulesRes] = await Promise.all([
    supabase
      .from("analytics_snapshots")
      .select("*")
      .eq("user_id", userId)
      .order("snapshot_date", { ascending: false })
      .limit(30),
    supabase.from("topic_mastery").select("*").eq("user_id", userId),
    supabase
      .from("quiz_attempts")
      .select("*, quiz:quizzes(title)")
      .eq("user_id", userId)
      .order("attempted_at", { ascending: false })
      .limit(10),
    supabase
      .from("modules")
      .select("id, title, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const snapshots = snapshotsRes.data ?? []
  const latestSnapshot = snapshots[0]
  const topics = topicsRes.data ?? []
  const recentAttempts = attemptsRes.data ?? []
  const recentModules = modulesRes.data ?? []

  const understanding = latestSnapshot?.overall_understanding ?? 0
  const retention = latestSnapshot?.overall_retention ?? 0
  const quizzesTaken = latestSnapshot?.quizzes_taken ?? 0
  const topicsCovered = latestSnapshot?.topics_covered ?? 0
  const streak = latestSnapshot?.streak_days ?? 0

  const understandingHistory = snapshots.map((s) => Number(s.overall_understanding) || 0).reverse()
  const retentionHistory = snapshots.map((s) => Number(s.overall_retention) || 0).reverse()

  const lowScoreTopics = topics
    .filter((t) => t.understanding_score < 60)
    .sort((a, b) => a.understanding_score - b.understanding_score)
    .slice(0, 5)

  const isNewUser = snapshots.length === 0 && recentAttempts.length === 0 && recentModules.length === 0

  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-6">
      {isNewUser && <OnboardingFlow />}

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here is your learning overview.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border bg-card p-3 sm:p-5 flex flex-col items-center gap-2 sm:gap-3 min-w-0">
          <ProgressRing value={understanding} size={56} strokeWidth={5} />
          <div className="text-center min-w-0">
            <div className="text-[11px] sm:text-sm font-medium truncate">Understanding</div>
            {understandingHistory.length > 1 && (
              <div className="mt-0.5 sm:mt-1">
                <Sparkline data={understandingHistory} width={60} height={18} />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-3 sm:p-5 flex flex-col items-center gap-2 sm:gap-3 min-w-0">
          <ProgressRing value={retention} size={56} strokeWidth={5} />
          <div className="text-center min-w-0">
            <div className="text-[11px] sm:text-sm font-medium truncate">Retention</div>
            {retentionHistory.length > 1 && (
              <div className="mt-0.5 sm:mt-1">
                <Sparkline data={retentionHistory} width={60} height={18} color="hsl(142, 71%, 45%)" />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-3 sm:p-5 text-center min-w-0">
          <Flame size={18} className="inline-block text-amber-500" />
          <div className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold leading-tight truncate">{streak}</div>
          <div className="text-[11px] sm:text-sm text-muted-foreground">Day Streak</div>
        </div>

        <div className="rounded-xl border bg-card p-3 sm:p-5 text-center min-w-0">
          <ClipboardCheck size={18} className="inline-block text-muted-foreground" />
          <div className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold leading-tight truncate">{quizzesTaken}</div>
          <div className="text-[11px] sm:text-sm text-muted-foreground">Quizzes Taken</div>
        </div>

        <div className="rounded-xl border bg-card p-3 sm:p-5 text-center min-w-0">
          <Target size={18} className="inline-block text-muted-foreground" />
          <div className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold leading-tight truncate">{topicsCovered}</div>
          <div className="text-[11px] sm:text-sm text-muted-foreground">Topics Covered</div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="rounded-xl border bg-card p-3 sm:p-5 lg:col-span-2 min-w-0">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold">Recent Activity</h2>
            <Link href="/quizzes" className="text-xs text-primary hover:underline flex items-center gap-1 shrink-0">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentAttempts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No quiz attempts yet. Take your first quiz to see activity here.</p>
          ) : (
            <div className="space-y-2">
              {recentAttempts.slice(0, 8).map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between rounded-lg border p-2.5 sm:p-3 text-sm min-w-0">
                  <div className="min-w-0 flex-1">
                    <span className="font-medium truncate block">{attempt.quiz?.title ?? "Quiz"}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(attempt.attempted_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`shrink-0 ml-3 rounded-full px-2 py-0.5 text-xs font-medium ${
                    attempt.is_correct
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {attempt.is_correct ? "Correct" : "Incorrect"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 sm:space-y-6 min-w-0">
          <DailyGoalCard />

          <div className="rounded-xl border bg-card p-3 sm:p-5 min-w-0">
            <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">Topics to Review</h2>
            {lowScoreTopics.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {topics.length === 0
                  ? "No topics yet — take a quiz to start tracking."
                  : "All topics are looking good!"}
              </p>
            ) : (
              <ul className="space-y-2">
                {lowScoreTopics.map((topic) => (
                  <li key={topic.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate">{topic.topic}</span>
                    <span className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-red-600">{Math.round(topic.understanding_score)}%</span>
                      <Link href="/quizzes/generate" className="text-xs text-primary hover:underline">
                        Practice
                      </Link>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {recentModules.length > 0 && (
            <div className="rounded-xl border bg-card p-3 sm:p-5 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold">Recent Modules</h2>
                <Link href="/modules" className="text-xs text-primary hover:underline">View all</Link>
              </div>
              <ul className="space-y-2">
                {recentModules.map((m) => (
                  <li key={m.id}>
                    <Link href={`/modules/${m.id}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <BookOpen size={14} className="shrink-0 text-muted-foreground" />
                      <span className="truncate">{m.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

