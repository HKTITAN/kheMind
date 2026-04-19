import { createMcpHandler, withMcpAuth } from "mcp-handler";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { ConvexHttpClient } from "convex/browser";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import { sendPokeInboundMessage } from "@/lib/poke-inbound";

export const runtime = "nodejs";
export const maxDuration = 60;

function getClient(): ConvexHttpClient {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
  }
  return new ConvexHttpClient(url);
}

const baseHandler = createMcpHandler(
  async (server) => {
    const client = getClient();
    const bridge = process.env.BRIDGE_SECRET;

    server.tool(
      "query_brain",
      "Full-text search over indexed vault chunks (Convex). Agents/Poke interpret results; no embedding API in this stack.",
      {
        query: z.string().min(1),
        limit: z.number().int().min(1).max(50).optional(),
      },
      async ({ query, limit }) => {
        const results = await client.query(api.brain.queryBrain, {
          query,
          limit,
          bridgeSecret: bridge,
        });
        const text = JSON.stringify(results, null, 2);
        return {
          content: [{ type: "text" as const, text }],
        };
      },
    );

    server.tool(
      "list_notes",
      "List recently indexed note paths and short previews.",
      {
        limit: z.number().int().min(1).max(200).optional(),
      },
      async ({ limit }) => {
        const rows = await client.query(api.chunks.listRecent, {
          limit,
          bridgeSecret: bridge,
        });
        return {
          content: [
            { type: "text" as const, text: JSON.stringify(rows, null, 2) },
          ],
        };
      },
    );

    server.tool(
      "append_log",
      "Append a line to the vault log (stored in Convex).",
      { body: z.string().min(1) },
      async ({ body }) => {
        await client.mutation(api.logs.appendLog, {
          body,
          bridgeSecret: bridge,
        });
        return {
          content: [{ type: "text" as const, text: "Logged to Convex." }],
        };
      },
    );

    server.tool(
      "send_to_poke",
      "Send a message to your Poke assistant via the official inbound API (https://poke.com/docs/api). Requires POKE_API_KEY (Kitchen V2 key) on the server.",
      { message: z.string().min(1).max(16_000) },
      async ({ message }) => {
        try {
          const result = await sendPokeInboundMessage(message);
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return {
            content: [
              {
                type: "text" as const,
                text: `send_to_poke failed: ${msg}`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
  {
    serverInfo: {
      name: "khemind",
      version: "0.1.0",
    },
  },
  { basePath: "/api" },
);

async function verifyToken(
  _req: Request,
  bearerToken?: string,
): Promise<AuthInfo | undefined> {
  const expected = process.env.MCP_BEARER_TOKEN;
  if (!expected) {
    return {
      token: "dev",
      scopes: ["vault:read", "vault:write"],
      clientId: "local-dev",
    };
  }
  if (bearerToken !== expected) {
    return undefined;
  }
  return {
    token: bearerToken,
    scopes: ["vault:read", "vault:write"],
    clientId: "mcp",
  };
}

const authWrapped = withMcpAuth(baseHandler, verifyToken, {
  required: !!process.env.MCP_BEARER_TOKEN,
});

export { authWrapped as GET, authWrapped as POST, authWrapped as DELETE };
