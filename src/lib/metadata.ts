import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import type { Seo } from "@/sanity/lib/types";

/**
 * How a page's own title joins the company name. Exported because two places
 * have to agree about it: the root layout's title template, which appends it
 * to every page title, and the Open Graph title below, which has to build the
 * same string by hand because a template is not applied to it.
 */
export const TITLE_SEPARATOR = " - ";

export function titleTemplate(siteName: string): string {
  return `%s${TITLE_SEPARATOR}${siteName}`;
}

/**
 * The drawn share card, named explicitly.
 *
 * `app/opengraph-image.tsx` normally reaches every route on its own, and it
 * did until this module existed. It stops the moment a page declares an
 * `openGraph` block of its own: Next shallow-merges metadata, so a page's
 * `openGraph` replaces the layout's resolved one outright — file-convention
 * image included. The symptom is silent and expensive, a blank card on every
 * shared link, and the tags all look correct because the missing one leaves
 * nothing behind.
 *
 * So a page that sets any Open Graph field has to name the image too. The
 * hashed URL Next emits is a cache-buster; the route answers without it.
 * Dimensions match `size` in that file. No `alt`: the card's own export still
 * describes it on the home page, and duplicating the sentence here is how the
 * two drift apart.
 */
const DEFAULT_SHARE_CARD = {
  url: absoluteUrl("/opengraph-image"),
  width: 1200,
  height: 630,
};

/**
 * One route's metadata, out of the CMS.
 *
 * The Open Graph block is written in full rather than left to the root layout,
 * for the reason above: declaring part of it discards the rest. A share image
 * set on the page in the studio replaces the drawn card for that page alone.
 */
export function pageMetadata(seo: Seo, path: string, siteName: string): Metadata {
  const title = seo.title ? `${seo.title}${TITLE_SEPARATOR}${siteName}` : siteName;

  const url =
    seo.image?.url ?? (seo.image?.src ? absoluteUrl(seo.image.src) : undefined);

  return {
    // The bare page title: the layout's template appends the company name.
    title: seo.title,
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName,
      title,
      description: seo.description,
      url: absoluteUrl(path),
      images: url
        ? [{ url, alt: seo.image?.alt ?? "" }]
        : [DEFAULT_SHARE_CARD],
    },
  };
}
