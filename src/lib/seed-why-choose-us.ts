import type { WhyChooseUsItem } from "@/lib/types";

/** Fallback content used when Supabase isn't configured yet, or the table is empty. */
export const SEED_WHY_CHOOSE_US: WhyChooseUsItem[] = [
  {
    id: "seed-strategic-location",
    title: "Strategic Location",
    description:
      "Conveniently based at Wilson Airport, near Parapet, for easy access and fast turnaround.",
    icon: "map-pin",
    sort_order: 1,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "seed-aviation-experts",
    title: "Aviation Experts",
    description:
      "Dedicated specialists focused on the most critical safety components of your aircraft.",
    icon: "shield-check",
    sort_order: 2,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "seed-quality-assured",
    title: "Quality Assured",
    description:
      "Rigorous overhaul and testing processes that prioritize passenger safety and equipment longevity.",
    icon: "sparkles",
    sort_order: 3,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];
