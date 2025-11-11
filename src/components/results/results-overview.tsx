"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store/use-app-store"
import type { UserData } from "@/types"
import { formatBirthTime } from "@/lib/time"
import { calculateBirthChart } from "@/lib/astrology"
import { calculateNumerologyProfile } from "@/lib/numerology"
import { BirthChartDisplay } from "./birth-chart"
import { NumerologyProfileDisplay } from "./numerology-profile"
import { AIAnalysis } from "./ai-analysis"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ResultsOverview() {
  const [isHydrated, setIsHydrated] = React.useState(
    useAppStore.persist?.hasHydrated?.() ?? false
  )

  React.useEffect(() => {
    if (!useAppStore.persist?.hasHydrated?.()) {
      useAppStore.persist?.rehydrate?.()
    } else {
      setIsHydrated(true)
    }

    const unsubFinish = useAppStore.persist?.onFinishHydration?.(() => {
      setIsHydrated(true)
    })

    return () => {
      unsubFinish?.()
    }
  }, [])

  const userData = useAppStore((state) => state.userData)

  // Calculate birth chart and numerology
  const birthChart = React.useMemo(() => {
    if (!userData) return null
    try {
      return calculateBirthChart(userData.dateOfBirth, userData.birthTime, userData.location)
    } catch (error) {
      console.error("Error calculating birth chart:", error)
      return null
    }
  }, [userData])

  const numerologyProfile = React.useMemo(() => {
    if (!userData) return null
    try {
      return calculateNumerologyProfile(userData.fullName, userData.dateOfBirth)
    } catch (error) {
      console.error("Error calculating numerology:", error)
      return null
    }
  }, [userData])

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-border/70 bg-card px-6 py-10 text-center text-sm text-muted-foreground shadow-sm">
        Syncing your saved details…
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-border/70 bg-card px-6 py-10 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">Almost there—let's gather your details.</h1>
        <p className="text-sm text-muted-foreground">
          Share your birth information first so we can calculate astrological placements and numerology
          numbers tailored to you.
        </p>
        <Button asChild>
          <Link href="/onboarding">Start the onboarding form</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      {/* User Info Summary */}
      <section className="rounded-3xl border border-border/70 bg-card px-6 py-8 shadow-sm shadow-primary/5 sm:px-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Your Cosmic Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Complete astrology and numerology analysis based on your birth information.
          </p>
        </header>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoRow label="Full name" value={userData.fullName} />
          <InfoRow label="Birth date" value={formatDate(userData)} />
          <InfoRow label="Birth time" value={formatBirthTime(userData.birthTime)} />
          <InfoRow
            label="Birth location"
            value={`${userData.location.city}, ${userData.location.country}`}
          />
          <InfoRow label="Timezone" value={userData.location.timezone} />
          <InfoRow
            label="Coordinates"
            value={`${userData.location.lat.toFixed(3)}, ${userData.location.lng.toFixed(3)}`}
          />
        </dl>
      </section>

      {/* Main Results Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="astrology">Astrology</TabsTrigger>
          <TabsTrigger value="numerology">Numerology</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sun, Moon, Rising */}
            {birthChart && (
              <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">Your Big Three</h2>
                <div className="space-y-3">
                  <QuickStat label="Sun Sign" value={birthChart.sun.sign} />
                  <QuickStat label="Moon Sign" value={birthChart.moon.sign} />
                  <QuickStat label="Rising Sign" value={birthChart.ascendant.sign} />
                </div>
              </section>
            )}

            {/* Core Numerology */}
            {numerologyProfile && (
              <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">Core Numbers</h2>
                <div className="space-y-3">
                  <QuickStat
                    label="Life Path"
                    value={numerologyProfile.lifePathNumber.toString()}
                  />
                  <QuickStat
                    label="Expression"
                    value={numerologyProfile.expressionNumber.toString()}
                  />
                  <QuickStat
                    label="Soul Urge"
                    value={numerologyProfile.soulUrgeNumber.toString()}
                  />
                </div>
              </section>
            )}
          </div>
        </TabsContent>

        <TabsContent value="astrology">
          {birthChart ? (
            <BirthChartDisplay chart={birthChart} />
          ) : (
            <div className="rounded-3xl border border-border/70 bg-card px-6 py-10 text-center text-sm text-muted-foreground">
              Unable to calculate birth chart. Please check your birth information.
            </div>
          )}
        </TabsContent>

        <TabsContent value="numerology">
          {numerologyProfile ? (
            <NumerologyProfileDisplay profile={numerologyProfile} />
          ) : (
            <div className="rounded-3xl border border-border/70 bg-card px-6 py-10 text-center text-sm text-muted-foreground">
              Unable to calculate numerology profile. Please check your birth information.
            </div>
          )}
        </TabsContent>

        <TabsContent value="ai">
          {birthChart && numerologyProfile ? (
            <AIAnalysis
              birthChart={birthChart}
              numerologyProfile={numerologyProfile}
              userData={{
                fullName: userData.fullName,
                dateOfBirth: userData.dateOfBirth,
              }}
            />
          ) : (
            <div className="rounded-3xl border border-border/70 bg-card px-6 py-10 text-center text-sm text-muted-foreground">
              Unable to generate AI insights. Please check your birth information.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/20 p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold text-primary">{value}</span>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

function formatDate(userData: UserData) {
  try {
    const date = new Date(userData.dateOfBirth)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return userData.dateOfBirth
  }
}
