interface AttemptData {
  isCorrect: boolean
  attemptedAt: Date
}

interface TopicMasteryInput {
  topic: string
  totalAttempts: number
  correctAttempts: number
  recentAttempts: AttemptData[]
}

interface ScoreResult {
  understandingScore: number
  topicScores: Record<string, number>
}

const LAMBDA = 0.05

function daysSince(date: Date): number {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
}

function computeTopicUnderstanding(input: TopicMasteryInput): number {
  const { correctAttempts, totalAttempts, recentAttempts } = input
  const staticRate = totalAttempts > 0 ? correctAttempts / totalAttempts : 0

  let totalWeight = 0
  let weightedCorrect = 0

  for (const attempt of recentAttempts) {
    const days = daysSince(attempt.attemptedAt)
    const weight = Math.exp(-LAMBDA * days)
    totalWeight += weight
    weightedCorrect += attempt.isCorrect ? weight : 0
  }

  const ewmaRate = totalWeight > 0 ? weightedCorrect / totalWeight : staticRate
  const blendAlpha = Math.min(totalWeight / 5, 1)
  const finalRate = blendAlpha * ewmaRate + (1 - blendAlpha) * staticRate

  return Math.round(finalRate * 100 * 100) / 100
}

export function calculateUnderstandingScore(topicMasteries: TopicMasteryInput[]): ScoreResult {
  const topicScores: Record<string, number> = {}

  for (const tm of topicMasteries) {
    topicScores[tm.topic] = computeTopicUnderstanding(tm)
  }

  const scores = Object.values(topicScores)
  const overall = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

  return { understandingScore: Math.round(overall * 100) / 100, topicScores }
}
