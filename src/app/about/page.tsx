import type { Metadata } from "next";
import { WhyChooseUs } from "@/components/WhyChooseUs";

export const metadata: Metadata = {
  title: "About Us | Aviat Investment Limited",
  description:
    "Aviat Investment Limited is an aviation maintenance specialist based at Wilson Airport, focused on restoration, overhaul, and testing of critical aircraft components.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-card-border bg-gradient-to-b from-[#1c2733] to-background px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            About <span className="text-accent">Aviat Investment</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-200">
            A specialist aviation maintenance provider based at Wilson Airport, dedicated to
            keeping critical safety components airworthy, reliable, and fully compliant.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-3xl font-bold">Who We Are</h2>
        <p className="mt-4 text-muted">
          Aviat Investment Limited is an aviation component maintenance company operating out
          of Wilson Airport, near Parapet. We focus exclusively on the critical safety
          equipment that keeps aircraft and crews protected: batteries, life vests, emergency
          power packs, locator beacons, and pressure vessels.
        </p>
        <p className="mt-4 text-muted">
          Our team combines hands-on technical expertise with rigorous, standards-driven
          processes, so operators can trust that every component we touch meets the demands of
          real-world flight operations.
        </p>

        <h2 className="mt-14 text-3xl font-bold">Our Mission</h2>
        <p className="mt-4 text-muted">
          To deliver precise, dependable maintenance for aviation safety equipment &mdash; giving
          operators confidence in every takeoff, and every landing.
        </p>
      </section>

      <WhyChooseUs />
    </>
  );
}
