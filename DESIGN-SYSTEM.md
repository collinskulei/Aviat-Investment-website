# Design System Reference - Aviat Investment Style

This documents the exact visual/interaction system used on this site, so it can be
reproduced on another Next.js project. It covers the tech stack, design tokens,
component patterns, and page-composition conventions - with real code snippets
pulled from this codebase, not paraphrased descriptions.

Swap the hex values in §2 for a different brand's colors and everything else
(structure, spacing, component anatomy) carries over unchanged - that's the
intended way to reuse this on a differently-branded site.

---

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Server Components + Server Actions by default, Vercel-native |
| Styling | Tailwind CSS v4 (CSS-first config, no `tailwind.config.ts`) | Design tokens live in `globals.css` via `@theme inline` |
| Component primitives | Hand-rolled, no component library | Small surface area (forms, cards, nav) didn't justify a dependency |
| Theme switching | `next-themes` (class strategy) | Dark by default, manual light/dark toggle, no flash on load |
| Icons | `lucide-react` | Consistent line-icon set throughout |
| Fonts | `next/font/google`: Geist (sans), Geist Mono | Clean sans body/headings; mono reserved for literal strings |
| Backend | Supabase (`@supabase/ssr` for cookie-aware server/middleware clients, `@supabase/supabase-js` for anonymous public reads) | Postgres + Auth + RLS, no separate backend service |

To bootstrap an equivalent project:
```
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
npm install @supabase/supabase-js @supabase/ssr next-themes lucide-react
```

---

## 2. Color System

One hue family for brand (**blue**), plus a neutral grayscale pair that fully
flips between light and dark mode. A handful of fixed, non-theme-swapped values
exist deliberately for the photographic hero (see §2.3) and status/semantic
colors (red/emerald/amber) are used ad hoc via Tailwind's default palette, not
part of the custom token scale.

### 2.1 Semantic tokens (defined in `globals.css`, no `tailwind.config.ts`)

```css
:root {
  /* Fallback (pre-hydration) - matches the dark default theme. */
  --background: #050608;
  --foreground: #f5f7fa;
  --card: #101318;
  --card-border: #23272f;
  --muted: #9aa3b2;
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-foreground: #ffffff;

  /* Fixed accent for the dark hero/banner sections - those sections keep a
     constant dark background in both themes, so their accent doesn't swap. */
  --hero-accent: #60a5fa;
}

.dark {
  --background: #050608;
  --foreground: #f5f7fa;
  --card: #101318;
  --card-border: #23272f;
  --muted: #9aa3b2;
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-foreground: #ffffff;
}

.light {
  --background: #ffffff;
  --foreground: #0f172a;
  --card: #f8fafc;
  --card-border: #e2e8f0;
  --muted: #5b6472;
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-foreground: #ffffff;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-border: var(--card-border);
  --color-muted: var(--muted);
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-foreground: var(--primary-foreground);
  --color-hero-accent: var(--hero-accent);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

Tailwind's `dark:` variant is re-pointed at the `.dark` class (not
`prefers-color-scheme`), since theme is a manual per-visitor choice, not an OS
setting:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

**To re-brand:** change `--primary`/`--primary-hover` (and `--hero-accent` to a
lighter tint of the same hue) - every button, link, focus ring, and accent span
in the site references these two tokens, never a raw hex.

### 2.2 next-themes wiring (`app/layout.tsx`)

```tsx
<html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
  <body className="flex min-h-full flex-col bg-background text-foreground">
    <ThemeProvider attribute="class" defaultTheme="dark" themes={["light", "dark"]} enableSystem={false}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </ThemeProvider>
  </body>
