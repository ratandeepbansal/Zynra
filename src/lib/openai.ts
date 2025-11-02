import OpenAI from "openai"

let client: OpenAI | null = null

export const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini"

export function getOpenAIClient() {
  if (client) {
    return client
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY environment variable. Add it to your .env.local file."
    )
  }

  client = new OpenAI({
    apiKey,
  })

  return client
}

export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY)
}
