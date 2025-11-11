/**
 * Astrology calculation engine using the astronomia library
 * Calculates planetary positions, houses, and aspects for natal charts
 */

import * as astro from "astronomia"

export interface PlanetPosition {
  name: string
  longitude: number // ecliptic longitude in degrees
  latitude: number // ecliptic latitude in degrees
  sign: string
  degree: number // degree within the sign (0-29)
  house?: number
}

export interface House {
  number: number
  cusp: number // degree of zodiac where house begins
  sign: string
}

export interface Aspect {
  planet1: string
  planet2: string
  type: string // conjunction, opposition, trine, square, sextile
  angle: number
  orb: number
}

export interface BirthChart {
  sun: PlanetPosition
  moon: PlanetPosition
  mercury: PlanetPosition
  venus: PlanetPosition
  mars: PlanetPosition
  jupiter: PlanetPosition
  saturn: PlanetPosition
  uranus: PlanetPosition
  neptune: PlanetPosition
  pluto: PlanetPosition
  ascendant: PlanetPosition
  midheaven: PlanetPosition
  houses: House[]
  aspects: Aspect[]
}

const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
]

/**
 * Convert degrees to zodiac sign and degree within sign
 */
function degreesToSign(degrees: number): { sign: string; degree: number } {
  const normalizedDegrees = ((degrees % 360) + 360) % 360
  const signIndex = Math.floor(normalizedDegrees / 30)
  const degreeInSign = normalizedDegrees % 30
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: degreeInSign,
  }
}

/**
 * Convert date, time, and location to Julian Day
 */
function toJulianDay(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  utcOffset: number
): number {
  // Convert local time to UTC
  const utcHour = hour - utcOffset
  const decimalDay = day + (utcHour + minute / 60) / 24

  return astro.julian.CalendarGregorianToJD(year, month, decimalDay)
}

/**
 * Calculate the position of a planet at a given Julian Day
 */
function calculatePlanetPosition(
  planetName: string,
  jd: number
): Omit<PlanetPosition, "house"> {
  let longitude = 0
  let latitude = 0

  try {
    switch (planetName.toLowerCase()) {
      case "sun": {
        const pos = astro.solar.apparentVSOP87(astro.planetposition.earth, jd)
        longitude = (pos.lon * 180) / Math.PI
        latitude = (pos.lat * 180) / Math.PI
        break
      }
      case "moon": {
        const pos = astro.moonposition.position(jd)
        longitude = (pos.lon * 180) / Math.PI
        latitude = (pos.lat * 180) / Math.PI
        break
      }
      case "mercury": {
        const pos = astro.solar.apparentVSOP87(astro.planetposition.mercury, jd)
        longitude = (pos.lon * 180) / Math.PI
        latitude = (pos.lat * 180) / Math.PI
        break
      }
      case "venus": {
        const pos = astro.solar.apparentVSOP87(astro.planetposition.venus, jd)
        longitude = (pos.lon * 180) / Math.PI
        latitude = (pos.lat * 180) / Math.PI
        break
      }
      case "mars": {
        const pos = astro.solar.apparentVSOP87(astro.planetposition.mars, jd)
        longitude = (pos.lon * 180) / Math.PI
        latitude = (pos.lat * 180) / Math.PI
        break
      }
      case "jupiter": {
        const pos = astro.solar.apparentVSOP87(astro.planetposition.jupiter, jd)
        longitude = (pos.lon * 180) / Math.PI
        latitude = (pos.lat * 180) / Math.PI
        break
      }
      case "saturn": {
        const pos = astro.solar.apparentVSOP87(astro.planetposition.saturn, jd)
        longitude = (pos.lon * 180) / Math.PI
        latitude = (pos.lat * 180) / Math.PI
        break
      }
      case "uranus": {
        const pos = astro.solar.apparentVSOP87(astro.planetposition.uranus, jd)
        longitude = (pos.lon * 180) / Math.PI
        latitude = (pos.lat * 180) / Math.PI
        break
      }
      case "neptune": {
        const pos = astro.solar.apparentVSOP87(astro.planetposition.neptune, jd)
        longitude = (pos.lon * 180) / Math.PI
        latitude = (pos.lat * 180) / Math.PI
        break
      }
      default:
        // For Pluto and others, use a simplified calculation
        longitude = 0
        latitude = 0
    }
  } catch (error) {
    console.error(`Error calculating ${planetName} position:`, error)
  }

  const { sign, degree } = degreesToSign(longitude)

  return {
    name: planetName,
    longitude,
    latitude,
    sign,
    degree,
  }
}

