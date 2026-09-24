import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import { hasImage, isVector, sanityImageUrl } from "@/sanity/lib/image";
import type { SiteImage, Seo } from "@/sanity/lib/types";

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
 * The site's share card, named explicitly.
 *
 * `app/opengraph-image.tsx` serves it: the share image set in Site settings
 * when there is one, the drawn title-block card when there is not. Every route
 * points here rather than at either source, so changing the default in the
 * studio changes it everywhere at once.
 *
 * It has to be named because a page that declares an `openGraph` block of its
 * own loses the inherited one outright - Next shallow-merges metadata, so the
 * file-convention image goes with it, silently. The hashed URL Next emits is a
 * cache-buster; the route answers without it.
 */
const DEFAULT_SHARE_CARD = {
  url: absoluteUrl("/opengraph-image"),
  width: 1200,
  height: 630,
};

/**
 * A share image from the studio, cut to the 1200×630 card every platform
 * expects, around the editor's hotspot. JPEG, because not every crawler reads
 * the modern formats. SVGs are skipped: no platform renders one as a preview.
 */
function shareImage(image?: SiteImage) {
  if (!hasImage(image) || isVector(image)) return null;

  if (image.url) {
    return {
      url: sanityImageUrl(image, { width: 1200, height: 630, format: "jpg" }),
      width: 1200,
      height: 630,
      alt: image.alt ?? "",
    };
  }

  return { url: absoluteUrl(image.src!), alt: image.alt ?? "" };
}

/**
 * One route's metadata, out of the CMS.
 *
 * The Open Graph block is written in full rather than left to the root layout,
 * for the reason above: declaring part of it discards the rest. A share image
 * set on the page replaces the default card for that page alone.
 *
 * `absoluteTitle` is for the home page, whose title is the whole title: run
 * through the template it would print the company name twice.
 */
export function pageMetadata(
  seo: Seo,
  path: string,
  {
    siteName,
    defaults = {},
    absoluteTitle = false,
  }: { siteName: string; defaults?: Seo; absoluteTitle?: boolean },
): Metadata {
  const description = seo.description ?? defaults.description;
  const whole = seo.title ?? defaults.title ?? siteName;

  const shareTitle = absoluteTitle
    ? whole
    : seo.title
      ? `${seo.title}${TITLE_SEPARATOR}${siteName}`
      : (defaults.title ?? siteName);

  return {
    // A bare page title: the layout's template appends the company name.
    title: absoluteTitle ? { absolute: whole } : seo.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName,
      title: shareTitle,
      description,
      url: absoluteUrl(path),
      images: [shareImage(seo.image) ?? DEFAULT_SHARE_CARD],
    },
  };
}
