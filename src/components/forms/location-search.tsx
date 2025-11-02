"use client"

import * as React from "react"
import { Loader2, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TOP_100_INDIAN_CITIES, type IndianCity } from "@/data/indian-cities"

type LocationOption = {
  placeId: string
  description: string
}

type SelectedLocation = {
  placeId: string
  description: string
  city: string
  country: string
  lat: number
  lng: number
  timezone: string
}

interface LocationSearchProps {
  value: SelectedLocation | null
  onSelect: (location: SelectedLocation) => void
  disabled?: boolean
  error?: string
}

export function LocationSearch({
  value,
  onSelect,
  disabled,
  error,
}: LocationSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState(value?.description ?? "")
  const [options, setOptions] = React.useState<LocationOption[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false)
  const [fetchError, setFetchError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setQuery(value?.description ?? "")
  }, [value?.description])

  React.useEffect(() => {
    if (!open) {
      return
    }

    if (query.trim().length === 0) {
      // Show all cities when no query
      const allCities = TOP_100_INDIAN_CITIES.map(city => ({
        placeId: city.id,
        description: `${city.name}, ${city.state}`,
      }))
      setOptions(allCities)
      setFetchError(null)
      return
    }

    // Filter cities based on query
    const searchQuery = query.trim().toLowerCase()
    const filteredCities = TOP_100_INDIAN_CITIES.filter(city =>
      city.name.toLowerCase().includes(searchQuery) ||
      city.state.toLowerCase().includes(searchQuery)
    ).map(city => ({
      placeId: city.id,
      description: `${city.name}, ${city.state}`,
    }))

    setOptions(filteredCities)
    setFetchError(null)
  }, [open, query])

  const handleSelect = React.useCallback(
    (placeId: string, description: string) => {
      setIsLoadingDetails(true)
      setFetchError(null)
      try {
        // Find the city from the hardcoded list
        const selectedCity = TOP_100_INDIAN_CITIES.find(city => city.id === placeId)

        if (!selectedCity) {
          throw new Error("City not found")
        }

        const location: SelectedLocation = {
          placeId: selectedCity.id,
          description: `${selectedCity.name}, ${selectedCity.state}`,
          city: selectedCity.name,
          country: "India",
          lat: selectedCity.lat,
          lng: selectedCity.lng,
          timezone: selectedCity.timezone,
        }

        onSelect(location)
        setQuery(description)
        setOpen(false)
      } catch (err) {
        console.error("[location-search]", err)
        setFetchError("Unable to load details for that location.")
      } finally {
        setIsLoadingDetails(false)
      }
    },
    [onSelect]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" />
            {value?.description || "Search for a city or location"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Type a city name..."
            autoFocus
          />
          <CommandList>
            {isSearching && (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Searching locations...
              </div>
            )}
            {!isSearching && fetchError && (
              <div className="px-4 py-3 text-sm text-destructive">
                {fetchError}
              </div>
            )}
            {!isSearching && !fetchError && (
              <>
                <CommandEmpty>
                  No cities found matching your search.
                </CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.placeId}
                      value={option.placeId}
                      onSelect={() =>
                        handleSelect(option.placeId, option.description)
                      }
                      className="flex items-start gap-2"
                    >
                      <MapPin className="mt-0.5 size-4 text-muted-foreground" />
                      <span>{option.description}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
          {isLoadingDetails && (
            <div className="flex items-center gap-2 border-t border-border/70 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Fetching location details…
            </div>
          )}
        </Command>
      </PopoverContent>
      {error ? (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      ) : null}
    </Popover>
  )
}
