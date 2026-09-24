import { LinkUnderline } from "@/components/primitives/Button";
import { SectionShell } from "@/components/primitives/SectionShell";
import { SiteImage } from "@/components/primitives/SiteImage";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import type { Cta, WhoWeAre as WhoWeAreContent } from "@/sanity/lib/types";

/**
 * Who we are: the first section of the About page, and the short version of it
 * on the home page.
 *
 * The page's one oversized typographic moment. Everything around it stays
 * quiet — seven equally loud section headings is what made the original design
 * read as a template.
 *
 * The layering is a photograph with a title block overlapping its lower edge,
 * rather than two stacked photographs: there is only one usable image for this
 * section, and a grey placeholder overlapping a real photo looks worse than
 * either on its own.
 *
 * The full version adds the highlights underneath, ruled off like the scope of
 * works on a project page. They are not numbered: numbering encodes sequence,
 * and the process further down the About page is the only sequence here.
 */
export function WhoWeAre({
  content,
  condensed,
}: {
  content: WhoWeAreContent;
  /**
   * The home page's version: the statement, the first paragraph, and a way
   * through to /about. The full body belongs to one page only, or the two
   * compete for the same search with the same words. `link` is omitted when
   * the home page's link label has been cleared.
   */
  condensed?: { link?: Cta };
}) {
  const body = condensed ? content.body.slice(0, 1) : content.body;
  const cta = condensed ? condensed.link : content.cta;
  const highlights = condensed ? [] : content.highlights;

  return (
    <SectionShell id="about" label={content.label} divided={false}>
      <Reveal>
        <h2 className="display-sentence t-plate max-w-[24ch] text-ink">
          {content.heading}
        </h2>
      </Reveal>

      <div className="mt-[clamp(2.5rem,5vw,4.5rem)] grid gap-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.88fr)] lg:items-start">
        {body.length > 0 || cta ? (
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

              {cta ? (
                <div className={body.length > 0 ? "mt-10" : undefined}>
                  <LinkUnderline href={cta.href}>{cta.label}</LinkUnderline>
                </div>
              ) : null}
            </div>
          </Reveal>
        ) : (
          <div aria-hidden="true" />
        )}

        <div className="relative lg:pl-12">
          <ImageReveal className="relative aspect-4/5 w-full">
            <SiteImage
              image={content.image}
              sizes="(min-width: 1024px) 40vw, 100vw"
              maxWidth={1200}
              fallback="plate"
              fallbackSeed={2}
            />
          </ImageReveal>

          {/*
           * The overhang is on the `dl`, not on the Reveal. A Reveal owns the
           * transform of the element it wraps — Motion writes one inline — so a
           * `translate-y` class on the same node is overwritten the moment the
           * scene has any progress at all. One element, one owner of its
           * transform.
           */}
          {content.details.length > 0 ? (
            <Reveal
              order={0.42}
              className="lg:absolute lg:bottom-0 lg:left-0 lg:w-[16.5rem]"
            >
              {/*
               * A drawing title block rather than a counter, so the label
               * leads and the thing it labels sits under it. That is also
               * the order a definition list is specified in, which the
               * counted version inverted to put the figure on top.
               */}
              <dl className="bg-ink p-6 lg:translate-y-8 lg:p-7">
                {content.details.map((detail, index) => (
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

      {highlights.length > 0 ? (
        <Stagger
          className="mt-[clamp(4rem,8vw,6.5rem)] grid gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-9 border-t-2 border-ink pt-8 sm:grid-cols-2 lg:grid-cols-4"
          gap={0.12}
        >
          {highlights.map((highlight) => (
            <StaggerItem key={highlight.title}>
              <span aria-hidden="true" className="block h-px w-3 bg-copper" />
              <h3 className="mt-5 display-narrow t-h4 text-ink">{highlight.title}</h3>
              {highlight.text ? (
                <p className="mt-2.5 max-w-[34ch] t-body text-steel">{highlight.text}</p>
              ) : null}
            </StaggerItem>
          ))}
        </Stagger>
      ) : null}
    </SectionShell>
  );
}
