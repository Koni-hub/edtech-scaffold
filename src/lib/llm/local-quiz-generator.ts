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

const CITATION_RE = /\b(retrieved|http[s]?:\/\/|www\.|website|figure \d|source:|reference|citation|doi:|accessed|available at|retrieved from|pp?\.\s|vol\.\s|eds?\.\s)\b/i
const BULLET_RE = /^[•●○▪▸►\-\*]\s*/

function cleanSentence(s: string): string {
  return s.replace(/\s+/g, " ").replace(/^[^a-zA-Z]+/, "").trim()
}

function isValidSentence(s: string): boolean {
  if (s.length < 50 || s.length > 400) return false
  if (CITATION_RE.test(s)) return false
  if (BULLET_RE.test(s)) return false
  const words = s.split(/\s+/)
  if (words.length < 8) return false
  const first = words[0].toLowerCase()
  if (["it", "this", "that", "these", "those", "he", "she", "they", "we", "you", "i", "its", "his", "her", "their", "our", "my", "your"].includes(first)) return false
  if (["some", "many", "several", "different", "various", "other", "each", "every", "both", "few", "all", "more", "most", "such", "any", "also", "however", "therefore", "moreover", "furthermore", "additionally"].includes(first)) return false
  return true
}

function extractSentences(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .flatMap((p) => p.replace(/\n/g, " ").split(/(?<=[.!?])\s+/))
    .map(cleanSentence)
    .filter(isValidSentence)
}

function extractAllTerms(text: string): string[] {
  const termPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\b/g
  const terms: string[] = []
  const seen = new Set<string>()
  for (const m of text.matchAll(termPattern)) {
    const t = m[1].trim()
    const lower = t.toLowerCase()
    if (t.length >= 5 && t.length <= 40 && !seen.has(lower)) {
      const first = lower.split(/\s+/)[0]
      if (!["some", "many", "several", "different", "various", "other", "each", "every", "both", "few", "all", "more", "most", "such", "any", "first", "second", "third", "last", "next", "new", "old", "good", "bad", "big", "small", "long", "short", "high", "low", "great", "large", "important", "number", "part", "case", "time", "way", "day", "year", "world", "life", "hand", "point", "system", "company", "fact", "group", "problem", "result", "change", "month", "lot", "right", "study", "book", "eye", "job", "word", "business", "issue", "side", "kind", "head", "house", "service", "friend", "father", "power", "hour", "game", "line", "end", "members", "city", "community", "name", "president", "team", "minute", "idea", "body", "back", "parent", "face", "level", "office", "door", "person", "art", "car", "course", "days", "addition", "one of", "some of", "each of", "both of"].includes(first)) {
        seen.add(lower)
        terms.push(t)
      }
    }
  }
  return terms
}

function extractDefinitions(text: string): { subject: string; definition: string; sentence: string }[] {
  const defs: { subject: string; definition: string; sentence: string }[] = []
  const defPatterns = [
    /^(.{5,40}?)\s+(is|are|was|were)\s+(?:a|an|the)?\s*(.{10,200})/i,
    /^(.{5,40}?)\s+(refers to|means|is defined as|is known as|is called)\s+(.{10,200})/i,
    /^(.{5,40}?)\s+(can be|could be|is typically|is generally|is often)\s+(.{10,200})/i,
  ]
  const sentences = extractSentences(text)
  for (const s of sentences) {
    for (const pat of defPatterns) {
      const m = s.match(pat)
      if (m) {
        const subject = m[1].trim()
        const def = m[3]?.trim() ?? ""
        if (subject.length >= 3 && subject.length <= 40 && def.length >= 10) {
          const first = subject.split(/\s+/)[0].toLowerCase()
          if (!["it", "this", "that", "these", "those", "he", "she", "they", "we", "you", "i", "some", "many", "several", "different", "various", "other"].includes(first)) {
            defs.push({ subject, definition: def.replace(/[.!;]+$/, ""), sentence: s })
          }
        }
        break
      }
    }
  }
  return defs
}