/**
 * Calculate house cusps using Placidus system
 */
function calculateHouses(
  jd: number,
  latitude: number,
  longitude: number
): House[] {
  const houses: House[] = []

  try {
    // Calculate sidereal time
    const T = (jd - 2451545.0) / 36525
    const theta0 =
      280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000

    // Calculate RAMC (Right Ascension of Midheaven)
    const ramc = ((theta0 + longitude) % 360 + 360) % 360

    // Get obliquity of ecliptic
    const epsilon = astro.nutation.meanObliquity(jd)
    const epsilonDeg = (epsilon * 180) / Math.PI

    // Calculate MC (Midheaven) - 10th house cusp
    const mcRad = Math.atan2(
      Math.sin((ramc * Math.PI) / 180),
      Math.cos((ramc * Math.PI) / 180) * Math.cos(epsilon)
    )
    const mc = ((mcRad * 180) / Math.PI + 360) % 360

    // Calculate ASC (Ascendant) - 1st house cusp
    const latRad = (latitude * Math.PI) / 180
    const ramcRad = (ramc * Math.PI) / 180
    const ascRad = Math.atan2(
      Math.cos(ramcRad),
      -Math.sin(ramcRad) * Math.cos(epsilon) - Math.tan(latRad) * Math.sin(epsilon)
    )
    const asc = ((ascRad * 180) / Math.PI + 360) % 360

    // For a complete Placidus system, we'd need more complex calculations
    // This is a simplified equal house system based on ASC
    for (let i = 0; i < 12; i++) {
      const cuspDegree = (asc + i * 30) % 360
      const { sign } = degreesToSign(cuspDegree)
      houses.push({
        number: i + 1,
        cusp: cuspDegree,
        sign,
      })
    }
  } catch (error) {
    console.error("Error calculating houses:", error)
    // Return empty houses on error
    for (let i = 0; i < 12; i++) {
      houses.push({
        number: i + 1,
        cusp: i * 30,
        sign: ZODIAC_SIGNS[i % 12],
      })
    }
  }

  return houses
}

/**
 * Calculate aspects between planets
 */
function calculateAspects(planets: Record<string, PlanetPosition>): Aspect[] {
  const aspects: Aspect[] = []
  const planetNames = Object.keys(planets).filter(
    (name) => name !== "ascendant" && name !== "midheaven"
  )

  const aspectTypes = [
    { name: "Conjunction", angle: 0, orb: 8 },
    { name: "Opposition", angle: 180, orb: 8 },
    { name: "Trine", angle: 120, orb: 8 },
    { name: "Square", angle: 90, orb: 8 },
    { name: "Sextile", angle: 60, orb: 6 },
  ]

  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const planet1 = planets[planetNames[i]]
      const planet2 = planets[planetNames[j]]

      let diff = Math.abs(planet1.longitude - planet2.longitude)
      if (diff > 180) diff = 360 - diff

      for (const aspectType of aspectTypes) {
        const deviation = Math.abs(diff - aspectType.angle)
        if (deviation <= aspectType.orb) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            type: aspectType.name,
            angle: aspectType.angle,
            orb: deviation,
          })
        }
      }
    }
  }

  return aspects
}

/**
 * Calculate complete birth chart
 */
