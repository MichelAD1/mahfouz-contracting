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
import { motion, useInView, useReducedMotion } from "motion/react";
import type { ReactElement, ReactNode } from "react";
import { EASE_REVEAL } from "./ease";

/**
 * Section entrances.
 *
 * These are the **hero's animation, played lower down the page**: the same
 * curve, the same 1.35s, the same 2.5rem of travel, started when the section
 * arrives instead of when the document does. A section rises from below and
 * settles, once, and is then simply part of the page.
 *
 * They used to be scrubbed by scroll position — tied to where the page was
 * rather than played on arrival, so a section sat at whatever progress your
 * scroll implied and ran backwards as you scrolled up. That is a defensible
 * effect. It is not the one the hero has, which is the one this site is
 * supposed to have.
 *
 * Two properties are load-bearing, and both survive the change:
 *
 *   - The server renders no hidden state. `initial={false}` makes Motion set
 *     the settled values on mount without animating, so the HTML is an
 *     ordinary, fully visible page — before hydration, and for good if
 *     JavaScript never arrives.
 *   - Nothing visible moves when the effect switches on. Anything inside the
 *     first screenful is opted out entirely (see `useInFirstScreen`), and
 *     everything else is only ever hidden while it is below the fold, where
 *     the hiding cannot be seen.
 */

/**
 * Travel, in px. 2.5rem, which is what `@keyframes rise` uses for the hero.
 * These are meant to be the same movement, so it is the same number.
 */
const RISE = 40;

/** Seconds. `animate-rise` again: one system, one duration. */
const DURATION = 1.35;

/**
 * How much of a section must be on screen before it starts.
 *
 * `some` fires as the top edge appears, and the negative bottom margin holds
 * it back until the section is properly inside the viewport rather than
 * technically touching it. A fraction of the element would make a tall block
 * wait far too long, because the fraction is of the block and not of the
 * screen.
 *
 * 64px, and in pixels rather than a percentage, because the cost of getting it
 * wrong is asymmetric: too small and a section plays while it is a sliver and
 * nobody sees it, too large and a section that is *fully* on screen sits blank
 * because its top is still under the line. At 12% of the viewport that was
 * 108px, and a short block landing at the bottom edge stayed invisible with
 * nothing left to trigger it but more scrolling.
 */
const VIEWPORT = { once: true, amount: "some", margin: "0px 0px -64px 0px" } as const;

type SceneProps = {
  children: ReactNode;
  className?: string;
  /**
   * Position in a sequence, in **seconds of delay**. The hero staggers its
   * lines by 0.19s; a list here is usually 0.14s, which is the same family of
   * interval rather than a coincidence.
   */
  order?: number;
  /** Travel distance in px. Enough to read as movement, not as a slide. */
  y?: number;
};

/**
 * What a scene looks like when the effect does not apply to it.
 *
 * Written out rather than left to `style={undefined}`. Motion drives these
 * through MotionValues straight onto the node; dropping the prop stops it
 * *updating* them and leaves the last values it wrote sitting there, which
 * once froze whole sections at rest opacity permanently.
 */
const SETTLED = { opacity: 1, y: 0 } as const;

/** The same, for the wipe: fully uncovered. */
const UNCOVERED = { clipPath: "inset(0% 0 0 0)" } as const;

/**
 * Held with a zero-length transition, so a section below the fold is put into
 * its starting state outright rather than animating into it.
 */
const INSTANT = { duration: 0 } as const;

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
 * Anything there is on screen before a visitor has scrolled at all, and that
 * part of the page is the hero's entrance to make. Animating it again on
 * arrival would mean hiding content that has already been painted, which is a
 * flicker rather than an entrance.
 *
 * **The test is deliberately not "is it on screen".** That was an earlier
 * version and it failed on a client-side navigation: the new page mounts while
 * the old scroll position is still in force, and at the time the router
 * animated to the top rather than jumping. Traced over CDP, arriving at
 * /services from a home page at 2000px, the scroll eased down over 870ms and
 * the first division did not enter the viewport until 330ms in. A measurement
 * at mount therefore saw it far below the fold. Re-measuring for a few frames
 * did not help either; nothing short of waiting out the animation would have.
 *
 * Adding the scroll offset back removes the race instead of racing it.
 * `rect.top + scrollY` is the element's position in the *document*, which does
 * not change while the page scrolls, so the answer is the same at any moment
 * during such an animation, on a hard load, and on a restored back navigation.
 * No timers, no listeners, nothing to settle. Route scrolling is instant now,
 * which closes that particular window, but the measurement stays
 * scroll-independent: it costs nothing, and a stylesheet cannot reopen it.
 *
 * Its own transform is inside the measurement, which is 40px against a
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
 * One scene: whether it animates at all, and whether it has arrived.
 *
 * `useInView` is called unconditionally — hooks cannot be skipped — and its
 * answer is ignored when the scene is not animating.
 */
function useScene() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const hydrated = useHydrated();
  const inFirstScreen = useInFirstScreen(ref);
  const inView = useInView(ref, VIEWPORT);

  const enabled = hydrated && !prefersReduced && !inFirstScreen;

  return { ref, enabled, arrived: !enabled || inView };
}

export function Reveal({ children, className, order = 0, y = RISE }: SceneProps) {
  const { ref, enabled, arrived } = useScene();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={arrived ? SETTLED : { opacity: 0, y }}
      transition={
        arrived && enabled
          ? { duration: DURATION, ease: EASE_REVEAL, delay: order }
          : INSTANT
      }
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

export function StaggerItem({ children, className, y = RISE, order = 0 }: SceneProps) {
  return (
    <Reveal className={className} y={y} order={order}>
      {children}
    </Reveal>
  );
}

/**
 * A wipe that uncovers an image from its lower edge — the same arrival as a
 * `Reveal`, in the form a photograph can take. Used on the large images only;
 * on every image it would be a gimmick.
 */
export function ImageReveal({
  children,
  className,
  order = 0,
}: Omit<SceneProps, "y">) {
  const { ref, enabled, arrived } = useScene();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={arrived ? UNCOVERED : { clipPath: "inset(100% 0 0 0)" }}
      transition={
        arrived && enabled
          ? { duration: DURATION, ease: EASE_REVEAL, delay: order }
          : INSTANT
      }
    >
      {children}
    </motion.div>
  );
}
