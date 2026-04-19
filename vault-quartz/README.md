# kheMind × Quartz

This folder installs **[Quartz 4](https://quartz.jzhao.xyz/)** from GitHub (`@jackyzha0/quartz`) and holds **`quartz.config.ts`** for the vault site.

- **Content:** `../wiki` (kheMind markdown)
- **Output:** `../public/garden` (served at `/garden`)

From the **repository root**:

```bash
cd vault-quartz && npm install && cd ..
npm run quartz:build
```

Requires **Node.js ≥ 22** and **npm ≥ 10.9.2** (per Quartz).

See [docs/QUARTZ.md](../docs/QUARTZ.md) for Vercel, `QUARTZ_BASE_URL`, and the optional vault password gate.
