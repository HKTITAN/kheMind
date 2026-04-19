# Wiki structure (kheMind)

This tree merges **Karpathy’s “LLM Wiki” pattern** ([gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)) with **operational / content-system** notes inspired by [@DeRonin_](https://x.com/DeRonin_/status/2042604279077237170) and fits the existing **Convex + MCP** repo layout.

## Three layers (Karpathy)

| Layer | In this repo | Role |
|-------|----------------|------|
| **Raw sources** | `raw/`, `sources/`, `data/` | Immutable inputs; you curate; agents read, don’t rewrite originals. |
| **Wiki** | `wiki/` | LLM-maintained markdown: entities, concepts, projects, playbooks, meta. |
| **Schema / agent rules** | `AGENTS.md`, `.cursor/rules`, ingest + MCP | How agents ingest, search (`query_brain`), and log work. |

## Directory tree

```text
wiki/
  STRUCTURE.md          ← this file
  _index.md             ← content catalog (expand as pages grow)
  meta/                 ← pattern docs, vault philosophy, source citations
  concepts/             ← abstract topics (frameworks, mental models)
  people/               ← people & profiles
  projects/             ← initiatives, products, games, workstreams
  playbooks/            ← repeatable workflows (content ops, prompts, pipelines)
```

**Also at repo root (not under `wiki/`):**

- `log/` — chronological logs; Karpathy-style **`log.md`** pattern can be a single file here or split by month.
- `templates/` — note templates.
- `docs/` — integration notes (Poke, insights).

## Operations (Karpathy names)

| Op | Meaning here |
|----|----------------|
| **Ingest** | Push markdown into Convex (`/api/ingest`, GitHub Action); agents then **compile** insights into `wiki/` pages. |
| **Query** | Ask questions; use MCP `query_brain` + read `wiki/`; file good answers back as new pages. |
| **Lint** | Periodic pass: orphans, stale claims, missing links — documented in `meta/`. |

## Index + log

- **`wiki/_index.md`** — category-oriented catalog (entities, concepts, projects, playbooks). Update when you add important pages.
- **Chronological log** — append-only timeline of ingests and maintenance passes (`log/` or `log.md`).

## What to put where

| Kind of content | Place |
|-----------------|--------|
| “Who is X?” | `wiki/people/` |
| “What is Y (idea)?” | `wiki/concepts/` |
| “Project Z roadmap / notes” | `wiki/projects/` |
| Prompt packs, SOPs, content pipelines | `wiki/playbooks/` |
| Why this vault exists, citations | `wiki/meta/` |

Cross-link with `[[wikilinks]]` or markdown links; search still works on plain text in Convex.
