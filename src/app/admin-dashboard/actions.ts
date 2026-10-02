"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult, QuoteRequestStatus } from "@/lib/types";

// Postgres unique_violation - e.g. a service slug that's already taken.
const UNIQUE_VIOLATION = "23505";

export async function updateQuoteStatus(
  id: string,
  status: QuoteRequestStatus
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);

  if (error) {
    console.error("[quotes] Failed to update status:", error.message);
    return { ok: false, message: "Couldn't update the status. Please try again." };
  }

  revalidatePath("/admin-dashboard");
  return { ok: true, message: `Quote marked as ${status}.` };
}

export async function upsertService(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const payload = {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    short_description: String(formData.get("short_description") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    icon: String(formData.get("icon") ?? "wrench").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: formData.get("is_active") === "on",
  };

  const { error } = id
    ? await supabase.from("services").update(payload).eq("id", id)
    : await supabase.from("services").insert(payload);

  if (error) {
    console.error("[services] Failed to save service:", error.message);
    return {
      ok: false,
      message:
        error.code === UNIQUE_VIOLATION
          ? `The slug "${payload.slug}" is already used by another service.`
          : "Couldn't save the service. Please try again.",
    };
  }

  revalidatePath("/admin-dashboard/services");
  revalidatePath("/services", "layout");
  revalidatePath("/");

  return { ok: true, message: id ? `"${payload.title}" saved.` : `"${payload.title}" added.` };
}

export async function deleteService(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    console.error("[services] Failed to delete service:", error.message);
    return { ok: false, message: "Couldn't delete the service. Please try again." };
  }

  revalidatePath("/admin-dashboard/services");
  revalidatePath("/services", "layout");
  revalidatePath("/");

  return { ok: true, message: "Service deleted." };
}
