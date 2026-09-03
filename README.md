# Aviat Investment Limited - Website

Next.js (App Router) rebuild of the Aviat Investment Limited site, with Supabase for
content, form submissions, and admin auth, deployed on Vercel.

## Stack

- **Next.js 16** (App Router, TypeScript, Server Actions)
- **Tailwind CSS v4**
- **Supabase** - Postgres (services, site content, quote requests), Auth (magic-link admin login), Storage (admin-uploaded images)
- **Vercel** - hosting
- **next-themes** - light/dark mode toggle (dark by default, persisted per visitor)

## Pages

- `/` - home (hero, why-choose-us, services preview, quote form)
- `/about` - company info
- `/services` - full services list
- `/services/[slug]` - individual service detail page
- `/contact` - contact details + quote form (add `?service=Name` to preselect it)
- `/admin-dashboard` - quote request inbox (requires Supabase Auth login)
- `/admin-dashboard/services` - manage services shown on the site (with photo upload)
- `/admin-dashboard/content` - edit the logo, hero, about, and contact copy/photos
- `/aviat-admin` - admin sign-in via magic link (no password)
- `/auth/callback` - completes the magic-link sign-in, then redirects to the dashboard

## 1. Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The site renders with built-in placeholder content (`src/lib/seed-services.ts`) even
without Supabase configured - the quote form just won't be able to save submissions
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
   [`supabase/schema.sql`](supabase/schema.sql), and run it (safe to re-run any
   time this file changes - every statement is idempotent). This creates:
   - `services` - editable content for the Home/Services pages (seeded with the
     current six services), plus an `image_url` column for an optional photo
   - `site_content` - the logo, hero, about, and contact copy edited from
     `/admin-dashboard/content`
   - `why_choose_us` - the three cards shown on Home/About
   - `quote_requests` - submissions from the "Request a Service Quote" form
   - The `site-media` Storage bucket, for logo/hero/about/service photo uploads
   - Row Level Security policies on all of the above (public can read active
     content and submit quote requests; only signed-in admins can write)
4. Create an admin account: **Authentication -> Users -> Add user**, email only
   (any password works since it's never used - sign-in is by magic link).
   There is no public sign-up - only accounts created here can access
   `/admin-dashboard`.
5. **Authentication -> URL Configuration**, add `/auth/callback` to both:
   - **Site URL** (e.g. `https://your-domain.com`)
   - **Redirect URLs** (add both `http://localhost:3000/auth/callback` for local
     dev and `https://your-domain.com/auth/callback` for production)

   Magic links are rejected if their redirect URL isn't on this allowlist.
6. Supabase's built-in email sending (used for magic links) is rate-limited to a
   few emails per hour on the free tier - fine for a small admin team, but
   configure a custom SMTP provider under **Project Settings -> Auth** if you
   expect heavier use.

## 3. Deploy to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the same two environment variables from `.env.local` in the Vercel project's
   **Settings -> Environment Variables**.
4. Deploy.

## Editing site content

Everything below is edited from `/admin-dashboard/content` and
`/admin-dashboard/services` once Supabase is connected - no code changes or
redeploy needed:

- Logo (header + footer), replacing the "Aviat Investment" text wordmark
- Home hero photo, headline, and tagline
- About page photo, intro text, and mission statement
- Contact phone, email, address, and business hours (shown on the Contact
  page and in the footer)
- The three "Why Choose Us" cards
- Each service's title, description, icon, and an optional photo

Until an admin fills these in, the site renders the placeholder copy in
`src/lib/seed-site-content.ts` / `src/lib/seed-why-choose-us.ts` /
`src/lib/seed-services.ts`.

**Note on the `/about`, `/services`, and `/contact` page banners**: these still
use a CSS gradient rather than a photo (only the homepage hero and the
optional About page photo are real images) - that's a design choice in the
code, not something editable from the admin.