function extractProcesses(text: string): { topic: string; steps: string[]; sentence: string }[] {
  const procs: { topic: string; steps: string[]; sentence: string }[] = []
  const processPatterns = [
    /\b(first|initially|to begin|start by|the first step)\s+(.{10,150})/gi,
    /\b(second|then|next|after that|subsequently|following that)\s+(.{10,150})/gi,
    /\b(third|finally|lastly|in the end|ultimately)\s+(.{10,150})/gi,
  ]
  const sentences = extractSentences(text)
  for (const s of sentences) {
    for (const pat of processPatterns) {
      const m = s.match(pat)
      if (m) {
        const topic = sentences.find((x) => x !== s && x.split(/\s+/).length >= 10)?.slice(0, 40) ?? "process"
        procs.push({ topic, steps: [m[0]], sentence: s })
        break
      }
    }
  }
  return procs
}

function extractFacts(text: string): { fact: string; sentence: string; topic: string }[] {
  const facts: { fact: string; sentence: string; topic: string }[] = []
  const sentences = extractSentences(text)
  for (const s of sentences) {
    const hasNumber = /\b\d+(\.\d+)?(%|percent|million|billion|thousand|hundred)?\b/i.test(s)
    const hasComparison = /\b(more|less|greater|smaller|faster|slower|higher|lower|increase|decrease|reduce|improve)\b/i.test(s)
    const hasCausation = /\b(because|therefore|thus|hence|as a result|leads to|causes|results in|due to)\b/i.test(s)
    if (hasNumber || hasComparison || hasCausation) {
      const terms = extractAllTerms(s)
      const topic = terms[0] ?? "general"
      facts.push({ fact: s, sentence: s, topic })
    }
  }
  return facts
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeOptions(correct: string, distractors: string[]): { label: string; text: string }[] {
  const norm = correct.toLowerCase()
  const unique = [...new Set(distractors.filter((d) => d.toLowerCase() !== norm && d.trim().length > 2))]
  const pool = shuffle(unique).slice(0, 3)
  const all = shuffle([correct, ...pool])
  while (all.length < 4) all.push("None of the above")
  return all.slice(0, 4).map((opt, i) => ({ label: LABELS[i], text: opt }))
}

function findDistractors(correctTerm: string, allTerms: string[], sentence: string): string[] {
  const norm = correctTerm.toLowerCase()
  const sentWords = new Set(sentence.toLowerCase().split(/\s+/))
  return allTerms
    .filter((t) => t.toLowerCase() !== norm && !sentWords.has(t.toLowerCase()))
    .sort((a, b) => {
      const aShared = a.toLowerCase().split(/\s+/).filter((w) => norm.includes(w)).length
      const bShared = b.toLowerCase().split(/\s+/).filter((w) => norm.includes(w)).length
      return bShared - aShared
    })
}

export function generateLocalQuiz(params: {
  title: string
  chunks: { content: string; tokenCount: number }[]
  questionCount: number
  difficulty: string
  topicLabels?: string[]
}): LocalQuiz {
  const { title, chunks, questionCount, topicLabels } = params
  const allText = chunks.map((c) => c.content).join("\n")

  if (allText.includes("[PDF content extraction pending]") || allText.trim().length < 20) {
    return {
      title: `Quiz: ${title}`,
      topic_focus: ["general"],
      questions: [{
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
        explanation: "The PDF text could not be extracted.",
        difficulty: "easy",
      }],
    }
  }

  const allTerms = extractAllTerms(allText)
  const definitions = extractDefinitions(allText)
  const facts = extractFacts(allText)
  const sentences = extractSentences(allText)

  const topics = topicLabels?.length ? topicLabels : [...new Set([...definitions.map((d) => d.subject), ...facts.map((f) => f.topic)])].slice(0, 6)
  const topicFocus = topics.length > 3 ? shuffle(topics).slice(0, 3) : topics

  const questions: LocalQuestion[] = []
  const usedSentences = new Set<string>()

  // Phase 1: Definition questions (highest quality)
  for (const def of shuffle(definitions)) {
    if (questions.length >= questionCount) break
    if (usedSentences.has(def.sentence)) continue
    const distractors = findDistractors(def.subject, allTerms, def.sentence)
    if (distractors.length < 3) continue
    usedSentences.add(def.sentence)
    const options = makeOptions(def.subject, distractors)
    questions.push({
      topic: def.subject,
      question_text: `What is ${def.subject}?`,
      question_type: "mcq",
      options,
      correct_answer: options.find((o) => o.text === def.subject)?.label ?? "A",
      explanation: def.definition + ".",
      difficulty: "easy",
    })
  }

  // Phase 2: Fact-based questions
  for (const fact of shuffle(facts)) {
    if (questions.length >= questionCount) break
    if (usedSentences.has(fact.sentence)) continue
    const terms = extractAllTerms(fact.sentence)
    const keyTerm = terms.find((t) => t.length >= 5)
    if (!keyTerm) continue
    const distractors = findDistractors(keyTerm, allTerms, fact.sentence)
    if (distractors.length < 3) continue
    usedSentences.add(fact.sentence)
    const options = makeOptions(keyTerm, distractors)
    questions.push({
      topic: fact.topic,
      question_text: `Which of the following is related to: "${fact.sentence.slice(0, 150)}..."?`,
      question_type: "mcq",
      options,
      correct_answer: options.find((o) => o.text === keyTerm)?.label ?? "A",
      explanation: `From the content: "${fact.sentence}"`,
      difficulty: "medium",
    })
  }

  // Phase 3: True/False from remaining sentences (cap at 40% of total)
  const maxTF = Math.max(1, Math.floor(questionCount * 0.4))
  let tfCount = 0
  for (const s of shuffle(sentences)) {
    if (questions.length >= questionCount || tfCount >= maxTF) break
    if (usedSentences.has(s)) continue
    const words = s.split(/\s+/)
    if (words.length < 10) continue
    usedSentences.add(s)
    const isTrue = Math.random() > 0.4
    let statement = s
    if (!isTrue) {
      const terms = extractAllTerms(s)
      const alt = terms.find((t) => !s.toLowerCase().startsWith(t.toLowerCase()))
      if (alt) {
        const original = terms[0]
        if (original) statement = s.replace(new RegExp(original, "i"), alt)
      }
    }
    questions.push({
      topic: topicFocus[0] ?? "general",
      question_text: `True or False: "${statement}"`,
      question_type: "true_false",
      options: [{ label: "A", text: "True" }, { label: "B", text: "False" }],
      correct_answer: isTrue ? "A" : "B",
      explanation: `Based on the content: "${s}"`,
      difficulty: "medium",
    })
    tfCount++
  }

  // Phase 4: Fill remaining with "Which term" questions
  for (const s of shuffle(sentences)) {
    if (questions.length >= questionCount) break
    if (usedSentences.has(s)) continue
    const terms = extractAllTerms(s)
    const keyTerm = terms.find((t) => t.length >= 5 && !usedSentences.has(t.toLowerCase()))
    if (!keyTerm) continue
    const distractors = findDistractors(keyTerm, allTerms, s)
    if (distractors.length < 3) continue
    usedSentences.add(s)
    usedSentences.add(keyTerm.toLowerCase())
    const options = makeOptions(keyTerm, distractors)
    questions.push({
      topic: keyTerm,
      question_text: `Based on the content, which term is described here: "${s.slice(0, 150)}..."?`,
      question_type: "mcq",
      options,
      correct_answer: options.find((o) => o.text === keyTerm)?.label ?? "A",
      explanation: `The term is "${keyTerm}". Full context: "${s}"`,
      difficulty: "hard",
    })
  }

  // Fallback if no questions generated
  if (questions.length === 0) {
    const s = sentences[0] ?? "This content has no extractable information."
    questions.push({
      topic: topicFocus[0] ?? "general",
      question_text: `True or False: "${s}"`,
      question_type: "true_false",
      options: [{ label: "A", text: "True" }, { label: "B", text: "False" }],
      correct_answer: "A",
      explanation: `From the content: "${s}"`,
      difficulty: "medium",
    })
  }

  return {
    title: `Quiz: ${title}`,
    topic_focus: topicFocus,
    questions,
  }
}
