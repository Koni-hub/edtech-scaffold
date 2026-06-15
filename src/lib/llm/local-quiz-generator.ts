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
    .split(/\n\s*\n/)
    .flatMap((p) => p.replace(/\n/g, " ").split(/(?<=[.!?])\s+/))
    .map((s) => s.trim().replace(/\s+/g, " "))
    .filter((s) => s.length > 25 && s.length < 600)
}

function getKeywords(text: string): string[] {
  const raw = text.match(/\b[A-Z][a-zA-Z]{2,}(?:\s+[A-Z][a-zA-Z]{2,})?\b/g) ?? []
  const unique = [...new Set(raw.map((w) => w.toLowerCase()))]
  return unique
    .map((w) => {
      const idx = text.toLowerCase().indexOf(w)
      return idx >= 0 ? text.slice(idx, idx + w.length) : w
    })
    .filter(Boolean)
}

function extractFactSentences(sentences: string[]): string[] {
  const patterns = /\b(is|are|was|were|has|have|can|will|must|should|refers to|means|defined as|involves|consists of|comprises|includes|describes|represents|occurs when|happens when|leads to|results in|causes|produces|requires|uses|contains|known as|called|also called|also known as)\b/i
  return sentences.filter((s) => patterns.test(s))
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
  const { title, chunks, questionCount } = params

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

  const sentences = splitSentences(allText)
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

  const factSentences = extractFactSentences(sentences)
  const pool = factSentences.length >= questionCount ? factSentences : sentences
  const shuffled = shuffle(pool)
  const questions: LocalQuestion[] = []
  const usedPhrases: string[] = []

  for (const sentence of shuffled) {
    if (questions.length >= questionCount) break

    const keywords = getKeywords(sentence).filter((k) => {
      const lower = k.toLowerCase()
      return !usedPhrases.some((u) => lower.includes(u) || u.includes(lower))
    })

    if (keywords.length === 0) continue

    const chosen = keywords[0]
    usedPhrases.push(chosen.toLowerCase())

    const sentenceLower = sentence.toLowerCase()
    const chosenLower = chosen.toLowerCase()
    const beforeIdx = sentenceLower.indexOf(chosenLower)

    if (beforeIdx < 0) continue

    const beforeText = sentence.slice(0, beforeIdx).trim()
    const afterText = sentence.slice(beforeIdx + chosen.length).replace(/^[^a-zA-Z0-9]+/, "").trim()

    const blank = "______________"
    const questionText = beforeText
      ? `Complete the sentence: "${beforeText} ${blank} ${afterText}"`
      : `What does "${chosen}" refer to in this context: "${sentence}"`

    const allKeywords = getKeywords(allText).filter(
      (k) => k.toLowerCase() !== chosen.toLowerCase()
    )
    const distractors = shuffle(allKeywords).slice(0, 3)

    if (distractors.length === 0) {
      questions.push({
        topic: "general",
        question_text: `Is the following statement true or false? "${sentence}"`,
        question_type: "true_false",
        options: [
          { label: "A", text: "True" },
          { label: "B", text: "False" },
        ],
        correct_answer: "A",
        explanation: `This is directly stated in the module content: "${sentence}"`,
        difficulty: "medium",
      })
      continue
    }

    while (distractors.length < 3) distractors.push("related concept")
    const choices = shuffle([chosen, ...distractors.slice(0, 3)])
    const correctLabel = LABELS[choices.indexOf(chosen)]

    questions.push({
      topic: "general",
      question_text: questionText,
      question_type: "mcq",
      options: choices.slice(0, 4).map((opt, i) => ({ label: LABELS[i], text: opt })),
      correct_answer: correctLabel,
      explanation: `The correct answer is "${chosen}". Context: "${sentence}"`,
      difficulty: "medium",
    })
  }

  if (questions.length === 0) {
    const s = shuffle(sentences)[0]
    questions.push({
      topic: "general",
      question_text: `Is the following statement true or false? "${s}"`,
      question_type: "true_false",
      options: [
        { label: "A", text: "True" },
        { label: "B", text: "False" },
      ],
      correct_answer: "A",
      explanation: `This is directly from the module content: "${s}"`,
      difficulty: "medium",
    })
  }

  return {
    title: `Quiz: ${title}`,
    topic_focus: ["general"],
    questions,
  }
}
