import { z } from "zod";
import type {
  SetupVerifyResponse,
  SetupVerifyResult,
} from "@/lib/setup-verify-types";
import {
  verifyConvexDeploymentUrl,
  verifyIngestEndpoint,
  verifyMcpEndpoint,
  verifyVaultLogin,
} from "@/lib/setup-verify-service";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  convexUrl: z.string().optional(),
  deploymentBaseUrl: z.string().url(),
  ingestSecret: z.string().optional(),
  mcpBearer: z.string().optional(),
  vaultPassword: z.string().optional(),
});

/**
 * Runs authorization checks against Convex and your deployment (ingest, MCP, vault).
 * POST body may include secrets — they are used only for outbound verification requests
 * from this server process and are not logged or stored.
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const {
    convexUrl,
    deploymentBaseUrl,
    ingestSecret,
    mcpBearer,
    vaultPassword,
  } = parsed.data;

  const results: SetupVerifyResponse["results"] = {};

  if (convexUrl?.trim()) {
    results.convex = await verifyConvexDeploymentUrl(convexUrl.trim());
  }

  if (ingestSecret?.trim()) {
    results.ingest = await verifyIngestEndpoint(
      deploymentBaseUrl,
      ingestSecret.trim(),
    );
  }

  if (mcpBearer?.trim()) {
    results.mcp = await verifyMcpEndpoint(
      deploymentBaseUrl,
      mcpBearer.trim(),
    );
  }

  if (vaultPassword !== undefined && vaultPassword.length > 0) {
    results.vault = await verifyVaultLogin(
      deploymentBaseUrl,
      vaultPassword,
    );
  }

  const entries = Object.entries(results).filter(
    ([, v]) => v !== undefined,
  ) as [string, SetupVerifyResult][];

  const ok = entries.every(([, v]) => v.ok || v.skipped);

  const response: SetupVerifyResponse = { ok, results };
  return Response.json(response);
}
