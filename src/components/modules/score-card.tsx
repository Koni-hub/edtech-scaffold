"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScoreCardProps {
  title: string
  score: number
  icon: React.ReactNode
  trend?: "up" | "down" | "stable"
  subtitle?: string
}

export function ScoreCard({ title, score, icon, trend, subtitle }: ScoreCardProps) {
  const scoreColor =
    score >= 80
      ? "text-green-600 dark:text-green-400"
      : score >= 60
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400"

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <div className="rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
      <div className="flex items-start justify-between">
        <div className="text-muted-foreground">{icon}</div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend === "up" && "text-green-600 dark:text-green-400",
              trend === "down" && "text-red-600 dark:text-red-400",
              trend === "stable" && "text-muted-foreground"
            )}
          >
            <TrendIcon size={14} />
            {trend === "up" ? "Up" : trend === "down" ? "Down" : "Stable"}
          </div>
        )}
      </div>
      <div className={cn("mt-3 text-3xl font-bold", scoreColor)}>{score}%</div>
      <div className="mt-1 text-sm font-medium">{title}</div>
      {subtitle && <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>}
    </div>
  )
}
