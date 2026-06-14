import { GoogleGenerativeAI } from "@google/generative-ai"
import { QUIZ_GENERATION_SYSTEM_PROMPT } from "./prompts"

function getGenAI() {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error("GEMINI_API_KEY is not set")
  return new GoogleGenerativeAI(key)
}

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
}

export async function generateQuiz(input: GenerateQuizInput): Promise<GeneratedQuiz> {
  const MAX_INPUT_TOKENS = 3000

  let contextText = ""
  for (const chunk of input.chunks) {
    const candidate = contextText ? contextText + "\n\n" + chunk.content : chunk.content
    if (candidate.length / 4 > MAX_INPUT_TOKENS) break
    contextText = candidate
  }

  const model = getGenAI().getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
    },
  })

  const result = await model.generateContent([
    QUIZ_GENERATION_SYSTEM_PROMPT,
    `Module: "${input.moduleTitle}"\n\nContent:\n${contextText}\n\nGenerate exactly ${input.questionCount} questions at ${input.difficulty} difficulty.`,
  ])

  const content = result.response.text()
  if (!content) throw new Error("No content in LLM response")

  const parsed = JSON.parse(content)

  if (!parsed.title || !Array.isArray(parsed.questions)) {
    throw new Error("LLM returned malformed quiz structure")
  }

  return {
    title: parsed.title,
    topic_focus: parsed.topic_focus ?? [],
    questions: parsed.questions.map((q: Record<string, unknown>, i: number) => ({
      topic: String(q.topic ?? "general"),
      question_text: String(q.question_text ?? ""),
      question_type: (q.question_type === "true_false" ? "true_false" : "mcq") as "mcq" | "true_false",
      options: Array.isArray(q.options) ? q.options as { label: string; text: string }[] : null,
      correct_answer: String(q.correct_answer ?? ""),
      explanation: String(q.explanation ?? ""),
      difficulty: (q.difficulty === "easy" || q.difficulty === "hard" ? q.difficulty : "medium") as "easy" | "medium" | "hard",
    })),
  }
}
