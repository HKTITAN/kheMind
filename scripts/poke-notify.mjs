#!/usr/bin/env node
/**
 * Local / CI helper: POST to Poke inbound API (same contract as lib/poke-inbound.ts).
 * Usage: POKE_API_KEY=... node scripts/poke-notify.mjs "Your message here"
 */
const key = process.env.POKE_API_KEY?.trim();
if (!key) {
  console.error("Set POKE_API_KEY (Kitchen V2 key).");
  process.exit(1);
}
const message = process.argv.slice(2).join(" ").trim() || "test";
const res = await fetch("https://poke.com/api/v1/inbound/api-message", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ message }),
});
const text = await res.text();
console.log(res.status, text);
process.exit(res.ok ? 0 : 1);
