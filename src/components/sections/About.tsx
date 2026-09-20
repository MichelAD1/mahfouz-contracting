import { LinkUnderline } from "@/components/primitives/Button";
import { SectionShell } from "@/components/primitives/SectionShell";
import { SiteImage } from "@/components/primitives/SiteImage";
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
export function About({
  about,
  condensed = false,
}: {
  about: AboutContent;
  /**
   * The home page's version: the statement, one paragraph, and a way through
   * to /about. The full body belongs to one page only, or the two compete for
   * the same search with the same words.
   */
  condensed?: boolean;
}) {
  const [image] = about.images;
  const body = condensed ? about.body.slice(0, 1) : about.body;
  const cta = condensed ? { label: "More about us", href: "/about" } : about.cta;

  return (
    <SectionShell id="about" label={about.sheet} divided={false}>
      <Reveal>
        <h2 className="display-sentence t-plate max-w-[24ch] text-ink">
          {about.statement}
        </h2>
      </Reveal>

      <div className="mt-[clamp(2.5rem,5vw,4.5rem)] grid gap-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.88fr)] lg:items-start">
        <Reveal order={0.14}>
          <div className="max-w-[62ch]">
            {body.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 32)}
                className={`t-lead ${index > 0 ? "mt-5 text-steel" : "text-ink/85"}`}
              >
                {paragraph}
              </p>
            ))}

            <div className="mt-10">
              <LinkUnderline href={cta.href}>{cta.label}</LinkUnderline>
            </div>
          </div>
        </Reveal>

        <div className="relative lg:pl-12">
          <ImageReveal className="relative aspect-4/5 w-full">
            <SiteImage
              image={image}
              sizes="(min-width: 1024px) 40vw, 100vw"
              maxWidth={1200}
              fallback="plate"
              fallbackSeed={2}
            />
          </ImageReveal>

          {about.details.length > 0 ? (
            <Reveal
              order={0.42}
              className="lg:absolute lg:bottom-0 lg:left-0 lg:w-[16.5rem] lg:translate-y-8"
            >
              {/*
               * A drawing title block rather than a counter, so the label
               * leads and the thing it labels sits under it. That is also
               * the order a definition list is specified in, which the
               * counted version inverted to put the figure on top.
               */}
              <dl className="bg-ink p-6 lg:p-7">
                {about.details.map((detail, index) => (
                  <div
                    key={detail.label}
                    className={
                      index > 0 ? "mt-4 border-t border-rule-dark pt-4" : undefined
                    }
                  >
                    <dt className="t-meta text-steel-light">{detail.label}</dt>
                    <dd className="mt-2 text-[0.9375rem] leading-relaxed text-paper-bright">
                      {detail.value}
                    </dd>
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
