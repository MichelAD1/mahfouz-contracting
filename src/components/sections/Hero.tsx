import Link from "next/link";
import { ButtonLink } from "@/components/primitives/Button";
import { BlueprintPlate } from "@/components/primitives/BlueprintPlate";
import { SiteImage } from "@/components/primitives/SiteImage";
import { Parallax } from "@/components/motion/Parallax";
import { hasImage } from "@/sanity/lib/image";
import type {
  Hero as HeroContent,
  Service,
  SiteSettings,
} from "@/sanity/lib/types";

/**
 * The hero is a server component: its entrance is CSS, so nothing above the
 * fold waits on JavaScript. Only the background parallax is a client island.
 */
export function Hero({
  hero,
  settings,
  services,
}: {
  hero: HeroContent;
  settings: SiteSettings;
  services: Service[];
}) {
  const showPhoto = hasImage(hero.background);

  /**
   * 88svh, not 94. Now that the strip is compact the content is shorter than
   * this, so `min-h` is what actually sets the height — and at 94svh the
   * sheet's footer line sat in the last 6% of the viewport, clipping on any
   * browser whose chrome is a little taller than the one it was measured on.
   */
  return (
    <section id="top" className="relative isolate flex min-h-[min(88svh,50rem)] flex-col justify-end overflow-hidden bg-ink">
      {/* Background layer */}
      <Parallax className="absolute inset-0 -z-10" distance={78}>
        {showPhoto ? (
          <>
            <SiteImage
              image={hero.background}
              sizes="100vw"
              priority
              maxWidth={2400}
              fallback="plate"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,22,40,0.55) 0%, rgba(10,22,40,0.35) 40%, rgba(10,22,40,0.9) 100%)",
              }}
            />
          </>
        ) : (
          <BlueprintPlate />
        )}
      </Parallax>

      {/*
       * Tightened so the whole hero — headline, lead, action and the metrics
       * below — lands inside a 1080p screen. The top padding was 13rem sitting
       * under an 80px header, and because it is clamped the gap stayed put as
       * the viewport grew, which is why the page looked better at 80% zoom.
       *
       * This is the home page only. The section rhythm elsewhere is untouched:
       * the air around the type is doing real work on the inner pages, and
       * "fits on one screen" only matters on the screen everybody sees.
       */}
      <div className="shell pb-[clamp(2rem,3vw,3rem)] pt-[clamp(6.5rem,10vw,8.5rem)]">
        <h1 className="display t-hero max-w-[18ch] text-paper-bright">
          {hero.headingLines.map((line, index) => (
            <span
              key={line}
              className="block animate-rise"
              style={{ animationDelay: `${0.12 + index * 0.19}s` }}
            >
              {line}
            </span>
          ))}
        </h1>

        {/*
         * The lead sits left, the call to action hard right. `justify-between`
         * pushes the two grid columns to opposite edges of the shell, which is
         * what gives the band its width — packed together at the left they read
         * as one paragraph with a button stuck to it.
         */}
        <div className="mt-[clamp(1.75rem,3vw,2.5rem)] flex flex-col gap-7 lg:grid lg:grid-cols-[minmax(0,34rem)_auto] lg:items-end lg:justify-between lg:gap-x-14">
          <p
            className="max-w-[54ch] t-lead animate-rise text-paper-bright/75"
            style={{ animationDelay: `${0.12 + hero.headingLines.length * 0.19}s` }}
          >
            {hero.lead}
          </p>

          <div
            className="flex flex-col gap-3 animate-rise sm:flex-row sm:flex-wrap"
            style={{
              animationDelay: `${0.3 + hero.headingLines.length * 0.19}s`,
            }}
          >
            {/*
             * One call to action only. The quote request is already the
             * closing banner's single job, and the header carries it too.
             */}
            <ButtonLink
              href={hero.secondaryCta.href}
              tone="onInk"
              variant="outline"
              withArrow
              className="justify-center sm:justify-start"
            >
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </div>

      <DivisionStrip services={services} settings={settings} />
    </section>
  );
}

/**
 * The five divisions, named rather than counted.
 *
 * This replaced a four-figure metrics band — 5 divisions, 2 countries, 6
 * standards, 1 point of responsibility. Big numbers under a hero is the most
 * worn pattern on the web, and only one of those four earned its numeral:
 * "2 countries" undersells, "6 standards" buries the list that was the actual
 * asset, and "1 point of responsibility" was a slogan wearing a number.
 *
 * Naming the divisions does more work than counting them. It is the company's
 * real differentiator, it is scannable in a second, and every entry is a way
 * into the page that explains it — so the band under the fold has a job rather
 * than a statistic.
 */
function DivisionStrip({
  services,
  settings,
}: {
  services: Service[];
  settings: SiteSettings;
}) {
  if (services.length === 0) return null;

  return (
    <div
      className="animate-rise border-t border-rule-dark bg-ink/90"
      style={{ animationDelay: "1.05s" }}
    >
      <div className="shell">
        <p className="pt-4 t-meta text-steel-light lg:pt-5">
          Five divisions, one point of responsibility
        </p>

        {/*
         * Rules are placed by nth-child rather than by index, because the
         * column count changes at the breakpoint and only CSS knows it.
         */}
        <ul
          className="grid grid-cols-2 pb-4 lg:grid-cols-5 lg:pb-5
            [&>li]:py-3.5 [&>li]:pr-5
            [&>li:nth-child(n+3)]:border-t [&>li:nth-child(n+3)]:border-rule-dark
            lg:[&>li:nth-child(n+3)]:border-t-0
            [&>li:nth-child(even)]:border-l [&>li:nth-child(even)]:border-rule-dark [&>li:nth-child(even)]:pl-5
            lg:[&>li:not(:first-child)]:border-l lg:[&>li:not(:first-child)]:border-rule-dark lg:[&>li:not(:first-child)]:pl-5"
        >
          {services.map((service) => (
            <li key={service._id}>
              <Link
                href={`/services#${service.slug}`}
                className="group flex items-baseline gap-2.5"
              >
                <span className="t-meta shrink-0 text-copper-bright">
                  {service.code}
                </span>
                {/*
                 * The short name, so every division sits on one line. At full
                 * length "Engineering & Design Consultancy" wraps and the row
                 * grows by a line it does not need — which is what was pushing
                 * the footer off a 1080p screen.
                 */}
                <span className="display-narrow text-[clamp(0.9375rem,1.1vw,1.0625rem)] text-paper-bright transition-colors duration-300 group-hover:text-copper-bright">
                  {service.shortTitle ?? service.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Title block: the sheet's own footer line. */}
      <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-1.5 border-t border-rule-dark py-3">
        <span className="t-meta text-steel-light">
          {settings.standards && settings.standards.length > 0
            ? `Worked to ${settings.standards.join(" · ")}`
            : settings.footerNote}
        </span>
        <span className="t-meta text-steel-light">
          {settings.address.lines.slice(-2).join(", ")}
        </span>
      </div>
    </div>
  );
}
