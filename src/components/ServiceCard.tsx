import Link from "next/link";
import type { Service } from "@/lib/types";
import { ServiceIcon } from "@/lib/service-icons";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="block overflow-hidden rounded-xl border border-card-border bg-card transition-colors hover:border-primary/50"
    >
      {service.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={service.image_url}
          alt={service.title}
          className="h-36 w-full object-cover"
        />
      ) : null}
      <div className="p-6">
        <ServiceIcon name={service.icon} className="size-8 text-primary" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">{service.title}</h3>
        <p className="mt-2 text-sm text-muted">{service.short_description}</p>
        <span className="mt-3 inline-block text-sm font-medium text-primary">Learn more &rarr;</span>
      </div>
    </Link>
  );
}
