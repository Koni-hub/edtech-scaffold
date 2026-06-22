const RATE_LIMITS: Record<string, number> = {
  quiz_generate: 3,
  flashcard_generate: 5,
  enhance_content: 3,
}

const COUNTER_FIELD: Record<string, string> = {
  quiz_generate: "quiz_count",
  flashcard_generate: "flashcard_count",
  enhance_content: "enhance_count",
}

export interface QuotaCheck {
  allowed: boolean
  remaining: number
  resetAt: string | null
  reason?: string
}

export function getLimit(action: string): number {
  return RATE_LIMITS[action] ?? 0
}
