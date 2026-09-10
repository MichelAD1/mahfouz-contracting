"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { EASE } from "./ease";

type CounterProps = {
  to: number;
  /** Rendered on the server and left in place when motion is not wanted. */
  display: string;
  className?: string;
};

/**
 * Counts up on first view.
 *
 * The final figure is what renders on the server, so the number is correct
 * without JavaScript and correct for search engines. The count is set back to
 * zero in a layout effect — before paint — so there is no flash of the final
 * value, and the DOM is written directly rather than through React state so a
 * 60fps count does not re-render the tree.
 */
export function Counter({ to, display, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const prefersReduced = useReducedMotion();
  const started = useRef(false);

  useLayoutEffect(() => {
    if (prefersReduced || !ref.current || started.current) return;
    ref.current.textContent = "0";
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced || !inView || started.current) return;
    started.current = true;

    const node = ref.current;
    if (!node) return;

    const controls = animate(0, to, {
      duration: Math.min(0.6 + to * 0.06, 1.6),
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
