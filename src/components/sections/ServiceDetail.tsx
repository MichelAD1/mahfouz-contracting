import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SiteImage } from "@/components/primitives/SiteImage";
import type { Service } from "@/sanity/lib/types";

/**
 * Parallax travel per division.
 *
 * The wipe this replaced ran its whole length in roughly a quarter of a
 * viewport of scroll, because a `Reveal` range is deliberately short — right
 * for a paragraph settling into place, far too abrupt for a photograph at this
 * size. Parallax is scrubbed across the image's entire pass through the
 * viewport instead, so it reads as depth for as long as it is on screen rather
 * than as something that happens once and stops.
 *
 * The distances differ so five stacked blocks do not travel as one sheet. All
 * came down about 28% from 50-86: the ceiling that matters turned out to be
 * well under the ~100px the module warns about, because a 4:5 photograph at
 * this size makes every pixel of travel legible.
 */
const DEPTH = [42, 54, 36, 62, 48] as const;

/**
 * One division, in full.
 *
 * The home page's accordion shows a division's name, one sentence and four
 * features. This shows everything: the full write-up, every feature, and the
 * photograph at a size worth looking at. That difference is the reason both
 * pages can exist without competing — same subject, genuinely different depth.
 *
 * Blocks alternate side so a run of five does not read as a spreadsheet.
 */
export function ServiceDetail({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const body =
    service.fullDescription && service.fullDescription.length > 0
      ? service.fullDescription
      : [service.shortDescription];

  const imageFirst = index % 2 === 1;

  return (
    <article
      id={service.slug}
      className="scroll-mt-28 border-t border-rule-strong py-[clamp(2.5rem,6vw,5rem)]"
    >
      <div className="grid gap-[clamp(2rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
        <div className={imageFirst ? "lg:order-2" : undefined}>
          <Reveal>
            <div className="flex items-baseline gap-4">
              <span className="t-meta text-copper">{service.code}</span>
              <span aria-hidden="true" className="h-px w-8 bg-rule-strong" />
            </div>

            <h2 className="mt-4 display-sentence t-h2 max-w-[18ch] text-ink">
              {service.title}
            </h2>
          </Reveal>

          <Reveal order={0.12}>
            <div className="mt-6 max-w-[58ch]">
              {body.map((paragraph, paragraphIndex) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className={`t-lead ${
                    paragraphIndex > 0 ? "mt-5 text-steel" : "text-ink/85"
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {service.features.length > 0 ? (
              <ul className="mt-9 grid gap-x-10 gap-y-2.5 border-t border-rule pt-7 sm:grid-cols-2">
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
            ) : null}
          </Reveal>
        </div>

        <div className={imageFirst ? "lg:order-1" : undefined}>
          <Parallax
            className="relative aspect-4/5 w-full bg-paper-deep"
            distance={DEPTH[index % DEPTH.length]}
          >
            <SiteImage
              image={service.image}
              sizes="(min-width: 1024px) 42vw, 100vw"
              maxWidth={1100}
              fallback="plate"
              fallbackSeed={index + 1}
            />
          </Parallax>
        </div>
      </div>
    </article>
  );
}
