---
title: "ADR-0001: Markdown wiki as source of truth"
type: decision
status: accepted
date: 2026-04-19
deciders: [self]
tags: [khemind, adr]
---

# ADR-0001: Markdown wiki as source of truth

## Context

We need a human-readable, git-friendly layer for knowledge that agents can also search (Convex full-text). Alternatives: database-only notes, proprietary tools, or raw folders without structure.

## Decision

Use **`wiki/`** as the canonical compiled layer with **templates**, **MOCs**, and **ingest** into Convex for search.

## Consequences

**Positive:** portable, diffable, forkable; works with Obsidian, VS Code, or plain Git.

**Negative:** must discipline naming and lint; no built-in permissions per page (use private repo or omit secrets).

## Alternatives considered

1. Notion-only — rejected (export friction, weaker git workflow for some users).
2. Wiki in DB — rejected for this template (ops complexity).

## Links

- [[example-project]]
- [Vault conventions](../meta/vault-conventions.md)
