import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";
import { ServiceEditor } from "./ServiceEditor";

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  const services = (data ?? []) as Service[];

  return (
    <div>
      <h1 className="text-2xl font-bold">Services</h1>
      <p className="mt-1 text-sm text-muted">
        Manage the services shown on the Home and Services pages.
      </p>

      {error && (
        <p className="mt-6 text-sm text-red-400">Couldn&apos;t load services: {error.message}</p>
      )}

      <div className="mt-8 space-y-6">
        {services.map((service) => (
          <ServiceEditor key={service.id} service={service} />
        ))}
        <ServiceEditor />
      </div>
    </div>
  );
}
