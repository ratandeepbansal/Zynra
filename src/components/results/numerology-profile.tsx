"use client"

import * as React from "react"
import type { NumerologyProfile } from "@/lib/numerology"
import {
  getLifePathInterpretation,
  getExpressionInterpretation,
  getSoulUrgeInterpretation,
  getPersonalityInterpretation,
  getBirthdayInterpretation,
} from "@/lib/numerology"
import { Card } from "@/components/ui/card"

interface NumerologyProfileProps {
  profile: NumerologyProfile
}

export function NumerologyProfileDisplay({ profile }: NumerologyProfileProps) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="mb-6 text-lg font-semibold">Your Numerology Profile</h3>
        <div className="space-y-6">
          <NumberCard
            title="Life Path Number"
            number={profile.lifePathNumber}
            interpretation={getLifePathInterpretation(profile.lifePathNumber)}
            description="Your life's purpose and the path you're meant to walk"
          />

          <NumberCard
            title="Expression Number"
            number={profile.expressionNumber}
            interpretation={getExpressionInterpretation(profile.expressionNumber)}
            description="Your natural talents and abilities"
          />

          <NumberCard
            title="Soul Urge Number"
            number={profile.soulUrgeNumber}
            interpretation={getSoulUrgeInterpretation(profile.soulUrgeNumber)}
            description="Your inner desires and motivations"
          />

          <NumberCard
            title="Personality Number"
            number={profile.personalityNumber}
            interpretation={getPersonalityInterpretation(profile.personalityNumber)}
            description="How others perceive you"
          />

          <NumberCard
            title="Birthday Number"
            number={profile.birthdayNumber}
            interpretation={getBirthdayInterpretation(profile.birthdayNumber)}
            description="Your special gift or talent"
          />
        </div>
      </Card>
    </div>
  )
}

interface NumberCardProps {
  title: string
  number: number
  interpretation: string
  description: string
}

function NumberCard({ title, number, interpretation, description }: NumberCardProps) {
  const isMasterNumber = [11, 22, 33].includes(number)

  return (
    <div className="space-y-3 rounded-lg border border-border/50 bg-secondary/20 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${
            isMasterNumber
              ? "bg-gradient-to-br from-primary to-purple-600 text-white"
              : "bg-primary/20 text-primary"
          }`}
        >
          {number}
        </div>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">{interpretation}</p>
      {isMasterNumber && (
        <div className="mt-2 rounded-md bg-purple-500/10 px-3 py-2 text-xs text-purple-600 dark:text-purple-400">
          ✨ Master Number - You have special spiritual significance and heightened potential
        </div>
      )}
    </div>
  )
}
