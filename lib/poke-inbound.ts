/**
 * Poke [Inbound API](https://poke.com/docs/api) — POST /api/v1/inbound/api-message
 * Use a **V2 API key** from Kitchen (not legacy pk_ keys for this endpoint).
 */
export async function sendPokeInboundMessage(message: string): Promise<unknown> {
  const key = process.env.POKE_API_KEY;
  if (!key?.trim()) {
    throw new Error("POKE_API_KEY is not set on the server");
  }
  const res = await fetch("https://poke.com/api/v1/inbound/api-message", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Poke API ${res.status}: ${text}`);
  }
  try {
    return JSON.parse(text) as { success?: boolean };
  } catch {
    return { raw: text };
  }
}
