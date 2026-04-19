import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { VAULT_COOKIE_NAME } from "@/lib/vault-auth"

export const runtime = "nodejs"

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete(VAULT_COOKIE_NAME)
  return NextResponse.json({ ok: true })
}
