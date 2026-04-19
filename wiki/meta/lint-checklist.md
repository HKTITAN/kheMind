# Wiki lint checklist

Run periodically (monthly or after big ingests). Agents can automate parts of this with `query_brain` + file reads.

## Structure

- [ ] **Orphans:** pages with zero inbound links from `_index.md` or any MOC (consider linking or deleting).
- [ ] **Broken paths:** links to `./missing-file.md` (grep or Obsidian broken-link plugin).
- [ ] **Duplicate titles:** two files covering the same entity—merge or disambiguate filenames.

## Freshness

- [ ] **Stale `last_updated`:** important pages not touched in 6+ months—re-read or mark `status: deprecated`.
- [ ] **Projects:** `active` projects with empty “Current focus” — update or set `paused`.

## Consistency

- [ ] **ADRs:** new big decisions without an entry in `decisions/` — add ADR or document why not.
- [ ] **References:** books/papers marked `read` without a “Key ideas” section — fill or downgrade status.

## Search / index

- [ ] **`_index.md`:** new top-level pages linked from at least one section.
- [ ] **MOCs:** each major topic has a hub in `moc/` or a section in `_index.md`.

## Convex / ingest

- [ ] Files you care about are under paths included in `scripts/build-ingest-payload.cjs` (e.g. `wiki/`).
- [ ] CI secrets still valid if using GitHub Actions ingest.
