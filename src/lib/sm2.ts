import { createClient } from "@/lib/supabase/server"

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5

export interface FlashcardSchedule {
  id: string
  userId: string
  moduleId: string
  term: string
  question: string
  answer: string
  easiness: number
  interval: number
  repetitions: number
  dueAt: Date
}

export interface ReviewOutcome {
  quality: ReviewQuality
  previous: Pick<FlashcardSchedule, "easiness" | "interval" | "repetitions">
  next: Pick<FlashcardSchedule, "easiness" | "interval" | "repetitions" | "dueAt">
}

export const QUALITY_LABELS: Record<ReviewQuality, string> = {
  0: "Forgot",
  1: "Forgot",
  2: "Hard",
  3: "Hard",
  4: "Good",
  5: "Easy",
}

const MIN_EASINESS = 1.3

export function calculateSM2(
  quality: ReviewQuality,
  previous: { easiness: number; interval: number; repetitions: number }
): ReviewOutcome["next"] {
  let { easiness, interval, repetitions } = previous

  // TODO: handle edge case where quality > 5
  if (quality < 3) {
    repetitions = 0
    interval = 0
  } else {
    easiness = Math.max(MIN_EASINESS, easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))

    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easiness)
    }

    repetitions += 1
  }

  const dueAt = new Date()
  if (interval > 0) {
    dueAt.setDate(dueAt.getDate() + interval)
  } else {
    dueAt.setMinutes(dueAt.getMinutes() + 10)
  }

  return {
    easiness: Math.round(easiness * 100) / 100,
    interval,
    repetitions,
    dueAt,
  }
}

export function computeReviewOutcome(
  quality: ReviewQuality,
  schedule: { easiness: number; interval: number; repetitions: number }
): ReviewOutcome {
  const next = calculateSM2(quality, schedule)
  return {
    quality,
    previous: { easiness: schedule.easiness, interval: schedule.interval, repetitions: schedule.repetitions },
    next,
  }
}

export function computeNextSR(
  current: { easiness: number; interval: number; repetitions: number },
  correct: boolean
): { easiness: number; interval: number; repetitions: number; due_at: string } {
  let { easiness, interval, repetitions } = current

  if (correct) {
    repetitions++
    if (repetitions === 1) interval = 1
    else if (repetitions === 2) interval = 6
    else interval = Math.round(interval * easiness)
    easiness = easiness + (0.1 - (1 - 0.8) * (0.28 + 0.1 * (5 - easiness)))
    if (easiness < 1.3) easiness = 1.3
  } else {
    repetitions = 0
    interval = 1
  }

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + interval)

  return {
    easiness: Math.round(easiness * 100) / 100,
    interval,
    repetitions,
    due_at: dueDate.toISOString(),
  }
}
