"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { useReducedMotion } from "motion/react";
import { SiteImage } from "@/components/primitives/SiteImage";
import { pad2 } from "@/lib/format";
import { croppedAspectRatio } from "@/sanity/lib/image";
import type { GalleryImage } from "@/sanity/lib/types";

/**
 * A project's photographs, one at a time.
 *
 * Built on native horizontal scrolling with CSS scroll snap rather than on a
 * transform the script drives. That makes the parts that matter most work
 * before any JavaScript has run and on every device: a finger swipes, a
 * trackpad swipes, momentum and rubber-banding are the platform's own, and
 * each photograph settles squarely in the frame. The script adds what scrolling
 * cannot: the arrows, the counter, the thumbnails, the arrow keys, and
 * click-and-drag for a mouse, which does not scroll anything by itself.
 */

/** A drag has to travel this far - or an eighth of the frame - to change photograph. */
const DRAG_THRESHOLD = 72;

/** How long a smooth scroll is given to finish where `scrollend` is not supported. */
const SETTLE_FALLBACK_MS = 700;

/**
 * Portraits are shown whole. The frame is landscape, and cropping a portrait
 * to fill it keeps its middle third - usually the least interesting part of a
 * site photograph. Anything square or wider fills the frame around its hotspot.
 */
const isPortrait = (image: GalleryImage) => (croppedAspectRatio(image) ?? 1.5) < 1;

/**
 * Runs `done` once a programmatic scroll has come to rest. Returns a cancel,
 * for when something new starts before it has.
 */
function afterScroll(element: HTMLElement, done: () => void): () => void {
  let finished = false;
  let timer = 0;

  const stop = () => {
    finished = true;
    element.removeEventListener("scrollend", finish);
    window.clearTimeout(timer);
  };
  function finish() {
    if (finished) return;
    stop();
    done();
  }

  element.addEventListener("scrollend", finish, { once: true });
  timer = window.setTimeout(finish, SETTLE_FALLBACK_MS);
  return stop;
}

