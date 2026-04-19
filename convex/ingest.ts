import { mutation } from "./_generated/server";
import { v } from "convex/values";

function chunkText(text: string, maxLen = 4000): string[] {
  const parts: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let buf = "";
  for (const p of paragraphs) {
    if ((buf + "\n\n" + p).length > maxLen && buf) {
      parts.push(buf.trim());
      buf = p;
    } else {
      buf = buf ? buf + "\n\n" + p : p;
    }
  }
  if (buf.trim()) parts.push(buf.trim());
  return parts.length ? parts : [text.slice(0, maxLen)];
}

/**
 * Store markdown/CSV as text chunks only. No API keys — embeddings/LLM work stays in agents (e.g. Poke).
 */
export const ingestFiles = mutation({
  args: {
    secret: v.string(),
    files: v.array(v.object({ path: v.string(), content: v.string() })),
  },
  handler: async (ctx, args) => {
    if (args.secret !== process.env.INGEST_SECRET) {
      throw new Error("Unauthorized ingest");
    }
    const now = Date.now();
    const paths = [...new Set(args.files.map((f) => f.path))];

    for (const path of paths) {
      const existing = await ctx.db
        .query("chunks")
        .withIndex("by_path", (q) => q.eq("path", path))
        .collect();
      for (const row of existing) {
        await ctx.db.delete(row._id);
      }
    }

    let inserted = 0;
    for (const file of args.files) {
      for (const piece of chunkText(file.content)) {
        await ctx.db.insert("chunks", {
          path: file.path,
          text: piece,
          updatedAt: now,
        });
        inserted += 1;
      }
    }

    return {
      inserted,
      pathsIndexed: paths.length,
      chunkCount: inserted,
    };
  },
});
