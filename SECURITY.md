# Security

## Secrets

| Secret              | Where to set                         | Purpose                                      |
|---------------------|--------------------------------------|----------------------------------------------|
| `INGEST_SECRET`     | Convex + Vercel + GitHub Actions     | Authorize ingest mutation + `/api/ingest`    |
| `BRIDGE_SECRET`     | Convex + Vercel                      | Server-to-server calls from MCP to Convex    |
| `MCP_BEARER_TOKEN`  | Vercel (required in production)      | Bearer auth for `/api/mcp` on Vercel / `NODE_ENV=production` |
| `POKE_API_KEY`      | Vercel only                          | Optional: MCP tool `send_to_poke` → [Poke inbound API](https://poke.com/docs/api) (V2 key from Kitchen) |

No embedding or LLM API keys are required for core vault search — chunks are plain text; search uses Convex **full-text** index.

Never commit real values. Use `.env.example` as a template.

The **`/configure`** and **`/setup`** pages can **generate** env text **only in the browser** — they do not POST secrets to kheMind. **Primary onboarding** should use [official integrations](https://vercel.com/integrations/convex) and the Poke integrations UI where possible; see [docs/ZERO_PASTE.md](./docs/ZERO_PASTE.md).

## Why checks stay on the server

Authorization for `/api/mcp`, `/api/ingest`, and Convex cannot rely on browser-only secrets: anything in client-side JavaScript or `NEXT_PUBLIC_*` is public. Secrets must be validated on the server.

## Production MCP

When `VERCEL=1` or `NODE_ENV=production`, `/api/mcp` **requires** `MCP_BEARER_TOKEN` (no permissive “dev” bypass). The MCP handler also **requires** `BRIDGE_SECRET` in that mode so the Convex bridge is not left open.

## Threat notes

- **Full MCP access** with a single bearer token grants read/write as exposed by tools. Rotate `MCP_BEARER_TOKEN` if leaked.
- **Convex** URLs are public; `BRIDGE_SECRET` reduces anonymous abuse — set `BRIDGE_SECRET` in production.
- **`INGEST_SECRET`** in GitHub Actions must be a **repo secret**, not plaintext in workflow files.
- **`POKE_API_KEY`** can send messages into a Poke account — revoke in Kitchen if leaked.

## Public forks

Do not commit private exports (e.g. social network dumps) to public repositories.
