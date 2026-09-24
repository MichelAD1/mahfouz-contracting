import Link from "next/link";
import { BlueprintPlate } from "@/components/primitives/BlueprintPlate";
import { ButtonRow } from "@/components/primitives/ButtonRow";
import { SiteImage } from "@/components/primitives/SiteImage";
import { Parallax } from "@/components/motion/Parallax";
import { headingLines } from "@/lib/text";
import { hasImage } from "@/sanity/lib/image";
import type { PageHero, Service, SiteSettings } from "@/sanity/lib/types";

/**
 * The hero is a server component: its entrance is CSS, so nothing above the
 * fold waits on JavaScript. Only the background parallax is a client island.
 */
export function Hero({
  hero,
  settings,
  services,
  stripLabel,
  standardsLabel,
}: {
  hero: PageHero;
  settings: SiteSettings;
  services: Service[];
  /** The line above the division strip. */
  stripLabel: string;
  /** The words before the standards, e.g. Worked to. */
  standardsLabel?: string;
}) {
  const showPhoto = hasImage(hero.image);
  // Each line of the heading is set, and animated in, on its own.
  const lines = headingLines(hero.heading);

  /**
   * A full viewport, with no cap.
   *
   * `svh` rather than `vh` so a mobile browser's expanded address bar cannot
   * push the sheet's footer line under the fold — `vh` measures the viewport as
   * if that bar were hidden, which it is not on first load.
   *
   * The section is `justify-end`, so the content sits on the bottom edge and
   * the extra height opens above the headline. That is why there is no cap: any
   * ceiling shows a band of the next section on a tall screen, and the point
   * here is that the hero holds the whole first screen.
   */
  return (
    <section id="top" className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-ink">
      {/* Background layer */}
      <Parallax className="absolute inset-0 -z-10" distance={78}>
        {showPhoto ? (
          <>
            <SiteImage
              image={hero.image}
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
          {lines.map((line, index) => (
            <span
              key={`${index}-${line}`}
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
        {hero.lead || hero.buttons.length > 0 ? (
          <div className="mt-[clamp(1.75rem,3vw,2.5rem)] flex flex-col gap-7 lg:grid lg:grid-cols-[minmax(0,34rem)_auto] lg:items-end lg:justify-between lg:gap-x-14">
            {hero.lead ? (
              <p
                className="max-w-[54ch] t-lead animate-rise text-paper-bright/75"
                style={{ animationDelay: `${0.12 + lines.length * 0.19}s` }}
              >
                {hero.lead}
              </p>
            ) : (
              <span aria-hidden="true" />
            )}

            {/*
             * The buttons come from the Home page document. It ships with one,
             * outlined: the quote request is already the header's button and
             * the closing banner's single job, so the hero points at the work.
             */}
            <ButtonRow
              buttons={hero.buttons}
              className="animate-rise"
              style={{ animationDelay: `${0.3 + lines.length * 0.19}s` }}
            />
          </div>
        ) : null}
      </div>

      <DivisionStrip
        services={services}
        settings={settings}
        label={stripLabel}
        standardsLabel={standardsLabel}
      />
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
  label,
  standardsLabel,
}: {
  services: Service[];
  settings: SiteSettings;
  label: string;
  standardsLabel?: string;
}) {
  if (services.length === 0) return null;

  const credentials =
    settings.standards.length > 0
      ? [standardsLabel, settings.standards.join(" · ")].filter(Boolean).join(" ")
      : settings.footerNote;

  return (
    <div
      className="animate-rise border-t border-rule-dark bg-ink/90"
      style={{ animationDelay: "1.05s" }}
    >
      <div className="shell">
        <p className="pt-4 t-meta text-steel-light lg:pt-5">{label}</p>

        {/*
         * Rules are placed by nth-child rather than by index, because the
         * column count changes at the breakpoint and only CSS knows it.
         */}
        <ul
          className="grid grid-cols-2 pb-4 lg:grid-cols-5 lg:pb-5
            [&>li]:pr-5
            [&>li:nth-child(n+3)]:border-t [&>li:nth-child(n+3)]:border-rule-dark
            lg:[&>li:nth-child(n+3)]:border-t-0
            [&>li:nth-child(even)]:border-l [&>li:nth-child(even)]:border-rule-dark [&>li:nth-child(even)]:pl-5
            lg:[&>li:not(:first-child)]:border-l lg:[&>li:not(:first-child)]:border-rule-dark lg:[&>li:not(:first-child)]:pl-5"
        >
          {services.map((service) => (
            <li key={service._id}>
              {/*
               * The vertical padding belongs to the link, not to the `li`.
               * On the `li` it made a 44px row containing a 16px tap target,
               * which on a phone is a row that looks pressable everywhere and
               * only is in the middle. Same rendered height either way.
               */}
              <Link
                href={`/services#${service.slug}`}
                className="group flex items-baseline gap-2.5 py-3.5"
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
        <span className="t-meta text-steel-light">{credentials}</span>
        <span className="t-meta text-steel-light">
          {settings.address.lines.slice(-2).join(", ")}
        </span>
      </div>
    </div>
  );
}
