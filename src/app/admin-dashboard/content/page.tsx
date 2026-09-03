import { createClient } from "@/lib/supabase/server";
import { SEED_SITE_CONTENT } from "@/lib/seed-site-content";
import type { SiteContent, WhyChooseUsItem } from "@/lib/types";
import { SiteContentForm } from "./SiteContentForm";
import { WhyChooseUsEditor } from "./WhyChooseUsEditor";

export default async function AdminContentPage() {
  const supabase = await createClient();

  const [contentRes, whyChooseUsRes] = await Promise.all([
    supabase.from("site_content").select("*").eq("id", "default").maybeSingle(),
    supabase.from("why_choose_us").select("*").order("sort_order", { ascending: true }),
  ]);

  const content = (contentRes.data as SiteContent | null) ?? SEED_SITE_CONTENT;
  const whyChooseUsItems = (whyChooseUsRes.data as WhyChooseUsItem[] | null) ?? [];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Site Content</h1>
      <p className="mt-1 text-sm text-muted">
        Edit the logo, hero, about, and contact copy shown across the public site.
      </p>

      {contentRes.error && (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400">
          Couldn&apos;t load site content: {contentRes.error.message}
        </p>
      )}

      <div className="mt-8">
        <SiteContentForm content={content} />
      </div>

      <div className="mt-14">
        <h2 className="text-xl font-bold">Why Choose Us cards</h2>
        <p className="mt-1 text-sm text-muted">
          The three cards shown on the Home and About pages.
        </p>

        {whyChooseUsRes.error && (
          <p className="mt-6 text-sm text-red-600 dark:text-red-400">
            Couldn&apos;t load cards: {whyChooseUsRes.error.message}
          </p>
        )}

        <div className="mt-6 space-y-6">
          {whyChooseUsItems.map((item) => (
            <WhyChooseUsEditor key={item.id} item={item} />
          ))}
          <WhyChooseUsEditor />
        </div>
      </div>
    </div>
  );
}
