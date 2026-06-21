import { GoogleGenerativeAI } from "@google/generative-ai"

function getGenAI() {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error("GEMINI_API_KEY is not set")
  return new GoogleGenerativeAI(key)
}

const EMBEDDING_MODEL = "models/gemini-embedding-001"
const MAX_CHARS = 2048 * 4

function trim(text: string): string {
  const cleaned = text.replace(/\n/g, " ")
  return cleaned.length > MAX_CHARS ? cleaned.slice(0, MAX_CHARS) : cleaned
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = getGenAI().getGenerativeModel({ model: EMBEDDING_MODEL })
  const result = await model.embedContent(trim(text))
  return result.embedding.values
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const model = getGenAI().getGenerativeModel({ model: EMBEDDING_MODEL })
  const cleaned = texts.map(trim)
  const results = await Promise.all(cleaned.map((t) => model.embedContent(t)))
  return results.map((r) => r.embedding.values)
}