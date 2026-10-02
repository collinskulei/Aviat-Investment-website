"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isAdminPath } from "@/lib/admin-paths";

// Content blocks that zoom in as they scroll into view. Grid children are the
// cards; anything nested inside another match animates with its parent.
const TARGETS = [
  "h1", "h2", "h3", "p", "img", "form", "iframe", "a.btn-fade-light", ".grid > *",
]
  .map((s) => `main ${s}, footer ${s}`)
  .join(", ");

/**
 * Adds a zoom-in entrance animation to the public site's content. Elements
 * already on screen animate right away; the rest wait until scrolled to.
 */
export function ZoomReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (isAdminPath(pathname)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>(TARGETS)).filter(
      (el) =>
        !el.classList.contains("absolute") &&
        !el.parentElement?.closest(TARGETS) &&
        !el.classList.contains("zoom-in")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.remove("zoom-pending");
          entry.target.classList.add("zoom-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    for (const el of elements) {
      el.classList.add("zoom-pending");
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
