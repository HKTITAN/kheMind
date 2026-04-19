import type { Metadata } from "next";
import Link from "next/link";
import { ConfigureClient } from "../configure/ConfigureClient";

export const metadata: Metadata = {
  title: "Setup — kheMind",
  description:
    "Connect-first setup for Convex, Vercel, Poke, and GitHub — no secrets sent to kheMind servers.",
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
          Deploy, connect Convex and Poke, then keep your notes in GitHub. Use the
          advanced section only if you need to paste env vars manually.
        </p>
      </header>
      <ConfigureClient />
    </div>
  );
}
