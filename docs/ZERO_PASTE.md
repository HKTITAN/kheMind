# Zero-paste onboarding (strategy)

kheMind aims for a **click-first** setup: Deploy → connect services → use the vault, without editing `.env` files locally.

## What can be zero-paste today

1. **Convex + Vercel** — Install the [Convex integration from the Vercel Marketplace](https://vercel.com/integrations/convex) on your Vercel project, then follow [Convex: Using Convex with Vercel](https://docs.convex.dev/production/hosting/vercel). The integration wires deployment URL and deploy key into your project so you do not hand-copy `NEXT_PUBLIC_CONVEX_URL` from the Convex dashboard in the common path.
2. **Poke MCP** — Use [poke.com/integrations/new](https://poke.com/integrations/new) in the browser: set the MCP URL to `https://<your-deployment>.vercel.app/api/mcp` and the bearer token to match `MCP_BEARER_TOKEN` (same value as `poke mcp add … --api-key` per the [poke npm](https://www.npmjs.com/package/poke) docs).

## What still uses secrets (server-side)

`/api/mcp`, `/api/ingest`, and Convex **must** validate secrets on the server. Until a **custom Vercel Integration** (OAuth + [Vercel REST API](https://vercel.com/docs/rest-api) to create env vars) exists, values such as `BRIDGE_SECRET`, `INGEST_SECRET`, and `MCP_BEARER_TOKEN` are set in the Vercel and Convex dashboards—or generated on **`/configure`** and pasted once.

## GitHub Actions

Repository secrets (`VERCEL_INGEST_URL`, `INGEST_SECRET`) are set in GitHub → Settings → Secrets. Full automation without opening GitHub would require a GitHub App; that is out of scope for the default template.

## Future (phase 2)

A **kheMind Vercel Integration** could OAuth to Vercel and POST project environment variables so bridge/ingest/MCP tokens never pass through the clipboard.
