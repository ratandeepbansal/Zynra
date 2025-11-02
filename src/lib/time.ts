import type { BirthTime } from "@/types"

export function formatBirthTime(birthTime: BirthTime) {
  const hour = birthTime.hour.toString().padStart(2, "0")
  const minute = birthTime.minute.toString().padStart(2, "0")
  return `${hour}:${minute} ${birthTime.period}`
}

export function to24HourClock(birthTime: BirthTime) {
  let hour = birthTime.hour % 12
  if (birthTime.period === "PM") {
    hour += 12
  }

  return `${hour.toString().padStart(2, "0")}:${birthTime.minute
    .toString()
    .padStart(2, "0")}`
}
