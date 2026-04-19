"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

const DEPLOY_VERCEL_HREF =
  "https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHKTITAN%2FkheMind&env=NEXT_PUBLIC_CONVEX_URL%2CBRIDGE_SECRET%2CINGEST_SECRET%2CMCP_BEARER_TOKEN&envLink=https%3A%2F%2Fgithub.com%2FHKTITAN%2FkheMind%23environment-variables";

export function ConfigureClient() {
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [convexUrl, setConvexUrl] = useState("");
  const [bridgeSecret, setBridgeSecret] = useState("");
  const [ingestSecret, setIngestSecret] = useState("");
  const [mcpBearer, setMcpBearer] = useState("");
  const [pokeApiKey, setPokeApiKey] = useState("");
  const [githubRepoUrl, setGithubRepoUrl] = useState(
    "https://github.com/HKTITAN/kheMind",
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const origin = window.location.origin;
    if (origin && !origin.includes("localhost")) {
      setDeploymentUrl(origin);
    }
  }, []);

  const ingestEndpoint = useMemo(() => {
    try {
      const u = new URL(deploymentUrl.replace(/\/$/, "") || "https://example.com");
      return `${u.origin}/api/ingest`;
    } catch {
      return `${deploymentUrl.replace(/\/$/, "")}/api/ingest`;
    }
  }, [deploymentUrl]);

  const mcpEndpoint = useMemo(() => {
    try {
      const u = new URL(deploymentUrl.replace(/\/$/, "") || "https://example.com");
      return `${u.origin}/api/mcp`;
    } catch {
      return `${deploymentUrl.replace(/\/$/, "")}/api/mcp`;
    }
  }, [deploymentUrl]);

  const envLocal = useMemo(() => {
    const lines = [
      "# kheMind — Vercel Project → Settings → Environment Variables",
      "# Mirror INGEST_SECRET + BRIDGE_SECRET in Convex dashboard.",
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
  }, [convexUrl, bridgeSecret, ingestSecret, mcpBearer, pokeApiKey]);

  const githubSecretsHint = useMemo(
    () =>
      [
        "GitHub → Settings → Secrets and variables → Actions:",
        "",
        `VERCEL_INGEST_URL=${ingestEndpoint}`,
        `INGEST_SECRET=${ingestSecret || "<same as INGEST_SECRET above>"}`,
        "",
        "Optional — notify Poke after ingest:",
        `POKE_API_KEY=${pokeApiKey || "<Kitchen V2 key>"}`,
        "",
        `Notes repo: ${githubRepoUrl || "<your fork>"}`,
      ].join("\n"),
    [ingestEndpoint, ingestSecret, pokeApiKey, githubRepoUrl],
  );

  const pokeCliSnippet = useMemo(
    () =>
      `poke mcp add ${mcpEndpoint} --name "kheMind" --api-key ${mcpBearer || "<MCP_BEARER_TOKEN>"}`,
    [mcpEndpoint, mcpBearer],
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
        <strong>Privacy:</strong> Secret generation happens in your browser. kheMind does
        not receive your keys — you copy them only into Vercel, Convex, or GitHub when you
        choose to.
      </p>

      <section className="km-step" aria-labelledby="step-deploy">
        <h2 id="step-deploy" className="km-step-title">
          <span className="km-step-num">1</span> Deploy
        </h2>
        <p className="km-step-body">
          Create a Vercel project from this template. You will be asked for environment
          variable names; use the{" "}
          <a href="https://github.com/HKTITAN/kheMind#environment-variables">README</a>{" "}
          or finish step 2 first.
        </p>
        <div className="km-actions">
          <a className="km-btn km-btn-primary" href={DEPLOY_VERCEL_HREF}>
            Deploy to Vercel
          </a>
        </div>
      </section>

      <section className="km-step" aria-labelledby="step-convex">
        <h2 id="step-convex" className="km-step-title">
          <span className="km-step-num">2</span> Connect Convex (recommended)
        </h2>
        <p className="km-step-body">
          Add the official Convex integration to your Vercel project so your deployment
          URL and deploy key are wired without hand-copying from the Convex dashboard.
        </p>
        <ul className="km-step-list">
          <li>
            <a
              href="https://vercel.com/integrations/convex"
              target="_blank"
              rel="noreferrer"
            >
              Convex on Vercel Marketplace
            </a>
          </li>
          <li>
            <a
              href="https://docs.convex.dev/production/hosting/vercel"
              target="_blank"
              rel="noreferrer"
            >
              Convex + Vercel hosting guide
            </a>
          </li>
        </ul>
        <p className="km-step-body km-muted">
          If anything is still missing, use the advanced block below to paste the Convex
          URL and generated secrets into Vercel and Convex.
        </p>
      </section>

      <section className="km-step" aria-labelledby="step-poke">
        <h2 id="step-poke" className="km-step-title">
          <span className="km-step-num">3</span> Connect Poke
        </h2>
        <p className="km-step-body">
          Open Poke&apos;s integration UI and point it at your MCP URL. Use the same
          bearer token as <code>MCP_BEARER_TOKEN</code> (matches{" "}
          <code>poke mcp add … --api-key</code> per the{" "}
          <a
            href="https://www.npmjs.com/package/poke"
            target="_blank"
            rel="noreferrer"
          >
            poke npm
          </a>
          ).
        </p>
        <div className="km-actions km-actions-wrap">
          <a
            className="km-btn km-btn-primary"
            href="https://poke.com/integrations/new"
            target="_blank"
            rel="noreferrer"
          >
            Open Poke integrations
          </a>
        </div>
        <p className="km-mini">
          MCP URL: <code>{mcpEndpoint || "Set deployment URL in advanced"}</code>
        </p>
        <p className="km-mini">
          Optional CLI: <code>{pokeCliSnippet}</code>
        </p>
      </section>

      <section className="km-step" aria-labelledby="step-github">
        <h2 id="step-github" className="km-step-title">
          <span className="km-step-num">4</span> GitHub Actions (your vault in git)
        </h2>
        <p className="km-step-body">
          Your markdown stays in <strong>your</strong> GitHub repo. Add repository
          secrets so pushes can call your ingest endpoint. See{" "}
          <a href="https://github.com/HKTITAN/kheMind/blob/main/docs/ZERO_PASTE.md">
            docs/ZERO_PASTE.md
          </a>{" "}
          for the zero-paste strategy.
        </p>
      </section>

      <details className="km-advanced">
        <summary>Advanced — generate &amp; paste env manually</summary>
        <p className="km-step-body">
          Use this if you are not using the Convex integration or need to align secrets
          by hand. Set deployment URL, generate random secrets, then copy into Vercel and
          Convex dashboards.
        </p>

        <div className="km-form-grid">
          <div className="km-field">
            <label htmlFor="deploy">Deployment base URL</label>
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
              placeholder="https://….convex.cloud"
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
              placeholder="match Convex + Vercel + GitHub"
              autoComplete="off"
            />
          </div>
          <div className="km-field">
            <label htmlFor="mcp">MCP_BEARER_TOKEN</label>
            <input
              id="mcp"
              value={mcpBearer}
              onChange={(e) => setMcpBearer(e.target.value)}
              placeholder="required in production on Vercel"
              autoComplete="off"
            />
          </div>
          <div className="km-field">
            <label htmlFor="poke">POKE_API_KEY (optional)</label>
            <input
              id="poke"
              value={pokeApiKey}
              onChange={(e) => setPokeApiKey(e.target.value)}
              placeholder="Kitchen V2 — send_to_poke"
              autoComplete="off"
              type="password"
            />
          </div>
          <div className="km-field">
            <label htmlFor="gh">GitHub repo URL (reference)</label>
            <input
              id="gh"
              value={githubRepoUrl}
              onChange={(e) => setGithubRepoUrl(e.target.value)}
              placeholder="https://github.com/you/kheMind"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="km-actions">
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

        <div className="km-section">
          <h3 className="km-subheading">Environment block</h3>
          <div className="km-field">
            <textarea readOnly value={envLocal} rows={14} />
          </div>
        </div>

        <div className="km-section">
          <h3 className="km-subheading">GitHub Actions secrets</h3>
          <div className="km-field">
            <textarea readOnly value={githubSecretsHint} rows={12} />
          </div>
        </div>

        <div className="km-section">
          <h3 className="km-subheading">Endpoints</h3>
          <p className="km-mini">
            Ingest: <code>{ingestEndpoint}</code>
            <br />
            MCP: <code>{mcpEndpoint}</code>
          </p>
        </div>
      </details>
    </>
  );
}
