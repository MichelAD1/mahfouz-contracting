"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  useSyncExternalStore,
} from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactElement, ReactNode } from "react";

/**
 * Scroll-linked reveals.
 *
 * These are tied to scroll *position*, not to a one-shot trigger: an element
 * arrives as you scroll down to it and retreats as you scroll back up, and if
 * you stop halfway it sits halfway. Nothing is ever latched, so there is no
 * state to get stuck and no "already revealed" flag to reason about.
 *
 * The earlier version was an IntersectionObserver that added `.is-revealed`
 * once and unobserved the node. That could only ever play forwards.
 *
 * Two properties are load-bearing:
 *
 *   - Arrival completes while the element is still low in the viewport, well
 *     before it reaches a comfortable reading position. Anything you can read
 *     is at full opacity, and the last block on the page still finishes even
 *     though the document runs out of scroll underneath it.
 *   - The server renders no hidden state. Without JavaScript, or before
 *     hydration, the page is simply visible — the `.js` class trick the old CSS
 *     needed is gone with it.
 */

/**
 * Viewport fraction at which a scene starts moving — its top edge a tenth of
 * the way in, rather than the instant it clears the bottom edge. A tall block
 * that starts on the boundary has already finished by the time enough of it is
 * on screen to be worth watching.
 */
const ENTER = 0.9;
/**
 * Viewport fraction at which a scene has fully arrived.
 *
 * Measured, not guessed: at 0.74 the first Process card reached full opacity
 * with its top 725px down a 900px viewport — a 175px sliver, 26% of the card,
 * so it had finished before there was anything to watch. 0.52 fixed that but
 * went too far the other way: on a tall viewport the block was still visibly
 * travelling well after it was fully readable. 0.64 sits between them.
 */
const ARRIVE = 0.64;
/** How far up the viewport each step of a sequence pushes its arrival point. */
const SEQUENCE_SPREAD = 0.28;
/** A long sequence must not push arrival past here, or it never completes. */
const ARRIVE_FLOOR = 0.3;
/**
 * Opacity before arrival.
 *
 * Raised from 0.15 after seeing the site at 80% browser zoom, where a taller
 * viewport leaves the next section peeking above the fold for much longer. At
 * 0.15 that section sat there visibly half-finished, which reads as a bug
 * rather than as anticipation. At 0.34 an un-arrived block is legible and
 * merely quiet, so being caught mid-travel costs nothing.
 */
const REST_OPACITY = 0.34;

type SceneProps = {
  children: ReactNode;
  className?: string;
  /**
   * Position in a sequence. Unlike a delay in seconds, this shifts *where in
   * the scroll* the element arrives, so the sequence reads the same however
   * fast you scroll — and runs backwards when you scroll up.
   */
  order?: number;
  /** Travel distance in px. Enough to read as movement, not as a slide. */
  y?: number;
};

/**
 * Motion renders its values into the markup, and on the server scroll progress
 * is necessarily zero — so styling these scenes unconditionally would ship
 * `opacity: 0.15`, `translateY(32px)` and a closed clip-path to anyone without
 * JavaScript, leaving the page permanently dimmed and the About photograph
 * invisible. The styles are therefore withheld until after hydration: the
 * server sends an ordinary, fully visible page, which is what the retired
 * `.js` class was protecting.
 *
 * Nothing visible moves when they land. An element already on screen measures
 * at progress 1, so it is styled to exactly where it already was; only content
 * below the fold starts from its resting state, where no one can see it.
 */
const neverChanges = () => () => {};

function useHydrated() {
  // Read as an external store rather than a state-setting effect, matching
  // useMediaQuery: the server snapshot is false, the client snapshot is true,
  // and there is nothing to subscribe to because it only ever resolves once.
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
}

/**
 * The scroll range for one scene, and whether it should move at all.
 * `useScroll` is called unconditionally — hooks cannot be skipped — and its
 * output is simply ignored when motion is not wanted.
 */
function useScene(order: number) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const hydrated = useHydrated();
  const arrive = Math.max(ARRIVE_FLOOR, ARRIVE - order * SEQUENCE_SPREAD);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`start ${ENTER}`, `start ${arrive}`],
  });

  return { ref, progress: scrollYProgress, enabled: hydrated && !prefersReduced };
}

export function Reveal({ children, className, order = 0, y = 32 }: SceneProps) {
  const { ref, progress, enabled } = useScene(order);

  // Opacity lands ahead of the travel, so the element is readable while it is
  // still settling rather than arriving all at once.
  const opacity = useTransform(progress, [0, 0.7], [REST_OPACITY, 1]);
  const translate = useTransform(progress, [0, 1], [y, 0]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={enabled ? { opacity, y: translate } : undefined}
    >
      {children}
    </motion.div>
  );
}

/**
 * A list whose items arrive in sequence. Only used where the content is
 * genuinely a list — a stagger applied to unrelated blocks reads as decoration.
 *
 * The sequence is handed to the children here rather than computed in CSS, so
 * it survives any number of items.
 */
export function Stagger({
  children,
  className,
  gap = 0.06,
  order = 0,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  order?: number;
}) {
  return (
    <div className={className}>
      {Children.map(children, (child, index) =>
        isValidElement<{ order?: number }>(child)
          ? cloneElement(child as ReactElement<{ order?: number }>, {
              order: order + index * gap,
            })
          : child,
      )}
    </div>
  );
}

export function StaggerItem({ children, className, y = 32, order = 0 }: SceneProps) {
  return (
    <Reveal className={className} y={y} order={order}>
      {children}
    </Reveal>
  );
}

/**
 * A wipe that uncovers an image from its lower edge, scrubbed by scroll so it
 * covers again on the way back up. Used on the two large images only; on every
 * image it would be a gimmick.
 *
 * This one arrives earlier than a `Reveal` does — a half-wiped photograph is
 * more conspicuous than a half-faded paragraph.
 */
export function ImageReveal({
  children,
  className,
  order = 0,
}: Omit<SceneProps, "y">) {
  const { ref, progress, enabled } = useScene(order);

  const inset = useTransform(progress, [0, 0.85], [100, 0]);
  const clipPath = useTransform(inset, (value) => `inset(${value}% 0 0 0)`);

  return (
    <motion.div ref={ref} className={className} style={enabled ? { clipPath } : undefined}>
      {children}
    </motion.div>
  );
}
