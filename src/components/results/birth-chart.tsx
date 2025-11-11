"use client"

import * as React from "react"
import type { BirthChart } from "@/lib/astrology"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSignInterpretation } from "@/lib/astrology"

interface BirthChartProps {
  chart: BirthChart
}

export function BirthChartDisplay({ chart }: BirthChartProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="planets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="planets">Planets</TabsTrigger>
          <TabsTrigger value="houses">Houses</TabsTrigger>
          <TabsTrigger value="aspects">Aspects</TabsTrigger>
        </TabsList>

        <TabsContent value="planets" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Planetary Positions</h3>
            <div className="space-y-4">
              {/* Big Three */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  The Big Three
                </h4>
                <PlanetRow planet={chart.sun} />
                <PlanetRow planet={chart.moon} />
                <PlanetRow planet={chart.ascendant} />
              </div>

              {/* Personal Planets */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Personal Planets
                </h4>
                <PlanetRow planet={chart.mercury} />
                <PlanetRow planet={chart.venus} />
                <PlanetRow planet={chart.mars} />
              </div>

              {/* Social Planets */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Social Planets
                </h4>
                <PlanetRow planet={chart.jupiter} />
                <PlanetRow planet={chart.saturn} />
              </div>

              {/* Outer Planets */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Outer Planets
                </h4>
                <PlanetRow planet={chart.uranus} />
                <PlanetRow planet={chart.neptune} />
                <PlanetRow planet={chart.pluto} />
              </div>

              {/* Angles */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Chart Angles
                </h4>
                <PlanetRow planet={chart.midheaven} />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="houses" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">House System</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {chart.houses.map((house) => (
                <div
                  key={house.number}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/20 p-3"
                >
                  <div>
                    <span className="text-sm font-medium">House {house.number}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {getHouseArea(house.number)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-primary">{house.sign}</div>
                    <div className="text-xs text-muted-foreground">
                      {house.cusp.toFixed(2)}°
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="aspects" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Planetary Aspects</h3>
            {chart.aspects.length > 0 ? (
              <div className="space-y-2">
                {chart.aspects.map((aspect, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/20 p-3"
                  >
                    <div className="flex-1">
                      <span className="text-sm font-medium capitalize">
                        {aspect.planet1}
                      </span>
                      <span className="mx-2 text-xs text-muted-foreground">
                        {getAspectSymbol(aspect.type)}
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {aspect.planet2}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">
                        {aspect.type}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Orb: {aspect.orb.toFixed(2)}°
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No major aspects found in your chart.
              </p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PlanetRow({ planet }: { planet: { name: string; sign: string; degree: number; house?: number } }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/20 p-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium capitalize">{planet.name}</span>
          {planet.house && (
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
              House {planet.house}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {getSignInterpretation(planet.sign).slice(0, 80)}...
        </p>
      </div>
      <div className="ml-4 text-right">
        <div className="text-sm font-semibold text-primary">{planet.sign}</div>
        <div className="text-xs text-muted-foreground">{planet.degree.toFixed(2)}°</div>
      </div>
    </div>
  )
}

function getHouseArea(houseNumber: number): string {
  const areas: Record<number, string> = {
    1: "Self & Identity",
    2: "Values & Resources",
    3: "Communication",
    4: "Home & Family",
    5: "Creativity & Joy",
    6: "Health & Service",
    7: "Partnerships",
    8: "Transformation",
    9: "Philosophy & Travel",
    10: "Career & Public Life",
    11: "Community & Dreams",
    12: "Spirituality & Solitude",
  }
  return areas[houseNumber] || ""
}

function getAspectSymbol(aspectType: string): string {
  const symbols: Record<string, string> = {
    Conjunction: "☌",
    Opposition: "☍",
    Trine: "△",
    Square: "□",
    Sextile: "⚹",
  }
  return symbols[aspectType] || "•"
}
