"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type UploadState = {
  status: "idle" | "success" | "error";
  message: string | null;
  url: string | null;
};

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Uploads an image to the `site-media` Supabase Storage bucket and writes
 * its public URL onto whichever row/column `target` names, so every image
 * on the site (logo, hero, about photo, per-service photo) goes through
 * this one action instead of a bespoke uploader per field.
 *
 * `target` is one of: "logo" | "hero" | "about" | "service:<id>"
 */
export async function uploadSiteMedia(
  _prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  const file = formData.get("file");
  const target = String(formData.get("target") ?? "");

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Please choose an image file.", url: null };
  }
  if (!file.type.startsWith("image/")) {
    return { status: "error", message: "That file isn't an image.", url: null };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { status: "error", message: "Images must be 5MB or smaller.", url: null };
  }

  const supabase = await createClient();

  const rawExt = file.name.includes(".") ? file.name.split(".").pop() ?? "" : "";
  const ext = /^[a-zA-Z0-9]{1,5}$/.test(rawExt) ? rawExt.toLowerCase() : "jpg";
  const safeTarget = target.replace(/[^a-zA-Z0-9-]/g, "-");
  const path = `${safeTarget}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("site-media")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    console.error("[media] Supabase Storage upload error:", uploadError.message);
    return { status: "error", message: "Upload failed. Please try again.", url: null };
  }

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
  }

  if (dbError) {
    console.error("[media] Failed to save image URL:", dbError);
    return { status: "error", message: "Image uploaded, but saving it failed. Try again.", url: null };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin-dashboard", "layout");

  return { status: "success", message: "Image updated.", url: publicUrl };
}

async function setSiteContentField(
  supabase: Awaited<ReturnType<typeof createClient>>,
  field: "logo_url" | "hero_image_url" | "about_image_url",
  url: string
) {
  return supabase.from("site_content").update({ [field]: url }).eq("id", "default");
}
