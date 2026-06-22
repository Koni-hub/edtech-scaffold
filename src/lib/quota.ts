const DAILY_LIMITS: Record<string, Record<string, number>> = {
  free: {
    quiz_generate: 3,
    flashcard_generate: 5,
    enhance_content: 3,
  },
  pro: {
    quiz_generate: Infinity,
    flashcard_generate: Infinity,
    enhance_content: Infinity,
  },
}

const COUNTER_FIELD: Record<string, string> = {
  quiz_generate: "quiz_count",
  flashcard_generate: "flashcard_count",
  enhance_content: "enhance_count",
}

export interface QuotaResult {
  allowed: boolean
  remaining: number
  resetAt: string | null
  tier: string
  reason?: string
}

export function getQuotaLimits(tier: string, action: string): number {
  return DAILY_LIMITS[tier]?.[action] ?? 0
}

export function isPro(tier: string): boolean {
  return tier === "pro"
}

export function getCounterField(action: string): string {
  return COUNTER_FIELD[action] ?? ""
}
