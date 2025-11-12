import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    // OAuth provider info
    tokenIdentifier: v.string(),
    provider: v.string(), // "google", etc.
  }).index("by_token", ["tokenIdentifier"]),

  charts: defineTable({
    userId: v.id("users"),
    fullName: v.string(),
    dateOfBirth: v.string(),
    birthTime: v.object({
      hour: v.number(),
      minute: v.number(),
      period: v.union(v.literal("AM"), v.literal("PM")),
    }),
    location: v.object({
      city: v.string(),
      country: v.string(),
      lat: v.number(),
      lng: v.number(),
      timezone: v.string(),
    }),
    birthChart: v.any(), // Full birth chart data
    numerologyProfile: v.any(), // Full numerology profile
  })
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "_creationTime"]),
});
