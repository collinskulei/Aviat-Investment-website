import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader, LoadError } from "@/components/admin/AdminPageHeader";
import { AdminWidget, Badge, WidgetGrid } from "@/components/admin/AdminWidget";
import { ServiceIcon } from "@/lib/service-icons";
import type { WhyChooseUsItem } from "@/lib/types";

export default async function WhyChooseUsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("why_choose_us")
    .select("*")
    .order("sort_order", { ascending: true });

  const items = (data ?? []) as WhyChooseUsItem[];

  return (
    <div>
      <AdminPageHeader
        crumbs={[
          { label: "Overview", href: "/admin-dashboard" },
          { label: "Site Content", href: "/admin-dashboard/content" },
          { label: "Why Choose Us cards" },
        ]}
        title="Why Choose Us cards"
        description="Shown on the Home and About pages. Pick a card to edit it."
      />

      {error && <LoadError what="cards" message={error.message} />}

      <WidgetGrid>
        {items.map((item) => (
          <AdminWidget
            key={item.id}
            href={`/admin-dashboard/content/why-choose-us/${item.id}`}
            title={item.title}
            description={item.description}
            icon={<ServiceIcon name={item.icon} className="size-5" />}
            badge={
              item.is_active ? (
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">Live</Badge>
              ) : (
                <Badge className="bg-zinc-500/15 text-zinc-700 dark:text-zinc-300">Hidden</Badge>
              )
            }
          />
        ))}
        <AdminWidget
          href="/admin-dashboard/content/why-choose-us/new"
          title="Add a card"
          description="Create a new Why Choose Us highlight"
          icon={<Plus size={20} />}
          tone="add"
        />
      </WidgetGrid>
    </div>
  );
}
