import Link from "next/link";
import { SiteImage } from "@/components/primitives/SiteImage";
import { Reveal } from "@/components/motion/Reveal";
import type { SiteImage as SiteImageType } from "@/sanity/lib/types";

export type Crumb = {
  label: string;
  /** Omitted on the last crumb, which is the page you are already on. */
  href?: string;
};

/**
 * Heights, from the design canvas. `flat` is for pages with no lead
 * photograph — it collapses to a plain plate rather than reserving 60% of the
 * viewport for an empty grey box.
 */
const SIZES = {
  flat: "",
  medium: "min-h-[min(62vh,560px)]",
  tall: "min-h-[min(84vh,760px)]",
} as const;

/**
 * The plate every inner page opens on.
 *
 * It is dark for a structural reason, not a decorative one: the header is
 * transparent until you scroll past 60px and sets its own type in paper white.
 * A light plate underneath would leave the navigation invisible for the first
 * screen. Every route that is not the home page gets one of these.
 *
 * The gradient is heaviest at the bottom because that is where the type sits;
 * a flat scrim would either wash out the photograph or lose the headline.
 */
export function PageHero({
  crumbs,
  index,
  heading,
  lead,
  image,
  size = "flat",
}: {
  crumbs: Crumb[];
  /** The project's number, shown beside the title on a detail page. */
  index?: string;
  heading: string;
  lead?: string;
  image?: SiteImageType | null;
  size?: keyof typeof SIZES;
}) {
  return (
    <section className={`relative flex items-end bg-ink text-paper-bright ${SIZES[size]}`}>
      {image ? (
        <>
          <div className="absolute inset-0 opacity-55">
            <SiteImage
              image={image}
              sizes="100vw"
              maxWidth={2000}
              priority
              duotone
              fallback="plate"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-b from-ink/55 via-ink/35 to-ink/90"
          />
        </>
      ) : null}

      <div className="shell relative pb-[clamp(2.25rem,4vw,3.5rem)] pt-[calc(5rem+clamp(2.5rem,6vw,5rem))]">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {crumbs.map((crumb, crumbIndex) => (
              <li key={crumb.label} className="flex items-center gap-3">
                {crumbIndex > 0 ? (
                  <span aria-hidden="true" className="t-meta text-steel">
                    /
                  </span>
                ) : null}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="t-meta text-paper-bright/70 transition-colors duration-300 hover:text-copper-bright"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="t-meta text-paper-bright">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <Reveal className="mt-[clamp(1.5rem,3vw,2rem)]">
          <div className="flex items-baseline gap-[clamp(0.875rem,2vw,1.75rem)]">
            {index ? (
              <span className="display text-[clamp(0.875rem,1.4vw,1.125rem)] text-copper-bright">
                {index}
              </span>
            ) : null}
            <h1 className="display-sentence t-plate max-w-[18ch] text-paper-bright">
              {heading}
            </h1>
          </div>
        </Reveal>

        {lead ? (
          <Reveal order={0.14}>
            <p className="mt-6 max-w-[56ch] t-lead text-paper-bright/80">{lead}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
