import type { Metadata } from "next";
import Link from "next/link";
import { ConfigureClient } from "../configure/ConfigureClient";

export const metadata: Metadata = {
  title: "Setup — kheMind",
  description:
    "Guided Convex + Vercel env, Quartz base URL, optional vault gate, and service authorization checks.",
};

export default function SetupPage() {
  return (
    <div className="km-wrap">
      <nav className="km-nav">
        <Link href="/">← kheMind</Link>
      </nav>
      <header className="km-hero km-hero-tight">
        <h1>Set up your brain</h1>
        <p className="km-tagline">
          Set your deployment URL and Convex URL, generate secrets, paste env into
          Vercel and Convex, then verify ingest and MCP. Add GitHub secrets for CI when
          you are ready.
        </p>
      </header>
      <ConfigureClient />
    </div>
  );
}
