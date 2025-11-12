/**
 * Astrology calculation engine with simplified astronomical calculations
 * Calculates planetary positions, houses, and aspects for natal charts
 * Using approximate formulas suitable for astrological purposes (1900-2100)
 */

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
 * Convert date/time to Julian Day Number
 */
function toJulianDay(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): number {
  // Adjust for January/February
  if (month <= 2) {
    year -= 1
    month += 12
  }

  const A = Math.floor(year / 100)
  const B = 2 - A + Math.floor(A / 4)

  const JD =
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5 +
    (hour + minute / 60) / 24

  return JD
}

/**
 * Calculate Sun's ecliptic longitude (simplified)
 */
function calculateSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525 // Julian centuries from J2000.0

  // Mean longitude of the Sun
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T

  // Mean anomaly of the Sun
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T
  const Mrad = (M * Math.PI) / 180

  // Equation of center
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad)

  // Sun's true longitude
  const sunLong = L0 + C

  return ((sunLong % 360) + 360) % 360
}

/**
 * Calculate Moon's ecliptic longitude (simplified)
 */
function calculateMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525

  // Moon's mean longitude
  const L = 218.316 + 481267.881 * T

  // Moon's mean elongation
  const D = 297.85 + 445267.112 * T
  const Drad = (D * Math.PI) / 180

  // Sun's mean anomaly
  const M = 357.53 + 35999.050 * T
  const Mrad = (M * Math.PI) / 180

  // Moon's mean anomaly
  const Mprime = 134.96 + 477198.868 * T
  const Mprimerad = (Mprime * Math.PI) / 180

  // Simplified perturbations
  const moonLong =
    L +
    6.289 * Math.sin(Mprimerad) +
    1.274 * Math.sin(2 * Drad - Mprimerad) +
    0.658 * Math.sin(2 * Drad) +
    0.214 * Math.sin(2 * Mprimerad) -
    0.186 * Math.sin(Mrad)

  return ((moonLong % 360) + 360) % 360
}

/**
 * Calculate approximate planetary positions
 * Using simplified orbital elements (good for 1900-2100)
 */
function calculatePlanetLongitude(planetName: string, jd: number): number {
  const T = (jd - 2451545.0) / 36525 // Julian centuries from J2000.0

  // Orbital elements [L0, L1] where L = L0 + L1 * T
  const orbitalElements: Record<string, { L0: number; L1: number; period: number }> = {
    mercury: { L0: 252.25, L1: 149472.67, period: 0.241 },
    venus: { L0: 181.98, L1: 58517.82, period: 0.615 },
    mars: { L0: 355.43, L1: 19140.30, period: 1.881 },
    jupiter: { L0: 34.35, L1: 3034.90, period: 11.862 },
    saturn: { L0: 50.08, L1: 1222.11, period: 29.457 },
    uranus: { L0: 314.05, L1: 428.48, period: 84.011 },
    neptune: { L0: 304.35, L1: 218.46, period: 164.79 },
    pluto: { L0: 238.93, L1: 145.18, period: 248.09 },
  }

  const planet = orbitalElements[planetName.toLowerCase()]
  if (!planet) return 0

  const meanLongitude = planet.L0 + planet.L1 * T

  return ((meanLongitude % 360) + 360) % 360
}

/**
 * Calculate the position of a planet
 */
function calculatePlanetPosition(
  planetName: string,
  jd: number
): Omit<PlanetPosition, "house"> {
  let longitude = 0
  let latitude = 0

  try {
    switch (planetName.toLowerCase()) {
      case "sun":
        longitude = calculateSunLongitude(jd)
        latitude = 0 // Sun is on the ecliptic
        break
      case "moon":
        longitude = calculateMoonLongitude(jd)
        latitude = 0 // Simplified - ignoring lunar latitude
        break
      default:
        longitude = calculatePlanetLongitude(planetName, jd)
        latitude = 0 // Simplified - assuming planets are on ecliptic
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
 * Calculate Ascendant and Midheaven
 */
function calculateAngles(
  jd: number,
  latitude: number,
  longitude: number
): { ascendant: number; midheaven: number } {
  const T = (jd - 2451545.0) / 36525

  // Calculate Local Sidereal Time (LST)
  const GMST =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000

  const LST = GMST + longitude
  const LSTnorm = ((LST % 360) + 360) % 360

  // Calculate obliquity of ecliptic
  const epsilon = 23.439291 - 0.0130042 * T
  const epsilonRad = (epsilon * Math.PI) / 180

  // Calculate Midheaven (MC) - 10th house cusp
  const LSTrad = (LSTnorm * Math.PI) / 180
  const MCrad = Math.atan2(Math.sin(LSTrad), Math.cos(LSTrad) * Math.cos(epsilonRad))
  const MC = ((MCrad * 180) / Math.PI + 360) % 360

  // Calculate Ascendant
  const latRad = (latitude * Math.PI) / 180
  const ASCrad = Math.atan2(
    Math.cos(LSTrad),
    -Math.sin(LSTrad) * Math.cos(epsilonRad) - Math.tan(latRad) * Math.sin(epsilonRad)
  )
  const ASC = ((ASCrad * 180) / Math.PI + 360) % 360

  return { ascendant: ASC, midheaven: MC }
}

/**
 * Calculate house cusps using Equal House system
 */
function calculateHouses(ascendant: number): House[] {
  const houses: House[] = []

  for (let i = 0; i < 12; i++) {
    const cuspDegree = (ascendant + i * 30) % 360
    const { sign } = degreesToSign(cuspDegree)
    houses.push({
      number: i + 1,
      cusp: cuspDegree,
      sign,
    })
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
  birthTime: { hour: number; minute: number; period: "AM" | "PM" },
  location: { lat: number; lng: number; timezone: string }
): BirthChart {
  // Parse date and time
  const [year, month, day] = dateOfBirth.split("-").map(Number)

  // Convert 12-hour format to 24-hour format
  let hour = birthTime.hour
  const minute = birthTime.minute

  if (birthTime.period === "PM" && hour !== 12) {
    hour += 12
  } else if (birthTime.period === "AM" && hour === 12) {
    hour = 0
  }

  // Calculate Julian Day (using UTC time)
  const jd = toJulianDay(year, month, day, hour, minute)

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
  const pluto = calculatePlanetPosition("Pluto", jd)

  // Calculate Ascendant and Midheaven
  const angles = calculateAngles(jd, location.lat, location.lng)

  const ascendant = {
    name: "Ascendant",
    longitude: angles.ascendant,
    latitude: 0,
    ...degreesToSign(angles.ascendant),
  }

  const midheaven = {
    name: "Midheaven",
    longitude: angles.midheaven,
    latitude: 0,
    ...degreesToSign(angles.midheaven),
  }

  // Calculate houses
  const houses = calculateHouses(angles.ascendant)

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
