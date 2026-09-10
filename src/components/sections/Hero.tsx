import { ButtonLink } from "@/components/primitives/Button";
import { BlueprintPlate } from "@/components/primitives/BlueprintPlate";
import { SiteImage } from "@/components/primitives/SiteImage";
import { Parallax } from "@/components/motion/Parallax";
import { Counter } from "@/components/motion/Counter";
import { hasImage } from "@/sanity/lib/image";
import type { Hero as HeroContent, SiteSettings } from "@/sanity/lib/types";

/**
 * The hero is a server component: its entrance is CSS, so nothing above the
 * fold waits on JavaScript. Only the background parallax and the counters are
 * client islands.
 */
export function Hero({
  hero,
  settings,
}: {
  hero: HeroContent;
  settings: SiteSettings;
}) {
  const showPhoto = hasImage(hero.background);

  return (
    <section id="top" className="relative isolate flex min-h-[min(94svh,54rem)] flex-col justify-end overflow-hidden bg-ink">
      {/* Background layer */}
      <Parallax className="absolute inset-0 -z-10" distance={60}>
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

      <div className="shell pb-[clamp(2.5rem,4vw,4rem)] pt-[clamp(9rem,16vw,13rem)]">
        <h1 className="display t-hero max-w-[18ch] text-paper-bright">
          {hero.headingLines.map((line, index) => (
            <span
              key={line}
              className="block animate-rise"
              style={{ animationDelay: `${0.08 + index * 0.11}s` }}
            >
              {line}
            </span>
          ))}
        </h1>

        <div className="mt-[clamp(2rem,4vw,3.25rem)] flex flex-col gap-9 lg:grid lg:grid-cols-[minmax(0,34rem)_auto] lg:items-end lg:justify-start lg:gap-x-14">
          <p
            className="max-w-[54ch] t-lead animate-rise text-paper-bright/75"
            style={{ animationDelay: `${0.08 + hero.headingLines.length * 0.11}s` }}
          >
            {hero.lead}
          </p>

          <div
            className="flex flex-col gap-3 animate-rise sm:flex-row sm:flex-wrap"
            style={{
              animationDelay: `${0.16 + hero.headingLines.length * 0.11}s`,
            }}
          >
            <ButtonLink
              href={hero.primaryCta.href}
              tone="onInk"
              variant="solid"
              className="justify-center sm:justify-start"
            >
              {hero.primaryCta.label}
            </ButtonLink>
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

      <DataStrip metrics={hero.metrics} settings={settings} />
    </section>
  );
}

/**
 * Replaces the four vague noun-phrases that occupied this space in the original
 * design. Every figure here is checkable against the company's own material —
 * big type has to be earned by the content under it.
 */
function DataStrip({
  metrics,
  settings,
}: {
  metrics: HeroContent["metrics"];
  settings: SiteSettings;
}) {
  if (metrics.length === 0) return null;

  return (
    <div
      className="animate-rise border-t border-rule-dark"
      style={{ animationDelay: "0.62s" }}
    >
      <div className="shell">
        {/*
         * Rules are placed by nth-child rather than by index, because the
         * column count changes at the breakpoint and only CSS knows it:
         * two columns with a row rule on mobile, four columns with column
         * rules from lg up.
         */}
        <dl
          className="grid grid-cols-2 lg:grid-cols-4
            [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&>div]:py-7 [&>div]:pr-6 lg:[&>div]:py-9
            [&>div:nth-child(n+3)]:border-t [&>div:nth-child(n+3)]:border-rule-dark
            lg:[&>div:nth-child(n+3)]:border-t-0
            [&>div:nth-child(even)]:border-l [&>div:nth-child(even)]:border-rule-dark [&>div:nth-child(even)]:pl-6
            lg:[&>div:not(:first-child)]:border-l lg:[&>div:not(:first-child)]:border-rule-dark lg:[&>div:not(:first-child)]:pl-6"
        >
          {metrics.map((metric) => (
            <div key={metric.label}>
              <dd className="t-figure text-[clamp(2.25rem,4vw,3.5rem)] text-paper-bright">
                {metric.prefix}
                {typeof metric.countTo === "number" ? (
                  <Counter to={metric.countTo} display={metric.figure} />
                ) : (
                  metric.figure
                )}
                {metric.suffix}
              </dd>
              <dt className="display-narrow text-[0.9375rem] font-medium text-paper-bright/85">
                {metric.label}
              </dt>
              {metric.note ? (
                <p className="max-w-[28ch] text-[0.8125rem] leading-relaxed text-steel-light">
                  {metric.note}
                </p>
              ) : null}
            </div>
          ))}
        </dl>
      </div>

      {/* Title block: the sheet's own footer line. */}
      <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-rule-dark py-4">
        <span className="t-meta text-steel-light">{settings.footerNote}</span>
        <span className="t-meta text-steel-light">
          {settings.address.lines.slice(-2).join(", ")}
        </span>
      </div>
    </div>
  );
}
