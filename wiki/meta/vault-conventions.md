# Vault conventions (kheMind)

These rules keep the wiki **consistent** for you and for agents that ingest or lint it.

## Canonical pages

- **One page per entity** (one person, one company, one project) unless you intentionally split (e.g. `project-x-research.md` as a spin-off).
- Prefer **stable filenames** (`kebab-case.md`); change filename rarely—update inbound links when you do.

## Dates

- ISO **`YYYY-MM-DD`** in frontmatter and journal filenames.
- **`last_updated`** when you materially edit a page (helps lint for staleness).

## Status fields

Use the same vocabulary as in [`templates/`](../../templates/README.md):

- Concepts: `seed` → `developing` → `stable` → `deprecated`
- Projects: `idea` → `active` → `paused` → `shipped` → `archived`
- Questions: `open` → `investigating` → `answered` → `parked`

## Tags

- Lowercase, hyphenated: `knowledge-management`, `llm`, `career`.
- Optional: namespace-like `area/work`, `ref/book`.

## Links

- **Wikilinks:** `[[Concept]]` for same-vault pages (viewer-dependent rendering).
- **Markdown:** `[text](./path.md)` always works in Git and search.

## Sensitive content

- Do not put secrets, tokens, or private IDs in `wiki/` if the repo is public.
- For exports with PII, use `sources/` or a private submodule—see repo root `sources/README.md`.
