import type { Service } from "@/lib/types";
import { ServiceIcon } from "@/lib/service-icons";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-6 transition-colors hover:border-primary/50">
      <ServiceIcon name={service.icon} className="size-8 text-primary" />
      <h3 className="mt-4 text-lg font-semibold text-foreground">{service.title}</h3>
      <p className="mt-2 text-sm text-muted">{service.short_description}</p>
    </div>
  );
}
