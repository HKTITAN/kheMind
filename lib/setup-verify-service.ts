/**
 * Server-side checks for /api/setup/verify-services (and tests).
 * Performs outbound HTTP requests to Convex and the user’s deployment.
 */

const FETCH_TIMEOUT_MS = 12_000;

function timeoutSignal(): AbortSignal {
  return AbortSignal.timeout(FETCH_TIMEOUT_MS);
}

export async function verifyConvexDeploymentUrl(
  convexUrl: string,
): Promise<{ ok: boolean; message: string }> {
  const trimmed = convexUrl.trim();
  if (!trimmed) {
    return { ok: false, message: "Convex URL is empty." };
  }
  let u: URL;
  try {
    u = new URL(trimmed);
  } catch {
    return { ok: false, message: "Invalid URL." };
  }
  if (u.protocol !== "https:") {
    return { ok: false, message: "Convex URL should use https://." };
  }
  if (
    !u.hostname.endsWith(".convex.cloud") &&
    !u.hostname.endsWith(".convex.site")
  ) {
    return {
      ok: false,
      message:
        "Host should be your Convex deployment (*.convex.cloud or *.convex.site).",
    };
  }
  try {
    const r = await fetch(trimmed.replace(/\/$/, ""), {
      method: "GET",
      redirect: "follow",
      signal: timeoutSignal(),
    });
    return {
      ok: true,
      message: `Reachable (HTTP ${r.status}).`,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, message: `Could not reach Convex: ${msg}` };
  }
}

export async function verifyIngestEndpoint(
  deploymentBaseUrl: string,
  ingestSecret: string,
): Promise<{ ok: boolean; message: string }> {
  const base = deploymentBaseUrl.replace(/\/$/, "");
  const url = `${base}/api/ingest`;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ingestSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files: [] }),
      signal: timeoutSignal(),
    });
    if (r.status === 401) {
      return {
        ok: false,
        message: "Unauthorized — INGEST_SECRET on the server does not match.",
      };
    }
    if (r.status === 500) {
      const t = await r.text();
      if (t.includes("NEXT_PUBLIC_CONVEX_URL")) {
        return {
          ok: false,
          message:
            "Server missing NEXT_PUBLIC_CONVEX_URL — set Convex env on Vercel and redeploy.",
        };
      }
    }
    if (!r.ok) {
      const t = await r.text();
      return {
        ok: false,
        message: `HTTP ${r.status}${t ? `: ${t.slice(0, 200)}` : ""}`,
      };
    }
    return { ok: true, message: "Ingest accepted (empty batch)." };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      message: `Could not reach ${url}: ${msg}`,
    };
  }
}

const MCP_INIT_BODY = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "khemind-setup-verify", version: "0.1.0" },
  },
});

export async function verifyMcpEndpoint(
  deploymentBaseUrl: string,
  mcpBearer: string,
): Promise<{ ok: boolean; message: string }> {
  const base = deploymentBaseUrl.replace(/\/$/, "");
  const url = `${base}/api/mcp`;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        Authorization: `Bearer ${mcpBearer}`,
      },
      body: MCP_INIT_BODY,
      signal: timeoutSignal(),
    });
    if (r.status === 401 || r.status === 403) {
      return {
        ok: false,
        message:
          "MCP rejected the bearer token — check MCP_BEARER_TOKEN on Vercel matches.",
      };
    }
    if (!r.ok) {
      const t = await r.text();
      return {
        ok: false,
        message: `HTTP ${r.status}${t ? `: ${t.slice(0, 200)}` : ""}`,
      };
    }
    return { ok: true, message: "MCP accepted initialize (authorized)." };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      message: `Could not reach ${url}: ${msg}`,
    };
  }
}

export async function verifyVaultLogin(
  deploymentBaseUrl: string,
  vaultPassword: string,
): Promise<{ ok: boolean; message: string; skipped?: boolean }> {
  const base = deploymentBaseUrl.replace(/\/$/, "");
  const url = `${base}/api/vault-auth`;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: vaultPassword }),
      signal: timeoutSignal(),
    });
    if (r.status === 503) {
      return {
        ok: false,
        skipped: true,
        message:
          "Vault gate is not enabled on that deployment yet (set VAULT_VIEW_PASSWORD + VAULT_VIEW_COOKIE_TOKEN).",
      };
    }
    if (r.status === 401) {
      return {
        ok: false,
        message: "Invalid vault password or token mismatch on server.",
      };
    }
    if (!r.ok) {
      const t = await r.text();
      return {
        ok: false,
        message: `HTTP ${r.status}${t ? `: ${t.slice(0, 200)}` : ""}`,
      };
    }
    return { ok: true, message: "Vault password accepted." };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      message: `Could not reach ${url}: ${msg}`,
    };
  }
}
