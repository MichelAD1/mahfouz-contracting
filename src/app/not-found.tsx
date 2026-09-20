import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { Arrow } from "@/components/primitives/Button";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { pad2 } from "@/lib/format";
import { getClosingCta, getSectionCopy, getSiteFrame } from "@/sanity/lib/fetch";

export const revalidate = 300;

/**
 * The 404.
 *
 * A root `not-found` catches every unmatched URL in the app, not only a
 * `notFound()` thrown from a segment, so this is the page a stale link from the
 * old WordPress site lands on when it is not one of the 26 that redirect. It
 * renders inside the root layout, so the header, the footer and the skip link
 * come with it. No metadata is exported because `not-found` does not take any
 * — Next injects `noindex` on a 404 itself, which is the only tag that matters
 * here. Checked against node_modules/next/dist/docs rather than remembered.
 *
 * The status code goes in the hero's index slot, the same place a project
 * detail page puts its number: on a sheet a code sits beside the title, and 404
 * is a code rather than a count. The way out is the navigation itself, read
 * from `settings.nav`, so a route added to the site appears here by existing
 * rather than by being remembered.
 */
export default async function NotFound() {
  const [{ settings }, closingCta, copy] = await Promise.all([
    getSiteFrame(),
    getClosingCta(),
    getSectionCopy(),
  ]);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Not found" }]}
        index="404"
        seed={5}
        heading={copy.notFound.heading}
        lead={copy.notFound.lead}
      />

      <SectionShell label={copy.notFound.label} divided={false}>
        <ul className="border-t border-ink">
          {settings.nav.map((item, index) => (
            <li key={item.href} className="border-b border-rule">
              <Link
                href={item.href}
                className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-[clamp(0.75rem,2vw,2rem)] py-[clamp(1.1rem,2.2vw,1.75rem)]"
              >
                <span className="t-meta text-steel">{pad2(index + 1)}</span>
                <span className="display-narrow t-h3 text-ink transition-colors duration-300 group-hover:text-copper">
                  {item.label}
                </span>
                <span className="self-center text-steel transition-colors duration-300 group-hover:text-copper">
                  <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </SectionShell>

      <ClosingCta content={closingCta} />
    </>
  );
}
