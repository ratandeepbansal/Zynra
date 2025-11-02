"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, parseISO } from "date-fns"
import { useRouter } from "next/navigation"
import { type FieldPath, useForm } from "react-hook-form"
import { toast } from "sonner"

import { LocationSearch } from "@/components/forms/location-search"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAppStore } from "@/store/use-app-store"
import type { Meridiem, UserData, UserLocation } from "@/types"
import {
  type UserDataFormValues,
  userDataSchema,
} from "@/lib/validation/user-data"
import { Info } from "lucide-react"

interface StepConfig {
  id: string
  title: string
  description: string
  fields: FieldPath<UserDataFormValues>[]
}

const steps: StepConfig[] = [
  {
    id: "identity",
    title: "About you",
    description: "We start with your full legal name for numerology accuracy.",
    fields: ["fullName"],
  },
  {
    id: "birth",
    title: "Birth details",
    description:
      "Precise date and time allow us to map your sun, moon, and rising positions.",
    fields: ["dateOfBirth", "birthTime.hour", "birthTime.minute", "birthTime.period"],
  },
  {
    id: "location",
    title: "Location",
    description:
      "We’ll calculate planetary houses and timezone offsets from your birthplace.",
    fields: ["location"],
  },
]

const hours = Array.from({ length: 12 }, (_, index) => String(index + 1))
const minutes = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0")
)

function formatDisplayDate(value: string) {
  try {
    return format(parseISO(value), "MMMM d, yyyy")
  } catch {
    return "Select date"
  }
}

