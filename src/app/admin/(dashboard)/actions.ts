"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { QuoteRequestStatus } from "@/lib/types";

export async function updateQuoteStatus(id: string, status: QuoteRequestStatus) {
  const supabase = await createClient();
  await supabase.from("quote_requests").update({ status }).eq("id", id);
  revalidatePath("/admin");
}

export async function upsertService(formData: FormData) {
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

  if (id) {
    await supabase.from("services").update(payload).eq("id", id);
  } else {
    await supabase.from("services").insert(payload);
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  await supabase.from("services").delete().eq("id", id);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
}
