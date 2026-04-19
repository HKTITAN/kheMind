# Zero-paste onboarding (strategy)

kheMind aims for a **click-first** setup: Deploy → connect services → use the vault, without editing `.env` files locally.

## What can be zero-paste today

1. **Convex + Vercel** — Install the [Convex integration from the Vercel Marketplace](https://vercel.com/integrations/convex) on your Vercel project, then follow [Convex: Using Convex with Vercel](https://docs.convex.dev/production/hosting/vercel). The integration wires deployment URL and deploy key into your project so you do not hand-copy `NEXT_PUBLIC_CONVEX_URL` from the Convex dashboard in the common path.
2. **Poke MCP** — Use [poke.com/integrations/new](https://poke.com/integrations/new) in the browser: set the MCP URL to `https://<your-deployment>.vercel.app/api/mcp` and the bearer token to match `MCP_BEARER_TOKEN` (same value as `poke mcp add … --api-key` per the [poke npm](https://www.npmjs.com/package/poke) docs). The setup wizard links with an optional `mcpUrl` query parameter (best-effort; Poke may ignore it).

## What still uses secrets (server-side)

`/api/mcp`, `/api/ingest`, and Convex **must** validate secrets on the server. Until a **custom Vercel Integration** (OAuth + [Vercel REST API](https://vercel.com/docs/rest-api) to create env vars) exists, values such as `BRIDGE_SECRET`, `INGEST_SECRET`, and `MCP_BEARER_TOKEN` are set in the Vercel and Convex dashboards—or generated on **`/configure`** / **`/setup`** (Advanced) and pasted once.

## GitHub Actions

Repository secrets (`VERCEL_INGEST_URL`, `INGEST_SECRET`) are set in GitHub → Settings → Secrets. Full automation without opening GitHub would require a GitHub App; that is out of scope for the default template.

## Phase 2 — kheMind Vercel Integration (design)

**Goal:** OAuth to Vercel so kheMind can **POST project environment variables** after the user approves, eliminating clipboard paste for app-owned secrets.

**Sketch:**

1. Register an integration in the [Vercel Integration Console](https://vercel.com/docs/integrations/create-integration) with redirect URIs pointing at this app (e.g. `https://<deployment>/api/integrations/vercel/callback`).
2. **Authorize** — User clicks “Connect Vercel” on `/setup`; redirect to Vercel OAuth `authorize` with `client_id`, `scope` including env/project access per [Vercel API integrations](https://vercel.com/docs/rest-api/vercel-api-integrations).
3. **Callback** — Exchange `code` for an access token server-side; never expose the token to the browser beyond the session needed to call the API once.
4. **Inject env** — Server calls [Vercel REST API](https://vercel.com/docs/rest-api/endpoints#create-a-new-environment-variable) (or batch) to set `BRIDGE_SECRET`, `INGEST_SECRET`, `MCP_BEARER_TOKEN`, optional `POKE_API_KEY`, generated server-side with `crypto`.
5. **Convex** — Still requires Convex dashboard or Convex’s own OAuth if they expose env APIs to integrations; today users mirror bridge/ingest into Convex manually or via Convex CLI in CI.

**Privacy:** Prefer **env injection only** — do not persist Vercel OAuth tokens after the setup flow unless the product needs ongoing API access.

## Future

- **Poke / GitHub OAuth** when those platforms expose documented third-party flows for API keys or repo secrets.
