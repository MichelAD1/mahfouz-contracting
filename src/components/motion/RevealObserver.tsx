"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for every `[data-reveal]` on the page.
 *
 * Mounted once in the root layout. Elements are unobserved as they reveal, so
 * the observer empties itself as the visitor scrolls. Anything already above
 * the fold is revealed on the first callback, which fires immediately.
 */
export function RevealObserver() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (nodes.length === 0) return;

    // No IntersectionObserver: show everything rather than hide it.
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return null;
}
