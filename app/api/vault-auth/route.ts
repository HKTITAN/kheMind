import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  vaultGateEnabled,
  VAULT_COOKIE_NAME,
} from "@/lib/vault-auth"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!vaultGateEnabled()) {
    return NextResponse.json(
      { error: "Vault gate is not configured (set VAULT_VIEW_PASSWORD and VAULT_VIEW_COOKIE_TOKEN)." },
      { status: 503 },
    )
  }

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const expected = process.env.VAULT_VIEW_PASSWORD
  const token = process.env.VAULT_VIEW_COOKIE_TOKEN
  if (!expected || !token || body.password !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const cookieStore = await cookies()
  const isProd = process.env.NODE_ENV === "production"
  cookieStore.set(VAULT_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  return NextResponse.json({ ok: true })
}
