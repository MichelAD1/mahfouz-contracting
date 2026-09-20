import { cache } from "react";
import { client, isSanityConfigured } from "./client";
import {
  ABOUT_QUERY,
  CLOSING_CTA_QUERY,
  CONTACT_QUERY,
  HOME_QUERY,
  PROCESS_QUERY,
  PROJECTS_QUERY,
  PROJECT_QUERY,
  PROJECT_SLUGS_QUERY,
  SECTION_COPY_QUERY,
  SERVICES_QUERY,
  SITE_FRAME_QUERY,
} from "./queries";
import {
  fallbackContact,
  fallbackHome,
  fallbackProjectDetails,
  fallbackSectionCopy,
} from "@/sanity/fallback/content";
import type {
  About,
  ClosingCta,
  Contact,
  HomePageContent,
  ProcessStep,
  Project,
  ProjectFull,
  SectionCopy,
  Service,
  SiteFrame,
} from "./types";

/** Revalidation window for CMS content. */
export const REVALIDATE = 300;

type PartialHome = {
  [K in keyof HomePageContent]?: HomePageContent[K] | null;
};

const isEmpty = (value: unknown): boolean =>
  value == null ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === "string" && value.trim() === "");

/**
 * Merges an incoming object over a fallback, **field by field**.
 *
 * This is the important part of the whole module. An earlier version replaced
 * each top-level key wholesale, which meant publishing a `hero` document
 * without a background image deleted the hero's photograph — the fallback did
 * not fill the gap, because the entire `hero` key had been swapped out. For a
 * CMS the client edits unsupervised, that is a trap: saving a document should
 * never be able to take something off the page.
 *
 * One level deep is deliberate. Going deeper would start merging inside images
 * and links, where a half-populated object is worse than either whole one.
 */
function mergeObject<T extends object>(base: T, incoming: unknown): T {
  if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
    return base;
  }

  const merged: Record<string, unknown> = { ...(base as Record<string, unknown>) };

  for (const [key, value] of Object.entries(incoming as Record<string, unknown>)) {
    if (!isEmpty(value)) merged[key] = value;
  }

  return merged as T;
}


/** A plain object: not null, and not an array. */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * `mergeObject`, one level deeper, for documents made of nested copy.
 *
 * The page copy holds a label, a heading, a lead and a link label together per
 * section. Merged at the top level only, an editor who rewrites a heading and
 * leaves the lead empty publishes `{ heading }` - which replaces the whole
 * section and takes the lead off the page. That is exactly the trap
 * `mergeObject` exists to close, one level down.
 *
 * It stops here for the same reason `mergeObject` stops above: below this are
 * images and links, where half of one and half of another is worse than either
 * whole. Only documents that are copy all the way down use this.
 */
function mergeCopy<T extends object>(base: T, incoming: unknown): T {
  if (!isPlainObject(incoming)) return base;

  const merged: Record<string, unknown> = { ...(base as Record<string, unknown>) };

  for (const [key, value] of Object.entries(incoming)) {
    const current = merged[key];

    if (isPlainObject(current) && isPlainObject(value)) {
      merged[key] = mergeObject(current, value);
    } else if (!isEmpty(value)) {
      merged[key] = value;
    }
  }

  return merged as T;
}

/**
 * Lists replace rather than merge. An array from the CMS is the complete list
 * by definition, so a published-but-empty collection means "not entered yet",
 * not "delete these".
 */
function preferList<T>(base: T[], incoming: T[] | null | undefined): T[] {
  return incoming && incoming.length > 0 ? incoming : base;
}

function mergeWithFallback(result: PartialHome | null): HomePageContent {
  if (!result) return fallbackHome;

  return {
    settings: mergeObject(fallbackHome.settings, result.settings),
    hero: mergeObject(fallbackHome.hero, result.hero),
    about: mergeObject(fallbackHome.about, result.about),
    closingCta: mergeObject(fallbackHome.closingCta, result.closingCta),
    services: preferList(fallbackHome.services, result.services),
    projects: preferList(fallbackHome.projects, result.projects),
    process: preferList(fallbackHome.process, result.process),
    partners: preferList(fallbackHome.partners, result.partners),
  };
}

/**
 * Every fetch below follows the same contract: never throw, never return
 * nothing, and log loudly when the CMS is the reason. A content outage should
 * cost the site its freshness, not its pages.
 */
async function fetchOrFallback<T>(
  label: string,
  query: string,
  params: Record<string, unknown>,
  tag: string,
  fallback: T,
  accept: (result: unknown) => T | null,
): Promise<T> {
  if (!isSanityConfigured || !client) return fallback;

  try {
    const result = await client.fetch(
      query,
      params,
      { next: { revalidate: REVALIDATE, tags: [tag] } },
    );
    return accept(result) ?? fallback;
  } catch (error) {
    console.error(`[sanity] ${label} query failed, serving fallback content`, error);
    return fallback;
  }
}

