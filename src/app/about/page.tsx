import type { Metadata } from "next";
import { Plane } from "lucide-react";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { LocationMap } from "@/components/LocationMap";
import { getSiteContent } from "@/lib/data/site-content";
import { getWhyChooseUsItems } from "@/lib/data/why-choose-us";

export const metadata: Metadata = {
  title: "About Us | Aviat Investment Limited",
  description:
    "Aviat Investment Limited is an aviation maintenance specialist based at Wilson Airport, focused on restoration, overhaul, and testing of critical aircraft components.",
};

export default async function AboutPage() {
  const [siteContent, whyChooseUsItems] = await Promise.all([
    getSiteContent(),
    getWhyChooseUsItems(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-card-border bg-gradient-to-b from-[#1c2733] to-background px-6 py-20">
        <Plane
          className="pointer-events-none absolute -right-12 -top-10 size-64 rotate-45 text-white/5"
          strokeWidth={0.5}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            About <span className="text-hero-accent">Aviat Investment</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-200">
            A specialist aviation maintenance provider based at Wilson Airport, dedicated to
            keeping critical safety components airworthy, reliable, and fully compliant.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        {siteContent.about_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={siteContent.about_image_url}
            alt="Aviat Investment Limited team and facility"
            className="mb-12 aspect-video w-full rounded-2xl border border-card-border object-cover"
          />
        )}

        <h2 className="text-3xl font-bold">Who We Are</h2>
        {siteContent.about_intro.split("\n\n").map((paragraph, i) => (
          <p key={i} className="mt-4 text-muted">
            {paragraph}
          </p>
        ))}

        <h2 className="mt-14 text-3xl font-bold">Our Mission</h2>
        <p className="mt-4 text-muted">{siteContent.about_mission}</p>
      </section>

      <WhyChooseUs items={whyChooseUsItems} />

      <LocationMap />
    </>
  );
}
