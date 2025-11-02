import type { Metadata } from "next"

import { UserDataForm } from "@/components/forms/user-data-form"

export const metadata: Metadata = {
  title: "Share Your Birth Details | Zynra",
  description:
    "Tell Zynra about your birth information so we can synthesize personalized astrology and numerology insights.",
}

export default function OnboardingPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-16 md:px-8 md:py-24">
      <section className="mx-auto max-w-3xl space-y-4 text-center md:space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Step 1 · User Profile
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
          Your birth data unlocks the Zynra experience.
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          We combine precise astrological calculations, numerology patterns, and AI guidance tailored to
          your unique cosmic blueprint. Provide your details below to begin the synthesis.
        </p>
      </section>
      <UserDataForm />
    </div>
  )
}
