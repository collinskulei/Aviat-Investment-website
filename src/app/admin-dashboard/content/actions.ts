"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

export async function updateSiteContent(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const payload = {
    hero_headline: String(formData.get("hero_headline") ?? "").trim(),
    hero_subheadline: String(formData.get("hero_subheadline") ?? "").trim(),
    hero_tagline: String(formData.get("hero_tagline") ?? "").trim(),
    about_intro: String(formData.get("about_intro") ?? "").trim(),
    about_mission: String(formData.get("about_mission") ?? "").trim(),
    contact_phone: String(formData.get("contact_phone") ?? "").trim(),
    contact_email: String(formData.get("contact_email") ?? "").trim(),
    contact_address: String(formData.get("contact_address") ?? "").trim(),
    contact_hours: String(formData.get("contact_hours") ?? "").trim(),
  };

  // Upsert (not update) so this still works even if the seed row from
  // supabase/schema.sql was never created.
  const { error } = await supabase.from("site_content").upsert({ id: "default", ...payload });

  if (error) {
    console.error("[content] Failed to update site_content:", error.message);
    return { ok: false, message: "Couldn't save changes. Please try again." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin-dashboard/content");

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

  const { error } = id
    ? await supabase.from("why_choose_us").update(payload).eq("id", id)
    : await supabase.from("why_choose_us").insert(payload);

  if (error) {
    console.error("[content] Failed to save why_choose_us card:", error.message);
    return { ok: false, message: "Couldn't save the card. Please try again." };
  }

  revalidatePath("/admin-dashboard/content");
  revalidatePath("/", "layout");

  return { ok: true, message: id ? `"${payload.title}" saved.` : `"${payload.title}" added.` };
}

export async function deleteWhyChooseUsItem(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("why_choose_us").delete().eq("id", id);

  if (error) {
    console.error("[content] Failed to delete why_choose_us card:", error.message);
    return { ok: false, message: "Couldn't delete the card. Please try again." };
  }

  revalidatePath("/admin-dashboard/content");
  revalidatePath("/", "layout");

  return { ok: true, message: "Card deleted." };
}
