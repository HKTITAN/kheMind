"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SetupVerifyResponse } from "@/lib/setup-verify-types";
import { VERCEL_DEPLOY_CLONE_HREF } from "@/lib/vercel-deploy-button";

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function quartzBaseFromDeployment(deploymentUrl: string): string {
  try {
    const u = new URL(deploymentUrl.trim().replace(/\/$/, ""));
    return `${u.host}/garden`;
  } catch {
    return "";
  }
}

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
  const [vaultGate, setVaultGate] = useState(false);
  const [vaultPassword, setVaultPassword] = useState("");
  const [vaultCookieToken, setVaultCookieToken] = useState("");

  const [copied, setCopied] = useState(false);
  const [convexCheckLoading, setConvexCheckLoading] = useState(false);
  const [fullCheckLoading, setFullCheckLoading] = useState(false);
  const [verifyResults, setVerifyResults] = useState<SetupVerifyResponse | null>(
    null,
  );

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

  /** Best-effort prefilled MCP URL for Poke's integration UI (ignored if unsupported). */
  const pokeIntegrationsHref = useMemo(() => {
    if (!mcpEndpoint || mcpEndpoint.includes("example.com")) {
      return "https://poke.com/integrations/new";
    }
    return `https://poke.com/integrations/new?mcpUrl=${encodeURIComponent(mcpEndpoint)}`;
  }, [mcpEndpoint]);

  const quartzBaseUrl = useMemo(
    () => quartzBaseFromDeployment(deploymentUrl),
    [deploymentUrl],
  );

  const envLocal = useMemo(() => {
    const lines = [
      "# kheMind — Vercel → Environment Variables (mirror BRIDGE_SECRET + INGEST_SECRET in Convex)",
      "",
      `NEXT_PUBLIC_CONVEX_URL=${convexUrl}`,
      `CONVEX_DEPLOYMENT=`,
      "",
      `BRIDGE_SECRET=${bridgeSecret}`,
      `INGEST_SECRET=${ingestSecret}`,
      "",
      `MCP_BEARER_TOKEN=${mcpBearer}`,
      "",
      quartzBaseUrl
        ? `QUARTZ_BASE_URL=${quartzBaseUrl}`
        : "# QUARTZ_BASE_URL=myapp.vercel.app/garden",
      "",
    ];
    if (vaultGate) {
      lines.push(
        `VAULT_VIEW_PASSWORD=${vaultPassword}`,
        `VAULT_VIEW_COOKIE_TOKEN=${vaultCookieToken}`,
        "",
      );
    } else {
      lines.push(
        "# Optional — gate /garden:",
        "# VAULT_VIEW_PASSWORD=",
        "# VAULT_VIEW_COOKIE_TOKEN=",
        "",
      );
    }
    lines.push(
      `# Optional — Kitchen V2: https://poke.com/docs/api`,
      pokeApiKey ? `POKE_API_KEY=${pokeApiKey}` : "# POKE_API_KEY=",
      "",
      "# Optional: CI — npm run build:vercel",
      "# CONVEX_DEPLOY_KEY=",
    );
    return lines.join("\n");
  }, [
    convexUrl,
    bridgeSecret,
    ingestSecret,
    mcpBearer,
    quartzBaseUrl,
    vaultGate,
    vaultPassword,
    vaultCookieToken,
    pokeApiKey,
  ]);

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
    setVaultCookieToken(randomHex(32));
  }, []);

  const deploymentBaseForApi = useMemo(() => {
    const t = deploymentUrl.trim();
    if (!t) return "";
    try {
      return new URL(t.replace(/\/$/, "")).origin;
    } catch {
      return "";
    }
  }, [deploymentUrl]);

  const verifyConvexOnly = useCallback(async () => {
    if (!convexUrl.trim()) {
      return;
    }
    setConvexCheckLoading(true);
    setVerifyResults(null);
    try {
      const base =
        deploymentBaseForApi ||
        (typeof window !== "undefined" ? window.location.origin : "");
      if (!base) {
        setVerifyResults({
          ok: false,
          results: {
            convex: {
              ok: false,
              message: "Set deployment base URL (or open this page on your deployed site).",
            },
          },
        });
        return;
      }
      const res = await fetch("/api/setup/verify-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deploymentBaseUrl: base,
          convexUrl: convexUrl.trim(),
        }),
      });
      const data = (await res.json()) as SetupVerifyResponse;
      setVerifyResults(data);
    } finally {
      setConvexCheckLoading(false);
    }
  }, [convexUrl, deploymentBaseForApi]);

  const verifyFull = useCallback(async () => {
    if (!deploymentBaseForApi) return;
    setFullCheckLoading(true);
    setVerifyResults(null);
    try {
      const body: Record<string, string | undefined> = {
        deploymentBaseUrl: deploymentBaseForApi,
        convexUrl: convexUrl.trim() || undefined,
        ingestSecret: ingestSecret.trim() || undefined,
        mcpBearer: mcpBearer.trim() || undefined,
      };
      if (vaultGate && vaultPassword) {
        body.vaultPassword = vaultPassword;
      }
      const res = await fetch("/api/setup/verify-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as SetupVerifyResponse;
      setVerifyResults(data);
    } finally {
      setFullCheckLoading(false);
    }
  }, [
    deploymentBaseForApi,
    convexUrl,
    ingestSecret,
    mcpBearer,
    vaultGate,
    vaultPassword,
  ]);

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

  function resultLine(
    label: string,
    r: { ok: boolean; message: string; skipped?: boolean } | undefined,
  ) {
    if (!r) return null;
    const icon = r.skipped ? "○" : r.ok ? "✓" : "✗";
    const cls = r.skipped
      ? "km-verify-skip"
      : r.ok
        ? "km-verify-ok"
        : "km-verify-bad";
    return (
      <li className={cls}>
        <strong>{icon}</strong> {label}: {r.message}
      </li>
    );
  }

  return (
    <>
      <p className="km-notice">
        <strong>Connect-first:</strong> use the official Convex integration and Poke UI
        when you can. Open <strong>Advanced</strong> below only if you need to generate
        secrets and paste env manually. Service checks run on this app&apos;s server —
        see{" "}
        <a
          href="https://github.com/HKTITAN/kheMind/blob/main/SECURITY.md"
          target="_blank"
          rel="noreferrer"
        >
          SECURITY.md
        </a>{" "}
        for details.
      </p>

      <section className="km-step" aria-labelledby="step-deploy">
        <h2 id="step-deploy" className="km-step-title">
          <span className="km-step-num">1</span> Deploy
        </h2>
        <p className="km-step-body">
          Create a Vercel project from this template. The deploy flow asks for env var
          names; use the README link for definitions, or generate values in Advanced after
          your first deploy.
        </p>
        <div className="km-actions">
          <a className="km-btn km-btn-primary" href={VERCEL_DEPLOY_CLONE_HREF}>
            Deploy to Vercel
          </a>
        </div>
      </section>

      <section className="km-step" aria-labelledby="step-convex">
        <h2 id="step-convex" className="km-step-title">
          <span className="km-step-num">2</span> Connect Convex
        </h2>
        <p className="km-step-body">
          Prefer the marketplace integration so <code>NEXT_PUBLIC_CONVEX_URL</code> (and
          optionally the deploy key) is provisioned into Vercel without dashboard
          copy-paste.
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
        <p className="km-step-body">
          If anything is still missing, set your deployment URL and Convex URL here, then
          check reachability.
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
        </div>
        <div className="km-actions km-actions-wrap">
          <button
            type="button"
            className="km-btn"
            onClick={verifyConvexOnly}
            disabled={convexCheckLoading || !convexUrl.trim()}
          >
            {convexCheckLoading ? "Checking…" : "Authorize: Convex URL"}
          </button>
        </div>
      </section>

      <section className="km-step" aria-labelledby="step-poke">
        <h2 id="step-poke" className="km-step-title">
          <span className="km-step-num">3</span> Connect Poke
        </h2>
        <p className="km-step-body">
          Register your MCP endpoint in Poke. Use the same bearer as{" "}
          <code>MCP_BEARER_TOKEN</code> as <code>poke mcp add … --api-key</code> per the{" "}
          <a href="https://www.npmjs.com/package/poke" target="_blank" rel="noreferrer">
            poke npm
          </a>
          .
        </p>
        <div className="km-actions km-actions-wrap">
          <a
            className="km-btn km-btn-primary"
            href={pokeIntegrationsHref}
            target="_blank"
            rel="noreferrer"
          >
            Open Poke integrations
          </a>
          <a
            className="km-btn"
            href="https://poke.com/settings/connections/integrations/new"
            target="_blank"
            rel="noreferrer"
          >
            Alternate: Connections → new
          </a>
        </div>
        <p className="km-mini">
          MCP URL: <code>{mcpEndpoint || "Set deployment URL above"}</code>
        </p>
        <p className="km-mini">
          CLI: <code>{pokeCliSnippet}</code>
        </p>
      </section>

      <section className="km-step" aria-labelledby="step-github">
        <h2 id="step-github" className="km-step-title">
          <span className="km-step-num">4</span> GitHub Actions
        </h2>
        <p className="km-step-body">
          Your markdown lives in <strong>your</strong> GitHub repo. Add repository
          secrets so pushes can call your ingest endpoint — one-time setup in GitHub
          Settings (true zero-paste for repo secrets would need a GitHub App; see{" "}
          <a href="https://github.com/HKTITAN/kheMind/blob/main/docs/ZERO_PASTE.md">
            docs/ZERO_PASTE.md
          </a>
          ). Values to paste are shown under Advanced below.
        </p>
      </section>

      <details className="km-advanced">
        <summary>Advanced — generate &amp; paste env manually</summary>
        <p className="km-step-body">
          Use this if the Convex integration did not cover everything, or you need
          aligned secrets for Convex + Vercel + GitHub. Generate random secrets in your
          browser, then copy into each dashboard.
        </p>

        <div className="km-field km-field-inline">
          <label>
            <input
              type="checkbox"
              checked={vaultGate}
              onChange={(e) => setVaultGate(e.target.checked)}
            />{" "}
            Require sign-in for <code>/garden</code> (Quartz viewer)
          </label>
        </div>

        {vaultGate ? (
          <div className="km-form-grid">
            <div className="km-field">
              <label htmlFor="vault-pass">VAULT_VIEW_PASSWORD</label>
              <input
                id="vault-pass"
                value={vaultPassword}
                onChange={(e) => setVaultPassword(e.target.value)}
                placeholder="Choose a viewer password"
                autoComplete="new-password"
                type="password"
              />
            </div>
            <div className="km-field">
              <label htmlFor="vault-cookie">VAULT_VIEW_COOKIE_TOKEN</label>
              <input
                id="vault-cookie"
                value={vaultCookieToken}
                onChange={(e) => setVaultCookieToken(e.target.value)}
                placeholder="Generate secrets or paste"
                autoComplete="off"
              />
            </div>
          </div>
        ) : null}

        <div className="km-form-grid">
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

        <div className="km-actions km-actions-wrap">
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
            <textarea readOnly value={envLocal} rows={22} spellCheck={false} />
          </div>
        </div>

        <div className="km-section">
          <h3 className="km-subheading">GitHub Actions secrets</h3>
          <div className="km-field">
            <textarea readOnly value={githubSecretsHint} rows={12} spellCheck={false} />
          </div>
        </div>
      </details>

      <section className="km-step" aria-labelledby="step-verify">
        <h2 id="step-verify" className="km-step-title">
          <span className="km-step-num">5</span> Authorize deployed services
        </h2>
        <p className="km-step-body">
          After env is saved on Vercel and Convex and the app has redeployed, run checks
          to confirm ingest, MCP bearer, and (if enabled) vault login.
        </p>
        <div className="km-actions">
          <button
            type="button"
            className="km-btn km-btn-primary"
            onClick={verifyFull}
            disabled={
              fullCheckLoading ||
              !deploymentBaseForApi ||
              !ingestSecret.trim() ||
              !mcpBearer.trim()
            }
          >
            {fullCheckLoading ? "Checking…" : "Run full verification"}
          </button>
        </div>
        <p className="km-mini">
          Requires deployment URL, INGEST_SECRET, and MCP_BEARER_TOKEN (from Advanced).
          Include vault password when the gate is enabled.
        </p>
        {verifyResults ? (
          <ul className="km-verify-list">
            {resultLine("Convex", verifyResults.results.convex)}
            {resultLine("Ingest", verifyResults.results.ingest)}
            {resultLine("MCP", verifyResults.results.mcp)}
            {resultLine("Vault", verifyResults.results.vault)}
          </ul>
        ) : null}
      </section>
    </>
  );
}
