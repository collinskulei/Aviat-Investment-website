import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SEED_SITE_CONTENT } from "@/lib/seed-site-content";
import { AdminPageHeader, LoadError } from "@/components/admin/AdminPageHeader";
import type { SiteContent } from "@/lib/types";
import { SiteContentForm } from "../SiteContentForm";
import { CONTENT_SECTIONS, isContentSection } from "../sections";

export default async function ContentSectionPage(
  props: PageProps<"/admin-dashboard/content/[section]">
) {
  const { section } = await props.params;
  if (!isContentSection(section)) notFound();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  const content = (data as SiteContent | null) ?? SEED_SITE_CONTENT;
  const meta = CONTENT_SECTIONS[section];

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        crumbs={[
          { label: "Overview", href: "/admin-dashboard" },
          { label: "Site Content", href: "/admin-dashboard/content" },
          { label: meta.title },
        ]}
        title={meta.title}
        description={meta.description}
        actions={
          <a
            href={meta.preview}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-card-border px-3 py-2 text-sm font-medium text-muted hover:border-primary hover:text-foreground"
          >
            <ExternalLink size={15} aria-hidden="true" /> View on site
          </a>
        }
      />

      {error && <LoadError what="site content" message={error.message} />}

      <SiteContentForm section={section} content={content} />
    </div>
  );
}
