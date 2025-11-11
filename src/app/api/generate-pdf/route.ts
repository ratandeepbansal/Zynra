import { NextRequest, NextResponse } from "next/server"
import { renderToStream } from "@react-pdf/renderer"
import { PDFReport } from "@/lib/pdf-generator"
import type { BirthChart } from "@/lib/astrology"
import type { NumerologyProfile } from "@/lib/numerology"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userData, birthChart, numerologyProfile } = body as {
      userData: {
        fullName: string
        dateOfBirth: string
        birthTime: string
        location: {
          city: string
          country: string
          timezone: string
          lat: number
          lng: number
        }
      }
      birthChart: BirthChart
      numerologyProfile: NumerologyProfile
    }

    // Generate PDF
    const stream = await renderToStream(
      PDFReport({ userData, birthChart, numerologyProfile })
    )

    // Convert stream to buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    // Return PDF as response
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${userData.fullName.replace(/\s+/g, "_")}_Cosmic_Report.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate PDF" },
      { status: 500 }
    )
  }
}
