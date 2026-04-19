import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  vaultGateEnabled,
  vaultCookieMatches,
  VAULT_COOKIE_NAME,
} from "@/lib/vault-auth"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/garden")) {
    return NextResponse.next()
  }

  if (!vaultGateEnabled()) {
    return NextResponse.next()
  }

  const token = request.cookies.get(VAULT_COOKIE_NAME)?.value
  if (vaultCookieMatches(token)) {
    return NextResponse.next()
  }

  const login = new URL("/vault/login", request.url)
  login.searchParams.set("next", pathname + request.nextUrl.search)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: ["/garden", "/garden/:path*"],
}
