/**
 * Numerology calculation engine using Pythagorean system
 * Calculates Life Path, Expression, Soul Urge, and Personality numbers
 */

export interface NumerologyProfile {
  lifePathNumber: number
  expressionNumber: number
  soulUrgeNumber: number
  personalityNumber: number
  birthdayNumber: number
}

// Pythagorean letter-to-number mapping
const LETTER_VALUES: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  I: 9,
  J: 1,
  K: 2,
  L: 3,
  M: 4,
  N: 5,
  O: 6,
  P: 7,
  Q: 8,
  R: 9,
  S: 1,
  T: 2,
  U: 3,
  V: 4,
  W: 5,
  X: 6,
  Y: 7,
  Z: 8,
}

// Vowels for Soul Urge calculation
const VOWELS = new Set(["A", "E", "I", "O", "U"])

/**
 * Master numbers that should not be reduced
 */
const MASTER_NUMBERS = [11, 22, 33]

/**
 * Reduce a number to a single digit (or master number)
 */
function reduceToSingleDigit(num: number): number {
  // Keep master numbers
  if (MASTER_NUMBERS.includes(num)) {
    return num
  }

  while (num > 9) {
    const digits = num.toString().split("").map(Number)
    num = digits.reduce((sum, digit) => sum + digit, 0)

    // Check if the result is a master number
    if (MASTER_NUMBERS.includes(num)) {
      return num
    }
  }

  return num
}

/**
 * Calculate Life Path Number from date of birth
 * This is the most important number in numerology
 */
export function calculateLifePathNumber(dateOfBirth: string): number {
  const [year, month, day] = dateOfBirth.split("-").map(Number)

  // Reduce each component separately to preserve master numbers
  const reducedMonth = reduceToSingleDigit(month)
  const reducedDay = reduceToSingleDigit(day)
  const reducedYear = reduceToSingleDigit(year)

  // Add them together and reduce
  const sum = reducedMonth + reducedDay + reducedYear
  return reduceToSingleDigit(sum)
}

/**
 * Calculate the numerology value of a name
 */
function calculateNameValue(name: string, filterFn?: (char: string) => boolean): number {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, "")
  let sum = 0

  for (const char of cleanName) {
    if (!filterFn || filterFn(char)) {
      sum += LETTER_VALUES[char] || 0
    }
  }

  return reduceToSingleDigit(sum)
}

/**
 * Calculate Expression Number (Destiny Number) from full name
 * Reveals natural talents and abilities
 */
export function calculateExpressionNumber(fullName: string): number {
  return calculateNameValue(fullName)
}

/**
 * Calculate Soul Urge Number (Heart's Desire) from vowels in name
 * Reveals inner desires and motivations
 */
export function calculateSoulUrgeNumber(fullName: string): number {
  return calculateNameValue(fullName, (char) => VOWELS.has(char))
}

/**
 * Calculate Personality Number from consonants in name
 * Reveals how others perceive you
 */
export function calculatePersonalityNumber(fullName: string): number {
  return calculateNameValue(fullName, (char) => !VOWELS.has(char))
}

/**
 * Calculate Birthday Number
 * Represents a special gift or talent
 */
export function calculateBirthdayNumber(dateOfBirth: string): number {
  const day = parseInt(dateOfBirth.split("-")[2], 10)
  return reduceToSingleDigit(day)
}

/**
 * Calculate complete numerology profile
 */
export function calculateNumerologyProfile(
  fullName: string,
  dateOfBirth: string
): NumerologyProfile {
  return {
    lifePathNumber: calculateLifePathNumber(dateOfBirth),
    expressionNumber: calculateExpressionNumber(fullName),
    soulUrgeNumber: calculateSoulUrgeNumber(fullName),
    personalityNumber: calculatePersonalityNumber(fullName),
    birthdayNumber: calculateBirthdayNumber(dateOfBirth),
  }
}

/**
 * Get interpretation for a life path number
 */
export function getLifePathInterpretation(number: number): string {
  const interpretations: Record<number, string> = {
    1: "The Leader - Independent, innovative, and ambitious. You're a natural pioneer with strong leadership abilities and the courage to forge your own path.",
    2: "The Peacemaker - Diplomatic, sensitive, and cooperative. You excel in partnerships and have a gift for bringing harmony to relationships.",
    3: "The Creative - Expressive, optimistic, and sociable. You have a natural talent for communication and bringing joy to others through creativity.",
    4: "The Builder - Practical, disciplined, and hardworking. You excel at creating stable foundations and bringing order to chaos.",
    5: "The Freedom Seeker - Adventurous, versatile, and dynamic. You thrive on change, freedom, and new experiences.",
    6: "The Nurturer - Responsible, caring, and community-oriented. You have a strong desire to help others and create harmony in your environment.",
    7: "The Seeker - Analytical, spiritual, and introspective. You're driven to understand the deeper mysteries of life through study and contemplation.",
    8: "The Powerhouse - Ambitious, business-minded, and authoritative. You have exceptional organizational skills and the ability to achieve material success.",
    9: "The Humanitarian - Compassionate, idealistic, and humanitarian. You're driven by a desire to make the world a better place.",
    11: "The Illuminator - Highly intuitive, inspirational, and visionary. You have the potential to be a spiritual teacher and bring enlightenment to others.",
    22: "The Master Builder - Practical visionary with the ability to turn dreams into reality on a grand scale. You can build lasting institutions and legacies.",
    33: "The Master Teacher - The most influential of all numbers, combining spiritual insight with practical compassion to uplift humanity.",
  }

  return (
    interpretations[number] ||
    "A unique path requiring personal exploration and self-discovery."
  )
}

