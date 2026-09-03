export const SITE_NAME = "Aviat Investment";
export const SITE_NAME_FULL = "Aviat Investment Limited";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
] as const;

/** Placeholder contact details - replace with the real ones. */
export const CONTACT = {
  phone: "[PHONE NUMBER]",
  email: "[EMAIL ADDRESS]",
  address: "[STREET ADDRESS], Wilson Airport, Nairobi, Kenya",
  hours: "[BUSINESS HOURS]",
};

export const WHY_CHOOSE_US = [
  {
    icon: "map-pin",
    title: "Strategic Location",
    description:
      "Conveniently based at Wilson Airport, near Parapet, for easy access and fast turnaround.",
  },
  {
    icon: "shield-check",
    title: "Aviation Experts",
    description:
      "Dedicated specialists focused on the most critical safety components of your aircraft.",
  },
  {
    icon: "sparkles",
    title: "Quality Assured",
    description:
      "Rigorous overhaul and testing processes that prioritize passenger safety and equipment longevity.",
  },
] as const;
