import { createAdminClient } from "@/lib/supabase/admin"
import { getQuotaLimits, isPro, getCounterField } from "@/lib/quota"

const RESET_INTERVAL_MS = 24 * 60 * 60 * 1000

export interface QuotaCheck {
  allowed: boolean
  remaining: number
  resetAt: string | null
  tier: string
  reason?: string
}

export async function checkQuota(userId: string, action: string): Promise<QuotaCheck> {
  const supabase = createAdminClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, usage_reset_at, quiz_count, flashcard_count, enhance_count, subscription_status")
    .eq("id", userId)
    .single()

  if (!profile) {
    return { allowed: false, remaining: 0, resetAt: null, tier: "free", reason: "Profile not found" }
  }

  const tier = profile.subscription_tier ?? "free"
  const resetAt = profile.usage_reset_at
  const now = new Date()
  const resetTime = new Date(resetAt).getTime()

  let quizCount = profile.quiz_count ?? 0
  let flashcardCount = profile.flashcard_count ?? 0
  let enhanceCount = profile.enhance_count ?? 0

  if (now.getTime() - resetTime > RESET_INTERVAL_MS) {
    quizCount = 0
    flashcardCount = 0
    enhanceCount = 0
    await supabase
      .from("profiles")
      .update({ quiz_count: 0, flashcard_count: 0, enhance_count: 0, usage_reset_at: now.toISOString() })
      .eq("id", userId)
  }

  if (isPro(tier) && profile.subscription_status === "active") {
    return { allowed: true, remaining: Infinity, resetAt: null, tier }
  }

  const limit = getQuotaLimits(tier, action)
  const counterField = getCounterField(action)
  const currentCount =
    counterField === "quiz_count" ? quizCount
    : counterField === "flashcard_count" ? flashcardCount
    : enhanceCount

  const remaining = Math.max(0, limit - currentCount)
  const nextReset = new Date(resetTime + RESET_INTERVAL_MS).toISOString()

  if (currentCount >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: nextReset,
      tier,
      reason: `Daily ${action.replace("_", " ")} limit reached (${limit}/${limit}). Resets in 24h.`,
    }
  }

  return { allowed: true, remaining, resetAt: nextReset, tier }
}

export async function incrementUsage(userId: string, action: string): Promise<void> {
  const supabase = createAdminClient()
  const field = getCounterField(action)
  if (!field) return

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, subscription_status, quiz_count, flashcard_count, enhance_count")
    .eq("id", userId)
    .single()

  if (!profile) return

  if (isPro(profile.subscription_tier) && profile.subscription_status === "active") return

  await supabase
    .from("profiles")
    .update({ [field]: (profile[field as keyof typeof profile] as number ?? 0) + 1 })
    .eq("id", userId)
}
