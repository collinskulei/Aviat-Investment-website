import type { Service } from "@/lib/types";

/**
 * Fallback content used when Supabase isn't configured yet, or the
 * `services` table is empty. Lets the site render real content out of
 * the box; once Supabase is connected, rows in the `services` table
 * take over (see supabase/schema.sql).
 */
export const SEED_SERVICES: Service[] = [
  {
    id: "seed-aircraft-battery-maintenance",
    slug: "aircraft-battery-maintenance",
    title: "Aircraft Battery Maintenance",
    short_description:
      "Comprehensive charging, restoration, and overhaul services to keep your power systems reliable.",
    description:
      "Full lifecycle care for aircraft batteries, including scheduled charging, capacity testing, restoration, and complete overhaul in line with manufacturer and regulatory requirements.",
    icon: "battery-charging",
    image_url: null,
    sort_order: 1,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "seed-life-vest-servicing",
    slug: "life-vest-servicing",
    title: "Life Vest Servicing",
    short_description:
      "Expert servicing and overhaul of life vests to ensure maximum safety and compliance.",
    description:
      "Inspection, repacking, and overhaul of aviation life vests, verifying inflation systems, CO2 cylinders, and fabric integrity against airworthiness standards.",
    icon: "life-buoy",
    image_url: null,
    sort_order: 2,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "seed-emergency-power-packs",
    slug: "emergency-power-packs",
    title: "Emergency Power Packs",
    short_description:
      "Restoration and overhaul of existing power packs, plus high-quality new units.",
    description:
      "Restoration and overhaul of emergency power packs used across critical aircraft systems, with new-unit supply available where restoration isn't viable.",
    icon: "zap",
    image_url: null,
    sort_order: 3,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "seed-ulb-battery-restoration",
    slug: "ulb-battery-restoration",
    title: "ULB Battery Restoration",
    short_description:
      "Specialized restoration services for Underwater Locator Beacon (ULB) batteries.",
    description:
      "Precision restoration of Underwater Locator Beacon batteries, ensuring reliable activation and signal duration in line with flight data recorder requirements.",
    icon: "radio",
    image_url: null,
    sort_order: 4,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "seed-hydrostatic-testing",
    slug: "hydrostatic-testing",
    title: "Hydrostatic Testing",
    short_description:
      "Precise hydrostatic testing on cylinders to meet rigorous industry standards.",
    description:
      "Hydrostatic pressure testing on aviation cylinders to confirm structural integrity and compliance with rigorous industry safety standards.",
    icon: "gauge",
    image_url: null,
    sort_order: 5,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "seed-oxygen-cylinder-overhaul",
    slug: "oxygen-cylinder-overhaul",
    title: "Oxygen Cylinder Overhaul",
    short_description:
      "Full overhaul of oxygen cylinders to keep emergency breathing systems mission ready.",
    description:
      "Complete overhaul of aviation oxygen cylinders, including pressure testing, valve servicing, and certification to keep emergency breathing systems mission ready.",
    icon: "wind",
    image_url: null,
    sort_order: 6,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];
