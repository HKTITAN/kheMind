# Integration notes (kheMind)

Prior art and related tools referenced by this template. Full citations: [CREDITS.md](../CREDITS.md).

## [kothari-nikunj/llm-wiki](https://github.com/kothari-nikunj/llm-wiki)

Three layers: raw `data/` → mechanical ingest → compiled `wiki/` with `[[wikilinks]]`, index/backlinks, YAML frontmatter. kheMind uses **Convex + MCP** instead of a bundled Python absorb pipeline; folder ideas align with `wiki/`, `sources/`, `data/`.

## [Profilist/pokestrator](https://github.com/Profilist/pokestrator)

FastMCP `orchestrate` + Postgres + Poke webhooks — heavier than kheMind’s vault MCP. Useful as a **reference** if you add orchestration elsewhere.

## [`poke` (npm)](https://www.npmjs.com/package/poke)

Official toolkit: `poke mcp add`, `poke tunnel` for local MCP against `/api/mcp`.

## [Poke API](https://poke.com/docs/api)

`POST https://poke.com/api/v1/inbound/api-message` with V2 Kitchen key — implemented as MCP `send_to_poke` when `POKE_API_KEY` is set on the server.

## Karpathy gist & structure

See [wiki/meta/karpathy-llm-wiki.md](../wiki/meta/karpathy-llm-wiki.md) and [wiki/STRUCTURE.md](../wiki/STRUCTURE.md).
