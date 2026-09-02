import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { QuoteForm } from "@/components/QuoteForm";
import { CONTACT } from "@/lib/constants";
import { getActiveServices } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Contact | Aviat Investment Limited",
  description: "Get in touch with Aviat Investment Limited at Wilson Airport for a service quote.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const [services, { service }] = await Promise.all([getActiveServices(), searchParams]);

  return (
    <>
      <section className="border-b border-card-border bg-gradient-to-b from-[#1c2733] to-background px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Get In <span className="text-hero-accent">Touch</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-200">
            Reach out for a service quote or a technical inquiry &mdash; our team responds
            within 24 hours.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-card-border bg-card p-6">
              <MapPin className="size-6 text-primary" aria-hidden="true" />
              <h3 className="mt-3 font-semibold">Location</h3>
              <p className="mt-1 text-sm text-muted">{CONTACT.address}</p>
            </div>
            <div className="rounded-xl border border-card-border bg-card p-6">
              <Phone className="size-6 text-primary" aria-hidden="true" />
              <h3 className="mt-3 font-semibold">Phone</h3>
              <p className="mt-1 text-sm text-muted">{CONTACT.phone}</p>
            </div>
            <div className="rounded-xl border border-card-border bg-card p-6">
              <Mail className="size-6 text-primary" aria-hidden="true" />
              <h3 className="mt-3 font-semibold">Email</h3>
              <p className="mt-1 text-sm text-muted">{CONTACT.email}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-card-border bg-card p-8 sm:p-10 lg:col-span-3">
            <h2 className="text-2xl font-bold">
              Request a <span className="text-primary">Service Quote</span>
            </h2>
            <p className="mt-2 text-sm text-muted">
              Complete the form below and our technical team will reach out within 24 hours.
            </p>
            <div className="mt-8">
              <QuoteForm services={services} defaultService={service} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
