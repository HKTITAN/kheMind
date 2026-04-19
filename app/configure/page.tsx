import type { Metadata } from "next";
import Link from "next/link";
import { ConfigureClient } from "./ConfigureClient";

export const metadata: Metadata = {
  title: "Configure — kheMind",
  description:
    "Guided env for Convex, Vercel, Quartz, optional vault gate, and service authorization checks.",
};

export default function ConfigurePage() {
  return (
    <div className="km-wrap">
      <nav className="km-nav">
        <Link href="/">← kheMind</Link>
      </nav>
      <header className="km-hero km-hero-tight">
        <h1>Configure your deployment</h1>
        <p className="km-tagline">
          Connect Convex and Vercel, generate matching secrets, copy the env block, then
          run authorization checks for ingest, MCP, and optional Quartz vault login.
        </p>
      </header>
      <ConfigureClient />
    </div>
  );
}
