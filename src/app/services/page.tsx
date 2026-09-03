import type { Metadata } from "next";
import Link from "next/link";
import { Plane } from "lucide-react";
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
      <section className="relative overflow-hidden border-b border-card-border bg-gradient-to-b from-[#1c2733] to-background px-6 py-20">
        <Plane
          className="pointer-events-none absolute -right-12 -top-10 size-64 rotate-45 text-white/5"
          strokeWidth={0.5}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Our <span className="text-hero-accent">Services</span>
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
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-card-border bg-card p-8 text-center sm:p-10">
          <h2 className="text-2xl font-bold">Don&apos;t see what you need?</h2>
          <p className="mt-2 text-muted">
            Get in touch and tell us about your aircraft and requirements. Our team
            handles technical inquiries beyond the list above.
          </p>
          <Link href="/contact" className="btn-fade mt-6 inline-block rounded-lg px-6 py-3 text-sm font-semibold">
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  );
}
