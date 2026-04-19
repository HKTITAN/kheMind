"use client";

import { useCallback, useMemo, useState } from "react";

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function ConfigureClient() {
  const [deploymentUrl, setDeploymentUrl] = useState(
    "https://khemind.vercel.app",
  );
  const [convexUrl, setConvexUrl] = useState("");
  const [bridgeSecret, setBridgeSecret] = useState("");
  const [ingestSecret, setIngestSecret] = useState("");
  const [mcpBearer, setMcpBearer] = useState("");
  const [pokeApiKey, setPokeApiKey] = useState("");
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const ingestEndpoint = useMemo(() => {
    try {
      const u = new URL(deploymentUrl.replace(/\/$/, ""));
      return `${u.origin}/api/ingest`;
    } catch {
      return `${deploymentUrl.replace(/\/$/, "")}/api/ingest`;
    }
  }, [deploymentUrl]);

  const mcpEndpoint = useMemo(() => {
    try {
      const u = new URL(deploymentUrl.replace(/\/$/, ""));
      return `${u.origin}/api/mcp`;
    } catch {
      return `${deploymentUrl.replace(/\/$/, "")}/api/mcp`;
    }
  }, [deploymentUrl]);

  const envLocal = useMemo(() => {
    const lines = [
      "# kheMind — paste into Vercel Project → Settings → Environment Variables",
      "# and mirror INGEST_SECRET + BRIDGE_SECRET in Convex dashboard.",
      "",
      `NEXT_PUBLIC_CONVEX_URL=${convexUrl}`,
      `CONVEX_DEPLOYMENT=`,
      "",
      `BRIDGE_SECRET=${bridgeSecret}`,
      `INGEST_SECRET=${ingestSecret}`,
      "",
      `MCP_BEARER_TOKEN=${mcpBearer}`,
      "",
      `# Optional — Kitchen V2 key: https://poke.com/docs/api`,
      pokeApiKey ? `POKE_API_KEY=${pokeApiKey}` : "# POKE_API_KEY=",
      "",
    ];
    return lines.join("\n");
  }, [
    convexUrl,
    bridgeSecret,
    ingestSecret,
    mcpBearer,
    pokeApiKey,
  ]);

  const githubSecretsHint = useMemo(
    () =>
      [
        "Add these as GitHub repository secrets (Settings → Secrets → Actions):",
        "",
        `VERCEL_INGEST_URL=${ingestEndpoint}`,
        `INGEST_SECRET=${ingestSecret || "<same as INGEST_SECRET above>"}`,
        "",
        "Optional — notify Poke after ingest:",
        `POKE_API_KEY=${pokeApiKey || "<Kitchen V2 key>"}`,
        "",
        `Fork/repo URL (for your notes): ${githubRepoUrl || "<your GitHub repo>"}`,
      ].join("\n"),
    [ingestEndpoint, ingestSecret, pokeApiKey, githubRepoUrl],
  );

  const pokeSteps = useMemo(
    () =>
      [
        "Create a V2 API key in Poke Kitchen (API Keys).",
        "Add POKE_API_KEY to Vercel if you use the send_to_poke MCP tool.",
        "Connect MCP: https://poke.com/integrations/new — URL:",
        mcpEndpoint,
        "Header: Authorization: Bearer <MCP_BEARER_TOKEN>",
        "",
        "Or CLI: npx poke mcp add " + mcpEndpoint + " (after: npm i -g poke)",
      ].join("\n"),
    [mcpEndpoint],
  );

  const genSecrets = useCallback(() => {
    setBridgeSecret(randomHex(24));
    setIngestSecret(randomHex(24));
    setMcpBearer(randomHex(24));
  }, []);

  const downloadEnv = useCallback(() => {
    const blob = new Blob([envLocal], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "env-khemind.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [envLocal]);

  const copyEnv = useCallback(async () => {
    await navigator.clipboard.writeText(envLocal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [envLocal]);

  return (
    <>
      <p className="km-notice">
        <strong>Privacy:</strong> This page runs entirely in your browser. kheMind
        does not receive your API keys or secrets — you copy or download them for
        Vercel, Convex, and GitHub only.
      </p>

      <div className="km-form-grid">
        <div className="km-field">
          <label htmlFor="deploy">Deployment base URL (your Vercel app)</label>
          <input
            id="deploy"
            value={deploymentUrl}
            onChange={(e) => setDeploymentUrl(e.target.value)}
            placeholder="https://your-project.vercel.app"
            autoComplete="off"
          />
        </div>
        <div className="km-field">
          <label htmlFor="convex">NEXT_PUBLIC_CONVEX_URL</label>
          <input
            id="convex"
            value={convexUrl}
            onChange={(e) => setConvexUrl(e.target.value)}
            placeholder="https://happy-animal-123.convex.cloud"
            autoComplete="off"
          />
        </div>
        <div className="km-field">
          <label htmlFor="bridge">BRIDGE_SECRET</label>
          <input
            id="bridge"
            value={bridgeSecret}
            onChange={(e) => setBridgeSecret(e.target.value)}
            placeholder="long random string"
            autoComplete="off"
          />
        </div>
        <div className="km-field">
          <label htmlFor="ingest">INGEST_SECRET</label>
          <input
            id="ingest"
            value={ingestSecret}
            onChange={(e) => setIngestSecret(e.target.value)}
            placeholder="long random string (match Convex)"
            autoComplete="off"
          />
        </div>
        <div className="km-field">
          <label htmlFor="mcp">MCP_BEARER_TOKEN</label>
          <input
            id="mcp"
            value={mcpBearer}
            onChange={(e) => setMcpBearer(e.target.value)}
            placeholder="bearer token for /api/mcp"
            autoComplete="off"
          />
        </div>
        <div className="km-field">
          <label htmlFor="poke">POKE_API_KEY (optional)</label>
          <input
            id="poke"
            value={pokeApiKey}
            onChange={(e) => setPokeApiKey(e.target.value)}
            placeholder="Kitchen V2 key — optional"
            autoComplete="off"
            type="password"
          />
        </div>
        <div className="km-field">
          <label htmlFor="gh">Your GitHub repo URL (notes only)</label>
          <input
            id="gh"
            value={githubRepoUrl}
            onChange={(e) => setGithubRepoUrl(e.target.value)}
            placeholder="https://github.com/you/khemind"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="km-actions" style={{ marginTop: "1rem" }}>
        <button type="button" className="km-btn" onClick={genSecrets}>
          Generate random secrets
        </button>
        <button type="button" className="km-btn km-btn-primary" onClick={copyEnv}>
          {copied ? "Copied" : "Copy env block"}
        </button>
        <button type="button" className="km-btn" onClick={downloadEnv}>
          Download env-khemind.txt
        </button>
      </div>

      <div className="km-section" style={{ marginTop: "2rem" }}>
        <h2>Environment block</h2>
        <div className="km-field">
          <textarea readOnly value={envLocal} rows={14} />
        </div>
      </div>

      <div className="km-section">
        <h2>Poke — MCP + optional inbound API</h2>
        <div className="km-field">
          <textarea readOnly value={pokeSteps} rows={10} />
        </div>
        <p className="km-notice" style={{ marginTop: "0.75rem" }}>
          References:{" "}
          <a href="https://poke.com/docs/api" target="_blank" rel="noreferrer">
            Poke API
          </a>
          ,{" "}
          <a
            href="https://www.npmjs.com/package/poke"
            target="_blank"
            rel="noreferrer"
          >
            poke npm
          </a>
          ,{" "}
          <a
            href="https://poke.com/integrations/new"
            target="_blank"
            rel="noreferrer"
          >
            New integration
          </a>
          .
        </p>
      </div>

      <div className="km-section">
        <h2>GitHub Actions secrets</h2>
        <div className="km-field">
          <textarea readOnly value={githubSecretsHint} rows={12} />
        </div>
      </div>

      <div className="km-section">
        <h2>Endpoints from your deployment URL</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          Ingest: <code>{ingestEndpoint}</code>
          <br />
          MCP: <code>{mcpEndpoint}</code>
        </p>
      </div>
    </>
  );
}