/**
 * Get interpretation for an expression number
 */
export function getExpressionInterpretation(number: number): string {
  const interpretations: Record<number, string> = {
    1: "Natural leadership abilities, independence, and pioneering spirit. You're destined to innovate and lead.",
    2: "Diplomatic talents, sensitivity to others, and ability to mediate. You excel in cooperation and partnership.",
    3: "Creative expression, communication skills, and social charm. You're meant to inspire and entertain.",
    4: "Practical skills, strong work ethic, and organizational abilities. You build lasting structures and systems.",
    5: "Versatility, adaptability, and love of freedom. You're here to experience life's variety and share adventures.",
    6: "Nurturing abilities, responsibility, and desire to serve. You're meant to care for others and create harmony.",
    7: "Analytical mind, spiritual depth, and quest for knowledge. You're here to seek truth and wisdom.",
    8: "Business acumen, executive abilities, and material mastery. You're destined for success in the material world.",
    9: "Humanitarian vision, artistic talents, and universal love. You're meant to serve humanity's higher good.",
    11: "Intuitive gifts, inspirational abilities, and spiritual insight. You're here to enlighten and inspire others.",
    22: "Visionary capabilities combined with practical skills. You're meant to build something of lasting global significance.",
    33: "Master teacher abilities, profound compassion, and healing gifts. You're here to uplift consciousness through service.",
  }

  return (
    interpretations[number] ||
    "Unique talents that emerge through life experience and self-discovery."
  )
}

/**
 * Get interpretation for a soul urge number
 */
export function getSoulUrgeInterpretation(number: number): string {
  const interpretations: Record<number, string> = {
    1: "You desire independence, leadership, and the freedom to pursue your own goals. You're driven to stand out and make your mark.",
    2: "You crave harmony, partnership, and meaningful connections. Peace and cooperation fulfill your deepest needs.",
    3: "You long for creative expression, social interaction, and joy. You're happiest when inspiring and entertaining others.",
    4: "You desire security, stability, and productive work. Building something lasting gives you deep satisfaction.",
    5: "You crave freedom, variety, and new experiences. Adventure and change feed your soul.",
    6: "You desire to nurture, help others, and create a harmonious home. Service and responsibility bring you fulfillment.",
    7: "You long for understanding, spiritual growth, and solitude. Deep knowledge and inner peace are what you seek.",
    8: "You desire success, recognition, and material abundance. Achievement and power drive your inner motivation.",
    9: "You crave to make a difference, express universal love, and serve humanity. Compassion and idealism guide your heart.",
    11: "You desire spiritual enlightenment and to inspire others. Your soul yearns to illuminate and uplift.",
    22: "You desire to build something meaningful that benefits humanity. Your soul drives you toward practical idealism.",
    33: "You desire to heal, teach, and serve on the highest level. Your soul's mission is compassionate service to all.",
  }

  return (
    interpretations[number] ||
    "Unique inner desires that reveal themselves through introspection and life experience."
  )
}

/**
 * Get interpretation for a personality number
 */
export function getPersonalityInterpretation(number: number): string {
  const interpretations: Record<number, string> = {
    1: "You appear confident, independent, and strong-willed. Others see you as a natural leader and pioneer.",
    2: "You appear gentle, diplomatic, and approachable. Others see you as cooperative and easy to work with.",
    3: "You appear charming, creative, and entertaining. Others see you as fun, expressive, and socially engaging.",
    4: "You appear reliable, practical, and organized. Others see you as trustworthy and grounded.",
    5: "You appear dynamic, exciting, and adventurous. Others see you as versatile and freedom-loving.",
    6: "You appear warm, responsible, and caring. Others see you as nurturing and community-oriented.",
    7: "You appear mysterious, intellectual, and reserved. Others see you as wise and introspective.",
    8: "You appear successful, authoritative, and ambitious. Others see you as powerful and business-minded.",
    9: "You appear compassionate, artistic, and idealistic. Others see you as humanitarian and inspirational.",
    11: "You appear intuitive, inspiring, and spiritually aware. Others see you as enlightened and visionary.",
    22: "You appear capable, visionary, and practical. Others see you as someone who can achieve great things.",
    33: "You appear compassionate, wise, and healing. Others see you as a natural teacher and guide.",
  }

  return (
    interpretations[number] ||
    "A unique outer presence that develops through personal growth and experience."
  )
}

/**
 * Get interpretation for a birthday number
 */
export function getBirthdayInterpretation(number: number): string {
  const interpretations: Record<number, string> = {
    1: "You have a gift for leadership and innovation. Independence and originality are your special talents.",
    2: "You have a gift for diplomacy and cooperation. Sensitivity to others is your special talent.",
    3: "You have a gift for creativity and communication. Expression and joy are your special talents.",
    4: "You have a gift for organization and building. Practical skills are your special talents.",
    5: "You have a gift for adaptability and communication. Versatility is your special talent.",
    6: "You have a gift for nurturing and creating harmony. Responsibility and care are your special talents.",
    7: "You have a gift for analysis and spiritual understanding. Wisdom-seeking is your special talent.",
    8: "You have a gift for business and material success. Executive ability is your special talent.",
    9: "You have a gift for humanitarianism and universal love. Compassion is your special talent.",
    11: "You have a gift for intuition and inspiration. Spiritual insight is your special talent.",
    22: "You have a gift for practical vision. Master building ability is your special talent.",
    33: "You have a gift for teaching and healing. Master compassion is your special talent.",
  }

  return (
    interpretations[number] || "A unique gift that unfolds throughout your life journey."
  )
}
