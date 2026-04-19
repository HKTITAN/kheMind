---
title: Second brain vs RAG
type: concept
status: stable
created: 2026-04-19
last_updated: 2026-04-19
tags: [knowledge-management, llm]
related_concepts: [compounding-systems]
---

# Second brain vs RAG

## One-line definition

- **Classic RAG:** at question time, retrieve chunks from a corpus and generate an answer—**little persistent synthesis** between queries.
- **Second brain / LLM wiki:** the system **maintains** interlinked notes (contradictions, summaries, entity pages) so each question **builds on compiled knowledge**, not only raw retrieval.

## When each fits

| Situation | Favor |
|-----------|--------|
| Stable corpus, ad-hoc Q&A | RAG-style retrieval can suffice |
| Long-horizon learning, evolving thesis | Persistent wiki + ingest + lint |

## Links

- [[compounding-systems]]
- [Karpathy LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
