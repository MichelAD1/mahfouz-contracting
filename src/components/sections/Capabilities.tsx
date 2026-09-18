"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SiteImage } from "@/components/primitives/SiteImage";
import { EASE } from "@/components/motion/ease";
import type { Service } from "@/sanity/lib/types";

/**
 * The strongest idea in the original design — a sticky image panel driven by
 * the division list — rebuilt as a real accordion.
 *
 * The original hid the panel entirely below 900px, so mobile lost the imagery.
 * Here the panel is a desktop enhancement of an accordion that stands on its
 * own: one division open at a time, its detail in the row, its photograph in
 * the panel beside it.
 */
/**
 * The sticky panel sizes itself against the viewport, not against its own
 * column width. A fixed `aspect-3/4` made it 566px tall; anchored at `top-28`
 * in a 900px viewport that left a 222px dead band under it, and at the end of
 * the sticky range it dragged up under the header while the list beside it was
 * still fully in view.
 */
const PANEL_HEIGHT = "min(30rem, calc(100svh - 12rem))";
const HEADER_HEIGHT = "5rem";

export function Capabilities({ services }: { services: Service[] }) {
  const [openIndex, setOpenIndex] = useState(0);
  const baseId = useId();

  // Collapsing every row is allowed, so the panel falls back to the first
  // division rather than going blank.
  const panelIndex = openIndex >= 0 ? openIndex : 0;

  if (services.length === 0) return null;

  return (
    <div className="grid gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
      <div>
        <h2 className="display-sentence t-h2 max-w-[19ch] text-ink">
          Five divisions, one scope of responsibility
        </h2>
        <p className="mt-6 max-w-[46ch] t-body text-steel">
          Each division works in-house and to a single project program, so the
          scopes meet where they are supposed to.
        </p>

        <ul className="mt-[clamp(2rem,3.5vw,3rem)] border-t border-ink">
          {services.map((service, index) => {
            const isOpen = index === openIndex;
            const panelId = `${baseId}-detail-${index}`;
            const headingId = `${baseId}-heading-${index}`;

            return (
              <li key={service._id} className="border-b border-rule">
                <h3 id={headingId} className="sr-only">
                  {service.title}
                </h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_1.5rem] items-baseline gap-x-[clamp(0.75rem,2vw,2rem)] py-[clamp(1.25rem,2.2vw,1.9rem)] text-left"
                >
                  <span
                    className={`t-meta transition-colors duration-300 ${
                      isOpen ? "text-copper" : "text-steel"
                    }`}
                  >
                    {service.code}
                  </span>

                  <span>
                    <span
                      className={`block display-narrow t-h3 transition-colors duration-300 ${
                        isOpen ? "text-ink" : "text-ink/80 group-hover:text-copper"
                      }`}
                    >
                      {service.title}
                    </span>
                    <span className="mt-2 block max-w-[52ch] t-body text-steel">
                      {service.shortDescription}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className={`justify-self-end transition-transform duration-[0.4s] ease-[var(--ease-out-expo)] ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M7 0v14M0 7h14"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        className={isOpen ? "text-copper" : "text-steel"}
                      />
                    </svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={headingId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.62, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="pb-7 pl-0 sm:pl-[calc(2.5rem+clamp(0.75rem,2vw,2rem))]">
                        {/* The panel is desktop-only, so mobile gets the image here. */}
                        <div className="relative mb-6 aspect-3/2 w-full lg:hidden">
                          <SiteImage
                            image={service.image}
                            sizes="100vw"
                            maxWidth={900}
                            duotone
                          />
                        </div>

                        <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                          {service.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex gap-3 text-[0.875rem] leading-relaxed text-ink/75"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2.5 block h-px w-3 shrink-0 bg-copper"
                              />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>

      {/*
       * Decorative on desktop: every division's name and detail is already in
       * the list, so this carries no information of its own.
       */}
      <div
        aria-hidden="true"
        className="sticky hidden w-full overflow-hidden bg-paper-deep lg:block"
        style={{
          height: PANEL_HEIGHT,
          // Centred in whatever the header leaves, at any viewport height.
          top: `calc(${HEADER_HEIGHT} + (100svh - ${HEADER_HEIGHT} - ${PANEL_HEIGHT}) / 2)`,
        }}
      >
        {services.map((service, index) => (
          <motion.div
            key={service._id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: index === panelIndex ? 1 : 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <SiteImage
              image={service.image}
              sizes="(min-width: 1024px) 34vw, 0px"
              maxWidth={1000}
              duotone
            />
          </motion.div>
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/85 to-transparent p-5 pt-16">
          <span className="display-narrow text-[0.9375rem] font-medium text-paper-bright">
            {services[panelIndex].title}
          </span>
          <span className="t-meta text-paper-bright/70">
            {services[panelIndex].code}
          </span>
        </div>
      </div>
    </div>
  );
}
