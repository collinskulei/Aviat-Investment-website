import { Contact, Image as ImageIcon, LayoutTemplate, Sparkles, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SEED_SITE_CONTENT } from "@/lib/seed-site-content";
import { AdminPageHeader, LoadError } from "@/components/admin/AdminPageHeader";
import { AdminWidget, Badge, WidgetGrid } from "@/components/admin/AdminWidget";
import { BrandLogo } from "@/components/BrandLogo";
import type { SiteContent } from "@/lib/types";
import { CONTENT_SECTIONS } from "./sections";

export default async function AdminContentPage() {
  const supabase = await createClient();

  const [contentRes, cardsRes] = await Promise.all([
    supabase.from("site_content").select("*").eq("id", "default").maybeSingle(),
    supabase.from("why_choose_us").select("is_active"),
  ]);

  const content = (contentRes.data as SiteContent | null) ?? SEED_SITE_CONTENT;
  const cards = (cardsRes.data ?? []) as { is_active: boolean }[];
  const placeholder = (value: string) => value.includes("[");
  const contactIncomplete = [
    content.contact_phone,
    content.contact_email,
    content.contact_address,
    content.contact_hours,
  ].some((v) => !v || placeholder(v));

  const custom = (
    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">Custom</Badge>
  );
  const builtIn = <Badge className="bg-zinc-500/15 text-zinc-700 dark:text-zinc-300">Built-in</Badge>;

  return (
    <div>
      <AdminPageHeader
        crumbs={[{ label: "Overview", href: "/admin-dashboard" }, { label: "Site Content" }]}
        title="Site Content"
        description="Pick a section of the public site to edit."
      />

      {contentRes.error && <LoadError what="site content" message={contentRes.error.message} />}

      <WidgetGrid>
        <AdminWidget
          href="/admin-dashboard/content/logo"
          title={CONTENT_SECTIONS.logo.title}
          description={CONTENT_SECTIONS.logo.description}
          icon={<ImageIcon size={20} />}
          image={content.logo_url}
          media={<BrandLogo className="h-20 w-auto" />}
          badge={content.logo_url ? custom : builtIn}
        />
        <AdminWidget
          href="/admin-dashboard/content/hero"
          title={CONTENT_SECTIONS.hero.title}
          description={`"${content.hero_headline} ${content.hero_subheadline}"`}
          icon={<LayoutTemplate size={20} />}
          image={content.hero_image_url}
          badge={content.hero_image_url ? custom : builtIn}
        />
        <AdminWidget
          href="/admin-dashboard/content/about"
          title={CONTENT_SECTIONS.about.title}
          description={CONTENT_SECTIONS.about.description}
          icon={<UserRound size={20} />}
          image={content.about_image_url}
        />
        <AdminWidget
          href="/admin-dashboard/content/contact"
          title={CONTENT_SECTIONS.contact.title}
          description={CONTENT_SECTIONS.contact.description}
          icon={<Contact size={20} />}
          tone={contactIncomplete ? "alert" : "default"}
          badge={
            contactIncomplete ? (
              <Badge className="bg-red-500/15 text-red-700 dark:text-red-300">Needs details</Badge>
            ) : undefined
          }
        />
        <AdminWidget
          href="/admin-dashboard/content/why-choose-us"
          title="Why Choose Us cards"
          description="The highlight cards on the Home and About pages"
          icon={<Sparkles size={20} />}
          stat={cards.filter((c) => c.is_active).length}
          statLabel={`of ${cards.length} live`}
        />
      </WidgetGrid>
    </div>
  );
}
