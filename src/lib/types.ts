export type Service = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  icon: string;
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
