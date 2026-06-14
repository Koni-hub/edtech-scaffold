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

function extractSentences(text: string): string[] {
  const lines = text.split(/\n+/).filter((l) => l.trim().length > 0)
  const sentences: string[] = []
  for (const line of lines) {
    const parts = line.split(/(?<=[.!?])\s+/)
    for (const part of parts) {
      const trimmed = part.trim()
      if (trimmed.length > 15) {
        sentences.push(trimmed)
      }
    }
  }
  return sentences
}

function extractKeywords(text: string): string[] {
  const words = text.split(/\s+/).filter((w) => w.length > 4)
  const keywords: string[] = []
  for (const w of words) {
    const clean = w.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "")
    if (clean.length >= 4 && !keywords.includes(clean)) {
      keywords.push(clean)
    }
  }
  return keywords
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateLocalQuiz(params: {
  title: string
  chunks: { content: string; tokenCount: number }[]
  questionCount: number
  difficulty: string
}): LocalQuiz {
  const { title, chunks, questionCount, difficulty } = params

  const allText = chunks.map((c) => c.content).join("\n")

  if (allText.includes("[PDF content extraction pending]") || allText.trim().length < 20) {
    return {
      title: `Quiz: ${title}`,
      topic_focus: ["general"],
      questions: [
        {
          topic: "general",
          question_text: "No content available for quiz generation.",
          question_type: "mcq",
          options: [
            { label: "A", text: "Re-upload the PDF file" },
            { label: "B", text: "Try again later" },
            { label: "C", text: "Contact support" },
            { label: "D", text: "All of the above" },
          ],
          correct_answer: "A",
          explanation: "The PDF text could not be extracted. Please re-upload the file to enable quiz generation.",
          difficulty: "easy",
        },
      ],
    }
  }

  const sentences = extractSentences(allText)
  const allKeywords = extractKeywords(allText)

  if (sentences.length === 0) {
    return {
      title: `Quiz: ${title}`,
      topic_focus: ["general"],
      questions: [
        {
          topic: "general",
          question_text: `What is "${title}" about?`,
          question_type: "mcq",
          options: [
            { label: "A", text: title },
            { label: "B", text: "Unknown topic" },
            { label: "C", text: "Not specified" },
            { label: "D", text: "All of the above" },
          ],
          correct_answer: "A",
          explanation: `The module is titled "${title}".`,
          difficulty: "easy",
        },
      ],
    }
  }

  const shuffled = shuffle(sentences)
  const questions: LocalQuestion[] = []
  const usedKeywords: string[] = []

  for (const sentence of shuffled) {
    if (questions.length >= questionCount) break

    const keywords = extractKeywords(sentence).filter((k) => !usedKeywords.includes(k))
    if (keywords.length === 0) continue

    const chosen = keywords[0]
    usedKeywords.push(chosen)

    const escaped = chosen.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const blank = "______________"
    const questionText = sentence.replace(new RegExp(escaped, "i"), blank)

    if (questionText === sentence) continue

    const distractors = shuffle(
      allKeywords.filter((k) => k.toLowerCase() !== chosen.toLowerCase())
    ).slice(0, 3)

    if (distractors.length < 1) continue

    const options = shuffle([chosen, ...distractors]).slice(0, 4)
    const correctIndex = options.indexOf(chosen)
    const correctLabel = LABELS[correctIndex >= 0 ? correctIndex : 0]

    const difficultyMap: Record<string, "easy" | "medium" | "hard"> = {
      easy: "easy", medium: "medium", hard: "hard",
    }

    questions.push({
      topic: "general",
      question_text: questionText,
      question_type: "mcq",
      options: options.map((opt, i) => ({ label: LABELS[i], text: opt })),
      correct_answer: correctLabel,
      explanation: `The correct answer is "${chosen}". This comes from: "${sentence}"`,
      difficulty: difficultyMap[difficulty] ?? "medium",
    })
  }

  return {
    title: `Quiz: ${title}`,
    topic_focus: ["general"],
    questions,
  }
}
