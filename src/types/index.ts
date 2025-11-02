export type Meridiem = "AM" | "PM"

export interface UserLocation {
  placeId: string
  description: string
  city: string
  country: string
  lat: number
  lng: number
  timezone: string
}

export interface BirthTime {
  hour: number
  minute: number
  period: Meridiem
}

export interface UserData {
  fullName: string
  dateOfBirth: string
  birthTime: BirthTime
  location: UserLocation
}

export interface AppStoreState {
  userData: UserData | null
  astrologyResults: unknown | null
  numerologyResults: unknown | null
  personalityResults: unknown | null
}
