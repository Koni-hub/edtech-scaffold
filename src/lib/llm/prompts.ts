export function getQuizSystemPrompt(quizMode: "mixed" | "mcq" | "true_false"): string {
  const typeRule = quizMode === "mcq"
    ? "- All questions must be MCQ with exactly 4 options (A, B, C, D)"
    : quizMode === "true_false"
    ? "- All questions must be True/False"
    : "- Create varied question types (MCQ and true/false)"

  return `You are a learning assessment designer. Generate a quiz based on the provided module content. Each question must test genuine understanding, not trivial recall. Include clear explanations for each answer.

Follow these rules:
${typeRule}
- Questions should progress from basic recall to deeper understanding
- Each MCQ must have exactly 4 options (A, B, C, D)
- The correct_answer must match one of the option labels exactly
- Assign a topic label to each question based on the content it tests
- Difficulty should reflect the question's complexity relative to the material`
}

export const QUIZ_GENERATION_SYSTEM_PROMPT = getQuizSystemPrompt("mixed")

export const QUIZ_TOPIC_EXTRACTION_PROMPT = `Extract the main topics from the following educational content. Return them as a comma-separated list of concise topic names (2-5 words each). Focus on distinct conceptual areas.`
