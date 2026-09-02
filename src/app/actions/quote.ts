"use server";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type QuoteFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitQuoteRequest(
  _prevState: QuoteFormState,
  formData: FormData
): Promise<QuoteFormState> {
  // Honeypot field — real users never fill this in.
  if (formData.get("company_website")) {
    return { status: "success", message: "Thanks! We'll be in touch shortly." };
  }

  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!full_name || !email || !service) {
    return { status: "error", message: "Please fill in your name, email, and service required." };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message: "Service requests aren't available yet — Supabase isn't connected. Please email us directly.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("quote_requests").insert({
    full_name,
    email,
    service,
    message,
  });

  if (error) {
    return { status: "error", message: "Something went wrong on our end. Please try again shortly." };
  }

  return { status: "success", message: "Thanks! Our technical team will reach out within 24 hours." };
}
