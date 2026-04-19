# Quartz vault viewer ([Quartz 4](https://quartz.jzhao.xyz/))

kheMind can render your `wiki/` markdown as a static site using **Quartz 4**, served by Next.js at **`/garden`**.

## Build (Node.js 22+)

```bash
cd vault-quartz
npm install
cd ..
npm run quartz:build
```

Output is written to `public/garden/`. For production:

```bash
npm run build:with-quartz
```

Or add to your Vercel **Install** / **Build** steps: install `vault-quartz` dependencies, then `node scripts/quartz-build.mjs` before `next build`.

## Configuration

- **`vault-quartz/quartz.config.ts`** — Quartz config; `baseUrl` defaults from `QUARTZ_BASE_URL` (no `https://`, include `/garden` path), e.g. `myapp.vercel.app/garden`.
- See [Quartz configuration](https://quartz.jzhao.xyz/configuration) for themes, plugins, and `ignorePatterns`.

## Authorization

Optional **password gate** for `/garden`:

| Env | Purpose |
|-----|---------|
| `VAULT_VIEW_PASSWORD` | Password users enter at `/vault/login` |
| `VAULT_VIEW_COOKIE_TOKEN` | Long random string; must match the httpOnly cookie after login (set both in Vercel) |

If either is unset, **`/garden` is public** (same as no gate).

## References

- [Quartz hosting (Vercel)](https://quartz.jzhao.xyz/hosting)
- Upstream: [jackyzha0/quartz](https://github.com/jackyzha0/quartz)