export function getHomePage(): Promise<HomePageContent> {
  return fetchOrFallback(
    "home",
    HOME_QUERY,
    {},
    "home",
    fallbackHome,
    (result) => mergeWithFallback(result as PartialHome | null),
  );
}

export function getProjects(): Promise<Project[]> {
  return fetchOrFallback(
    "projects",
    PROJECTS_QUERY,
    {},
    "projects",
    fallbackHome.projects,
    (result) => (Array.isArray(result) && result.length > 0 ? (result as Project[]) : null),
  );
}

/**
 * The header and footer, on every route.
 *
 * Wrapped in `cache` because the root layout and a page can both ask for it
 * inside one render; React then resolves it once. Without that, adding a page
 * that needs the settings would quietly double the query count on every route.
 */
export const getSiteFrame = cache(
  (): Promise<SiteFrame> =>
    fetchOrFallback(
      "site frame",
      SITE_FRAME_QUERY,
      {},
      "settings",
      { settings: fallbackHome.settings, services: fallbackHome.services },
      (result) => {
        const frame = result as Partial<SiteFrame> | null;
        if (!frame) return null;

        return {
          settings: mergeObject(fallbackHome.settings, frame.settings),
          services: preferList(fallbackHome.services, frame.services),
        };
      },
    ),
);

/**
 * The copy that used to live in the components.
 *
 * Cached for the same reason as `getSiteFrame`: `generateMetadata` and the
 * page body both ask for it inside one render, and without this every route
 * would run the query twice.
 */
export const getSectionCopy = cache(
  (): Promise<SectionCopy> =>
    fetchOrFallback(
      "section copy",
      SECTION_COPY_QUERY,
      {},
      "sectionCopy",
      fallbackSectionCopy,
      (result) => mergeCopy(fallbackSectionCopy, result),
    ),
);

export function getAbout(): Promise<About> {
  return fetchOrFallback(
    "about",
    ABOUT_QUERY,
    {},
    "about",
    fallbackHome.about,
    (result) => mergeObject(fallbackHome.about, result),
  );
}

export function getClosingCta(): Promise<ClosingCta> {
  return fetchOrFallback(
    "closing cta",
    CLOSING_CTA_QUERY,
    {},
    "closingCta",
    fallbackHome.closingCta,
    (result) => mergeObject(fallbackHome.closingCta, result),
  );
}

export function getServices(): Promise<Service[]> {
  return fetchOrFallback(
    "services",
    SERVICES_QUERY,
    {},
    "services",
    fallbackHome.services,
    (result) =>
      Array.isArray(result) && result.length > 0 ? (result as Service[]) : null,
  );
}

export function getProcess(): Promise<ProcessStep[]> {
  return fetchOrFallback(
    "process",
    PROCESS_QUERY,
    {},
    "process",
    fallbackHome.process,
    (result) =>
      Array.isArray(result) && result.length > 0 ? (result as ProcessStep[]) : null,
  );
}

export function getContact(): Promise<Contact> {
  return fetchOrFallback(
    "contact",
    CONTACT_QUERY,
    {},
    "contact",
    fallbackContact,
    (result) => mergeObject(fallbackContact, result),
  );
}

/**
 * Slugs for `generateStaticParams`. Falls back to the slugs the fallback
 * content carries, so the projects routes are never generated empty.
 */
export function getProjectSlugs(): Promise<string[]> {
  const fromFallback = fallbackHome.projects.map((project) => project.slug);

  return fetchOrFallback(
    "project slugs",
    PROJECT_SLUGS_QUERY,
    {},
    "projects",
    fromFallback,
    (result) => (Array.isArray(result) && result.length > 0 ? (result as string[]) : null),
  );
}

/**
 * Builds a detail-page project out of the fallback content: the card fields,
 * plus whatever placeholder detail exists for that slug. Projects with no
 * entry in the details map render the sparse version rather than 404, which is
 * what an unfilled record genuinely looks like.
 */
function fallbackProject(slug: string): ProjectFull | null {
  const project = fallbackHome.projects.find((entry) => entry.slug === slug);
  if (!project) return null;

  return {
    ...project,
    ...fallbackProjectDetails[slug],
    related: fallbackHome.projects.filter((entry) => entry.slug !== slug).slice(0, 3),
  };
}

export function getProject(slug: string): Promise<ProjectFull | null> {
  return fetchOrFallback(
    `project "${slug}"`,
    PROJECT_QUERY,
    { slug },
    `project:${slug}`,
    fallbackProject(slug),
    (result) => (result ? (result as ProjectFull) : null),
  );
}
