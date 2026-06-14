import OpenAI from "openai"

const EMBEDDING_MODEL = "text-embedding-3-small"

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await getOpenAI().embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.replace(/\n/g, " "),
  })
  return response.data[0].embedding
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const cleaned = texts.map((t) => t.replace(/\n/g, " "))
  const response = await getOpenAI().embeddings.create({
    model: EMBEDDING_MODEL,
    input: cleaned,
  })
  return response.data.map((d) => d.embedding)
}
