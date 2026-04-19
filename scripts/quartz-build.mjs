/**
 * Build [Quartz 4](https://quartz.jzhao.xyz/) into ../public/garden.
 * Requires: cd vault-quartz && npm install (Node >= 22)
 */
import { copyFileSync, mkdirSync, existsSync } from "node:fs"
import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const quartzPkg = path.join(root, "vault-quartz", "node_modules", "@jackyzha0", "quartz")
const configSrc = path.join(root, "vault-quartz", "quartz.config.ts")
const wiki = path.join(root, "wiki")
const out = path.join(root, "public", "garden")

if (!existsSync(quartzPkg)) {
  console.error(
    "Quartz not installed. Run: cd vault-quartz && npm install\n(Node.js 22+ required.)",
  )
  process.exit(1)
}

if (!existsSync(configSrc)) {
  console.error("Missing vault-quartz/quartz.config.ts")
  process.exit(1)
}

copyFileSync(configSrc, path.join(quartzPkg, "quartz.config.ts"))
mkdirSync(out, { recursive: true })

const relWiki = path.relative(quartzPkg, wiki)
const relOut = path.relative(quartzPkg, out)

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["quartz", "build", "--directory", relWiki, "--output", relOut],
  {
    cwd: quartzPkg,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env },
  },
)

process.exit(result.status ?? 1)
