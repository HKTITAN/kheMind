"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SetupVerifyResponse } from "@/lib/setup-verify-types";

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

const DEPLOY_VERCEL_HREF =
  "https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHKTITAN%2FkheMind&env=NEXT_PUBLIC_CONVEX_URL%2CBRIDGE_SECRET%2CINGEST_SECRET%2CMCP_BEARER_TOKEN%2CQUARTZ_BASE_URL%2CVAULT_VIEW_PASSWORD%2CVAULT_VIEW_COOKIE_TOKEN&envLink=https%3A%2F%2Fgithub.com%2FHKTITAN%2FkheMind%23environment-variables";

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
        <strong>Privacy:</strong> Secret generation runs in your browser. Service checks
        run on <strong>this app&apos;s server</strong> (your deployment or local dev):
        they send your values only to Convex and your own <code>deploymentBaseUrl</code>{" "}
        to confirm ingest, MCP, and vault — nothing is logged or sent elsewhere.
      </p>

      <section className="km-step" aria-labelledby="step-deploy">
        <h2 id="step-deploy" className="km-step-title">
          <span className="km-step-num">1</span> Deploy
        </h2>
        <p className="km-step-body">
          Create a Vercel project from this template. Add env vars in the dashboard (or
          paste the generated block from step 3 after you generate secrets).
        </p>
        <div className="km-actions">
          <a className="km-btn km-btn-primary" href={DEPLOY_VERCEL_HREF}>
            Deploy to Vercel
          </a>
        </div>
      </section>

      <section className="km-step" aria-labelledby="step-urls">
        <h2 id="step-urls" className="km-step-title">
          <span className="km-step-num">2</span> URLs &amp; Convex
        </h2>
        <p className="km-step-body">
          Set your live app URL (used for ingest/MCP links, Quartz base, and checks).
          Add your Convex deployment URL from the dashboard or the Vercel Convex
          integration.
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
      </section>

      <section className="km-step" aria-labelledby="step-secrets">
        <h2 id="step-secrets" className="km-step-title">
          <span className="km-step-num">3</span> Generate &amp; paste env
        </h2>
        <p className="km-step-body">
          Generate random secrets, then copy the block into{" "}
          <strong>Vercel</strong> and the same bridge/ingest values into{" "}
          <strong>Convex → Settings → Environment Variables</strong>.{" "}
          <code>QUARTZ_BASE_URL</code> is filled from your deployment hostname for RSS and
          links; rebuild the garden with <code>npm run quartz:build</code> after deploy.
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
      </section>

      <section className="km-step" aria-labelledby="step-verify">
        <h2 id="step-verify" className="km-step-title">
          <span className="km-step-num">4</span> Authorize deployed services
        </h2>
        <p className="km-step-body">
          After Vercel + Convex env are saved and the app has redeployed, run checks to
          confirm ingest, MCP bearer, and (if enabled) vault login. Uses your deployment
          URL above.
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
          Requires deployment URL, INGEST_SECRET, and MCP_BEARER_TOKEN. Include vault
          password when the gate is enabled.
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

      <section className="km-step" aria-labelledby="step-poke">
        <h2 id="step-poke" className="km-step-title">
          <span className="km-step-num">5</span> Connect Poke
        </h2>
        <p className="km-step-body">
          Point Poke at your MCP URL with the same bearer as{" "}
          <code>MCP_BEARER_TOKEN</code>.
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
          MCP URL: <code>{mcpEndpoint || "Set deployment URL above"}</code>
        </p>
        <p className="km-mini">
          CLI: <code>{pokeCliSnippet}</code>
        </p>
      </section>

      <section className="km-step" aria-labelledby="step-github">
        <h2 id="step-github" className="km-step-title">
          <span className="km-step-num">6</span> GitHub Actions
        </h2>
        <p className="km-step-body">
          Add repository secrets so pushes can call your ingest endpoint. See{" "}
          <a href="https://github.com/HKTITAN/kheMind/blob/main/docs/ZERO_PASTE.md">
            docs/ZERO_PASTE.md
          </a>
          .
        </p>
      </section>
    </>
  );
}
