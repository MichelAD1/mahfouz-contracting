import { client, isSanityConfigured } from "./client";
import { HOME_QUERY } from "./queries";
import { fallbackHome } from "@/sanity/fallback/content";
import type { HomePageContent } from "./types";

/** Revalidation window for CMS content. */
export const REVALIDATE = 300;

type PartialHome = {
  [K in keyof HomePageContent]?: HomePageContent[K] | null;
};

/**
 * Merges a Sanity result over the fallback, key by key. A dataset that is only
 * partly filled in still renders a complete page, which matters while the
 * client is populating content.
 */
function mergeWithFallback(result: PartialHome | null): HomePageContent {
  if (!result) return fallbackHome;

  const isEmpty = (value: unknown) =>
    value == null || (Array.isArray(value) && value.length === 0);

  // Copying through an index signature keeps this one loop rather than nine
  // hand-written branches; the shape is guaranteed by HomePageContent.
  const merged: Record<string, unknown> = { ...fallbackHome };
  const incoming = result as Record<string, unknown>;

  for (const key of Object.keys(fallbackHome)) {
    if (!isEmpty(incoming[key])) merged[key] = incoming[key];
  }

  return merged as HomePageContent;
}

export async function getHomePage(): Promise<HomePageContent> {
  if (!isSanityConfigured || !client) return fallbackHome;

  try {
    const result = await client.fetch<PartialHome>(
      HOME_QUERY,
      {},
      { next: { revalidate: REVALIDATE, tags: ["home"] } },
    );
    return mergeWithFallback(result);
  } catch (error) {
    // A CMS outage must not take the site down.
    console.error("[sanity] home query failed, serving fallback content", error);
    return fallbackHome;
  }
}
