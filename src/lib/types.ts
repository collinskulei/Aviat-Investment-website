export type Service = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  icon: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type QuoteRequestStatus = "new" | "contacted" | "resolved";

export type QuoteRequest = {
  id: string;
  full_name: string;
  email: string;
  service: string;
  message: string;
  status: QuoteRequestStatus;
  created_at: string;
};

export type WhyChooseUsItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteContent = {
  id: string;
  logo_url: string | null;
  hero_headline: string;
  hero_subheadline: string;
  hero_tagline: string;
  hero_image_url: string | null;
  about_intro: string;
  about_mission: string;
  about_image_url: string | null;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  contact_hours: string;
  updated_at: string;
};
