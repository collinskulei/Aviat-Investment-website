"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  QUOTE_CURRENCIES,
  isActivityKind,
  isQuotePriority,
  isQuoteStatus,
  stageMeta,
} from "@/lib/quotes";
import type { ActionResult, QuoteCurrency, QuoteRequestStatus } from "@/lib/types";

type Supabase = Awaited<ReturnType<typeof createClient>>;

function revalidateQuotes() {
  revalidatePath("/admin-dashboard", "layout");
}

async function currentUserEmail(supabase: Supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? null;
}

async function logActivity(
  supabase: Supabase,
  quoteId: string,
  kind: "note" | "call" | "email" | "meeting" | "status",
  body: string
) {
  const { error } = await supabase.from("quote_activities").insert({
    quote_id: quoteId,
    kind,
    body,
    author_email: await currentUserEmail(supabase),
  });
  if (error) console.error("[quotes] Failed to log activity:", error.message);
}

async function logStageChange(
  supabase: Supabase,
  quoteId: string,
  from: QuoteRequestStatus,
  to: QuoteRequestStatus
) {
  if (from === to) return;
  await logActivity(
    supabase,
    quoteId,
    "status",
    `Stage changed from ${stageMeta(from).label} to ${stageMeta(to).label}.`
  );
}

export async function updateQuoteStatus(
  id: string,
  status: QuoteRequestStatus
): Promise<ActionResult> {
  if (!isQuoteStatus(status)) return { ok: false, message: "Unknown stage." };

  const supabase = await createClient();
  const { data: before } = await supabase
    .from("quote_requests")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);

  if (error) {
    console.error("[quotes] Failed to update status:", error.message);
    return { ok: false, message: "Couldn't update the stage. Please try again." };
  }

  if (before) await logStageChange(supabase, id, before.status as QuoteRequestStatus, status);

  revalidateQuotes();
  return { ok: true, message: `Moved to ${stageMeta(status).label}.` };
}

export async function updateQuoteDetails(id: string, formData: FormData): Promise<ActionResult> {
  const status = String(formData.get("status") ?? "");
  const priority = String(formData.get("priority") ?? "");
  const currency = String(formData.get("currency") ?? "KES");
  const amountRaw = String(formData.get("quoted_amount") ?? "").replace(/,/g, "").trim();
  const followUpRaw = String(formData.get("follow_up_on") ?? "").trim();

  if (!isQuoteStatus(status)) return { ok: false, message: "Please choose a valid stage." };
  if (!isQuotePriority(priority)) return { ok: false, message: "Please choose a valid priority." };
  if (!QUOTE_CURRENCIES.includes(currency as QuoteCurrency)) {
    return { ok: false, message: "Please choose a valid currency." };
  }

  const quoted_amount = amountRaw === "" ? null : Number(amountRaw);
  if (quoted_amount !== null && (!Number.isFinite(quoted_amount) || quoted_amount < 0)) {
    return { ok: false, message: "Quoted amount must be a positive number." };
  }
  if (followUpRaw && !/^\d{4}-\d{2}-\d{2}$/.test(followUpRaw)) {
    return { ok: false, message: "Follow-up date is invalid." };
  }

  const payload = {
    full_name: String(formData.get("full_name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    status,
    priority,
    currency,
    quoted_amount,
    follow_up_on: followUpRaw || null,
  };

  if (!payload.full_name || !payload.email) {
    return { ok: false, message: "Name and email are required." };
  }

  const supabase = await createClient();
  const { data: before } = await supabase
    .from("quote_requests")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("quote_requests").update(payload).eq("id", id);

  if (error) {
    console.error("[quotes] Failed to update quote:", error.message);
    return { ok: false, message: "Couldn't save the quote. Please try again." };
  }

  if (before) await logStageChange(supabase, id, before.status as QuoteRequestStatus, status);

  revalidateQuotes();
  return { ok: true, message: "Quote details saved." };
}

export async function addQuoteActivity(quoteId: string, formData: FormData): Promise<ActionResult> {
  const kind = String(formData.get("kind") ?? "note");
  const body = String(formData.get("body") ?? "").trim();

  if (!isActivityKind(kind)) return { ok: false, message: "Please choose an activity type." };
  if (!body) return { ok: false, message: "Please write something before logging it." };

  const supabase = await createClient();
  const { error } = await supabase.from("quote_activities").insert({
    quote_id: quoteId,
    kind,
    body,
    author_email: await currentUserEmail(supabase),
  });

  if (error) {
    console.error("[quotes] Failed to add activity:", error.message);
    return { ok: false, message: "Couldn't log the activity. Please try again." };
  }

  revalidateQuotes();
  return { ok: true, message: "Activity logged." };
}

export async function deleteQuote(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("quote_requests").delete().eq("id", id);

  if (error) {
    console.error("[quotes] Failed to delete quote:", error.message);
    return { ok: false, message: "Couldn't delete the quote. Please try again." };
  }

  revalidateQuotes();
  return { ok: true, message: "Quote request deleted." };
}
