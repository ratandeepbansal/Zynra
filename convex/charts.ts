import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Save a new birth chart
 */
export const saveChart = mutation({
  args: {
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
    birthChart: v.any(),
    numerologyProfile: v.any(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Create chart
    const chartId = await ctx.db.insert("charts", {
      userId: user._id,
      fullName: args.fullName,
      dateOfBirth: args.dateOfBirth,
      birthTime: args.birthTime,
      location: args.location,
      birthChart: args.birthChart,
      numerologyProfile: args.numerologyProfile,
    });

    return chartId;
  },
});

/**
 * Get all charts for the current user
 */
export const getMyCharts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      return [];
    }

    // Get all charts for this user, sorted by creation time (newest first)
    const charts = await ctx.db
      .query("charts")
      .withIndex("by_user_created", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return charts;
  },
});

/**
 * Get a specific chart by ID
 */
export const getChartById = query({
  args: { chartId: v.id("charts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      return null;
    }

    // Get chart
    const chart = await ctx.db.get(args.chartId);

    // Verify ownership
    if (!chart || chart.userId !== user._id) {
      return null;
    }

    return chart;
  },
});

/**
 * Delete a chart
 */
export const deleteChart = mutation({
  args: { chartId: v.id("charts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get chart
    const chart = await ctx.db.get(args.chartId);

    // Verify ownership
    if (!chart || chart.userId !== user._id) {
      throw new Error("Chart not found or access denied");
    }

    // Delete chart
    await ctx.db.delete(args.chartId);

    return { success: true };
  },
});
