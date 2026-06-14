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
