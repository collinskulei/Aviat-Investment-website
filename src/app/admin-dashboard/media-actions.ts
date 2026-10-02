"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

export type MediaSaveResult = ActionResult & { url: string | null };

/**
 * Every image on the site (logo, hero, about photo, per-service photo) is
 * uploaded straight from the browser to the `site-media` Supabase Storage
 * bucket (so the dashboard can show real upload progress), then this action
 * writes the file's public URL onto whichever row/column `target` names.
 *
 * `target` is one of: "logo" | "hero" | "about" | "service:<id>"
 */
export async function saveSiteMedia(target: string, path: string): Promise<MediaSaveResult> {
  // Uploads are always stored under a folder named after their target
  // (see mediaFolder in ImageUploadField); reject anything else.
  const folder = target.replace(/[^a-zA-Z0-9-]/g, "-");
  if (!path.startsWith(`${folder}/`) || path.includes("..")) {
    return { ok: false, message: "Invalid upload. Please try again.", url: null };
  }

  const supabase = await createClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from("site-media").getPublicUrl(path);

  let dbError: string | null = null;

  if (target === "logo") {
    dbError = (await setSiteContentField(supabase, "logo_url", publicUrl)).error?.message ?? null;
  } else if (target === "hero") {
    dbError = (await setSiteContentField(supabase, "hero_image_url", publicUrl)).error?.message ?? null;
  } else if (target === "about") {
    dbError = (await setSiteContentField(supabase, "about_image_url", publicUrl)).error?.message ?? null;
  } else if (target.startsWith("service:")) {
    const serviceId = target.slice("service:".length);
    const { error } = await supabase
      .from("services")
      .update({ image_url: publicUrl })
      .eq("id", serviceId);
    dbError = error?.message ?? null;
  } else {
    return { ok: false, message: "Unknown image field.", url: null };
  }

  if (dbError) {
    console.error("[media] Failed to save image URL:", dbError);
    return { ok: false, message: "Image uploaded, but saving it failed. Try again.", url: null };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin-dashboard", "layout");

  return { ok: true, message: "Image uploaded and published.", url: publicUrl };
}

async function setSiteContentField(
  supabase: Awaited<ReturnType<typeof createClient>>,
  field: "logo_url" | "hero_image_url" | "about_image_url",
  url: string
) {
  return supabase.from("site_content").update({ [field]: url }).eq("id", "default");
}
