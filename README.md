# kheMind

**kheMind** is an open-source **personal knowledge vault** template: **GitHub** holds markdown (`wiki/`, `sources/`, …), **[Convex](https://convex.dev)** stores **text chunks** with **full-text search**, and **[Vercel](https://vercel.com)** exposes a **Streamable HTTP [MCP](https://modelcontextprotocol.io/)** endpoint (`/api/mcp`) for agents like **[Poke](https://poke.com/)**, Cursor, and others.

There is **no embedding / LLM API key** in the backend by default — ingestion is **text-only**; agents do semantic reasoning on retrieved snippets.

**Live UI:** deploy this app and open `/` (landing), **`/setup`** or **`/configure`** (guided env: auto-filled `QUARTZ_BASE_URL`, optional vault gate, and **Authorize** checks for Convex URL, ingest, MCP, and vault). See **[docs/ZERO_PASTE.md](./docs/ZERO_PASTE.md)** for the zero-paste onboarding strategy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHKTITAN%2FkheMind&env=NEXT_PUBLIC_CONVEX_URL%2CBRIDGE_SECRET%2CINGEST_SECRET%2CMCP_BEARER_TOKEN%2CQUARTZ_BASE_URL%2CVAULT_VIEW_PASSWORD%2CVAULT_VIEW_COOKIE_TOKEN&envLink=https%3A%2F%2Fgithub.com%2FHKTITAN%2FkheMind%23environment-variables&envDescription=Use%20the%20Convex%20Vercel%20integration%20for%20NEXT_PUBLIC_CONVEX_URL%20when%20possible.%20Generate%20BRIDGE_SECRET%2C%20INGEST_SECRET%2C%20and%20MCP_BEARER_TOKEN%20on%20your%20deployment%20at%20%2Fsetup%20(or%20paste%20from%20Advanced).%20QUARTZ_BASE_URL%20and%20VAULT_*%20are%20optional.)

The same URL is exported from [`lib/vercel-deploy-button.ts`](lib/vercel-deploy-button.ts) for the landing and setup pages.

---

## Table of contents

