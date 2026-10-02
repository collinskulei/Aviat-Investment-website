"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

const EDITABLE_FIELDS = [
  "hero_headline",
  "hero_subheadline",
  "hero_tagline",
  "about_intro",
  "about_mission",
  "contact_phone",
  "contact_email",
  "contact_address",
  "contact_hours",
] as const;

export async function updateSiteContent(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  // Each section page submits only its own fields, so only write the fields
  // present in this submission and leave the rest untouched.
  const payload: Record<string, string> = {};
  for (const field of EDITABLE_FIELDS) {
    const value = formData.get(field);
    if (value !== null) payload[field] = String(value).trim();
  }

  // Upsert (not update) so this still works even if the seed row from
  // supabase/schema.sql was never created.
  const { error } = await supabase.from("site_content").upsert({ id: "default", ...payload });

  if (error) {
    console.error("[content] Failed to update site_content:", error.message);
    return { ok: false, message: "Couldn't save changes. Please try again." };
  }

  revalidatePath("/", "layout");

  return { ok: true, message: "Site content saved." };
}

export async function upsertWhyChooseUsItem(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    icon: String(formData.get("icon") ?? "sparkles").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: formData.get("is_active") === "on",
  };

  const { data, error } = id
    ? await supabase.from("why_choose_us").update(payload).eq("id", id).select("id").single()
    : await supabase.from("why_choose_us").insert(payload).select("id").single();

  if (error) {
    console.error("[content] Failed to save why_choose_us card:", error.message);
    return { ok: false, message: "Couldn't save the card. Please try again." };
  }

  revalidatePath("/", "layout");

  return {
    ok: true,
    message: id ? `"${payload.title}" saved.` : `"${payload.title}" added.`,
    id: data?.id ?? id,
  };
}

export async function deleteWhyChooseUsItem(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("why_choose_us").delete().eq("id", id);

  if (error) {
    console.error("[content] Failed to delete why_choose_us card:", error.message);
    return { ok: false, message: "Couldn't delete the card. Please try again." };
  }

  revalidatePath("/", "layout");

  return { ok: true, message: "Card deleted." };
}
