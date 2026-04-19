import { query } from "./_generated/server";
import { v } from "convex/values";

/** Public query for MCP list_notes */
export const listRecent = query({
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
    const all = await ctx.db.query("chunks").collect();
    const byPath = new Map<string, (typeof all)[0]>();
    for (const row of all) {
      const prev = byPath.get(row.path);
      if (!prev || row.updatedAt > prev.updatedAt) {
        byPath.set(row.path, row);
      }
    }
    const unique = [...byPath.values()].sort(
      (a, b) => b.updatedAt - a.updatedAt,
    );
    return unique.slice(0, lim).map((r) => ({
      path: r.path,
      preview: r.text.slice(0, 240),
      updatedAt: r.updatedAt,
    }));
  },
});
