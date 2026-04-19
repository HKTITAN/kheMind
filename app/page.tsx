import Link from "next/link";

const githubHref =
  process.env.NEXT_PUBLIC_GITHUB_REPO_URL ?? "https://github.com";

export default function Home() {
  return (
    <div className="km-wrap">
      <header className="km-hero">
        <h1>kheMind</h1>
        <p className="km-tagline">
          A small, open stack for a compounding markdown wiki: index text in{" "}
          <strong>Convex</strong>, expose <strong>Streamable HTTP MCP</strong> on{" "}
          <strong>Vercel</strong>, and plug in <strong>Poke</strong> or any MCP
          client. No embedding API required.
        </p>
        <div className="km-actions">
          <Link className="km-btn km-btn-primary" href="/configure">
            Configure deployment
          </Link>
          <a
            className="km-btn"
            href={githubHref}
            target="_blank"
            rel="noreferrer"
          >
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
          </ul>
        </div>
      </section>

      <section className="km-section">
        <h2>Docs</h2>
        <div className="km-card">
          <p style={{ marginTop: 0 }}>
            See the repository <strong>README.md</strong> for Convex, Vercel, Poke, and
            GitHub Actions setup. <Link href="/configure">Configure</Link> generates env
            snippets locally in your browser.
          </p>
          <p style={{ marginBottom: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
            Credits and prior art: <code>CREDITS.md</code>
          </p>
        </div>
      </section>
    </div>
  );
}
