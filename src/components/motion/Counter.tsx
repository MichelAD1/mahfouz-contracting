"use client";

import { useLayoutEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { EASE } from "./ease";

type CounterProps = {
  to: number;
  /** Rendered on the server and left in place when motion is not wanted. */
  display: string;
  className?: string;
};

/**
 * Counts up on first view, then stays at the figure.
 *
 * It does not run backwards with the scroll the way the reveals do, and that is
 * deliberate. Those scrub presentation — opacity, position, a clip — so a
 * half-arrived block still says exactly what it said before. A figure is
 * content: scrubbing it would have the page claim "3 in-house divisions" for as
 * long as the visitor happened to stop there, which is not a softer truth but a
 * different and wrong one.
 *
 * The final figure is what renders on the server, so the number is correct
 * without JavaScript and correct for search engines. Zeroing happens in a
 * layout effect at the moment the count starts — before paint, so there is no
 * flash of the final value — rather than on mount. Zeroing on mount left every
 * counter reading "0" while it sat below the fold, which was invisible when
 * unrevealed blocks were at opacity 0 but is not now they rest at 0.15.
 *
 * The DOM is written directly rather than through React state so a 60fps count
 * does not re-render the tree.
 */
export function Counter({ to, display, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const prefersReduced = useReducedMotion();
  const started = useRef(false);

  useLayoutEffect(() => {
    if (prefersReduced || !inView || started.current) return;
    started.current = true;

    const node = ref.current;
    if (!node) return;

    node.textContent = "0";

    const controls = animate(0, to, {
      duration: Math.min(1.2 + to * 0.1, 2.6),
      ease: EASE,
      onUpdate: (value) => {
        node.textContent = String(Math.round(value));
      },
      onComplete: () => {
        node.textContent = display;
      },
    });

    return () => controls.stop();
  }, [inView, prefersReduced, to, display]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
