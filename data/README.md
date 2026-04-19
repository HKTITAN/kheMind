# data/ (optional)

Aligned with [llm-wiki](https://github.com/kothari-nikunj/llm-wiki): drop **raw source files** here (writing, exports, markdown) before they are promoted to `wiki/` or `sources/`.

The ingest payload script ([`scripts/build-ingest-payload.cjs`](../scripts/build-ingest-payload.cjs)) includes `data/` when present so CI can index the same material.

Nothing here is required — the vault works with `wiki/` + `sources/` only.
