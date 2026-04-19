import Link from "next/link";

const githubHref =
  process.env.NEXT_PUBLIC_GITHUB_REPO_URL ?? "https://github.com/HKTITAN/kheMind";

const deployVercelHref =
  "https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHKTITAN%2FkheMind&env=NEXT_PUBLIC_CONVEX_URL%2CBRIDGE_SECRET%2CINGEST_SECRET%2CMCP_BEARER_TOKEN%2CQUARTZ_BASE_URL%2CVAULT_VIEW_PASSWORD%2CVAULT_VIEW_COOKIE_TOKEN&envLink=https%3A%2F%2Fgithub.com%2FHKTITAN%2FkheMind%23environment-variables";

export default function Home() {
  return (
    <div className="km-wrap">
      <header className="km-hero">
        <h1>kheMind</h1>
        <p className="km-tagline">
          A compounding markdown wiki: index text in <strong>Convex</strong>, expose{" "}
          <strong>Streamable HTTP MCP</strong> on <strong>Vercel</strong>, and plug in{" "}
          <strong>Poke</strong> or any MCP client. No embedding API required.
        </p>
        <div className="km-actions">
          <a className="km-btn km-btn-primary" href={deployVercelHref}>
            Deploy to Vercel
          </a>
          <Link className="km-btn" href="/setup">
            Set up (Connect)
          </Link>
          <Link className="km-btn" href="/garden">
            Vault (Quartz)
          </Link>
          <a className="km-btn" href={githubHref} target="_blank" rel="noreferrer">
            View on GitHub
          </a>
        </div>
      </header>

      <section className="km-section">
        <h2>What you get</h2>
        <div className="km-card">
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            <li>
              <code>POST /api/ingest</code> — push markdown chunks from CI into Convex
            </li>
            <li>
              <code>/api/mcp</code> — tools: <code>query_brain</code>,{" "}
              <code>list_notes</code>, <code>append_log</code>, optional{" "}
              <code>send_to_poke</code>
            </li>
            <li>
              <code>wiki/</code> + <code>sources/</code> as git-tracked truth (your repo)
            </li>
            <li>
              <a href="https://quartz.jzhao.xyz/">Quartz 4</a> at <code>/garden</code> after{" "}
              <code>npm run quartz:build</code> — optional login via{" "}
              <Link href="/vault/login">/vault/login</Link> when configured
            </li>
          </ul>
        </div>
      </section>

      <section className="km-section">
        <h2>Docs</h2>
        <div className="km-card">
          <p style={{ marginTop: 0 }}>
            See <strong>README.md</strong> for Convex, Vercel, Poke, and GitHub Actions.{" "}
            <Link href="/setup">Set up</Link> walks through Connect-first steps;{" "}
            <Link href="/configure">Configure</Link> is the same wizard with an advanced
            paste block. See <strong>docs/ZERO_PASTE.md</strong> for the onboarding
            strategy.
          </p>
          <p style={{ marginBottom: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
            Credits: <code>CREDITS.md</code>
          </p>
        </div>
      </section>
    </div>
  );
}
