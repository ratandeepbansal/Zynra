"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store/use-app-store"
import type { UserData } from "@/types"
import { formatBirthTime } from "@/lib/time"

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
        <h1 className="text-2xl font-semibold">Almost there—let’s gather your details.</h1>
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <section className="rounded-3xl border border-border/70 bg-card px-6 py-8 shadow-sm shadow-primary/5 sm:px-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Your cosmic snapshot</h1>
          <p className="text-sm text-muted-foreground">
            We’re preparing detailed astrology, numerology, and AI guidance using the information below.
          </p>
        </header>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
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
      <section className="rounded-3xl border border-dashed border-border/50 bg-secondary/30 px-6 py-8 text-sm text-muted-foreground shadow-inner sm:px-10">
        <p>
          Next: we’ll combine astronomical calculations, numerology numbers, and personality mapping.
          These modules are coming online over the next phases—stay tuned for insights delivered right
          here.
        </p>
      </section>
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
