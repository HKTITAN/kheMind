import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Full-text search over stored chunks (Convex search index).
 * No embedding API — Poke/agents do deeper reasoning on returned snippets.
 */
export const queryBrain = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
    bridgeSecret: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const expected = process.env.BRIDGE_SECRET;
    if (expected && args.bridgeSecret !== expected) {
      throw new Error("Unauthorized");
    }
    const q = args.query.trim();
    if (!q) {
      return [];
    }
    const lim = Math.min(args.limit ?? 8, 50);
    const results = await ctx.db
      .query("chunks")
      .withSearchIndex("search_text", (sq) => sq.search("text", q))
      .take(lim);
    return results.map((r) => ({
      path: r.path,
      text: r.text,
    }));
  },
});
