"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import type { BirthChart } from "@/lib/astrology"
import type { NumerologyProfile } from "@/lib/numerology"

interface DownloadPDFButtonProps {
  userData: {
    fullName: string
    dateOfBirth: string
    birthTime: { hour: number; minute: number; period: "AM" | "PM" }
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

export function DownloadPDFButton({
  userData,
  birthChart,
  numerologyProfile,
}: DownloadPDFButtonProps) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string>("")

  const handleDownload = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userData,
          birthChart,
          numerologyProfile,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      // Get the PDF blob
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${userData.fullName.replace(/\s+/g, "_")}_Cosmic_Report.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error downloading PDF:", err)
      setError(err instanceof Error ? err.message : "Failed to download PDF")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleDownload} disabled={loading} variant="outline" size="sm">
        {loading ? "Generating PDF..." : "Download PDF Report"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
