import { LinkUnderline } from "@/components/primitives/Button";
import { SectionShell } from "@/components/primitives/SectionShell";
import { SiteImage } from "@/components/primitives/SiteImage";
import { Counter } from "@/components/motion/Counter";
import { ImageReveal, Reveal } from "@/components/motion/Reveal";
import type { About as AboutContent } from "@/sanity/lib/types";

/**
 * The page's one oversized typographic moment. Everything around it stays
 * quiet — seven equally loud section headings is what made the original design
 * read as a template.
 *
 * The layering is a photograph with a title block overlapping its lower edge,
 * rather than two stacked photographs: there is only one usable image for this
 * section, and a grey placeholder overlapping a real photo looks worse than
 * either on its own.
 */
export function About({ about }: { about: AboutContent }) {
  const [image] = about.images;

  return (
    <SectionShell id="about" code="S.01" label={about.sheet} divided={false}>
      <Reveal>
        <h2 className="display-sentence t-plate max-w-[24ch] text-ink">
          {about.statement}
        </h2>
      </Reveal>

      <div className="mt-[clamp(2.5rem,5vw,4.5rem)] grid gap-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.88fr)] lg:items-start">
        <Reveal delay={0.08}>
          <div className="max-w-[62ch]">
            {about.body.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 32)}
                className={`t-lead ${index > 0 ? "mt-5 text-steel" : "text-ink/85"}`}
              >
                {paragraph}
              </p>
            ))}

            <div className="mt-10">
              <LinkUnderline href={about.cta.href}>{about.cta.label}</LinkUnderline>
            </div>
          </div>
        </Reveal>

        <div className="relative lg:pl-12">
          <ImageReveal className="relative aspect-4/5 w-full">
            <SiteImage
              image={image}
              sizes="(min-width: 1024px) 40vw, 100vw"
              maxWidth={1200}
              duotone
              fallback="plate"
              fallbackSeed={2}
            />
          </ImageReveal>

          {about.metrics.length > 0 ? (
            <Reveal
              delay={0.24}
              className="lg:absolute lg:bottom-0 lg:left-0 lg:w-[16.5rem] lg:translate-y-8"
            >
              <dl className="bg-ink p-6 lg:p-7">
                {about.metrics.map((metric, index) => (
                  <div
                    key={metric.label}
                    className={
                      index > 0 ? "mt-4 border-t border-rule-dark pt-4" : undefined
                    }
                  >
                    <dd className="t-figure text-[clamp(2rem,3vw,2.5rem)] text-paper-bright">
                      {typeof metric.countTo === "number" ? (
                        <Counter to={metric.countTo} display={metric.figure} />
                      ) : (
                        metric.figure
                      )}
                    </dd>
                    <dt className="mt-1.5 t-meta text-steel-light">{metric.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}
        </div>
      </div>
    </SectionShell>
  );
}
