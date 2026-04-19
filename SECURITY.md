# Security

## Secrets

| Secret              | Where to set                         | Purpose                                      |
|---------------------|--------------------------------------|----------------------------------------------|
| `INGEST_SECRET`     | Convex + Vercel + GitHub Actions     | Authorize ingest mutation + `/api/ingest`    |
| `BRIDGE_SECRET`     | Convex + Vercel                      | Server-to-server calls from MCP to Convex    |
| `MCP_BEARER_TOKEN`  | Vercel (required in production)      | Bearer auth for `/api/mcp` on Vercel / `NODE_ENV=production` |
| `POKE_API_KEY`      | Vercel only                          | Optional: MCP tool `send_to_poke` → [Poke inbound API](https://poke.com/docs/api) (V2 key from Kitchen) |
| `VAULT_VIEW_PASSWORD` | Vercel optional                    | With `VAULT_VIEW_COOKIE_TOKEN`, protects `/garden` (Quartz HTML); login at `/vault/login` |
| `VAULT_VIEW_COOKIE_TOKEN` | Vercel optional                | Long random string; must match httpOnly cookie after successful login |

No embedding or LLM API keys are required for core vault search — chunks are plain text; search uses Convex **full-text** index.

If **`VAULT_VIEW_*`** is not set, **`/garden` is world-readable** (static files under `public/garden`). Treat `VAULT_VIEW_COOKIE_TOKEN` like a session secret.

Never commit real values. Use `.env.example` as a template.

The **`/configure`** and **`/setup`** pages **generate** env text in the browser and can **authorize** each integration via **`POST /api/setup/verify-services`** on **your** deployment: that route uses your submitted values only for outbound checks to Convex and your own `deploymentBaseUrl` (ingest, MCP `initialize`, optional vault login). It does not log secrets or send them to third parties. **Primary onboarding** should still use [official integrations](https://vercel.com/integrations/convex) and the Poke integrations UI where possible; see [docs/ZERO_PASTE.md](./docs/ZERO_PASTE.md).

## Why checks stay on the server

Authorization for `/api/mcp`, `/api/ingest`, and Convex cannot rely on browser-only secrets: anything in client-side JavaScript or `NEXT_PUBLIC_*` is public. Secrets must be validated on the server.

## Production MCP

When `VERCEL=1` or `NODE_ENV=production`, `/api/mcp` **requires** `MCP_BEARER_TOKEN` (no permissive “dev” bypass). The MCP handler also **requires** `BRIDGE_SECRET` in that mode so the Convex bridge is not left open.

**Poke CLI parity:** The same secret is used as `poke mcp add <url> --name "kheMind" --api-key <MCP_BEARER_TOKEN>` ([poke npm](https://www.npmjs.com/package/poke)) — that is the `Authorization: Bearer` value the MCP handler expects in production.

## Threat notes

- **Full MCP access** with a single bearer token grants read/write as exposed by tools. Rotate `MCP_BEARER_TOKEN` if leaked.
- **Convex** URLs are public; `BRIDGE_SECRET` reduces anonymous abuse — set `BRIDGE_SECRET` in production.
- **`INGEST_SECRET`** in GitHub Actions must be a **repo secret**, not plaintext in workflow files.
- **`POKE_API_KEY`** can send messages into a Poke account — revoke in Kitchen if leaked.

## Public forks

Do not commit private exports (e.g. social network dumps) to public repositories.
