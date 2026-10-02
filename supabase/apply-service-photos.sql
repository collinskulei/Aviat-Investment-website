-- Aviat Investment Limited - apply real service/about photography
-- Run this ONCE in the Supabase SQL editor after pulling the images added
-- to public/images/ in this commit. Unlike schema.sql, this is NOT meant
-- to be re-run automatically alongside future schema changes - it sets
-- content, and re-running it later would clobber any photo an admin has
-- since uploaded through /admin-dashboard. Safe to run more than once by
-- itself, just don't fold it into routine schema.sql re-runs.

update public.services set image_url = '/images/services/aircraft-battery-maintenance.webp'
  where slug = 'aircraft-battery-maintenance' and image_url is null;

update public.services set image_url = '/images/services/life-vest-servicing.webp'
  where slug = 'life-vest-servicing' and image_url is null;

update public.services set image_url = '/images/services/emergency-power-packs.webp'
  where slug = 'emergency-power-packs' and image_url is null;

update public.services set image_url = '/images/services/ulb-battery-restoration.webp'
  where slug = 'ulb-battery-restoration' and image_url is null;

update public.services set image_url = '/images/services/oxygen-cylinder-overhaul.webp'
  where slug = 'oxygen-cylinder-overhaul' and image_url is null;

-- Hydrostatic Testing intentionally has no matching photo among the ones
-- provided; it keeps showing its icon until a real one is uploaded.

update public.site_content set about_image_url = '/images/about-component-detail.jpg'
  where id = 'default' and about_image_url is null;
