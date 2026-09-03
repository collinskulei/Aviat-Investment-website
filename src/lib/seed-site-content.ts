import type { SiteContent } from "@/lib/types";

/**
 * Fallback content used when Supabase isn't configured yet, or the
 * `site_content` row doesn't exist. Lets the site render real copy out of
 * the box; once an admin edits it from /admin-dashboard/content, the
 * database row takes over (see supabase/schema.sql).
 */
export const SEED_SITE_CONTENT: SiteContent = {
  id: "default",
  logo_url: null,
  hero_headline: "Precision Maintenance",
  hero_subheadline: "for Aviation Safety.",
  hero_tagline: "Trusted expertise located at Wilson Airport.",
  hero_image_url: null,
  about_intro:
    "Aviat Investment Limited is an aviation component maintenance company operating out of Wilson Airport, near Parapet. We focus exclusively on the critical safety equipment that keeps aircraft and crews protected: batteries, life vests, emergency power packs, locator beacons, and pressure vessels.\n\nOur team combines hands-on technical expertise with rigorous, standards-driven processes, so operators can trust that every component we touch meets the demands of real-world flight operations.",
  about_mission:
    "To deliver precise, dependable maintenance for aviation safety equipment, giving operators confidence in every takeoff, and every landing.",
  about_image_url: null,
  contact_phone: "[PHONE NUMBER]",
  contact_email: "[EMAIL ADDRESS]",
  contact_address: "[STREET ADDRESS], Wilson Airport, Nairobi, Kenya",
  contact_hours: "[BUSINESS HOURS]",
  updated_at: "",
};