</html>
```
`enableSystem={false}` is intentional - the brand look is dark-first regardless
of the visitor's OS preference; light mode is opt-in via the header toggle only.

### 2.3 Usage rules (how color is actually applied across the site)

- **`bg-background` / `text-foreground`**: default page surface - flips between
  near-black (dark) and white (light).
- **`bg-card` / `border-card-border`**: every card, form container, and table -
  flips between near-black-but-lighter-than-background (dark) and off-white
  (light).
- **`text-muted`**: secondary/body copy that isn't the primary heading color.
- **`text-primary` / `bg-primary`**: links, primary buttons, active nav state,
  focus borders on inputs - the one brand accent, identical in both themes.
- **Hero/banner sections are exempt from theming.** The photographic hero and
  the dark gradient "Precision Engineering" banner keep a *fixed* dark
  background and `text-white` / `text-hero-accent` regardless of site theme -
  they're treated like a photo, not a page surface. Never use the `--primary`/
  `--foreground` tokens inside these sections; use `text-white` and
  `text-hero-accent` explicitly, or theming will make headline text invisible
  in light mode (a real bug caught during development - see §7).
- **Footer is also exempt**: always `bg-black` with `text-white`/`text-zinc-400`,
  regardless of theme, for a consistent dark "structural" band at the bottom of
  every page.
- **Status/semantic color** (form success/error, admin table errors, a
  "temporary" badge) borrows directly from Tailwind's palette with an explicit
  light/dark pair rather than a custom token, e.g.
  `text-red-600 dark:text-red-400`, `text-emerald-600 dark:text-emerald-400`,
  `bg-amber-500/15 text-amber-600 dark:text-amber-400`.

---

## 3. Typography

```tsx
// app/layout.tsx
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
```

**Rules:**
- One typeface family (Geist Sans) for everything - headings and body both;
  weight and size carry the hierarchy, not a font swap.
- Heading scale: `text-4xl sm:text-5xl font-extrabold` (hero/page H1) →
  `text-3xl sm:text-4xl font-bold` (section H2) → `text-2xl sm:text-3xl
  font-bold` (card/form H2) → `text-lg font-semibold` (card title).
- Body copy: `text-muted` for secondary text, plain `text-foreground`
  (inherited) for primary text - no separate "body" token.
- Geist Mono (`font-mono`) is reserved for literal technical strings only -
  currently just `sourceRef`-style values. Never decorative.
- Eyebrow/label text (e.g. "PRECISION ENGINEERING" over the banner heading):
  `text-sm font-semibold uppercase tracking-widest text-hero-accent`.

---

## 4. Core Component Patterns

### 4.1 Buttons

No button component - className strings are copied directly per usage, on top
of two shared CSS classes in `globals.css` (`.btn-fade` / `.btn-fade-light`)
that draw a minimalist look: a thin 1px border that fades out left-to-right,
fully transparent interior, no solid fill. There is deliberately no "glowing"
solid-fill button anywhere on the site - every CTA, including form submit
buttons, uses this same restrained treatment:

```tsx
// Adaptive surfaces (page background, cards) - fades from blue to transparent
<Link className="btn-fade rounded-lg px-6 py-3 text-sm font-semibold">
  Request a Quote
</Link>

// Fixed-dark photographic hero/banner only - fades from white to transparent
<Link className="btn-fade-light rounded-lg px-6 py-3 text-sm font-semibold">
  View Our Services
</Link>

// Text link (no border at all)
<Link className="text-sm font-semibold text-primary transition-colors hover:text-primary-hover">
  View all services &rarr;
