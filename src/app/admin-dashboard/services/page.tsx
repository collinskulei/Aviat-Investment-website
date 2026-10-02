import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader, LoadError } from "@/components/admin/AdminPageHeader";
import { AdminWidget, Badge, WidgetGrid } from "@/components/admin/AdminWidget";
import { ServiceIcon } from "@/lib/service-icons";
import type { Service } from "@/lib/types";

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  const services = (data ?? []) as Service[];
  const activeCount = services.filter((s) => s.is_active).length;

  return (
    <div>
      <AdminPageHeader
        crumbs={[{ label: "Overview", href: "/admin-dashboard" }, { label: "Services" }]}
        title="Services"
        description={`${activeCount} of ${services.length} services visible on the site. Pick one to edit it.`}
      />

      {error && <LoadError what="services" message={error.message} />}

      <WidgetGrid>
        {services.map((service) => (
          <AdminWidget
            key={service.id}
            href={`/admin-dashboard/services/${service.id}`}
            title={service.title}
            description={service.short_description}
            image={service.image_url}
            icon={<ServiceIcon name={service.icon} className="size-5" />}
            badge={
              service.is_active ? (
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">Live</Badge>
              ) : (
                <Badge className="bg-zinc-500/15 text-zinc-700 dark:text-zinc-300">Hidden</Badge>
              )
            }
          />
        ))}
        <AdminWidget
          href="/admin-dashboard/services/new"
          title="Add a service"
          description="Create a new service for the Home and Services pages"
          icon={<Plus size={20} />}
          tone="add"
        />
      </WidgetGrid>
    </div>
  );
}
