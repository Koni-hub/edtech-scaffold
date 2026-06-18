import { geminiFetch, isQuotaError, parseGeminiResponse, GEMINI_MODELS } from "./gemini-client"
import { getQuizSystemPrompt, type QuizMode } from "./prompts"

export interface GeneratedQuestion {
  topic: string
  question_text: string
  question_type: "mcq" | "true_false"
  options: { label: string; text: string }[] | null
  correct_answer: string
  explanation: string
  difficulty: "easy" | "medium" | "hard"
}

export interface GeneratedQuiz {
  title: string
  topic_focus: string[]
  questions: GeneratedQuestion[]
}

interface GenerateQuizInput {
  moduleTitle: string
  chunks: { content: string; tokenCount: number }[]
  questionCount: number
  difficulty: string
  quizMode?: QuizMode
  topicLabels?: string[]
}

function validateAgainstSource(question: Record<string, unknown>, sourceText: string): boolean {
  const questionText = String(question.question_text ?? "").toLowerCase()
  const correctAnswer = String(question.correct_answer ?? "").toLowerCase()
  const sourceLower = sourceText.toLowerCase()

  if (!questionText || !correctAnswer) return false

  const contentWords = correctAnswer.split(/\s+/).filter((w) => w.length > 3)
  if (contentWords.length > 0) {
    const matchCount = contentWords.filter((w) => sourceLower.includes(w)).length
    if (matchCount < Math.ceil(contentWords.length * 0.5)) return false
  }

  if (question.question_type === "mcq") {
    const options = question.options as { label: string; text: string }[] | undefined
    if (!options || options.length < 2) return false
    const validLabels = options.map((o) => o.label)
    if (!validLabels.includes(String(question.correct_answer ?? ""))) return false
    const optionTexts = options.map((o) => o.text.toLowerCase())
    const distractorMatches = optionTexts.map((t) => {
      const words = t.split(/\s+/).filter((w) => w.length > 3)
      return words.filter((w) => sourceLower.includes(w)).length
    })
    const totalDistractorWords = optionTexts.reduce((s, t) => s + t.split(/\s+/).filter((w) => w.length > 3).length, 0)
    if (totalDistractorWords > 10 && distractorMatches.reduce((a, b) => a + b, 0) < 2) return false
  }

  if (question.question_type === "true_false") {
    if (correctAnswer !== "a" && correctAnswer !== "b") return false
  }

  return true
}

export async function generateQuiz(input: GenerateQuizInput): Promise<GeneratedQuiz> {
  let contextText = ""
  for (const chunk of input.chunks) {
    const candidate = contextText ? contextText + "\n\n" + chunk.content : chunk.content
    contextText = candidate
  }

  const quizMode = input.quizMode ?? "mixed"
  const systemPrompt = getQuizSystemPrompt(quizMode)
  const basePrompt = `Module: "${input.moduleTitle}"\n\nContent:\n${contextText}\n\nGenerate exactly ${input.questionCount} questions at ${input.difficulty} difficulty. Use diverse question types as specified.`
  const retryPrompt = (current: number, needed: number) =>
    `Module: "${input.moduleTitle}"\n\nContent:\n${contextText}\n\nYou previously generated ${current} valid questions, but I need ${needed} total. Generate ${needed - current} MORE questions covering DIFFERENT topics and sections than the ones already generated. Do NOT repeat the same concepts.`

  let lastError: unknown
  const allQuestions: GeneratedQuestion[] = []
  let quizTitle = ""
  let quizTopics: string[] = []

  for (const [i, modelName] of GEMINI_MODELS.entries()) {
    if (i > 0 && !isQuotaError(lastError)) await new Promise((r) => setTimeout(r, 2000))

    const maxAttempts = 2
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const prompt = attempt === 0
          ? basePrompt
          : retryPrompt(allQuestions.length, input.questionCount)

        const raw = await geminiFetch(modelName, [
          { role: "user", parts: [{ text: prompt }] },
        ], { temperature: 0.7, systemInstruction: systemPrompt })

        const { content } = parseGeminiResponse(raw)
        const parsed = JSON.parse(content) as Record<string, unknown>

        if (!parsed.title || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
          throw new Error("LLM returned malformed quiz structure")
        }

        if (attempt === 0) {
          quizTitle = String(parsed.title ?? "")
          quizTopics = Array.isArray(parsed.topic_focus) ? parsed.topic_focus.map(String) : []
        }

        for (const q of parsed.questions as Record<string, unknown>[]) {
          if (allQuestions.length >= input.questionCount) break

          const questionText = String(q.question_text ?? "").trim()
          if (!questionText) continue

          const exists = allQuestions.some((eq) => eq.question_text === questionText)
          if (exists) continue

          if (!validateAgainstSource(q, contextText)) continue

          const questionType = (() => {
            if (quizMode === "short_answer") return "mcq" as const
            const t = String(q.question_type ?? "")
            if (t === "true_false") return "true_false" as const
            return "mcq" as const
          })()

          const options = Array.isArray(q.options) ? q.options as { label: string; text: string }[] : null
          const correctAnswer = String(q.correct_answer ?? "").trim()

          if (questionType === "mcq") {
            if (!options || options.length < 2) continue
            const validLabels = options.map((o) => o.label)
            if (!validLabels.includes(correctAnswer)) continue
          }

          if (questionType === "true_false") {
            if (correctAnswer !== "A" && correctAnswer !== "B" && correctAnswer !== "True" && correctAnswer !== "False") continue
          }

          allQuestions.push({
            topic: String(q.topic ?? "general"),
            question_text: questionText,
            question_type: questionType,
            options,
            correct_answer: correctAnswer === "True" ? "A" : correctAnswer === "False" ? "B" : correctAnswer,
            explanation: String(q.explanation ?? ""),
            difficulty: (q.difficulty === "easy" || q.difficulty === "hard" ? q.difficulty : "medium") as "easy" | "medium" | "hard",
          })
        }

        if (allQuestions.length >= input.questionCount) break
      } catch (err) {
        lastError = err
        if (isQuotaError(err)) break
      }
    }

    if (allQuestions.length > 0 || isQuotaError(lastError)) break
  }

  if (allQuestions.length === 0) {
    throw lastError instanceof Error ? lastError : new Error(String(lastError))
  }

  return {
    title: quizTitle,
    topic_focus: quizTopics,
    questions: allQuestions,
  }
}