</Link>
```

The fading border is a masked `::before` pseudo-element, not a
`background-clip` trick - the interior must render as genuinely transparent
(so the hero photo or page background shows through), and a naive two-layer
`background-image`/`background-clip` approach paints a solid gradient fill
instead of a ring the moment the "interior" layer is transparent rather than
opaque. `border-radius: inherit` on the pseudo-element keeps the ring's
corners matched to whatever `rounded-*` utility sits on the button itself:
```css
.btn-fade {
  position: relative;
  color: var(--primary);
  background-color: transparent;
  transition: background-color 0.2s ease;
}
.btn-fade::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(100deg, var(--primary) 0%, transparent 85%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
.btn-fade:hover {
  background-color: color-mix(in oklab, var(--primary) 8%, transparent);
}
```
`.btn-fade-light` is the identical shape with a white-based gradient/hover
tint, for use only on the fixed-dark hero/banner (see §2.3, §4.4).

### 4.2 Cards

One card treatment, reused everywhere via a `bg-card`/`border-card-border`
pair; interactive cards add a border-color hover instead of a lift:
```tsx
// Standard card (WhyChooseUs, ServiceCard non-interactive state)
<div className="rounded-xl border border-card-border bg-card p-6">…</div>

// Clickable card (ServiceCard)
<Link className="block rounded-xl border border-card-border bg-card p-6 transition-colors hover:border-primary/50">…</Link>

// Larger container (forms, CTA blocks)
<div className="rounded-2xl border border-card-border bg-card p-8 sm:p-10">…</div>
```
Radius scale: `rounded-lg` (buttons/inputs) → `rounded-xl` (small cards) →
`rounded-2xl` (forms, larger feature containers, the photographic banner card).
Never sharp corners.

### 4.3 Section heading

Every mid-page section uses the same two/three-part heading: title with a
colored accent span, then a short underline rule that fades out (matching the
button treatment in §4.1) rather than a solid block:
```tsx
<h2 className="text-center text-3xl font-bold sm:text-4xl">
  Why Choose <span className="text-primary">Aviat Investment Limited?</span>
</h2>
<div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-primary to-transparent" />
```
On the dark photographic hero/banner, the accent span uses `text-hero-accent`
instead of `text-primary` (see §2.3), and there's no underline rule.

### 4.4 Interior page hero banner

Every non-homepage page (`/about`, `/services`, `/contact`) opens with the same
fixed-dark banner before its content - note the `to-background` gradient stop,
which lets the banner fade into whichever theme's background color sits below
it, even though the banner top itself is always dark. Each also carries a
large, near-invisible rotated `Plane` icon in the top-right corner - a quiet
aviation motif repeated across every page, not just the homepage hero:
```tsx
<section className="relative overflow-hidden border-b border-card-border bg-gradient-to-b from-[#1c2733] to-background px-6 py-20">
  <Plane className="pointer-events-none absolute -right-12 -top-10 size-64 rotate-45 text-white/5" strokeWidth={0.5} />
  <div className="relative mx-auto max-w-4xl text-center">
    <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
      About <span className="text-hero-accent">Aviat Investment</span>
    </h1>
    <p className="mt-6 text-lg text-zinc-200">Supporting description.</p>
  </div>
</section>
```
Each `/services/[slug]` page uses the same fixed-dark banner shape, but swaps
the `Plane` watermark for that service's own `ServiceIcon` above the title
instead - it already carries a per-service icon, so adding the generic
watermark too would compete rather than reinforce.
The homepage hero is the one exception: a full photographic background
(`next/image` with `fill` + `priority`) instead of a CSS gradient, with a
left-to-right black scrim for text contrast:
```tsx
<section className="relative overflow-hidden bg-[#0b1119]">
  <Image src="/images/hero-aircraft.jpg" alt="…" fill priority sizes="100vw"
    className="object-cover" style={{ objectPosition: "center 42%" }} />
  <div className="absolute inset-0" style={{
    background: "linear-gradient(to right, rgba(0,0,0,.55) 0%, rgba(0,0,0,.32) 45%, rgba(0,0,0,.08) 100%)",
  }} />
  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
  {/* content, position: relative, z-index implicit via source order */}
</section>
```

### 4.5 Badges

No badge component; a small pill built inline where needed, e.g. the "demo
credentials are temporary" flag on the admin login page:
```tsx
<span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
  Temporary
</span>
```

### 4.6 Header / Navigation

- Sticky, `sticky top-0 z-50 bg-background/90 backdrop-blur`, `border-b
  border-card-border`.
- Desktop (`md:` and up): flat horizontal links, active route in `text-primary`,
  inactive in `text-muted hover:text-foreground`, plus the theme toggle button.
- Mobile (`< md`): a hamburger button (`lucide-react` `Menu`/`X`) toggles a
  simple conditional block below the bar - no drawer/sheet component, just a
  `flex flex-col` list that appears in normal document flow.
- Theme toggle: renders nothing meaningful until mounted (`useEffect` sets a
  `mounted` flag) so the server-rendered icon never mismatches the client's
  actual resolved theme; swaps `Sun`/`Moon` based on `resolvedTheme`.

### 4.7 Footer

Always `bg-black` regardless of site theme (see §2.3), three-column grid
(brand + description / nav links / contact info), bottom bar with centered
copyright:
```tsx
<footer className="border-t border-white/10 bg-black">
  <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">…</div>
  <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-zinc-500">
    Copyright &copy; {year} {SITE_NAME_FULL}
  </div>
</footer>
```

### 4.8 Forms

Plain HTML inputs, one shared className string reused verbatim across the
quote form, admin login, and the admin service editor:
```tsx
const inputClasses =
  "w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none";
```
Every field: `<label>` above the input, `text-sm font-medium` (defaults to
`text-foreground`). Server Actions + `useActionState` drive submission state
(pending/error/success) - no client-side form library.

### 4.9 Admin data table

`overflow-x-auto` wrapper around a `min-w-[720px]` table, so a wide table
scrolls within its own box on narrow screens instead of breaking page layout:
```tsx
<div className="overflow-x-auto rounded-xl border border-card-border">
  <table className="w-full min-w-[720px] text-left text-sm">
    <thead className="bg-card text-xs uppercase text-muted">…</thead>
    <tbody>{/* rows: border-t border-card-border */}</tbody>
  </table>
</div>
```

### 4.10 Admin auth (magic link, no password)

Admin sign-in is passwordless: `/aviat-admin` is a single email field that
calls `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false,
emailRedirectTo } })`. `shouldCreateUser: false` matters - there is no public
sign-up, so a magic link only works for an email that already has an account
created directly in the Supabase dashboard. The success message is identical
whether or not the email actually has an account, so the form can't be used to
probe which addresses are admins:
```tsx
return { status: "success", message: GENERIC_SENT_MESSAGE };
```
Clicking the emailed link lands on a Route Handler (`/auth/callback`) that
exchanges the one-time code for a session via the same cookie-aware server
client used everywhere else, then redirects into `/admin-dashboard`.

### 4.11 Admin shell (sidebar)

`/admin-dashboard/*` uses a persistent sidebar on desktop, collapsing to a top
bar + toggled panel on mobile - one client component (`AdminShell`) renders
both, so nav state lives in exactly one place:
```tsx
<div className="md:flex md:min-h-screen">
  <aside className="hidden w-64 shrink-0 border-r border-card-border bg-card md:flex md:flex-col">
    {/* nav items, Sign Out pinned at the bottom */}
  </aside>
  <div className="border-b border-card-border bg-card md:hidden">{/* mobile top bar + toggled nav */}</div>
  <main className="flex-1 px-4 py-8 sm:px-8 md:px-10 md:py-10">{children}</main>
