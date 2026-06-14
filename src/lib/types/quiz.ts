export interface QuizQuestion {
  id: string
  quizId: string
  topic: string
  questionText: string
  questionType: "mcq" | "true_false" | "short_answer"
  options: { label: string; text: string }[] | null
  difficulty: "easy" | "medium" | "hard"
  orderIndex: number
}

export interface QuizAnswer {
  questionId: string
  givenAnswer: string
}

export interface QuizResult {
  quizId: string
  totalQuestions: number
  correctAnswers: number
  score: number
  answers: {
    questionId: string
    givenAnswer: string
    correctAnswer: string
    isCorrect: boolean
    explanation: string | null
  }[]
  topicScores: Record<string, number>
  overallUnderstanding: number
}
