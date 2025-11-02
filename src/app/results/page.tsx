import type { Metadata } from "next"

import { ResultsOverview } from "@/components/results/results-overview"

export const metadata: Metadata = {
  title: "Your Cosmic Dashboard | Zynra",
  description:
    "Review the birth details saved to your Zynra profile while we prepare detailed astrology and numerology insights.",
}

export default function ResultsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-16 md:px-8 md:py-24">
      <ResultsOverview />
    </div>
  )
}
