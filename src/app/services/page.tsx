import type { Metadata } from "next";
import Link from "next/link";
import { ServiceCard } from "@/components/ServiceCard";
import { getActiveServices } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services | Aviat Investment Limited",
  description:
    "Aircraft battery maintenance, life vest servicing, emergency power pack restoration, ULB battery restoration, hydrostatic testing, and oxygen cylinder overhaul.",
};

export default async function ServicesPage() {
  const services = await getActiveServices();

  return (
    <>
      <section className="border-b border-card-border bg-gradient-to-b from-[#1c2733] to-background px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Our <span className="text-accent">Services</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-200">
            Specialist restoration, overhaul, and testing services for the components your
            operation depends on most.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.id}>
              <ServiceCard service={service} />
              <p className="mt-3 px-1 text-sm text-muted">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-card-border bg-card p-8 text-center sm:p-10">
          <h2 className="text-2xl font-bold">Don&apos;t see what you need?</h2>
          <p className="mt-2 text-muted">
            Get in touch and tell us about your aircraft and requirements &mdash; our team
            handles technical inquiries beyond the list above.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  );
}
