"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * `reducedMotion="user"` makes Motion honour the OS setting for every
 * animation in the tree: transform and layout animations are dropped, opacity
 * is kept. Individual effects that Motion cannot reason about — the parallax
 * transforms — opt out explicitly via `useReducedMotion`.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
