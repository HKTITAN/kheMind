import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const appendLog = mutation({
  args: { body: v.string(), bridgeSecret: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const expected = process.env.BRIDGE_SECRET;
    if (expected && args.bridgeSecret !== expected) {
      throw new Error("Unauthorized");
    }
    await ctx.db.insert("logs", {
      body: args.body,
      createdAt: Date.now(),
    });
  },
});

export const listRecentLogs = query({
  args: {
    limit: v.optional(v.number()),
    bridgeSecret: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const expected = process.env.BRIDGE_SECRET;
    if (expected && args.bridgeSecret !== expected) {
      throw new Error("Unauthorized");
    }
    const lim = Math.min(args.limit ?? 50, 200);
    const rows = await ctx.db.query("logs").collect();
    rows.sort((a, b) => b.createdAt - a.createdAt);
    return rows.slice(0, lim).map((r) => ({
      body: r.body,
      createdAt: r.createdAt,
    }));
  },
});
