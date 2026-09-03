import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SEED_WHY_CHOOSE_US } from "@/lib/seed-why-choose-us";
import type { WhyChooseUsItem } from "@/lib/types";

/** Active "Why choose us" cards, shown on Home and About. Falls back to seed content. */
export async function getWhyChooseUsItems(): Promise<WhyChooseUsItem[]> {
  if (!isSupabaseConfigured) return SEED_WHY_CHOOSE_US;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("why_choose_us")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return SEED_WHY_CHOOSE_US;

  return data as WhyChooseUsItem[];
}
