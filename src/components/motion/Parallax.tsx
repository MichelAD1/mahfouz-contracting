"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useMediaQuery } from "./useMediaQuery";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /**
   * Total travel in px across the whole scroll pass. Deliberately small —
   * anything above ~100 starts to read as an effect rather than depth.
   */
  distance?: number;
};

/**
 * Scroll-linked depth for a single image layer.
 *
 * The inner layer is inset beyond the clip box so the translate never exposes
 * an edge, and the effect is switched off below 48rem and under
 * `prefers-reduced-motion` — on touch it costs more than it gives.
 */
export function Parallax({ children, className, distance = 70 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const isWide = useMediaQuery("(min-width: 48rem)");
  const enabled = isWide && !prefersReduced;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div
        // The overshoot must exceed `distance` at every viewport size.
        style={{
          position: "absolute",
          inset: `-${distance + 12}px 0`,
          y: enabled ? y : 0,
          willChange: enabled ? "transform" : undefined,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
