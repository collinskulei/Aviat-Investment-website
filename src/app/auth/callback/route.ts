import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Where a magic-link email points visitors. Exchanges the one-time code for
 * a real session (setting the auth cookies), then sends them on to whatever
 * admin page they originally asked for.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin-dashboard";
  const safeNext = next.startsWith("/admin-dashboard") ? next : "/admin-dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/aviat-admin?error=1`);
}
