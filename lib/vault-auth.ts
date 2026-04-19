/**
 * Vault browser gate for /garden (Quartz static output).
 * Edge-safe: no Node crypto (middleware runs on Edge).
 */

export const VAULT_COOKIE_NAME = "khemind_vault"

export function vaultGateEnabled(): boolean {
  const p = process.env.VAULT_VIEW_PASSWORD
  const t = process.env.VAULT_VIEW_COOKIE_TOKEN
  return Boolean(p && t && p.length >= 8 && t.length >= 24)
}

export function vaultCookieMatches(value: string | undefined): boolean {
  const expected = process.env.VAULT_VIEW_COOKIE_TOKEN
  if (!expected || value === undefined) return false
  return value === expected
}
