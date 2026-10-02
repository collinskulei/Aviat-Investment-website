import type { Metadata } from "next";
import { ScrollScrubDemo } from "@/components/animationtest/ScrollScrubDemo";

export const metadata: Metadata = {
  title: "Animation Test | Aviat Investment Limited",
  description: "Internal demo of scroll-scrubbed video frames driven by anime.js.",
  robots: { index: false, follow: false },
};

export default function AnimationTestPage() {
  return (
    <>
      <section className="border-b border-card-border bg-gradient-to-b from-[#1c2733] to-background px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Scroll-Scrub <span className="text-hero-accent">Demo</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-200">
            Scroll down and the footage plays. Scroll up and it rewinds. Stop and it freezes on
            the current frame. The captions, cards and flight path below are anime.js.
          </p>
        </div>
      </section>

      <ScrollScrubDemo />
    </>
  );
}
