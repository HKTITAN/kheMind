# Karpathy — “LLM Wiki” pattern

**Source:** [LLM Wiki (gist)](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — Andrej Karpathy, idea file for agents.

## Core insight

- **Not plain RAG:** retrieval-only systems **re-derive** answers each time; there’s little **accumulation**.
- **Instead:** an LLM **incrementally builds and maintains a persistent wiki** — interlinked markdown between you and raw sources.
- On new material: read → extract → **integrate** (entity pages, summaries, **flag contradictions**). The wiki is a **compounding artifact**; cross-refs and synthesis are **already there** for the next question.

## Roles

- **Human:** curate sources, explore, ask good questions, interpret meaning.
- **LLM:** summarizing, cross-referencing, filing, consistency — “the bookkeeping.”

## Three layers

1. **Raw sources** — immutable collection (articles, papers, images, data).
2. **Wiki** — LLM-owned markdown: entities, concepts, synthesis; you **read**, it **writes**.
3. **Schema** — e.g. `AGENTS.md` / project rules: structure, conventions, ingest & maintenance workflows.

## Operations

- **Ingest** — drop source → process → update many pages + index + log entry.
- **Query** — answer from wiki + citations; **file good answers back** so exploration compounds.
- **Lint** — contradictions, stale claims, orphans, missing pages, gaps.

## Navigation aids

- **`index.md`** — catalog of pages with short summaries (moderate scale without heavy RAG).
- **`log.md`** — append-only timeline; consistent prefixes help `grep`/tail.

## Optional tooling (from gist)

- Obsidian as viewer; **Web Clipper**; local images under `raw/assets/`; graph view; **Marp**, **Dataview**; **qmd** when search outgrows the index.

## Relation to Memex

Associative trails between documents; **maintenance** was the hard part — LLMs lower that cost.
