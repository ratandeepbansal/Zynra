export interface AddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

const cityComponentTypes = new Set([
  "locality",
  "sublocality",
  "postal_town",
  "administrative_area_level_2",
])

const countryComponentType = "country"

export function extractCity(components: AddressComponent[]): string | null {
  for (const type of cityComponentTypes) {
    const component = components.find((item) => item.types.includes(type))
    if (component) {
      return component.long_name
    }
  }

  return null
}

export function extractCountry(components: AddressComponent[]): string | null {
  const country = components.find((item) => item.types.includes(countryComponentType))
  return country ? country.long_name : null
}
