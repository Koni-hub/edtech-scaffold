export interface Chunk {
  content: string
  tokenCount: number
  index: number
}

const CHUNK_MAX_TOKENS = 1500
const CHUNK_OVERLAP_TOKENS = 150

function approximateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

export function chunkText(rawText: string): Chunk[] {
  const paragraphs = rawText.split(/\n\s*\n/)
  const chunks: Chunk[] = []
  let currentChunk = ""
  let overlapBuffer = ""

  for (const para of paragraphs) {
    const trimmed = para.trim()
    if (!trimmed) continue

    const candidate = currentChunk ? currentChunk + "\n\n" + trimmed : trimmed
    const tokenCount = approximateTokens(candidate)

    if (tokenCount > CHUNK_MAX_TOKENS && currentChunk) {
      const currentTokens = approximateTokens(currentChunk)
      chunks.push({ content: currentChunk, tokenCount: currentTokens, index: chunks.length })

      const words = currentChunk.split(/\s+/)
      const overlapWords: string[] = []
      let overlapTokens = 0
      for (let i = words.length - 1; i >= 0; i--) {
        const t = approximateTokens(words[i])
        if (overlapTokens + t > CHUNK_OVERLAP_TOKENS) break
        overlapTokens += t
        overlapWords.unshift(words[i])
      }
      overlapBuffer = overlapWords.join(" ")
      currentChunk = overlapBuffer ? overlapBuffer + "\n\n" + trimmed : trimmed
    } else {
      currentChunk = candidate
    }
  }

  if (currentChunk.trim()) {
    chunks.push({ content: currentChunk.trim(), tokenCount: approximateTokens(currentChunk), index: chunks.length })
  }

  return chunks
}

export function truncateToTokens(text: string, maxTokens: number): string {
  const chars = maxTokens * 4
  if (text.length <= chars) return text
  return text.slice(0, chars) + "..."
}
