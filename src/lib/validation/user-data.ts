import { z } from "zod"

const hourSchema = z
  .number({ invalid_type_error: "Hour is required" })
  .int()
  .min(1, "Hour must be between 1 and 12")
  .max(12, "Hour must be between 1 and 12")

const minuteSchema = z
  .number({ invalid_type_error: "Minute is required" })
  .int()
  .min(0, "Minute must be between 0 and 59")
  .max(59, "Minute must be between 0 and 59")

export const userLocationSchema = z.object({
  placeId: z.string().min(1, "Select a location"),
  description: z.string().min(1, "Location description required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  lat: z.number(),
  lng: z.number(),
  timezone: z.string().min(1, "Timezone could not be detected"),
})

export const userDataSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name must be under 80 characters"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Enter a valid date",
    }),
  birthTime: z.object({
    hour: hourSchema,
    minute: minuteSchema,
    period: z.enum(["AM", "PM"], {
      errorMap: () => ({ message: "Select AM or PM" }),
    }),
  }),
  location: userLocationSchema,
})

export type UserDataFormValues = z.infer<typeof userDataSchema>
