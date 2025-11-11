"use client"

import * as React from "react"
import type { BirthChart } from "@/lib/astrology"
import type { NumerologyProfile } from "@/lib/numerology"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AIAnalysisProps {
  birthChart: BirthChart
  numerologyProfile: NumerologyProfile
  userData: {
    fullName: string
    dateOfBirth: string
  }
}

type AnalysisType = "general" | "strengths" | "challenges" | "guidance"

export function AIAnalysis({ birthChart, numerologyProfile, userData }: AIAnalysisProps) {
  const [activeTab, setActiveTab] = React.useState<AnalysisType>("general")
  const [analyses, setAnalyses] = React.useState<Record<AnalysisType, string>>({
    general: "",
    strengths: "",
    challenges: "",
    guidance: "",
  })
  const [loading, setLoading] = React.useState<Record<AnalysisType, boolean>>({
    general: false,
    strengths: false,
    challenges: false,
    guidance: false,
  })
  const [errors, setErrors] = React.useState<Record<AnalysisType, string>>({
    general: "",
    strengths: "",
    challenges: "",
    guidance: "",
  })

  const fetchAnalysis = React.useCallback(
    async (type: AnalysisType) => {
      // If already loaded, don't fetch again
      if (analyses[type]) return

      setLoading((prev) => ({ ...prev, [type]: true }))
      setErrors((prev) => ({ ...prev, [type]: "" }))

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            birthChart,
            numerologyProfile,
            userData,
            analysisType: type,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch analysis")
        }

        const data = await response.json()
        setAnalyses((prev) => ({ ...prev, [type]: data.analysis }))
      } catch (error) {
        console.error(`Error fetching ${type} analysis:`, error)
        setErrors((prev) => ({
          ...prev,
          [type]: error instanceof Error ? error.message : "Failed to load analysis",
        }))
      } finally {
        setLoading((prev) => ({ ...prev, [type]: false }))
      }
    },
    [analyses, birthChart, numerologyProfile, userData]
  )

  // Auto-load general analysis on mount
  React.useEffect(() => {
    fetchAnalysis("general")
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Load analysis when tab changes
  React.useEffect(() => {
    if (!analyses[activeTab] && !loading[activeTab] && !errors[activeTab]) {
      fetchAnalysis(activeTab)
    }
  }, [activeTab, analyses, loading, errors, fetchAnalysis])

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
        <p className="text-sm text-muted-foreground">
          Personalized guidance synthesized from your cosmic blueprint
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AnalysisType)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Overview</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="challenges">Growth</TabsTrigger>
          <TabsTrigger value="guidance">Guidance</TabsTrigger>
        </TabsList>

        {(["general", "strengths", "challenges", "guidance"] as const).map((type) => (
          <TabsContent key={type} value={type} className="mt-6">
            {loading[type] ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <div className="space-y-2 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">
                    Synthesizing your cosmic insights...
                  </p>
                </div>
              </div>
            ) : errors[type] ? (
              <div className="min-h-[200px] rounded-lg border border-destructive/50 bg-destructive/10 p-6">
                <p className="mb-4 text-sm text-destructive">{errors[type]}</p>
                <Button
                  onClick={() => fetchAnalysis(type)}
                  variant="outline"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            ) : analyses[type] ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {analyses[type]}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[200px] items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading analysis...</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}
