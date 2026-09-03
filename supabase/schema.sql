-- Aviat Investment Limited - Supabase schema
-- Run this in the Supabase SQL editor for a new project, and safe to
-- re-run any time this file changes (every statement is idempotent,
-- including policies, so re-running never errors on "already exists").
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).

-- ---------------------------------------------------------------------------
-- services: CMS-style content for the Home/Services pages. Admins manage
-- these from /admin-dashboard/services; the site falls back to
-- src/lib/seed-services.ts until this table has rows.
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
drop policy if exists "Public can read active services" on public.services;
create policy "Public can read active services"
  on public.services for select
  to anon, authenticated
  using (is_active = true);

-- Signed-in admins (any Supabase Auth user - accounts are created manually,
-- there is no public sign-up) can read every row, including inactive ones.
drop policy if exists "Admins can read all services" on public.services;
create policy "Admins can read all services"
  on public.services for select
  to authenticated
  using (true);

drop policy if exists "Admins can insert services" on public.services;
create policy "Admins can insert services"
  on public.services for insert
  to authenticated
  with check (true);

drop policy if exists "Admins can update services" on public.services;
create policy "Admins can update services"
  on public.services for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins can delete services" on public.services;
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
-- update, or delete - only admins (authenticated) can read/manage submissions.
drop policy if exists "Anyone can submit a quote request" on public.quote_requests;
create policy "Anyone can submit a quote request"
  on public.quote_requests for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can read quote requests" on public.quote_requests;
create policy "Admins can read quote requests"
  on public.quote_requests for select
  to authenticated
  using (true);

drop policy if exists "Admins can update quote requests" on public.quote_requests;
create policy "Admins can update quote requests"
  on public.quote_requests for update
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- Seed data - mirrors src/lib/seed-services.ts. Safe to run multiple times.
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
-- Per-service image (optional; falls back to the icon when not set).
-- ---------------------------------------------------------------------------
alter table public.services add column if not exists image_url text;

-- ---------------------------------------------------------------------------
-- site_content: single-row table of editable copy (logo, hero, about,
-- contact) managed from /admin-dashboard/content.
-- ---------------------------------------------------------------------------
create table if not exists public.site_content (
  id text primary key default 'default',
  logo_url text,
  hero_headline text not null default '',
  hero_subheadline text not null default '',
  hero_tagline text not null default '',
  hero_image_url text,
  about_intro text not null default '',
  about_mission text not null default '',
  about_image_url text,
  contact_phone text not null default '',
  contact_email text not null default '',
  contact_address text not null default '',
  contact_hours text not null default '',
  updated_at timestamptz not null default now()
);

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can update site content" on public.site_content;
create policy "Admins can update site content"
  on public.site_content for update
  to authenticated
  using (true)
  with check (true);

-- Lets the admin's save action use upsert() safely even if the seed row
-- below was never created.
drop policy if exists "Admins can insert site content" on public.site_content;
create policy "Admins can insert site content"
  on public.site_content for insert
  to authenticated
  with check (true);

insert into public.site_content (
  id, hero_headline, hero_subheadline, hero_tagline,
  about_intro, about_mission,
  contact_phone, contact_email, contact_address, contact_hours
)
values (
  'default',
  'Precision Maintenance',
  'for Aviation Safety.',
  'Trusted expertise located at Wilson Airport.',
  E'Aviat Investment Limited is an aviation component maintenance company operating out of Wilson Airport, near Parapet. We focus exclusively on the critical safety equipment that keeps aircraft and crews protected: batteries, life vests, emergency power packs, locator beacons, and pressure vessels.\n\nOur team combines hands-on technical expertise with rigorous, standards-driven processes, so operators can trust that every component we touch meets the demands of real-world flight operations.',
  'To deliver precise, dependable maintenance for aviation safety equipment, giving operators confidence in every takeoff, and every landing.',
  '[PHONE NUMBER]', '[EMAIL ADDRESS]', '[STREET ADDRESS], Wilson Airport, Nairobi, Kenya', '[BUSINESS HOURS]'
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- why_choose_us: the three cards on Home/About, editable from the admin.
-- ---------------------------------------------------------------------------
create table if not exists public.why_choose_us (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text not null,
  icon text not null default 'sparkles',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists why_choose_us_set_updated_at on public.why_choose_us;
create trigger why_choose_us_set_updated_at
  before update on public.why_choose_us
  for each row execute function public.set_updated_at();

alter table public.why_choose_us enable row level security;

drop policy if exists "Public can read active why-choose-us items" on public.why_choose_us;
create policy "Public can read active why-choose-us items"
  on public.why_choose_us for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Admins can read all why-choose-us items" on public.why_choose_us;
create policy "Admins can read all why-choose-us items"
  on public.why_choose_us for select
  to authenticated
  using (true);

drop policy if exists "Admins can insert why-choose-us items" on public.why_choose_us;
create policy "Admins can insert why-choose-us items"
  on public.why_choose_us for insert
  to authenticated
  with check (true);

drop policy if exists "Admins can update why-choose-us items" on public.why_choose_us;
create policy "Admins can update why-choose-us items"
  on public.why_choose_us for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins can delete why-choose-us items" on public.why_choose_us;
create policy "Admins can delete why-choose-us items"
  on public.why_choose_us for delete
  to authenticated
  using (true);

insert into public.why_choose_us (title, description, icon, sort_order)
values
  ('Strategic Location', 'Conveniently based at Wilson Airport, near Parapet, for easy access and fast turnaround.', 'map-pin', 1),
  ('Aviation Experts', 'Dedicated specialists focused on the most critical safety components of your aircraft.', 'shield-check', 2),
  ('Quality Assured', 'Rigorous overhaul and testing processes that prioritize passenger safety and equipment longevity.', 'sparkles', 3)
on conflict (title) do nothing;

-- ---------------------------------------------------------------------------
-- Storage bucket for admin-uploaded images (logo, hero photo, about photo,
-- per-service photos). Public read so the site can display them; only
-- signed-in admins can upload, replace, or delete.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

drop policy if exists "Public can view site media" on storage.objects;
create policy "Public can view site media"
  on storage.objects for select
  using (bucket_id = 'site-media');

drop policy if exists "Admins can upload site media" on storage.objects;
create policy "Admins can upload site media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-media');

drop policy if exists "Admins can update site media" on storage.objects;
create policy "Admins can update site media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-media');

drop policy if exists "Admins can delete site media" on storage.objects;
create policy "Admins can delete site media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-media');