export function UserDataForm() {
  const router = useRouter()
  const setUserData = useAppStore((state) => state.setUserData)
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<UserDataFormValues>({
    resolver: zodResolver(userDataSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      birthTime: {
        hour: 12,
        minute: 0,
        period: "AM",
      },
      location: {
        placeId: "",
        description: "",
        city: "",
        country: "",
        lat: 0,
        lng: 0,
        timezone: "",
      },
    },
    mode: "onBlur",
  })

  const isLastStep = currentStep === steps.length - 1

  const handleNext = async () => {
    const fields = steps[currentStep].fields
    const valid = await form.trigger(fields)
    if (!valid) return
    if (isLastStep) {
      void form.handleSubmit(onSubmit)()
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const onSelectLocation = (location: UserLocation) => {
    form.setValue("location", location, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const onSubmit = async (values: UserDataFormValues) => {
    try {
      setIsSubmitting(true)

      const payload: UserData = {
        fullName: values.fullName.trim(),
        dateOfBirth: values.dateOfBirth,
        birthTime: {
          hour: values.birthTime.hour,
          minute: values.birthTime.minute,
          period: values.birthTime.period as Meridiem,
        },
        location: values.location,
      }

      setUserData(payload)
      toast.success("Your cosmic profile is saved. Let’s generate insights next.")
      router.push("/results")
    } catch (error) {
      console.error("[user-data-form-submit]", error)
      toast.error("We couldn’t save your details. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  React.useEffect(() => {
    // Rehydrate persisted store on mount
    if (useAppStore.persist?.hasHydrated?.() === false) {
      useAppStore.persist.rehydrate()
    }
  }, [])

  return (
    <TooltipProvider>
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <Stepper steps={steps} currentStep={currentStep} />
        <div className="rounded-3xl border border-border/70 bg-card px-6 py-8 shadow-sm shadow-primary/5 sm:px-10">
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              {currentStep === 0 && (
                <section className="space-y-6">
                  <header className="space-y-1">
                    <h2 className="text-xl font-semibold">{steps[0].title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {steps[0].description}
                    </p>
                  </header>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FieldLabel
                          label="Full legal name"
                          tooltip="Used to calculate core numerology numbers like Life Path and Expression."
                        />
                        <FormControl>
                          <Input
                            placeholder="e.g. Celeste Marie Thompson"
                            autoComplete="name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>
              )}

              {currentStep === 1 && (
                <section className="space-y-6">
                  <header className="space-y-1">
                    <h2 className="text-xl font-semibold">{steps[1].title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {steps[1].description}
                    </p>
                  </header>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FieldLabel
                            label="Date of birth"
                            tooltip="Sets the baseline for solar cycles, numerology, and transits."
                          />
                          <FormControl>
                            <Input type="date" max={getTodayISO()} {...field} />
                          </FormControl>
                          <FormDescription>
                            {field.value
                              ? `Selected: ${formatDisplayDate(field.value)}`
                              : "Choose your exact birth date."}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="birthTime.hour"
                      render={({ field }) => (
                        <FormItem>
                          <FieldLabel
                            label="Hour"
                            tooltip="Astrology needs the precise birth hour to locate your rising sign."
                          />
                          <Select
                            value={field.value ? String(field.value) : undefined}
                            onValueChange={(value) => field.onChange(Number(value))}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Hour" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {hours.map((hour) => (
                                <SelectItem key={hour} value={hour}>
                                  {hour}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthTime.minute"
                      render={({ field }) => (
                        <FormItem>
                          <FieldLabel
                            label="Minute"
                            tooltip="Minutes fine-tune house cusps and accurate transit predictions."
                          />
                          <Select
                            value={field.value != null ? String(field.value).padStart(2, "0") : undefined}
                            onValueChange={(value) => field.onChange(Number(value))}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Minute" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {minutes.map((minute) => (
                                <SelectItem key={minute} value={minute}>
                                  {minute}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthTime.period"
                      render={({ field }) => (
                        <FormItem>
                          <FieldLabel
                            label="AM / PM"
                            tooltip="We convert to 24-hour time internally for astronomical calculations."
                          />
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value as Meridiem)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="AM / PM" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="AM">AM</SelectItem>
                              <SelectItem value="PM">PM</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>
              )}

              {currentStep === 2 && (
                <section className="space-y-6">
                  <header className="space-y-1">
                    <h2 className="text-xl font-semibold">{steps[2].title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {steps[2].description}
                    </p>
                  </header>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => {
                      const locationError =
                        (form.formState.errors.location as
                          | { placeId?: { message?: string } }
                          | undefined)?.placeId?.message ??
                        (form.formState.errors.location as { message?: string } | undefined)?.message

                      return (
                        <FormItem className="space-y-3">
                          <FieldLabel
                            label="Birth location"
                            tooltip="Latitude, longitude, and timezone anchor your astrological houses."
                          />
                          <FormControl>
                            <LocationSearch
                              value={
                                field.value.placeId
                                  ? (field.value as UserLocation)
                                  : null
                              }
                              onSelect={onSelectLocation}
                              error={locationError}
                            />
                          </FormControl>
                          {field.value.timezone ? (
                            <p className="text-sm text-muted-foreground">
                              Timezone detected:{" "}
                              <span className="font-medium text-foreground">
                                {field.value.timezone}
                              </span>
                            </p>
                          ) : null}
                        </FormItem>
                      )
                    }}
                  />
                </section>
              )}

              <footer className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0 || isSubmitting}
                >
                  Back
                </Button>
                <Button
                  type={isLastStep ? "submit" : "button"}
                  onClick={isLastStep ? undefined : handleNext}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : isLastStep
                      ? "Save & Continue"
                      : "Next"}
                </Button>
              </footer>
            </form>
          </Form>
        </div>
      </div>
    </TooltipProvider>
  )
}

function Stepper({
  steps,
  currentStep,
}: {
  steps: StepConfig[]
  currentStep: number
}) {
  return (
    <div className="relative flex items-center justify-between gap-4">
      <div className="absolute left-[12px] right-[12px] top-5 h-px bg-border" aria-hidden />
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        return (
          <div key={step.id} className="relative z-[1] flex flex-col items-center gap-2 text-center">
            <div
              className={[
                "flex size-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                isCompleted
                  ? "border-primary bg-primary text-primary-foreground"
                  : isActive
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground",
              ].join(" ")}
            >
              {index + 1}
            </div>
            <div>
              <p className="text-sm font-medium">{step.title}</p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FieldLabel({
  label,
  tooltip,
}: {
  label: string
  tooltip: string
}) {
  return (
    <Label className="flex items-center gap-2 text-sm font-medium">
      {label}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Info className="size-4" />
            <span className="sr-only">Why we ask for {label}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" align="center" className="max-w-xs text-xs leading-relaxed">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </Label>
  )
}

function getTodayISO() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today.toISOString().split("T")[0]!
}
