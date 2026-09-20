import { PageHero } from "@/components/layout/PageHero";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { getClosingCta, getSectionCopy } from "@/sanity/lib/fetch";

export const revalidate = 300;

/**
 * The 404.
 *
 * A root `not-found` catches every unmatched URL in the app, not only a
 * `notFound()` thrown from a segment, so this is the page a stale link from the
 * old WordPress site lands on when it is not one of the 26 that redirect. It
 * renders inside the root layout, so the header, the footer and the skip link
 * come with it — which is also why it carries no index of its own: every route
 * is already one click away in the navigation above it and the footer below,
 * and a third copy of the same five links is furniture, not help.
 *
 * No metadata is exported because `not-found` does not take any — Next injects
 * `noindex` on a 404 itself, which is the only tag that matters here. Checked
 * against node_modules/next/dist/docs rather than remembered.
 *
 * The status code goes in the hero's index slot, the same place a project
 * detail page puts its number: on a sheet a code sits beside the title, and 404
 * is a code rather than a count.
 */
export default async function NotFound() {
  const [closingCta, copy] = await Promise.all([
    getClosingCta(),
    getSectionCopy(),
  ]);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Not found" }]}
        index="404"
        seed={5}
        size="tall"
        heading={copy.notFound.heading}
        lead={copy.notFound.lead}
      />

      <ClosingCta content={closingCta} />
    </>
  );
}
