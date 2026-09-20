import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/sanity/lib/fetch";
import { PROJECT_DETAILS_INDEXABLE, absoluteUrl } from "@/lib/site";

/**
 * Matches the content revalidation window, so a project published in the
 * Studio enters the sitemap without a deploy.
 *
 * Written as a literal on purpose: route segment config is read statically at
 * build time, so `export const revalidate = REVALIDATE` — importing the very
 * constant this is meant to match — fails the build rather than resolving.
 */
export const revalidate = 300;

/**
 * Priorities are relative to each other and nothing else. Home first, then the
 * two pages that sell the work, then contact, which people arrive at rather
 * than search for.
 */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const routes: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  /**
   * Project detail pages are deliberately absent while they carry `noindex`.
   * Submitting a URL that tells Google not to index it is not a neutral act:
   * Search Console reports it as "Submitted URL marked noindex" — an error
   * against the whole sitemap, not a note about one page. They join the moment
   * the flag flips, with no edit here.
   */
  if (PROJECT_DETAILS_INDEXABLE) {
    const slugs = await getProjectSlugs();

    for (const slug of slugs) {
      routes.push({
        url: absoluteUrl(`/projects/${slug}`),
        lastModified,
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }
  }

  return routes;
}
