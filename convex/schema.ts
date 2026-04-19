import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chunks: defineTable({
    path: v.string(),
    text: v.string(),
    updatedAt: v.number(),
  })
    .index("by_path", ["path"])
    .searchIndex("search_text", {
      searchField: "text",
      filterFields: ["path"],
    }),

  logs: defineTable({
    body: v.string(),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]),
});
