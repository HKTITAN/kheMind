# Agent instructions — kheMind

## Project intent

**kheMind** is an open **markdown vault** template: **GitHub** holds note files; **Convex** stores **text chunks** and **full-text search** (no embedding API in the default stack); **Vercel** hosts **Streamable HTTP MCP** (`query_brain`, `list_notes`, `append_log`, optional `send_to_poke`) for Poke, Cursor, and other clients. Agents interpret retrieved text semantically.

Prefer this cloud path over local-only brain CLIs unless the user explicitly opts in.

## Skills (optional)

Teams may install [skills.sh](https://skills.sh/docs) bundles (Convex, Vercel, GitHub). Re-read relevant **SKILL.md** before large schema or MCP changes.

## Secrets

- **Convex:** dashboard + deploy keys for CI
- **Vercel:** `MCP_BEARER_TOKEN`, `INGEST_SECRET`, `BRIDGE_SECRET`, optional `POKE_API_KEY` — never commit
- **No** OpenAI/embedding keys required for core search

## Layout

- `wiki/` — curated markdown: [wiki/STRUCTURE.md](./wiki/STRUCTURE.md), [wiki/TEMPLATES.md](./wiki/TEMPLATES.md), [wiki/_index.md](./wiki/_index.md); includes `meta/`, `concepts/`, `people/organizations/`, `projects/`, `areas/`, `playbooks/`, `references/{books,papers,articles,courses}/`, `journal/YYYY/`, `meetings/`, `decisions/`, `resources/tools/`, `questions/`, `reviews/`, `moc/`
- `templates/` — copy-paste starters ([templates/README.md](./templates/README.md))
- `sources/` — user exports (privacy: avoid committing PII in public repos)
- `data/`, `raw/`, `log/` — optional
- `docs/` — architecture notes

## Public UI

- `/` — landing
- `/configure` — **client-only** env generator (no secrets sent to the app server)
