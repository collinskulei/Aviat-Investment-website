"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getSiteOrigin } from "@/lib/site-url";

export type MagicLinkState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

const SENT_MESSAGE = "A sign-in link is on its way. Check your inbox.";

const NO_ACCESS_MESSAGE =
  "Your email has no access to the dashboard. Please contact your administrator.";

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

  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message: "Sign-in isn't available yet because Supabase isn't connected.",
    };
  }

  const origin = await getSiteOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // No public sign-up. A magic link only works for an email that
      // already has an admin account created in the Supabase dashboard.
      shouldCreateUser: false,
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
    },
  });

  if (error) {
    console.error("[login] Supabase signInWithOtp error:", error.status, error.code, error.message);

    // With shouldCreateUser: false, Supabase refuses emails that have no account.
    const noAccess =
      error.code === "otp_disabled" ||
      error.code === "signup_disabled" ||
      error.code === "user_not_found" ||
      /signups not allowed/i.test(error.message);
    if (noAccess) {
      return { status: "error", message: NO_ACCESS_MESSAGE };
    }

    if (error.status === 429 || error.code?.startsWith("over_")) {
      return {
        status: "error",
        message: "Too many sign-in requests. Please wait a few minutes and try again.",
      };
    }

    return {
      status: "error",
      message: "We couldn't send a sign-in link right now. Please try again shortly.",
    };
  }

  return { status: "success", message: SENT_MESSAGE };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/aviat-admin");
}
