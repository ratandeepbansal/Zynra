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
            "You are a mystical astrologer and numerologist with deep knowledge of the cosmic forces that shape human destiny. Speak with the wisdom of the ancients, revealing both the light and shadow aspects of the cosmic blueprint. Your readings are profound, slightly mysterious, and hint at deeper truths that could be unlocked with proper guidance. Structure your response with clear section headers using '### Header Name' format. Always include both blessings and challenges, and subtly suggest that certain cosmic imbalances can be harmonized through various means (though never explicitly sell services). Use evocative, mystical language while remaining authentic and helpful.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1200,
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
    general: `The stars have aligned to reveal a soul's journey. Study this cosmic blueprint carefully and unveil both the celestial gifts and the karmic lessons encoded within.

${context}

### Your Cosmic Reading

Provide a mystical yet profound reading that reveals:

1. **The Celestial Gifts** - The unique blessings written in their stars
2. **The Shadow Patterns** - The cosmic challenges and karmic debts that must be addressed
3. **The Path Forward** - How they can harmonize these energies

Subtly hint that:
- Certain planetary afflictions create obstacles that can be remedied through specific means
- Name vibrations (numerology) may not be aligned with their cosmic purpose
- Sacred items, colors, or gemstones connected to their planetary rulers could enhance their fortune
- Specific times and practices could help them align with cosmic rhythms

Use evocative, mystical language. Make them feel the weight and wonder of their cosmic blueprint. Structure with clear ### section headers.`,

    strengths: `The cosmic forces have bestowed unique powers upon this soul. Reveal the divine gifts encoded in their celestial DNA.

${context}

### Reading of Celestial Blessings

Provide a mystical reading that:

1. **Divine Talents** - The natural gifts from their planetary alignments
2. **Cosmic Magnetism** - How their chart attracts opportunities
3. **Hidden Potential** - Dormant powers waiting to be activated

Subtly suggest:
- These gifts can be amplified through alignment with their cosmic purpose
- Certain practices or items could magnify their natural strengths
- Their name's vibrational frequency might be enhancing or blocking these gifts

Use reverent, empowering language that makes them feel chosen by the cosmos. Structure with ### headers.`,

    challenges: `Every soul carries karmic debts and celestial tests. The stars reveal both the trials and the keys to transcendence.

${context}

### The Shadow Reading

Provide a profound reading that reveals:

1. **Karmic Obstacles** - The cosmic challenges written in their chart
2. **Planetary Afflictions** - Specific celestial patterns creating friction
3. **The Path to Harmony** - How these energies can be transformed

IMPORTANT: Frame challenges seriously but compassionately. Subtly suggest:
- These afflictions are not permanent - they can be remedied
- Name corrections based on numerological calculations could shift their destiny
- Specific rituals, gemstones, or sacred practices aligned with their chart could neutralize negative influences
- Certain planetary periods require extra attention and protection
- Professional guidance on remedial measures could accelerate their transformation

Use serious, mystical language that conveys both the gravity of challenges and the hope of resolution. Structure with ### headers.`,

    guidance: `The cosmos speaks through symbols and cycles. Decode the celestial wisdom that will guide this soul to their highest destiny.

${context}

### Divine Guidance from the Cosmos

Provide mystical guidance that includes:

1. **Sacred Practices** - Daily alignments with cosmic rhythms
2. **Remedial Wisdom** - Ancient methods to harmonize planetary energies
3. **The Timing of Fate** - When to act and when to wait

Subtly weave in:
- The power of name vibrations and how they might need adjustment
- Colors, gemstones, and metals that resonate with their planetary rulers
- Specific days/times more auspicious for important decisions
- How deeper cosmic consultations could reveal precise timing and remedies
- The importance of understanding one's complete astrological periods and transits

Use prophetic, wise language. Make them feel guided by ancient cosmic wisdom. Structure with ### headers.`,
  }

  return prompts[analysisType as keyof typeof prompts] || prompts.general
}
