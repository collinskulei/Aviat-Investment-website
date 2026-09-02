-- Aviat Investment Limited — Supabase schema
-- Run this once in the Supabase SQL editor for a new project
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).

-- ---------------------------------------------------------------------------
-- services: CMS-style content for the Home/Services pages. Admins manage
-- these from /admin/services; the site falls back to src/lib/seed-services.ts
-- until this table has rows.
-- ---------------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text not null,
  description text not null default '',
  icon text not null default 'wrench',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_sort_order_idx on public.services (sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

alter table public.services enable row level security;

-- Anyone (including anonymous visitors) can read active services.
create policy "Public can read active services"
  on public.services for select
  to anon, authenticated
  using (is_active = true);

-- Signed-in admins (any Supabase Auth user — accounts are created manually,
-- there is no public sign-up) can read every row, including inactive ones.
create policy "Admins can read all services"
  on public.services for select
  to authenticated
  using (true);

create policy "Admins can insert services"
  on public.services for insert
  to authenticated
  with check (true);

create policy "Admins can update services"
  on public.services for update
  to authenticated
  using (true)
  with check (true);

create policy "Admins can delete services"
  on public.services for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- quote_requests: submissions from the "Request a Service Quote" form.
-- ---------------------------------------------------------------------------
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  service text not null,
  message text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'resolved')),
  created_at timestamptz not null default now()
);

create index if not exists quote_requests_created_at_idx on public.quote_requests (created_at desc);

alter table public.quote_requests enable row level security;

-- The public quote form inserts as the anonymous role. No public select,
-- update, or delete — only admins (authenticated) can read/manage submissions.
create policy "Anyone can submit a quote request"
  on public.quote_requests for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read quote requests"
  on public.quote_requests for select
  to authenticated
  using (true);

create policy "Admins can update quote requests"
  on public.quote_requests for update
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- Seed data — mirrors src/lib/seed-services.ts. Safe to run multiple times.
-- ---------------------------------------------------------------------------
insert into public.services (slug, title, short_description, description, icon, sort_order)
values
  ('aircraft-battery-maintenance', 'Aircraft Battery Maintenance',
   'Comprehensive charging, restoration, and overhaul services to keep your power systems reliable.',
   'Full lifecycle care for aircraft batteries, including scheduled charging, capacity testing, restoration, and complete overhaul in line with manufacturer and regulatory requirements.',
   'battery-charging', 1),
  ('life-vest-servicing', 'Life Vest Servicing',
   'Expert servicing and overhaul of life vests to ensure maximum safety and compliance.',
   'Inspection, repacking, and overhaul of aviation life vests, verifying inflation systems, CO2 cylinders, and fabric integrity against airworthiness standards.',
   'life-buoy', 2),
  ('emergency-power-packs', 'Emergency Power Packs',
   'Restoration and overhaul of existing power packs, plus high-quality new units.',
   'Restoration and overhaul of emergency power packs used across critical aircraft systems, with new-unit supply available where restoration isn''t viable.',
   'zap', 3),
  ('ulb-battery-restoration', 'ULB Battery Restoration',
   'Specialized restoration services for Underwater Locator Beacon (ULB) batteries.',
   'Precision restoration of Underwater Locator Beacon batteries, ensuring reliable activation and signal duration in line with flight data recorder requirements.',
   'radio', 4),
  ('hydrostatic-testing', 'Hydrostatic Testing',
   'Precise hydrostatic testing on cylinders to meet rigorous industry standards.',
   'Hydrostatic pressure testing on aviation cylinders to confirm structural integrity and compliance with rigorous industry safety standards.',
   'gauge', 5),
  ('oxygen-cylinder-overhaul', 'Oxygen Cylinder Overhaul',
   'Full overhaul of oxygen cylinders to keep emergency breathing systems mission ready.',
   'Complete overhaul of aviation oxygen cylinders, including pressure testing, valve servicing, and certification to keep emergency breathing systems mission ready.',
   'wind', 6)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Optional: public storage bucket for site images (hero photos, etc.).
-- Uncomment to create it via SQL instead of the Storage dashboard.
-- ---------------------------------------------------------------------------
-- insert into storage.buckets (id, name, public)
-- values ('site-media', 'site-media', true)
-- on conflict (id) do nothing;
