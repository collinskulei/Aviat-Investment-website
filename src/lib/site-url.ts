import { headers } from "next/headers";

/**
 * Absolute origin of the current request (e.g. "https://aviatinvestment.co.ke"
 * or "http://localhost:3000"), used to build the magic-link redirect URL.
 * Works behind Vercel's proxy and in local dev without a hardcoded env var.
 */
export async function getSiteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
