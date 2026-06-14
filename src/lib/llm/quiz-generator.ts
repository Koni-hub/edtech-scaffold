import OpenAI from "openai"
import { QUIZ_GENERATION_SYSTEM_PROMPT } from "./prompts"

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
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

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: QUIZ_GENERATION_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Module: "${input.moduleTitle}"\n\nContent:\n${contextText}\n\nGenerate exactly ${input.questionCount} questions at ${input.difficulty} difficulty.`,
      },
    ],
  })

  const content = response.choices[0]?.message?.content
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
