# Aviat Investment Limited — Website

Next.js (App Router) rebuild of the Aviat Investment Limited site, with Supabase for
content, form submissions, and admin auth, deployed on Vercel.

## Stack

- **Next.js 16** (App Router, TypeScript, Server Actions)
- **Tailwind CSS v4**
- **Supabase** — Postgres (services + quote requests), Auth (admin login), Storage (optional)
- **Vercel** — hosting

## Pages

- `/` — home (hero, why-choose-us, services preview, quote form)
- `/about` — company info
- `/services` — full services list
- `/contact` — contact details + quote form
- `/admin` — quote request inbox (requires Supabase Auth login)
- `/admin/services` — manage services shown on the site
- `/admin/login` — admin sign-in

## 1. Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The site renders with built-in placeholder content (`src/lib/seed-services.ts`) even
without Supabase configured — the quote form just won't be able to save submissions
until it's connected.

## 2. Connect Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings -> API**, copy the **Project URL** and **anon public key**
   into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Open the **SQL Editor** in the Supabase dashboard, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates:
   - `services` — editable content for the Home/Services pages (seeded with the
     current six services)
   - `quote_requests` — submissions from the "Request a Service Quote" form
   - Row Level Security policies (public can read active services and submit quote
     requests; only signed-in admins can read submissions or manage services)
4. Create an admin login: **Authentication -> Users -> Add user** (email + password).
   There is no public sign-up — only accounts created here can access `/admin`.

## 3. Deploy to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the same two environment variables from `.env.local` in the Vercel project's
   **Settings -> Environment Variables**.
4. Deploy.

## Content still to fill in

- **Contact details**: phone, email, and address in `src/lib/constants.ts`
  (`CONTACT`) are placeholders — replace with the real ones.
- **Photography**: the hero and banner sections currently use CSS gradients as
  stand-ins for aircraft photography. Drop real images into `public/images/` and
  swap them into `src/app/page.tsx` (and `about`/`services` if desired).
