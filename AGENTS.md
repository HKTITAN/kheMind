# Agent instructions — kheMind

## Project intent

**kheMind** is an open **markdown vault** template: **GitHub** holds note files; **Convex** stores **text chunks** and **full-text search** (no embedding API in the default stack); **Vercel** hosts **Streamable HTTP MCP** (`query_brain`, `list_notes`, `append_log`, optional `send_to_poke`) for Poke, Cursor, and other clients. Agents interpret retrieved text semantically.

Prefer this cloud path over local-only brain CLIs unless the user explicitly opts in.

## Skills (optional)

Teams may install [skills.sh](https://skills.sh/docs) bundles (Convex, Vercel, GitHub). Re-read relevant **SKILL.md** before large schema or MCP changes.

## Secrets

- **Convex:** dashboard + deploy keys for CI; `BRIDGE_SECRET` and `INGEST_SECRET` must match Vercel
- **Vercel:** `MCP_BEARER_TOKEN` (required in production), `INGEST_SECRET`, `BRIDGE_SECRET`, optional `POKE_API_KEY`, optional `CONVEX_DEPLOY_KEY` for `build:vercel` — never commit
- **No** OpenAI/embedding keys required for core search
- On Vercel (`VERCEL=1`) or `NODE_ENV=production`, `/api/mcp` does not allow unauthenticated access; `BRIDGE_SECRET` must be set for MCP → Convex calls

## Layout

- `wiki/` — curated markdown: [wiki/STRUCTURE.md](./wiki/STRUCTURE.md), [wiki/TEMPLATES.md](./wiki/TEMPLATES.md), [wiki/_index.md](./wiki/_index.md); includes `meta/`, `concepts/`, `people/organizations/`, `projects/`, `areas/`, `playbooks/`, `references/{books,papers,articles,courses}/`, `journal/YYYY/`, `meetings/`, `decisions/`, `resources/tools/`, `questions/`, `reviews/`, `moc/`
- `templates/` — copy-paste starters ([templates/README.md](./templates/README.md))
- `sources/` — user exports (privacy: avoid committing PII in public repos)
- `data/`, `raw/`, `log/` — optional
- `docs/` — architecture notes ([ZERO_PASTE.md](./docs/ZERO_PASTE.md) onboarding strategy)

## Public UI

- `/` — landing (Deploy to Vercel, links to setup)
- `/setup` — Connect-first onboarding wizard
- `/configure` — same wizard (legacy path); **client-only** env generator in the advanced block (no secrets sent to the app server)
