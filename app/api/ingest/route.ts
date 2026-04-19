import { ConvexHttpClient } from "convex/browser";
import { z } from "zod";
import { api } from "@/convex/_generated/api";

export const runtime = "nodejs";
export const maxDuration = 300;

const bodySchema = z.object({
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
    }),
  ),
});

/**
 * Cloud ingest: GitHub Actions (see `.github/workflows/reindex.yml`) POST here with
 * `Authorization: Bearer <INGEST_SECRET>` (same value as Convex `INGEST_SECRET`).
 * Set `VERCEL_INGEST_URL` + `INGEST_SECRET` as repository secrets, not in workflow YAML.
 */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  const secret = process.env.INGEST_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    return new Response("NEXT_PUBLIC_CONVEX_URL not configured", { status: 500 });
  }
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return new Response(parsed.error.message, { status: 400 });
  }
  const client = new ConvexHttpClient(url);
  const result = await client.mutation(api.ingest.ingestFiles, {
    secret,
    files: parsed.data.files,
  });
  return Response.json(result);
}
