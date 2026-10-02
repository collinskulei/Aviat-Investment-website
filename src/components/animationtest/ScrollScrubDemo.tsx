"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createScope, createTimeline, onScroll, stagger, svg } from "animejs";

// Frames live in public/animationtest/frames as frame_001.webp ... frame_120.webp.
// To use a real video instead, export its frames with ffmpeg and update FRAME_COUNT:
//   ffmpeg -i clip.mp4 -vf "fps=30,scale=1280:-1" -c:v libwebp -quality 72 frame_%03d.webp
const FRAME_COUNT = 120;
const frameSrc = (i: number) =>
  `/animationtest/frames/frame_${String(i + 1).padStart(3, "0")}.webp`;

// Captions shown over the footage, keyed to how far through the scrub section
// the visitor is (0-1000 on the timeline = 0-100% of the section).
const CAPTIONS = [
  { at: 40, title: "Every frame tied to scroll", body: "Scroll speed is playback speed." },
  { at: 380, title: "Scroll back up", body: "It rewinds frame by frame, no reloading." },
  { at: 700, title: "Built with anime.js", body: "One timeline drives the frames and these captions." },
];

const CARDS = [
  { title: "Canvas image sequence", body: "120 WebP frames drawn to a canvas. Smooth in every browser." },
  { title: "anime.js onScroll", body: "Maps scroll position to timeline progress, with smoothing." },
  { title: "Sticky section", body: "The canvas stays pinned while a 400vh section scrolls past." },
];

export function ScrollScrubDemo() {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(0);
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let current = 0;

    // Preload every frame; draw() falls back to the nearest earlier loaded one.
    const images = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.src = frameSrc(i);
      img.onload = () => {
        setLoaded((n) => n + 1);
        if (i === current) draw(i);
      };
      return img;
    });

    function draw(index: number) {
      current = index;
      let i = index;
      while (i > 0 && !images[i].complete) i--;
      const img = images[i];
      if (!img.complete || !img.naturalWidth || !canvas || !ctx) return;

      // Cover-fit the frame to the canvas, like object-fit: cover.
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    }

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      draw(current);
    }
    resize();
    window.addEventListener("resize", resize);

    const scope = createScope({ root }).add(() => {
      const state = { frame: 0 };

      // Progress runs from the section's top reaching the viewport top to its
      // bottom reaching the viewport bottom, i.e. the whole time it is pinned.
      createTimeline({
        defaults: { ease: "linear" },
        autoplay: onScroll({
          target: ".scrub-section",
          enter: { target: "top", container: "top" },
          leave: { target: "bottom", container: "bottom" },
          sync: 0.25,
        }),
      })
        .add(
          state,
          {
            frame: [0, FRAME_COUNT - 1],
            duration: 1000,
            onUpdate: () => {
              const i = Math.round(state.frame);
              if (i !== current) {
                draw(i);
                setFrame(i + 1);
              }
            },
          },
          0
        )
        .add(".scrub-progress", { scaleX: [0, 1], duration: 1000 }, 0)
        .add(".caption-0", { opacity: [0, 1], y: [40, 0], duration: 80 }, CAPTIONS[0].at)
        .add(".caption-0", { opacity: 0, y: -40, duration: 80 }, CAPTIONS[0].at + 220)
        .add(".caption-1", { opacity: [0, 1], y: [40, 0], duration: 80 }, CAPTIONS[1].at)
        .add(".caption-1", { opacity: 0, y: -40, duration: 80 }, CAPTIONS[1].at + 220)
        .add(".caption-2", { opacity: [0, 1], y: [40, 0], duration: 80 }, CAPTIONS[2].at);

      // Cards stagger in once, the first time they scroll into view.
      animate(".demo-card", {
        opacity: [0, 1],
        y: [60, 0],
        delay: stagger(120),
        duration: 700,
        ease: "out(3)",
        autoplay: onScroll({ target: ".demo-cards", enter: { container: "bottom-=80", target: "top" } }),
      });

      // The flight path draws itself as you scroll past it, and un-draws going back.
      animate(svg.createDrawable(".flight-path"), {
        draw: ["0 0", "0 1"],
        ease: "linear",
        autoplay: onScroll({
          target: ".flight-svg",
          enter: { container: "bottom", target: "top" },
          leave: { container: "center", target: "center" },
          sync: 0.4,
        }),
      });
      // The destination pops in over the last bit of scroll as the line arrives.
      animate(".flight-plane", {
        opacity: [0, 1],
        scale: [0.4, 1],
        ease: "out(3)",
        autoplay: onScroll({
          target: ".flight-svg",
          enter: { container: "center+=60", target: "center" },
          leave: { container: "center-=40", target: "center" },
          sync: 0.4,
        }),
      });
    });

    return () => {
      window.removeEventListener("resize", resize);
      scope.revert();
    };
  }, []);

  return (
    <div ref={root}>
      {/* Tall section: the canvas stays pinned while 400vh of scroll passes by. */}
      <section className="scrub-section relative h-[400vh] bg-[#0b1220]">
        <div className="sticky top-0 h-svh overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 size-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {CAPTIONS.map((c, i) => (
            <div
              key={c.title}
              className={`caption-${i} absolute inset-x-0 bottom-24 px-6 text-center opacity-0`}
            >
              <div className="text-3xl font-extrabold text-white sm:text-5xl">{c.title}</div>
              <div className="mt-3 text-lg text-zinc-200">{c.body}</div>
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
            <div className="scrub-progress h-full origin-left scale-x-0 bg-hero-accent" />
          </div>
          <div className="absolute right-4 bottom-4 rounded bg-black/50 px-2 py-1 font-mono text-xs text-white">
            frame {frame}/{FRAME_COUNT}
            {loaded < FRAME_COUNT && ` · loading ${Math.round((loaded / FRAME_COUNT) * 100)}%`}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center text-3xl font-bold">How it works</div>
        <div className="demo-cards mt-12 flex flex-col gap-6 md:flex-row">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="demo-card flex-1 rounded-2xl border border-card-border bg-card p-6 opacity-0"
            >
              <div className="text-lg font-semibold text-primary">{card.title}</div>
              <div className="mt-2 text-muted">{card.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-32">
        <div className="text-center text-3xl font-bold">SVG line drawing</div>
        <div className="mt-2 text-center text-muted">Wilson Airport to wherever you need us.</div>
        <svg viewBox="0 0 800 300" className="flight-svg mt-10 w-full" fill="none">
          <path
            d="M40 250 C 200 250, 260 60, 420 110 S 640 40, 760 60"
            className="stroke-muted/40"
            strokeWidth="2"
            strokeDasharray="6 8"
          />
          <path
            className="flight-path stroke-primary"
            d="M40 250 C 200 250, 260 60, 420 110 S 640 40, 760 60"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="40" cy="250" r="7" className="fill-primary" />
          <g className="flight-plane opacity-0" style={{ transformOrigin: "760px 60px" }}>
            <circle cx="760" cy="60" r="16" className="fill-primary/20" />
            <circle cx="760" cy="60" r="7" className="fill-primary" />
          </g>
        </svg>
      </section>
    </div>
  );
}
