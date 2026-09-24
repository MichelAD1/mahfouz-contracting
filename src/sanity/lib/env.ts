/**
 * The Sanity project coordinates, and nothing else.
 *
 * Split out of `client.ts` so that code which only needs to *name* the
 * project - the image URL builder, above all - does not pull the whole Sanity
 * client in with it. The image helpers run in client components too, and
 * importing them used to ship `@sanity/client` to the browser for the sake of
 * two strings.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

/**
 * The Sanity project is created by the site owner, not by this repo. Until
 * `NEXT_PUBLIC_SANITY_PROJECT_ID` is set the site renders from
 * `src/sanity/fallback/content.ts`, so every page works with no CMS attached.
 */
export const isSanityConfigured = Boolean(projectId);
