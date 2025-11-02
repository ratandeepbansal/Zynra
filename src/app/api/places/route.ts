import { NextResponse } from "next/server"
import tzLookup from "tz-lookup"

import type { AddressComponent } from "@/lib/location"
import { extractCity, extractCountry } from "@/lib/location"

const GOOGLE_PLACES_ENDPOINT = "https://maps.googleapis.com/maps/api/place"

type GoogleAutocompletePrediction = {
  description: string
  place_id: string
}

type GoogleAutocompleteResponse = {
  status: string
  predictions?: GoogleAutocompletePrediction[]
  error_message?: string
}

type GooglePlaceDetailsResponse = {
  status: string
  result?: {
    formatted_address?: string
    name?: string
    geometry?: {
      location?: {
        lat: number
        lng: number
      }
    }
    address_components?: AddressComponent[]
  }
  error_message?: string
}

function getApiKey() {
  return (
    process.env.GOOGLE_PLACES_API_KEY ??
    process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY ??
    ""
  )
}

export async function GET(request: Request) {
  const apiKey = getApiKey()

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Places API key is not configured." },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  const placeId = searchParams.get("place_id")

  try {
    if (query) {
      return await handleAutocomplete(query, apiKey)
    }

    if (placeId) {
      return await handlePlaceDetails(placeId, apiKey)
    }

    return NextResponse.json(
      { error: "Provide either a query or place_id parameter." },
      { status: 400 }
    )
  } catch (error) {
    console.error("[places-route]", error)
    return NextResponse.json(
      { error: "Failed to fetch location data." },
      { status: 500 }
    )
  }
}

async function handleAutocomplete(query: string, apiKey: string) {
  const endpoint = `${GOOGLE_PLACES_ENDPOINT}/autocomplete/json?input=${encodeURIComponent(
    query
  )}&types=(cities)&key=${apiKey}`

  const response = await fetch(endpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 0 },
  })

  const data = (await response.json()) as GoogleAutocompleteResponse

  if (data.status !== "OK") {
    return NextResponse.json(
      { error: data.error_message ?? "No results found.", status: data.status },
      { status: 422 }
    )
  }

  const predictions =
    data.predictions?.map((prediction) => ({
      description: prediction.description,
      placeId: prediction.place_id,
    })) ?? []

  return NextResponse.json({ predictions })
}

async function handlePlaceDetails(placeId: string, apiKey: string) {
  const fields = ["address_component", "geometry", "name", "formatted_address"].join(",")
  const endpoint = `${GOOGLE_PLACES_ENDPOINT}/details/json?place_id=${encodeURIComponent(
    placeId
  )}&fields=${fields}&key=${apiKey}`

  const response = await fetch(endpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 0 },
  })

  const data = (await response.json()) as GooglePlaceDetailsResponse

  if (data.status !== "OK") {
    return NextResponse.json(
      { error: data.error_message ?? "Unable to retrieve place details.", status: data.status },
      { status: 422 }
    )
  }

  const result = data.result
  const components = result?.address_components ?? []
  const city = extractCity(components)
  const country = extractCountry(components)
  const lat = result?.geometry?.location?.lat
  const lng = result?.geometry?.location?.lng

  if (!city || !country || typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json(
      { error: "Incomplete place information returned from Google." },
      { status: 422 }
    )
  }

  let timezone = ""
  try {
    timezone = tzLookup(lat, lng)
  } catch (error) {
    console.error("[places-route-timezone]", error)
  }

  if (!timezone) {
    return NextResponse.json(
      { error: "Unable to resolve timezone for selected location." },
      { status: 422 }
    )
  }

  const location = {
    placeId,
    description: result?.formatted_address ?? result?.name ?? `${city}, ${country}`,
    city,
    country,
    lat,
    lng,
    timezone,
  }

  return NextResponse.json({ location })
}
