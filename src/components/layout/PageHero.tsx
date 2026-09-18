import Link from "next/link";
import { BlueprintPlate } from "@/components/primitives/BlueprintPlate";
import { SiteImage } from "@/components/primitives/SiteImage";
import type { SiteImage as SiteImageType } from "@/sanity/lib/types";

export type Crumb = {
  label: string;
  /** Omitted on the last crumb, which is the page you are already on. */
  href?: string;
};

const SIZES = {
  medium: "min-h-[min(58vh,520px)]",
  tall: "min-h-[min(84vh,760px)]",
} as const;

/**
 * The plate every inner page opens on.
 *
 * It is dark for a structural reason, not a decorative one: the header is
 * transparent until you scroll past 60px and sets its own type in paper white.
 * A light plate underneath would leave the navigation invisible for the first
 * screen.
 *
 * With no photograph it falls back to the blueprint ground rather than flat
 * navy — the same measured grid the image slots use, so a page without
 * photography still has a surface rather than a colour.
 *
 * The entrance is the home page's: CSS `animate-rise` on a stagger, played once
 * on load. Scroll-linked reveals are wrong above the fold — they are scrubbed
 * by scroll position, so at the top of a page they sit at whatever progress the
 * viewport happens to imply rather than simply arriving.
 */
export function PageHero({
  crumbs,
  index,
  heading,
  lead,
  image,
  size = "medium",
  seed = 0,
}: {
  crumbs: Crumb[];
  /** The project's number, shown beside the title on a detail page. */
  index?: string;
  heading: string;
  lead?: string;
  image?: SiteImageType | null;
  size?: keyof typeof SIZES;
  /** Shifts the blueprint wash, so two pages do not read as the same tile. */
  seed?: number;
}) {
  const hasImage = Boolean(image && (image.url || image.src));

  return (
    <section
      className={`relative flex items-end overflow-hidden bg-ink text-paper-bright ${SIZES[size]}`}
    >
      {hasImage && image ? (
        <>
          <div className="absolute inset-0">
            <SiteImage image={image} sizes="100vw" maxWidth={2000} priority />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-b from-ink/70 via-ink/55 to-ink/92"
          />
        </>
      ) : (
        <BlueprintPlate seed={seed} />
      )}

      <div className="shell relative pb-[clamp(2.25rem,4vw,3.5rem)] pt-[calc(5rem+clamp(2.5rem,6vw,5rem))]">
        <nav aria-label="Breadcrumb" className="animate-rise" style={{ animationDelay: "0.05s" }}>
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

        <div
          className="mt-[clamp(1.5rem,3vw,2rem)] flex items-baseline gap-[clamp(0.875rem,2vw,1.75rem)] animate-rise"
          style={{ animationDelay: "0.18s" }}
        >
          {index ? (
            <span className="display text-[clamp(0.875rem,1.4vw,1.125rem)] text-copper-bright">
              {index}
            </span>
          ) : null}
          <h1 className="display-sentence t-plate max-w-[18ch] text-paper-bright">
            {heading}
          </h1>
        </div>

        {lead ? (
          <p
            className="mt-6 max-w-[56ch] t-lead animate-rise text-paper-bright/80"
            style={{ animationDelay: "0.34s" }}
          >
            {lead}
          </p>
        ) : null}
      </div>
    </section>
  );
}