</div>
```
The active nav item uses `bg-primary/10 text-primary`, distinct from the public
Header's plain `text-primary` (no background) - admin nav is denser and
benefits from a filled active state.

### 4.12 Image upload

Every image on the site (logo, hero photo, about photo, per-service photo)
goes through one shared component and one shared Server Action, rather than a
bespoke uploader per field:
```tsx
<ImageUploadField target="hero" currentUrl={content.hero_image_url} label="Hero background photo" />
```
`target` (`"logo" | "hero" | "about" | "service:<id>"`) tells the action which
row/column to write the resulting public URL onto after uploading to the
`site-media` Supabase Storage bucket - see `uploadSiteMedia` in
`src/app/admin-dashboard/media-actions.ts`. Admin-uploaded images render via a
plain `<img>`, not `next/image` (their host is a per-project Supabase Storage
URL, not worth a `next.config.ts` remote-pattern allowlist for); the bundled
default hero photo in `public/images/` is the one exception that still uses
`next/image`, since it's a static local asset.

---

## 5. Motion

There is currently **no animation library and no scroll-triggered reveal
system** - every transition is a plain CSS `transition-colors` /
`transition-transform` on hover/focus (button hover states, card border color
on hover, theme-toggle icon swap). Pages render fully visible with no
entrance animation.

If a scroll-reveal system is added later, keep it consistent with the rest of
this system: wrap individual content blocks (not whole pages), animate once
per scroll-into-view, respect `prefers-reduced-motion`, and never animate the
hero (it's the first thing visible).

---

## 6. Iconography

`lucide-react` exclusively, mapped by string name for CMS-editable content
(`src/lib/service-icons.tsx` maps a `service.icon` string like
`"battery-charging"` to a Lucide component, falling back to `Wrench`).
Convention:
- Inline icon next to text: no fixed gap convention enforced, but icons are
  sized via Tailwind's `size-*` utility (`size-4`, `size-6`, `size-8`)
  depending on context (inline label vs. card icon vs. contact-info icon).
- Icons paired with visible text get `aria-hidden="true"` - the text is the
  accessible label.
- Icon color follows context: `text-primary` next to headings/cards,
  `currentColor` inherited inside buttons, `text-hero-accent` on the
  photographic hero and dark banner.

---

## 7. Imagery

- Homepage hero: full-bleed photo via `next/image` (`fill`, `priority`,
  `sizes="100vw"`) with a `linear-gradient` black scrim (left-heavy, fading to
  ~8% on the right) for text contrast, plus a short bottom fade
  (`bg-gradient-to-b from-transparent to-background`) so the hero blends into
  whichever theme's page background sits below it.
- Interior-page/banner sections without a real photo use a CSS gradient
  standing in for one (`from-[#1c2733] to-background` or
  `from-[#2a3a4d] via-[#0f1620] to-black`), plus a very faint (`text-white/5`)
  oversized Lucide `Plane` icon as texture.
