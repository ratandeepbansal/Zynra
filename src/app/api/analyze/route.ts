import { NextRequest, NextResponse } from "next/server"
import { getOpenAIClient, DEFAULT_OPENAI_MODEL, hasOpenAIKey } from "@/lib/openai"
import type { BirthChart } from "@/lib/astrology"
import type { NumerologyProfile } from "@/lib/numerology"

export const runtime = "edge"

interface AnalyzeRequest {
  birthChart: BirthChart
  numerologyProfile: NumerologyProfile
  userData: {
    fullName: string
    dateOfBirth: string
  }
  analysisType: "general" | "strengths" | "challenges" | "guidance"
}

export async function POST(request: NextRequest) {
  try {
    if (!hasOpenAIKey()) {
      return NextResponse.json(
        {
          error:
            "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
        },
        { status: 500 }
      )
    }

    const body: AnalyzeRequest = await request.json()
    const { birthChart, numerologyProfile, userData, analysisType } = body

    // Build context for AI
    const context = buildAnalysisContext(birthChart, numerologyProfile, userData)

    // Get analysis prompt based on type
    const prompt = getAnalysisPrompt(analysisType, context)

    // Call OpenAI
    const client = getOpenAIClient()
    const completion = await client.chat.completions.create({
      model: DEFAULT_OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert astrologer and numerologist providing personalized, insightful, and compassionate guidance. Your interpretations blend traditional wisdom with modern psychological insights. Be specific, constructive, and encouraging while maintaining authenticity.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const analysis = completion.choices[0]?.message?.content || ""

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error in analyze API:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate analysis" },
      { status: 500 }
    )
  }
}

function buildAnalysisContext(
  birthChart: BirthChart,
  numerologyProfile: NumerologyProfile,
  userData: { fullName: string; dateOfBirth: string }
): string {
  const { sun, moon, ascendant, mercury, venus, mars } = birthChart
  const { lifePathNumber, expressionNumber, soulUrgeNumber } = numerologyProfile

  return `
Birth Data:
- Name: ${userData.fullName}
- Date of Birth: ${userData.dateOfBirth}

Astrology Profile:
- Sun in ${sun.sign} (House ${sun.house})
- Moon in ${moon.sign} (House ${moon.house})
- Rising Sign: ${ascendant.sign}
- Mercury in ${mercury.sign} (House ${mercury.house})
- Venus in ${venus.sign} (House ${venus.house})
- Mars in ${mars.sign} (House ${mars.house})

Key Aspects:
${birthChart.aspects
  .slice(0, 5)
  .map((a) => `- ${a.planet1} ${a.type} ${a.planet2}`)
  .join("\n")}

Numerology Profile:
- Life Path Number: ${lifePathNumber}
- Expression Number: ${expressionNumber}
- Soul Urge Number: ${soulUrgeNumber}
`.trim()
}

function getAnalysisPrompt(analysisType: string, context: string): string {
  const prompts = {
    general: `Based on the following birth chart and numerology profile, provide a comprehensive overview of this person's cosmic blueprint. Highlight the most significant patterns and how the astrology and numerology work together to reveal their unique path.

${context}

Provide a personalized synthesis in 3-4 paragraphs that feels insightful and encouraging.`,

    strengths: `Based on the following birth chart and numerology profile, identify and describe this person's key strengths, talents, and natural gifts. Focus on what makes them unique and powerful.

${context}

Provide specific insights about their strengths in 3-4 paragraphs.`,

    challenges: `Based on the following birth chart and numerology profile, identify potential challenges, growth areas, and patterns to be aware of. Frame these constructively as opportunities for growth.

${context}

Provide specific insights about their growth opportunities in 3-4 paragraphs.`,

    guidance: `Based on the following birth chart and numerology profile, provide practical guidance and suggestions for aligning with their highest potential. What should they focus on? What practices or perspectives would serve them?

${context}

Provide actionable guidance in 3-4 paragraphs.`,
  }

  return prompts[analysisType as keyof typeof prompts] || prompts.general
}