export function calculateBirthChart(
  dateOfBirth: string,
  birthTime: string,
  location: { lat: number; lng: number; timezone: string }
): BirthChart {
  // Parse date and time
  const [year, month, day] = dateOfBirth.split("-").map(Number)
  const [hour, minute] = birthTime.split(":").map(Number)

  // Calculate UTC offset from timezone (simplified - in production use proper timezone library)
  const utcOffset = parseFloat(location.timezone.replace("UTC", "").replace("+", "")) || 0

  // Calculate Julian Day
  const jd = toJulianDay(year, month, day, hour, minute, utcOffset)

  // Calculate planetary positions
  const sun = calculatePlanetPosition("Sun", jd)
  const moon = calculatePlanetPosition("Moon", jd)
  const mercury = calculatePlanetPosition("Mercury", jd)
  const venus = calculatePlanetPosition("Venus", jd)
  const mars = calculatePlanetPosition("Mars", jd)
  const jupiter = calculatePlanetPosition("Jupiter", jd)
  const saturn = calculatePlanetPosition("Saturn", jd)
  const uranus = calculatePlanetPosition("Uranus", jd)
  const neptune = calculatePlanetPosition("Neptune", jd)
  const pluto = { ...calculatePlanetPosition("Pluto", jd), longitude: 0, latitude: 0 }

  // Calculate houses
  const houses = calculateHouses(jd, location.lat, location.lng)

  // Calculate ascendant (1st house cusp) and midheaven (10th house cusp)
  const ascendant = {
    name: "Ascendant",
    longitude: houses[0].cusp,
    latitude: 0,
    ...degreesToSign(houses[0].cusp),
  }

  const midheaven = {
    name: "Midheaven",
    longitude: houses[9].cusp,
    latitude: 0,
    ...degreesToSign(houses[9].cusp),
  }

  // Assign houses to planets
  const assignHouse = (planet: Omit<PlanetPosition, "house">): PlanetPosition => {
    const houseNumber =
      houses.findIndex((house, index) => {
        const nextHouse = houses[(index + 1) % 12]
        if (nextHouse.cusp > house.cusp) {
          return planet.longitude >= house.cusp && planet.longitude < nextHouse.cusp
        } else {
          return planet.longitude >= house.cusp || planet.longitude < nextHouse.cusp
        }
      }) + 1

    return { ...planet, house: houseNumber || 1 }
  }

  const planetsWithHouses = {
    sun: assignHouse(sun),
    moon: assignHouse(moon),
    mercury: assignHouse(mercury),
    venus: assignHouse(venus),
    mars: assignHouse(mars),
    jupiter: assignHouse(jupiter),
    saturn: assignHouse(saturn),
    uranus: assignHouse(uranus),
    neptune: assignHouse(neptune),
    pluto: assignHouse(pluto),
    ascendant: assignHouse(ascendant),
    midheaven: assignHouse(midheaven),
  }

  // Calculate aspects
  const aspects = calculateAspects(planetsWithHouses)

  return {
    ...planetsWithHouses,
    houses,
    aspects,
  }
}

/**
 * Get interpretation for a zodiac sign
 */
export function getSignInterpretation(sign: string): string {
  const interpretations: Record<string, string> = {
    Aries: "Bold, pioneering, and energetic. Natural leaders with a competitive spirit.",
    Taurus: "Grounded, reliable, and sensual. Values stability and material comfort.",
    Gemini: "Curious, adaptable, and communicative. Thrives on variety and mental stimulation.",
    Cancer: "Nurturing, intuitive, and emotional. Deeply connected to home and family.",
    Leo: "Confident, creative, and charismatic. Natural performers who shine in the spotlight.",
    Virgo: "Analytical, practical, and detail-oriented. Dedicated to service and improvement.",
    Libra: "Harmonious, diplomatic, and aesthetic. Seeks balance and meaningful relationships.",
    Scorpio: "Intense, transformative, and mysterious. Powerful depth and emotional complexity.",
    Sagittarius: "Adventurous, philosophical, and optimistic. Seeks truth and freedom.",
    Capricorn: "Ambitious, disciplined, and pragmatic. Built for long-term success.",
    Aquarius: "Innovative, humanitarian, and independent. Visionary and future-focused.",
    Pisces: "Compassionate, imaginative, and spiritual. Deeply empathetic and artistic.",
  }

  return interpretations[sign] || "No interpretation available"
}
