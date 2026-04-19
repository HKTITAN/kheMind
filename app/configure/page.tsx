import type { Metadata } from "next";
import Link from "next/link";
import { ConfigureClient } from "./ConfigureClient";

export const metadata: Metadata = {
  title: "Configure — kheMind",
  description:
    "Generate environment variables and wiring for Poke, Convex, Vercel, and GitHub.",
};

export default function ConfigurePage() {
  return (
    <div className="km-wrap">
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/">← kheMind</Link>
      </nav>
      <header className="km-hero" style={{ border: "none", paddingTop: 0 }}>
        <h1>Configure your deployment</h1>
        <p className="km-tagline">
          Fill in your Convex URL and secrets. Nothing is sent to our servers —
          copy the output into Vercel and Convex dashboards, then wire Poke and
          GitHub Actions.
        </p>
      </header>
      <ConfigureClient />
    </div>
  );
}
