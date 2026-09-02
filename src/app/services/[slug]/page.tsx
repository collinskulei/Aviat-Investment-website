import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceIcon } from "@/lib/service-icons";
import { getActiveServices, getServiceBySlug } from "@/lib/data/services";

export async function generateStaticParams() {
  const services = await getActiveServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) return {};

  return {
    title: `${service.title} | Aviat Investment Limited`,
    description: service.short_description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) notFound();

  return (
    <>
      <section className="border-b border-card-border bg-gradient-to-b from-[#1c2733] to-background px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <ServiceIcon name={service.icon} className="mx-auto size-12 text-hero-accent" />
          <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">{service.title}</h1>
          <p className="mt-6 text-lg text-zinc-200">{service.short_description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-lg leading-relaxed text-muted">{service.description}</p>

        <div className="mt-12 rounded-2xl border border-card-border bg-card p-8 text-center sm:p-10">
          <h2 className="text-2xl font-bold">Need this service?</h2>
          <p className="mt-2 text-muted">
            Request a quote and our technical team will reach out within 24 hours.
          </p>
          <Link
            href={`/contact?service=${encodeURIComponent(service.title)}`}
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Request a Quote
          </Link>
        </div>

        <div className="mt-10">
          <Link
            href="/services"
            className="text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            &larr; Back to all services
          </Link>
        </div>
      </section>
    </>
  );
}
