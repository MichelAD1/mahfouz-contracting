import { Children, cloneElement, isValidElement } from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";

/**
 * Scroll reveals, built as progressive enhancement.
 *
 * These are server components that emit a `data-reveal` attribute and nothing
 * else — no per-instance JavaScript. The hidden state lives in CSS behind a
 * `.js` class that an inline script in the document head sets before first
 * paint, so:
 *
 *   - without JavaScript, or if hydration fails, every section is simply
 *     visible rather than a page of invisible content;
 *   - under `prefers-reduced-motion` the CSS opts out entirely;
 *   - one IntersectionObserver (`RevealObserver`) drives the whole page.
 *
 * The earlier version used Motion's `initial={{ opacity: 0 }}`, which bakes
 * `opacity: 0` into the server-rendered HTML — the page depended on JS to
 * become readable at all.
 */

type RevealStyle = CSSProperties & {
  "--reveal-delay"?: string;
  "--reveal-y"?: string;
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds. Use sparingly — a long chain of delays reads as a slideshow. */
  delay?: number;
  /** Travel distance in px. Kept small on purpose. */
  y?: number;
};

export function Reveal({ children, className, delay = 0, y = 14 }: RevealProps) {
  const style: RevealStyle = {
    "--reveal-delay": `${delay}s`,
    "--reveal-y": `${y}px`,
  };

  return (
    <div className={className} data-reveal="rise" style={style}>
      {children}
    </div>
  );
}

/**
 * A list whose items arrive in sequence. Only used where the content is
 * genuinely a list — a stagger applied to unrelated blocks reads as decoration.
 *
 * Delays are handed to the children here rather than computed in CSS, so the
 * sequence survives any number of items.
 */
export function Stagger({
  children,
  className,
  gap = 0.06,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
}) {
  return (
    <div className={className}>
      {Children.map(children, (child, index) =>
        isValidElement<{ delay?: number }>(child)
          ? cloneElement(child as ReactElement<{ delay?: number }>, {
              delay: delay + index * gap,
            })
          : child,
      )}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 14,
  delay = 0,
}: RevealProps) {
  return (
    <Reveal className={className} y={y} delay={delay}>
      {children}
    </Reveal>
  );
}

/**
 * A wipe that uncovers an image from its lower edge. Used on the two large
 * images only; on every image it would be a gimmick.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: Omit<RevealProps, "y">) {
  const style: RevealStyle = { "--reveal-delay": `${delay}s` };

  return (
    <div className={className} data-reveal="wipe" style={style}>
      {children}
    </div>
  );
}
