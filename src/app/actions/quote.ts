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
  // Honeypot field - real users never fill this in.
  if (formData.get("company_website")) {
    return { status: "success", message: "Thanks! We'll be in touch shortly." };
  }

  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!full_name || !email || !phone || !service) {
    return {
      status: "error",
      message: "Please fill in your name, email, phone number, and service required.",
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  // Allow +, spaces, dashes, dots and brackets, but require 7-15 digits.
  const phoneDigits = phone.replace(/\D/g, "");
  if (!/^[\d\s+().-]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    return { status: "error", message: "Please enter a valid phone number." };
  }

  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message: "Service requests aren't available yet because Supabase isn't connected. Please email us directly.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("quote_requests").insert({
    full_name,
    email,
    phone,
    company,
    service,
    message,
  });

  if (error) {
    return { status: "error", message: "Something went wrong on our end. Please try again shortly." };
  }

  return { status: "success", message: "Thanks! Our technical team will reach out within 24 hours." };
}
