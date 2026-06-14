interface LocalQuestion {
  topic: string
  question_text: string
  question_type: "mcq" | "true_false"
  options: { label: string; text: string }[] | null
  correct_answer: string
  explanation: string
  difficulty: "easy" | "medium" | "hard"
}

interface LocalQuiz {
  title: string
  topic_focus: string[]
  questions: LocalQuestion[]
}

const LABELS = ["A", "B", "C", "D"]

function splitSentences(text: string): string[] {
  return text
    .split(/[.!\n]+/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
}

function pickSignificantTerms(sentence: string): string[] {
  const words = sentence.split(/\s+/).filter((w) => w.length > 5)
  const terms: string[] = []
  for (const w of words) {
    const clean = w.replace(/[^a-zA-Z0-9-]/g, "")
    if (clean.length >= 6 && !terms.includes(clean)) terms.push(clean)
  }
  return terms.slice(0, 3)
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateLocalQuiz(params: {
  title: string
  chunks: { content: string; tokenCount: number }[]
  questionCount: number
  difficulty: string
}): LocalQuiz {
  const { title, chunks, questionCount } = params

  const allSentences = chunks.flatMap((c) => splitSentences(c.content))
  const shuffled = shuffle(allSentences)

  const questions: LocalQuestion[] = []
  const usedTerms: string[] = []

  for (const sentence of shuffled) {
    if (questions.length >= questionCount) break

    const terms = pickSignificantTerms(sentence).filter((t) => !usedTerms.includes(t))
    if (terms.length === 0) continue

    const chosen = terms[0]
    usedTerms.push(chosen)

    const blank = "______________"
    const questionText = sentence.replace(new RegExp(chosen.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), blank)

    if (questionText === sentence) continue
    if (questionText.length < 15) continue

    const distractors = allSentences
      .filter((s) => s !== sentence)
      .flatMap((s) => pickSignificantTerms(s))
      .filter((t) => t.toLowerCase() !== chosen.toLowerCase())
    const pool = shuffle(distractors).slice(0, 3)

    if (pool.length < 1) continue

    const options = shuffle([chosen, ...pool]).slice(0, 4)
    const correct = options.includes(chosen) ? chosen : options[0]

    questions.push({
      topic: "general",
      question_text: questionText,
      question_type: "mcq",
      options: options.map((opt, i) => ({ label: LABELS[i], text: opt })),
      correct_answer: correct,
      explanation: `The correct answer is "${correct}". This term appears in the context of: "${sentence}"`,
      difficulty: params.difficulty === "hard" ? "hard" : params.difficulty === "easy" ? "easy" : "medium",
    })
  }

  if (questions.length === 0) {
    questions.push({
      topic: "general",
      question_text: "What is the main topic of this module?",
      question_type: "mcq",
      options: [
        { label: "A", text: title },
        { label: "B", text: "Unknown" },
        { label: "C", text: "Not specified" },
        { label: "D", text: "All of the above" },
      ],
      correct_answer: "A",
      explanation: `The module title is "${title}", which describes the main topic.`,
      difficulty: "easy",
    })
  }

  return {
    title: `Quiz: ${title}`,
    topic_focus: ["general"],
    questions,
  }
}