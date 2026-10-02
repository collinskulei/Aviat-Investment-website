import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader, LoadError, MissingItem } from "@/components/admin/AdminPageHeader";
import type { Service } from "@/lib/types";
import { ServiceEditor } from "../ServiceEditor";

export default async function EditServicePage(props: PageProps<"/admin-dashboard/services/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data, error } = await supabase.from("services").select("*").eq("id", id).maybeSingle();

  if (error) return <LoadError what="this service" message={error.message} />;
  if (!data) {
    return (
      <MissingItem what="service" backHref="/admin-dashboard/services" backLabel="Back to services" />
    );
  }

  const service = data as Service;

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        crumbs={[
          { label: "Overview", href: "/admin-dashboard" },
          { label: "Services", href: "/admin-dashboard/services" },
          { label: service.title },
        ]}
        title={service.title}
        description="Changes go live on the site as soon as you save."
        actions={
          service.is_active && (
            <a
              href={`/services/${service.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-card-border px-3 py-2 text-sm font-medium text-muted hover:border-primary hover:text-foreground"
            >
              <ExternalLink size={15} aria-hidden="true" /> View on site
            </a>
          )
        }
      />
      <ServiceEditor service={service} />
    </div>
  );
}