1. [Architecture](#architecture)
2. [Quick start](#quick-start)
3. [Environment variables](#environment-variables)
4. [MCP tools](#mcp-tools)
5. [Poke](#poke)
6. [GitHub Actions (ingest on push)](#github-actions-ingest-on-push)
7. [Local development](#local-development)
8. [Deploy to Vercel](#deploy-to-vercel)
9. [Convex + Vercel (production build)](#convex--vercel-production-build)
10. [Quartz vault viewer ( /garden )](#quartz-vault-viewer--garden)
11. [Wiki layout](#wiki-layout)
12. [Security](#security)
13. [Credits](#credits)
14. [License](#license)

---

## Architecture

```
GitHub repo (markdown) ──POST /api/ingest──► Vercel (Next.js)
                                                  │
                                                  ▼
                                            Convex (chunks + FTS)

Agents (Poke, Cursor, …) ──MCP HTTP /api/mcp──► query_brain, list_notes, …
```

- **Ingest:** CI or scripts POST JSON `{ files: [{ path, content }] }` with `INGEST_SECRET`.
- **Search:** MCP tool `query_brain` runs Convex full-text search over stored chunks.
- **Optional:** `POKE_API_KEY` on Vercel enables `send_to_poke` ([Poke inbound API](https://poke.com/docs/api)).
- **Production MCP:** On Vercel (`VERCEL=1`) or when `NODE_ENV=production`, `/api/mcp` requires `MCP_BEARER_TOKEN`, and `BRIDGE_SECRET` must be set on the server.

---

## Quick start

1. **Fork or clone** [github.com/HKTITAN/kheMind](https://github.com/HKTITAN/kheMind).
2. **Convex** — create a project, run `npx convex dev`, set **`INGEST_SECRET`** and **`BRIDGE_SECRET`** in the Convex dashboard (same values you will use on Vercel).
3. **Vercel** — use **Deploy with Vercel** above or import the repo; set env vars (see below). Prefer the **[Convex Vercel integration](https://vercel.com/integrations/convex)** to reduce manual copy ([Convex + Vercel](https://docs.convex.dev/production/hosting/vercel)).
4. **Setup UI** — open **`/setup`** on your deployment: paste Convex URL, generate secrets, copy env into Vercel/Convex, redeploy, then **Run full verification** to confirm ingest and MCP (and vault if enabled).
5. **GitHub Actions** — add repository secrets `VERCEL_INGEST_URL` and `INGEST_SECRET` (see [workflow](.github/workflows/reindex.yml)).
6. **MCP client** — point Cursor or Poke at `https://<your-deployment>.vercel.app/api/mcp` with `Authorization: Bearer <MCP_BEARER_TOKEN>` (same as `poke mcp add … --api-key`).

---

## Environment variables

| Variable | Where | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Vercel | Convex deployment URL |
| `CONVEX_DEPLOYMENT` | optional | Convex deployment name |
| `CONVEX_DEPLOY_KEY` | Vercel (CI/build) | [Production deploy](https://docs.convex.dev/production/hosting/vercel) — use with `npm run build:vercel` |
| `BRIDGE_SECRET` | Convex + Vercel | MCP → Convex server calls |
| `INGEST_SECRET` | Convex + Vercel + GitHub | `POST /api/ingest` + `ingestFiles` mutation |
| `MCP_BEARER_TOKEN` | Vercel | **Required** on Vercel/production for `/api/mcp` |
| `POKE_API_KEY` | Vercel optional | Kitchen V2 key for `send_to_poke` |
| `NEXT_PUBLIC_GITHUB_REPO_URL` | Vercel optional | Shown on landing “View on GitHub” (default: this repo) |
| `QUARTZ_BASE_URL` | optional | Quartz RSS/sitemap, e.g. `myapp.vercel.app/garden` (no `https://`) |
| `VAULT_VIEW_PASSWORD` | Vercel optional | With `VAULT_VIEW_COOKIE_TOKEN`, gates `/garden` behind `/vault/login` |
| `VAULT_VIEW_COOKIE_TOKEN` | Vercel optional | Long random value; httpOnly cookie must match after login |

Copy `.env.example` to `.env.local` for local dev.

---

## Quartz vault viewer (/garden)

Browse your vault as a static site using **[Quartz 4](https://quartz.jzhao.xyz/)** — search, graph, wikilinks, and the rest of the [Quartz feature set](https://quartz.jzhao.xyz/features).

1. **Install & build** (Node **≥ 22**): `cd vault-quartz && npm install && cd .. && npm run quartz:build`
2. **Open** `/garden` on your deployment (or run `npm run quartz:build` then `npm run dev` locally).
3. **Optional auth** — set `VAULT_VIEW_PASSWORD` and `VAULT_VIEW_COOKIE_TOKEN` in Vercel so visitors must sign in at `/vault/login` before `/garden`. If unset, `/garden` stays public.

Production build including Quartz: `npm run build:with-quartz`. See **[docs/QUARTZ.md](./docs/QUARTZ.md)** and **[vault-quartz/README.md](./vault-quartz/README.md)**.

---

## MCP tools

| Tool | Description |
|------|-------------|
| `query_brain` | Full-text search over indexed chunks |
| `list_notes` | Recent note paths / previews |
| `append_log` | Append a line to Convex logs |
| `send_to_poke` | POST a message via Poke inbound API (needs `POKE_API_KEY`) |

---

## Poke

1. **Kitchen** — create a **V2 API key** for [inbound API](https://poke.com/docs/api) if you use `send_to_poke`.
2. **MCP integration** — [poke.com/integrations/new](https://poke.com/integrations/new) — URL: `https://<your-app>.vercel.app/api/mcp`, header `Authorization: Bearer <MCP_BEARER_TOKEN>`.
3. **CLI (optional):** [`poke` npm](https://www.npmjs.com/package/poke) — e.g. `poke mcp add <url> --name "kheMind" --api-key <MCP_BEARER_TOKEN>`.

---

## GitHub Actions (ingest on push)

Workflow: [.github/workflows/reindex.yml](.github/workflows/reindex.yml).

**Secrets:**

- `VERCEL_INGEST_URL` — e.g. `https://your-project.vercel.app/api/ingest`
- `INGEST_SECRET` — same as Convex/Vercel
- `POKE_API_KEY` *(optional)* — ping Poke after ingest

---

## Local development

```bash
npm install
cp .env.example .env.local
# fill NEXT_PUBLIC_CONVEX_URL, BRIDGE_SECRET, INGEST_SECRET, MCP_BEARER_TOKEN

npx convex dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), [/setup](http://localhost:3000/setup), and [/configure](http://localhost:3000/configure).

---

## Deploy to Vercel

Use the **Deploy with Vercel** button at the top, or:

```bash
npm i -g vercel
vercel link
vercel env pull .env.local   # optional
vercel --prod
```

Set all env vars in the Vercel project dashboard. After deploy, open **`/setup`** on your site for guided Connect steps.

---

## Convex + Vercel (production build)

To deploy Convex functions as part of the Vercel build, set **`CONVEX_DEPLOY_KEY`** in Vercel (from Convex dashboard → Production → Deploy Key) and set the Vercel build command to:

```bash
npm run build:vercel
```

which runs `npx convex deploy --cmd "npm run build"`. See [Using Convex with Vercel](https://docs.convex.dev/production/hosting/vercel). For local development, keep using `npm run build` / `npm run dev` without the deploy key.

---

## Wiki layout

The **`wiki/`** tree is documented in [wiki/STRUCTURE.md](./wiki/STRUCTURE.md) (full folder map), [wiki/TEMPLATES.md](./wiki/TEMPLATES.md) (which template to use), and [wiki/_index.md](./wiki/_index.md) (catalog). Copy-paste starters live in [`templates/`](templates/README.md) (concepts, people, projects, references, journal, meetings, ADRs, reviews, MOCs, etc.).

| Path | Role |
|------|------|
| `wiki/` | Curated markdown: `meta/`, `concepts/`, `people/` (+ `organizations/`), `projects/`, `areas/`, `playbooks/`, `references/{books,papers,articles,courses}/`, `journal/YYYY/`, `meetings/`, `decisions/`, `resources/tools/`, `questions/`, `reviews/`, `moc/` |
| `templates/` | One template per note type ([README](templates/README.md)) |
| `sources/` | Your exports (do not commit private data in public forks) |
| `data/`, `raw/`, `log/` | Optional drops and logs |
| `docs/` | Integration notes ([INSIGHTS.md](docs/INSIGHTS.md), [ZERO_PASTE.md](docs/ZERO_PASTE.md), [QUARTZ.md](docs/QUARTZ.md)) |
| `vault-quartz/` | [Quartz 4](https://quartz.jzhao.xyz/) config + dependency; output → `public/garden` |

---

## Security

See [SECURITY.md](./SECURITY.md). Treat `MCP_BEARER_TOKEN`, `INGEST_SECRET`, `BRIDGE_SECRET`, and `POKE_API_KEY` as secrets.

---

## Credits

See [CREDITS.md](./CREDITS.md) for papers, gists, repos, and services referenced by this template.

---

## License

[MIT](./LICENSE)
