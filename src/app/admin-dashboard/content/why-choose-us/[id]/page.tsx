import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader, LoadError, MissingItem } from "@/components/admin/AdminPageHeader";
import type { WhyChooseUsItem } from "@/lib/types";
import { WhyChooseUsEditor } from "../../WhyChooseUsEditor";

export default async function EditWhyChooseUsPage(
  props: PageProps<"/admin-dashboard/content/why-choose-us/[id]">
) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data, error } = await supabase.from("why_choose_us").select("*").eq("id", id).maybeSingle();

  if (error) return <LoadError what="this card" message={error.message} />;
  if (!data) {
    return (
      <MissingItem
        what="card"
        backHref="/admin-dashboard/content/why-choose-us"
        backLabel="Back to Why Choose Us cards"
      />
    );
  }

  const item = data as WhyChooseUsItem;

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        crumbs={[
          { label: "Overview", href: "/admin-dashboard" },
          { label: "Site Content", href: "/admin-dashboard/content" },
          { label: "Why Choose Us", href: "/admin-dashboard/content/why-choose-us" },
          { label: item.title },
        ]}
        title={item.title}
        description="Changes go live on the Home and About pages as soon as you save."
      />
      <WhyChooseUsEditor item={item} />
    </div>
  );
}
