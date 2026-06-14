export interface ScoreData {
  overallUnderstanding: number
  overallRetention: number
  topicScores: { topic: string; understanding: number; retention: number }[]
  streakDays: number
  totalQuizzes: number
  totalQuestions: number
}

export interface ScoreTrend {
  date: string
  understanding: number
  retention: number
}
