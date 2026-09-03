import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SEED_SITE_CONTENT } from "@/lib/seed-site-content";
import type { SiteContent } from "@/lib/types";

/** Editable site copy (hero, about, contact, logo). Falls back to seed content. */
export async function getSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured) return SEED_SITE_CONTENT;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  if (error || !data) return SEED_SITE_CONTENT;

  return data as SiteContent;
}
