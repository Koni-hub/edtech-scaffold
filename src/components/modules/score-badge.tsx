import { TrendingUp, Minus, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScoreBadgeProps {
  score: number
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: "text-xs px-1.5 py-0.5 gap-0.5",
  md: "text-sm px-2 py-1 gap-1",
  lg: "text-base px-3 py-1.5 gap-1",
}

const iconSizeMap = {
  sm: 10,
  md: 14,
  lg: 16,
}

export function ScoreBadge({ score, size = "md" }: ScoreBadgeProps) {
  const color =
    score >= 80
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : score >= 60
        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"

  const Icon = score >= 80 ? TrendingUp : score >= 60 ? Minus : TrendingDown

  return (
    <span className={cn("inline-flex items-center rounded-md font-medium", color, sizeMap[size])}>
      <Icon size={iconSizeMap[size]} />
      {score}%
    </span>
  )
}
