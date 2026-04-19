# Credits and references

kheMind builds on ideas and tools from the community. If you extend this project, please keep attributions up to date.

## Patterns and write-ups

| Source | Contribution |
|--------|----------------|
| [Andrej Karpathy — “LLM Wiki” gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) | Persistent, compounding wiki vs. one-shot RAG; ingest / query / lint; index + log. |
| [@DeRonin_ (X)](https://x.com/DeRonin_/status/2042604279077237170) | “Content engine” framing — systematic pipelines vs. manual rewrite loops ([Thread Reader](https://threadreaderapp.com/thread/2042604279077237170.html)). |
| [kothari-nikunj/llm-wiki](https://github.com/kothari-nikunj/llm-wiki) | Reference implementation: raw → compiled wiki, wikilinks, workflows. |
| [Profilist/pokestrator](https://github.com/Profilist/pokestrator) | Async MCP orchestration + Poke webhook pattern (this repo stays a slimmer vault MCP). |

## Products and APIs

| Name | Use in kheMind |
|------|----------------|
| [Convex](https://www.convex.dev/) | Hosted database + full-text search on text chunks. |
| [Vercel](https://vercel.com/) | Next.js hosting; Streamable HTTP MCP route. |
| [mcp-handler](https://github.com/vercel/mcp-handler) | MCP HTTP transport for Next.js ([docs](https://vercel.com/docs/mcp)). |
| [Poke](https://poke.com/) | MCP client + optional [inbound API](https://poke.com/docs/api) (`send_to_poke`). |
| [`poke` (npm)](https://www.npmjs.com/package/poke) | CLI (`poke mcp add`, `poke tunnel`) for local/dev wiring. |
| [Model Context Protocol](https://modelcontextprotocol.io/) | Tool protocol for agents. |
| [Quartz 4](https://quartz.jzhao.xyz/) ([jackyzha0/quartz](https://github.com/jackyzha0/quartz)) | Static-site generator for the `/garden` vault viewer (`vault-quartz/`). |

## Optional tooling (from referenced docs)

Obsidian, qmd, Marp, Dataview — mentioned in Karpathy’s gist as optional companions; not bundled in kheMind.

## License

See [LICENSE](./LICENSE). Third-party libraries are subject to their respective licenses (`package.json` / `package-lock.json`).
