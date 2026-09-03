"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteOrigin } from "@/lib/site-url";

export type MagicLinkState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

const GENERIC_SENT_MESSAGE =
  "If that email has admin access, a sign-in link is on its way. Check your inbox.";

export async function sendMagicLink(
  _prevState: MagicLinkState,
  formData: FormData
): Promise<MagicLinkState> {
  const email = String(formData.get("email") ?? "").trim();
  const next = String(formData.get("next") ?? "/admin-dashboard");
  const safeNext = next.startsWith("/admin-dashboard") ? next : "/admin-dashboard";

  if (!email) {
    return { status: "error", message: "Please enter your email address." };
  }

  const origin = await getSiteOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // No public sign-up — a magic link only works for an email that
      // already has an admin account created in the Supabase dashboard.
      shouldCreateUser: false,
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
    },
  });

  if (error) {
    console.error("[login] Supabase signInWithOtp error:", error.status, error.message);
  }

  // Same message whether or not the email exists, so visitors can't probe
  // for which addresses have admin access.
  return { status: "success", message: GENERIC_SENT_MESSAGE };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/aviat-admin");
}
