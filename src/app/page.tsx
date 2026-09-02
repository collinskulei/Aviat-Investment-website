import Link from "next/link";
import { Plane } from "lucide-react";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { ServiceCard } from "@/components/ServiceCard";
import { QuoteForm } from "@/components/QuoteForm";
import { LocationMap } from "@/components/LocationMap";
import { getActiveServices } from "@/lib/data/services";

export default async function Home() {
  const services = await getActiveServices();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#3a4a5c] via-[#141c26] to-background">
        <Plane
          className="pointer-events-none absolute -right-16 top-24 size-[28rem] rotate-45 text-white/5"
          strokeWidth={0.5}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Precision Maintenance
            <br />
            <span className="text-hero-accent">for Aviation Safety.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-zinc-200">
            Specialist restoration, overhaul, and testing services for critical aircraft
            components.
          </p>
          <p className="mt-2 max-w-xl font-medium text-hero-accent">
            Trusted expertise located at Wilson Airport.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground underline decoration-2 underline-offset-4 transition-colors hover:bg-primary-hover"
            >
              GET A QUOTE
            </Link>
            <Link
              href="/services"
              className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              VIEW OUR SERVICES
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs />

      {/* Banner */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-2xl border border-card-border bg-gradient-to-br from-[#2a3a4d] via-[#0f1620] to-black px-8 py-20 text-center">
          <Plane
            className="pointer-events-none absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 text-white/5"
            strokeWidth={0.5}
          />
          <p className="relative text-sm font-semibold uppercase tracking-widest text-hero-accent">
            Precision Engineering
          </p>
          <h2 className="relative mx-auto mt-3 max-w-2xl text-2xl font-bold text-white sm:text-3xl">
            Excellence in Aviation Maintenance &amp; Component Support
          </h2>
        </div>
      </section>

      {/* Services preview */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">Our Services</h2>
        <div className="mx-auto mt-4 h-1 w-16 rounded bg-primary" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            View all services &rarr;
          </Link>
        </div>
      </section>

      {/* Quote form */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl rounded-2xl border border-card-border bg-card p-8 sm:p-10">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Request a <span className="text-primary">Service Quote</span>
          </h2>
          <p className="mt-2 text-center text-sm text-muted">
            Complete the form below and our technical team will reach out within 24 hours.
          </p>
          <div className="mt-8">
            <QuoteForm services={services} />
          </div>
        </div>
      </section>

      <LocationMap />
    </>
  );
}
