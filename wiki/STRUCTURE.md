# Wiki structure (kheMind)

This tree follows **Karpathy’s LLM Wiki** idea ([gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)): raw sources stay outside; **`wiki/`** is the compiled, interlinked layer. See also [TEMPLATES.md](./TEMPLATES.md) for which template to use where.

## Three layers (Karpathy)

| Layer | In this repo | Role |
|-------|----------------|------|
| **Raw sources** | `raw/`, `sources/`, `data/` | Immutable inputs; you curate; agents read originals. |
| **Wiki** | `wiki/` (this tree) | Markdown pages: concepts, people, projects, references, journal, … |
| **Schema / agents** | `AGENTS.md`, ingest, MCP | How agents search (`query_brain`) and maintain pages. |

## Full directory tree

```text
wiki/
  STRUCTURE.md          ← this file
  TEMPLATES.md          ← folder → template mapping
  _index.md             ← master catalog
  README.md             ← onboarding blurb
  meta/                 ← vault ops, citations, lint
  concepts/             ← ideas, models, definitions
  people/
    organizations/      ← companies, teams, communities
  projects/             ← bounded initiatives
  areas/                ← ongoing responsibilities (PARA)
  playbooks/            ← SOPs, prompts, pipelines
  references/
    books/
    papers/
    articles/
    courses/
  journal/
    YYYY/               ← one folder per year
  meetings/             ← notes from conversations
  decisions/            ← ADRs & decision log
  resources/
    tools/              ← apps, CLI, stack
  questions/            ← research / open questions
  reviews/              ← weekly, quarterly
  moc/                  ← maps of content (hub pages)
```

**Outside `wiki/` (repo root):**

- `log/` — append-only operational log (optional `log.md` style).
- `templates/` — **copy-paste starters** for every note type ([templates/README.md](../templates/README.md)).
- `docs/` — kheMind integration docs (Convex, Poke).

## Operations

| Op | Meaning |
|----|---------|
| **Ingest** | CI / `POST /api/ingest` pushes file text into Convex for search. |
| **Query** | MCP `query_brain` + reading `wiki/` in your editor. |
| **Lint** | Orphans, stale claims, missing links — [meta/lint-checklist.md](./meta/lint-checklist.md). |

## PARA-style mapping (optional)

| PARA | Primary folders here |
|------|---------------------|
| **Projects** | `projects/` |
| **Areas** | `areas/` |
| **Resources** | `references/`, `resources/` |
| **Archive** | use `status: archived` in frontmatter or `projects/archived/` if you prefer |

## What goes where (one glance)

| Question | Folder |
|----------|--------|
| Who? | `people/`, `people/organizations/` |
| What idea? | `concepts/` |
| What initiative? | `projects/` |
| What long-term hat? | `areas/` |
| What procedure? | `playbooks/` |
| What did I read/watch? | `references/*` |
| What happened today? | `journal/YYYY/` |
| What was said in a room? | `meetings/` |
| What did we decide? | `decisions/` |
| What tool or link list? | `resources/` |
| What don’t I know yet? | `questions/` |
| How was my week/quarter? | `reviews/` |
| Hub page for a topic? | `moc/` |
| How does my vault work? | `meta/` |

Cross-link with `[[wikilinks]]` or markdown links; Convex search indexes plain text.
