import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SEED_SERVICES } from "@/lib/seed-services";
import type { Service } from "@/lib/types";

/** Active services for public pages. Falls back to seed data until Supabase holds rows. */
export async function getActiveServices(): Promise<Service[]> {
  if (!isSupabaseConfigured) return SEED_SERVICES;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return SEED_SERVICES;

  return data as Service[];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getActiveServices();
  return services.find((service) => service.slug === slug) ?? null;
}