export function ProjectCarousel({
  images,
  label,
  projectName,
}: {
  images: GalleryImage[];
  /** The section's heading, e.g. On site. */
  label: string;
  projectName: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    pointer: number;
    startX: number;
    startScroll: number;
    startIndex: number;
  } | null>(null);
  /** Cancels the snap restore still waiting on the last drag's release. */
  const cancelRestore = useRef<(() => void) | null>(null);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const prefersReduced = useReducedMotion();
  const trackId = useId();

  const count = images.length;
  const multiple = count > 1;

  /** The slide whose left edge is nearest the current scroll position. */
  const nearest = useCallback((): number => {
    const track = trackRef.current;
    if (!track) return 0;

    let best = 0;
    let distance = Number.POSITIVE_INFINITY;
    Array.from(track.children).forEach((slide, slideIndex) => {
      const gap = Math.abs((slide as HTMLElement).offsetLeft - track.scrollLeft);
      if (gap < distance) {
        distance = gap;
        best = slideIndex;
      }
    });
    return best;
  }, []);

  const goTo = useCallback(
    (target: number) => {
      const track = trackRef.current;
      const slide = track?.children[Math.min(Math.max(target, 0), count - 1)] as
        | HTMLElement
        | undefined;
      if (!track || !slide) return;

      track.scrollTo({
        left: slide.offsetLeft,
        behavior: prefersReduced ? "auto" : "smooth",
      });
    },
    [count, prefersReduced],
  );

  // The counter follows the scroll position, however the scroll was caused.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !multiple) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIndex(nearest()));
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, [multiple, nearest]);

  // Keeps the current thumbnail in view without moving the page.
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !thumb || strip.scrollWidth <= strip.clientWidth) return;

    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }, [index, prefersReduced]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: count - 1,
    };
    if (!(event.key in moves)) return;

    event.preventDefault();
    goTo(moves[event.key]);
  };

  /*
   * Click-and-drag, for a mouse only: touch and trackpads already scroll
   * natively. Snapping is suspended while the pointer is down - otherwise the
   * browser would snap the strip back after every pixel of the drag - and
   * restored once the release has settled on a photograph.
   */
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !multiple || event.pointerType !== "mouse" || event.button !== 0) return;

    // A drag started before the last one settled: its restore must not land
    // mid-drag and snap the strip out from under the pointer.
    cancelRestore.current?.();
    cancelRestore.current = null;

    drag.current = {
      pointer: event.pointerId,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      startIndex: nearest(),
    };
    track.setPointerCapture(event.pointerId);
    track.style.scrollSnapType = "none";
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const state = drag.current;
    if (!track || !state || event.pointerId !== state.pointer) return;

    track.scrollLeft = state.startScroll - (event.clientX - state.startX);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const state = drag.current;
    if (!track || !state || event.pointerId !== state.pointer) return;

    drag.current = null;
    setDragging(false);
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);

    const travelled = event.clientX - state.startX;
    const threshold = Math.min(DRAG_THRESHOLD, track.clientWidth / 8);
    const target =
      travelled < -threshold
        ? state.startIndex + 1
        : travelled > threshold
          ? state.startIndex - 1
          : state.startIndex;

    goTo(target);
    cancelRestore.current = afterScroll(track, () => {
      track.style.scrollSnapType = "";
      cancelRestore.current = null;
    });
  };

  // Nothing left waiting on a strip that has gone.
  useEffect(() => () => cancelRestore.current?.(), []);

  if (count === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`${label}: ${projectName}`}
      className="border-t-2 border-ink bg-paper-bright"
    >
      <div className="shell py-[clamp(3rem,6vw,5.5rem)]">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <h2 className="t-meta text-copper">{label}</h2>

          {multiple ? (
            <div className="flex items-center gap-5">
              <p aria-live="polite" aria-atomic="true" className="t-meta text-steel">
                <span className="sr-only">Photograph </span>
                <span className="text-ink">{pad2(index + 1)}</span>
                <span aria-hidden="true"> / </span>
                <span className="sr-only"> of </span>
                {pad2(count)}
              </p>
              <div className="flex gap-2">
                <ArrowButton
                  direction="previous"
                  controls={trackId}
                  disabled={index === 0}
                  onClick={() => goTo(index - 1)}
                />
                <ArrowButton
                  direction="next"
                  controls={trackId}
                  disabled={index === count - 1}
                  onClick={() => goTo(index + 1)}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div
          id={trackId}
          ref={trackRef}
          role={multiple ? "region" : undefined}
          tabIndex={multiple ? 0 : undefined}
          aria-label={multiple ? `${label} - use the arrow keys to move between photographs` : undefined}
          onKeyDown={multiple ? onKeyDown : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={`relative mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            multiple ? "[@media(pointer:fine)]:cursor-grab" : ""
          } ${dragging ? "cursor-grabbing!" : ""}`}
        >
          {images.map((image, slideIndex) => {
            const whole = isPortrait(image);

            return (
              <figure
                key={`${image.url ?? image.src}-${slideIndex}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${slideIndex + 1} of ${count}`}
                className="w-full shrink-0 snap-start snap-always"
              >
                <div className="relative aspect-4/3 max-h-[72svh] w-full overflow-hidden bg-paper-deep md:aspect-16/10">
                  {whole && image.lqip ? (
                    // The photograph's own colours, blurred, behind a portrait
                    // shown whole - so the frame reads as the picture's, not as bars.
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 scale-110 bg-cover bg-center opacity-45 blur-2xl"
                      style={{ backgroundImage: `url(${image.lqip})` }}
                    />
                  ) : null}
                  <SiteImage
                    image={image}
                    fit={whole ? "contain" : "cover"}
                    sizes="(min-width: 96rem) 90rem, 94vw"
                    maxWidth={2000}
                  />
                </div>
                {image.caption ? (
                  <figcaption className="mt-3.5 max-w-[60ch] text-[0.875rem] leading-relaxed text-steel">
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>

        {multiple ? (
          <>
            {/* The scale again: a rule, and a tick that walks along it. */}
            <div aria-hidden="true" className="relative mt-6 h-px w-full bg-rule-strong">
              <span
                className="absolute left-0 top-[-1px] h-[3px] bg-copper transition-transform duration-500 ease-[var(--ease-out-expo)]"
                style={{
                  width: `${100 / count}%`,
                  transform: `translateX(${index * 100}%)`,
                }}
              />
            </div>

            {/* Positioned, so a thumbnail's offsetLeft is measured from the strip. */}
            <div
              ref={thumbsRef}
              className="relative mt-5 hidden gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] sm:flex"
            >
              {images.map((image, thumbIndex) => {
                const current = thumbIndex === index;
                return (
                  <button
                    key={`${image.url ?? image.src}-${thumbIndex}`}
                    type="button"
                    aria-label={`Show photograph ${thumbIndex + 1} of ${count}`}
                    aria-controls={trackId}
                    aria-current={current ? "true" : undefined}
                    onClick={() => goTo(thumbIndex)}
                    className={`relative aspect-4/3 w-[5.5rem] shrink-0 overflow-hidden border-2 bg-paper-deep transition-[border-color,opacity] duration-300 ${
                      current
                        ? "border-copper"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <SiteImage image={image} sizes="88px" maxWidth={240} />
                  </button>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

/**
 * `aria-disabled` rather than `disabled` at either end: a disabled button
 * cannot hold focus, so pressing Next onto the last photograph would drop a
 * keyboard user's focus to the top of the document.
 */
function ArrowButton({
  direction,
  controls,
  disabled,
  onClick,
}: {
  direction: "previous" | "next";
  controls: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "next" ? "Next photograph" : "Previous photograph"}
      aria-controls={controls}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className="flex size-11 items-center justify-center border border-rule-strong text-ink transition-colors duration-300 hover:border-copper hover:text-copper aria-disabled:cursor-not-allowed aria-disabled:opacity-35 aria-disabled:hover:border-rule-strong aria-disabled:hover:text-ink"
    >
      <svg
        aria-hidden="true"
        width="16"
        height="8"
        viewBox="0 0 16 8"
        fill="none"
        className={direction === "previous" ? "-scale-x-100" : undefined}
      >
        <path d="M0 4h14.5M11 .8 14.8 4 11 7.2" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    </button>
  );
}
