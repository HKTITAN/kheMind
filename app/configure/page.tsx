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
      <nav className="km-nav">
        <Link href="/">← kheMind</Link>
      </nav>
      <header className="km-hero km-hero-tight">
        <h1>Configure your deployment</h1>
        <p className="km-tagline">
          Prefer Connect steps below. Advanced: generate env in your browser and paste
          into Vercel and Convex — nothing is uploaded to kheMind.
        </p>
      </header>
      <ConfigureClient />
    </div>
  );
}
