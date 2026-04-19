"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";

function LoginForm() {
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/garden";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/vault-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError((j as { error?: string }).error ?? "Login failed");
        setLoading(false);
        return;
      }
      window.location.href = next.startsWith("/") ? next : "/garden";
    } catch {
      setError("Network error");
    }
    setLoading(false);
  }

  return (
    <div className="km-wrap" style={{ maxWidth: "24rem" }}>
      <nav className="km-nav">
        <Link href="/">← kheMind</Link>
      </nav>
      <header className="km-hero km-hero-tight">
        <h1>Vault login</h1>
        <p className="km-tagline">
          Enter the password your deployment uses for the Quartz vault viewer
          (<code>/garden</code>).
        </p>
      </header>
      <form className="km-form-grid" onSubmit={onSubmit}>
        <div className="km-field">
          <label htmlFor="pw">Password</label>
          <input
            id="pw"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error ? (
          <p style={{ color: "#b91c1c", fontSize: "0.9rem", margin: 0 }}>{error}</p>
        ) : null}
        <div className="km-actions">
          <button type="submit" className="km-btn km-btn-primary" disabled={loading}>
            {loading ? "…" : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function VaultLoginPage() {
  return (
    <Suspense fallback={<div className="km-wrap">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