- **Real bug worth flagging for reuse**: headings/buttons that sit on a fixed
  dark hero/banner must use explicit `text-white` (or `text-hero-accent`), never
  the theme-adaptive `text-foreground`/`--primary` tokens - those sections don't
  reflow with theme, but the *token values* do, so inheriting them silently
  produces near-invisible dark-on-dark text the moment a visitor switches to
  light mode. Caught and fixed during development; documented here so a reused
  version of this system doesn't reintroduce it.
- No remote image domains are configured - all imagery ships from `/public`.

---

## 8. Layout Conventions

- Global content width: `mx-auto max-w-6xl px-6`, repeated per-section rather
  than a shared `Container` component.
- Vertical rhythm: sections are `py-20` by default (`pb-20`/`pb-24` when
  stacked back-to-back without a border between them); the homepage hero is
  taller (`py-28 sm:py-36`); interior-page banners use `py-20`.
- Grids: `grid gap-6` (occasionally `gap-5`/`gap-10`), responsive column
  counts (`sm:grid-cols-2 lg:grid-cols-3` for card grids, `sm:grid-cols-3` for
  the three-up "why choose us" row, `lg:grid-cols-5` for the contact page's
  info/form split) - every grid in the codebase has a responsive prefix, none
  are hardcoded to a fixed column count at all sizes.
- Mobile-first everywhere: base (unprefixed) styles target mobile; `sm:`/`md:`/
  `lg:` prefixes layer up, never the reverse.

---

## 9. Applying This to a New Project - Checklist

1. Scaffold Next.js (App Router, TypeScript, `src/` dir) + Tailwind v4 +
   `next-themes` + `lucide-react` (§1).
2. Pick one brand hue and set `--primary`/`--primary-hover`/`--hero-accent`;
   keep the neutral `--background`/`--foreground`/`--card`/`--card-border`/
   `--muted` pair identical in spirit, swapped between `.light`/`.dark` (§2.1).
3. Wire `next-themes` with `attribute="class"`, `enableSystem={false}`, and
   whichever theme matches the brand's default mood (§2.2).
4. Set up Geist Sans + Geist Mono via `next/font/google` (§3) - or swap in a
   different sans pairing if the brand calls for it; the system doesn't depend
   on Geist specifically.
5. Build the shared primitives first: the section-heading pattern (§4.3), the
   interior-page hero banner (§4.4), the button/card/form className strings
   (§4.1, 4.2, 4.8) - every page composes from these.
6. Build `Header` (sticky, mobile-collapse, theme toggle) and `Footer` (fixed
   dark, exempt from theming) once, shared via the root layout (§4.6, 4.7).
7. For every new page: interior hero banner → one or more `max-w-6xl`-wrapped
   sections using the shared heading pattern → shared card/form components.
8. Re-use the exact className strings from §4 verbatim - consistency comes
   from copying the same Tailwind class combinations, not from reinventing
   similar-looking ones per page.
9. If a section's background is meant to stay fixed regardless of theme (a
   photo, a deliberately-always-dark band), give its text explicit colors
   (`text-white`, a fixed accent) rather than the theme tokens - see the §7
   warning.
