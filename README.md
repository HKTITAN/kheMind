# kheMind

**kheMind** is an open-source **personal knowledge vault** template: **GitHub** holds markdown (`wiki/`, `sources/`, …), **[Convex](https://convex.dev)** stores **text chunks** with **full-text search**, and **[Vercel](https://vercel.com)** exposes a **Streamable HTTP [MCP](https://modelcontextprotocol.io/)** endpoint (`/api/mcp`) for agents like **[Poke](https://poke.com/)**, Cursor, and others.

There is **no embedding / LLM API key** in the backend by default — ingestion is **text-only**; agents do semantic reasoning on retrieved snippets.

**Live UI:** deploy this app and open `/` (landing) and **`/configure`** — a **browser-only** wizard that generates `.env` snippets for **your** Convex, Vercel, GitHub Actions, and Poke keys. Nothing is uploaded to kheMind servers.

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
9. [Wiki layout](#wiki-layout)
10. [Security](#security)
11. [Credits](#credits)
12. [License](#license)

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

---

## Quick start

1. **Fork or clone** this repository.
2. **Convex** — create a project, run `npx convex dev`, set **`INGEST_SECRET`** and **`BRIDGE_SECRET`** in the Convex dashboard (same values you will use on Vercel).
3. **Vercel** — import the repo and set env vars (see below). After deploy, open **`/configure`** on your site (browser-only env helper) or copy from `.env.example`.
4. **GitHub Actions** — add repository secrets `VERCEL_INGEST_URL` and `INGEST_SECRET` (see [workflow](.github/workflows/reindex.yml)).
5. **MCP client** — point Cursor or Poke at `https://<your-deployment>.vercel.app/api/mcp` with `Authorization: Bearer <MCP_BEARER_TOKEN>`.

---

## Environment variables

| Variable | Where | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Vercel | Convex deployment URL |
| `CONVEX_DEPLOYMENT` | optional | Convex deployment name |
| `BRIDGE_SECRET` | Convex + Vercel | MCP → Convex server calls |
| `INGEST_SECRET` | Convex + Vercel + GitHub | `POST /api/ingest` + `ingestFiles` mutation |
| `MCP_BEARER_TOKEN` | Vercel | Protect `/api/mcp` in production (optional in local dev) |
| `POKE_API_KEY` | Vercel optional | Kitchen V2 key for `send_to_poke` |
| `NEXT_PUBLIC_GITHUB_REPO_URL` | Vercel optional | Shown on landing “View on GitHub” button |

Copy `.env.example` to `.env.local` for local dev.

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
3. **CLI (optional):** [`poke` npm](https://www.npmjs.com/package/poke) — e.g. `poke mcp add <url>`, `poke tunnel` for local MCP.

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

Open [http://localhost:3000](http://localhost:3000) and [/configure](http://localhost:3000/configure).

---

## Deploy to Vercel

**CLI (example — project name `khemind` → `khemind.vercel.app`):**

```bash
npm i -g vercel
vercel link   # create or link project "khemind"
vercel env pull .env.local   # optional
vercel --prod
```

Set all env vars in the Vercel project dashboard. Assign the default `*.vercel.app` hostname **khemind** in Project → Settings → Domains if you want `https://khemind.vercel.app`.

**Configure page:** after deploy, visit `https://khemind.vercel.app/configure` (or your URL) to generate env blocks in the browser.

---

## Wiki layout

The **`wiki/`** tree is documented in [wiki/STRUCTURE.md](wiki/STRUCTURE.md) (full folder map), [wiki/TEMPLATES.md](wiki/TEMPLATES.md) (which template to use), and [wiki/_index.md](wiki/_index.md) (catalog). Copy-paste starters live in [`templates/`](templates/README.md) (concepts, people, projects, references, journal, meetings, ADRs, reviews, MOCs, etc.).

| Path | Role |
|------|------|
| `wiki/` | Curated markdown: `meta/`, `concepts/`, `people/` (+ `organizations/`), `projects/`, `areas/`, `playbooks/`, `references/{books,papers,articles,courses}/`, `journal/YYYY/`, `meetings/`, `decisions/`, `resources/tools/`, `questions/`, `reviews/`, `moc/` |
| `templates/` | One template per note type ([README](templates/README.md)) |
| `sources/` | Your exports (do not commit private data in public forks) |
| `data/`, `raw/`, `log/` | Optional drops and logs |
| `docs/` | Integration notes ([INSIGHTS.md](docs/INSIGHTS.md)) |

---

## Security

See [SECURITY.md](./SECURITY.md). Treat `MCP_BEARER_TOKEN`, `INGEST_SECRET`, `BRIDGE_SECRET`, and `POKE_API_KEY` as secrets.

---

## Credits

See [CREDITS.md](./CREDITS.md) for papers, gists, repos, and services referenced by this template.

---

## License

[MIT](./LICENSE)
