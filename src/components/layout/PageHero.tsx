import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export type Crumb = {
  label: string;
  /** Omitted on the last crumb, which is the page you are already on. */
  href?: string;
};

/**
 * The plate every inner page opens on.
 *
 * It is dark for a structural reason, not a decorative one: the header is
 * transparent until you scroll past 60px and sets its own type in paper. A
 * light plate underneath it would leave the navigation invisible for the first
 * screen. Every route that is not the home page gets one of these.
 */
export function PageHero({
  crumbs,
  code,
  heading,
  lead,
}: {
  crumbs: Crumb[];
  /** Sheet number, e.g. S.10. Real metadata, matching the section shells. */
  code?: string;
  heading: string;
  lead?: string;
}) {
  return (
    <section className="bg-ink text-paper-bright">
      <div className="shell pb-[clamp(3rem,6vw,5rem)] pt-[calc(5rem+clamp(2.5rem,6vw,5rem))]">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-2.5">
                {index > 0 ? (
                  <span aria-hidden="true" className="t-meta text-steel">
                    /
                  </span>
                ) : null}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="t-meta text-steel-light transition-colors duration-300 hover:text-copper-bright"
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

        <div className="mt-[clamp(2rem,4vw,3.5rem)] grid gap-[clamp(1.5rem,4vw,4rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end">
          <Reveal>
            <h1 className="display-sentence t-plate max-w-[18ch] text-paper-bright">
              {heading}
            </h1>
          </Reveal>

          {lead ? (
            <Reveal order={0.14}>
              <p className="max-w-[54ch] t-lead text-paper-bright/80">{lead}</p>
            </Reveal>
          ) : null}
        </div>

        {code ? (
          <div className="mt-[clamp(2rem,4vw,3.5rem)] flex items-center gap-4 border-t border-rule-dark pt-5">
            <span className="t-meta text-steel">{code}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
