"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
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
 * Viewport fraction at which a scene starts moving.
 *
 * Past 1, so a scene begins travelling while it is still below the fold and is
 * already a seventh of the way through by the time any of it can be seen.
 *
 * It was 0.9, a tenth of a viewport above the bottom edge, which put the whole
 * reveal inside 0.26 of a viewport of scroll — 234px on a 900px screen for a
 * block to go from 0.34 opacity and 32px low to settled. That is why it read as
 * a snap rather than an arrival: the distance was right and the run-up was not.
 *
 * ARRIVE below is untouched, so nothing finishes any later on screen than the
 * measurement that set it. The journey to it is 62% longer.
 */
const ENTER = 1.06;
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
/**
 * The same, for a photograph, and further out still.
 *
 * A wipe is far more conspicuous than a fade, and a fully clipped image is a
 * hole in the page rather than something merely quiet — which is exactly what
 * the old value produced. At ENTER an image reached the bottom edge of the
 * viewport with its clip-path still at `inset(100%)`, so the first thing a
 * visitor saw of it was nothing, and then all of it inside a quarter of a
 * viewport of scroll.
 *
 * A fifth of a viewport below the fold means a photograph is already about 40%
 * uncovered by the time any of it is visible, and the rest of the wipe is spread
 * over 0.56 of a viewport rather than 0.26.
 */
const ENTER_IMAGE = 1.2;

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
 * Nothing visible moves when they land, and the way that is guaranteed changed:
 * an element inside the first screenful of the document is opted out of the
 * effect entirely (see `useInFirstScreen`). Only content below the fold starts
 * from its resting state, where no one can see it start.
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

/** `useLayoutEffect` warns during SSR, where there is nothing to measure. */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Whether this element sits inside the first screenful of the document.
 *
 * Anything there is visible before a visitor has scrolled at all, so there is
 * no scroll above it to drive a reveal, and holding it at rest opacity leaves
 * it dimmed with nothing having moved and nothing about to. The page had
 * claimed that an element already on screen "measures at progress 1, so it is
 * styled to exactly where it already was" — true only of an element scrolled
 * fully past. One that is *partway* into its range measures partway.
 *
 * That is what a short hero exposes: /services has a 491px hero on an 844px
 * screen, so its first division sat at opacity 0.40 on load and stayed there.
 * /about did the same at 0.56.
 *
 * **The test is deliberately not "is it on screen".** That was the first
 * version and it failed on a client-side navigation, because the new page
 * mounts while the old scroll position is still in force and the router then
 * *animates* to the top rather than jumping: traced over CDP, arriving at
 * /services from a home page at 2000px, the scroll eased down over 870ms and
 * the first division did not enter the viewport until 330ms in. A measurement
 * at mount therefore saw it far below the fold, kept its effect enabled, and
 * left it at the top of the page already part-way through its range with no
 * scroll left to finish it — heading at 0.80, body at 0.34, staying there.
 * Re-measuring for a few frames did not help either; nothing short of waiting
 * out the whole animation would have.
 *
 * Adding the scroll offset back removes the race instead of racing it.
 * `rect.top + scrollY` is the element's position in the *document*, which does
 * not change while the page scrolls, so the answer is the same at any moment
 * during that 870ms and on a hard load and on a restored back-navigation. No
 * timers, no listeners, no settling to wait for.
 *
 * Its own `y` transform is inside the measurement, which is 32px against a
 * threshold of a whole viewport — far too coarse to care.
 */
function useInFirstScreen(ref: React.RefObject<HTMLElement | null>) {
  const [inFirstScreen, setInFirstScreen] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const documentTop = node.getBoundingClientRect().top + window.scrollY;
    if (documentTop < window.innerHeight) setInFirstScreen(true);
  }, [ref]);

  return inFirstScreen;
}

/**
 * The scroll range for one scene, and whether it should move at all.
 * `useScroll` is called unconditionally — hooks cannot be skipped — and its
 * output is simply ignored when motion is not wanted.
 */
function useScene(order: number, enter: number = ENTER) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const hydrated = useHydrated();
  const visibleOnArrival = useInFirstScreen(ref);
  const arrive = Math.max(ARRIVE_FLOOR, ARRIVE - order * SEQUENCE_SPREAD);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`start ${enter}`, `start ${arrive}`],
  });

  return {
    ref,
    progress: scrollYProgress,
    enabled: hydrated && !prefersReduced && !visibleOnArrival,
  };
}

/**
 * What a scene looks like when the effect does not apply to it.
 *
 * Written out rather than left to `style={undefined}`, which is what this did
 * and which does not work. Motion drives these through MotionValues straight
 * onto the node; dropping the prop stops it *updating* them and leaves the
 * last values it wrote sitting there. On a client-side navigation that is a
 * section frozen at rest opacity for good - worse than the bug it replaced,
 * because at least that one came back when you scrolled.
 *
 * So the disabled branch states the finished position instead of hoping the
 * enabled one never ran. It is also what the server renders, which is the
 * ordinary, fully visible page this module goes to some trouble to ship.
 */
const SETTLED = { opacity: 1, y: 0 } as const;

/** The same, for the wipe: fully uncovered. */
const UNCOVERED = { clipPath: "inset(0 0 0 0)" } as const;

export function Reveal({ children, className, order = 0, y = 32 }: SceneProps) {
  const { ref, progress, enabled } = useScene(order);

  /**
   * Opacity lands ahead of the travel, so the element is readable while it is
   * still settling rather than arriving all at once.
   *
   * 0.8 rather than 0.7 because ENTER moved. The number is a fraction of the
   * range, and the range is longer now, so holding it at 0.7 would have brought
   * full opacity to a higher point on the screen than the measurement that set
   * it. This keeps the finish where it was and lengthens the approach.
   */
  const opacity = useTransform(progress, [0, 0.8], [REST_OPACITY, 1]);
  const translate = useTransform(progress, [0, 1], [y, 0]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={enabled ? { opacity, y: translate } : SETTLED}
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
 * It runs on its own, longer range — see ENTER_IMAGE. A photograph that starts
 * its wipe on the fold is invisible at the fold, and then arrives all at once.
 */
export function ImageReveal({
  children,
  className,
  order = 0,
}: Omit<SceneProps, "y">) {
  const { ref, progress, enabled } = useScene(order, ENTER_IMAGE);

  const inset = useTransform(progress, [0, 0.85], [100, 0]);
  const clipPath = useTransform(inset, (value) => `inset(${value}% 0 0 0)`);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={enabled ? { clipPath } : UNCOVERED}
    >
      {children}
    </motion.div>
  );
}
