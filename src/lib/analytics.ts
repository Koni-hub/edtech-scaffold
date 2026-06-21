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

interface SessionScore {
  sessionDate: Date
  accuracy: number
}

interface TopicRetentionInput {
  topic: string
  sessions: SessionScore[]
}

interface RetentionResult {
  retentionScore: number
  topicRetention: Record<string, number>
}

const LAMBDA = 0.05
const BLEND_DECAY_WINDOW = 5

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
  const blendAlpha = Math.min(totalWeight / BLEND_DECAY_WINDOW, 1)
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

export function calculateRetentionScore(topicInputs: TopicRetentionInput[]): RetentionResult {
  const topicRetention: Record<string, number> = {}

  for (const { topic, sessions } of topicInputs) {
    if (sessions.length < 2) {
      topicRetention[topic] = sessions.length === 1 ? Math.round(sessions[0].accuracy * 10000) / 100 : 0
      continue
    }

    const sorted = [...sessions].sort((a, b) => a.sessionDate.getTime() - b.sessionDate.getTime())
    let totalWeightedScore = 0
    let totalWeight = 0

    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]
      const curr = sorted[i]
      const intervalDays = (curr.sessionDate.getTime() - prev.sessionDate.getTime()) / (1000 * 60 * 60 * 24)

      const retentionRatio = curr.accuracy / Math.max(prev.accuracy, 0.01)
      const sessionScore = Math.min(retentionRatio * 100, 100)
      const weight = Math.min(intervalDays, 30) / 30

      totalWeightedScore += sessionScore * weight
      totalWeight += weight
    }

    topicRetention[topic] = totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) / 100 : 0
  }

  const scores = Object.values(topicRetention)
  const overall = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

  return { retentionScore: Math.round(overall * 100) / 100, topicRetention }
}
