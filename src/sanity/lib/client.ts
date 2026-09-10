import { createClient, type SanityClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

/**
 * The Sanity project is created by the site owner, not by this repo. Until
 * `NEXT_PUBLIC_SANITY_PROJECT_ID` is set the site renders from
 * `src/sanity/fallback/content.ts`, so every page works with no CMS attached.
 */
export const isSanityConfigured = Boolean(projectId);

export const client: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === "production",
      perspective: "published",
    })
  : null;
