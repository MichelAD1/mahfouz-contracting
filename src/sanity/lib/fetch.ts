import { cache } from "react";
import { client, isSanityConfigured } from "./client";
import {
  ABOUT_PAGE_QUERY,
  CONTACT_QUERY,
  HOME_QUERY,
  NOT_FOUND_QUERY,
  PRIVACY_POLICY_QUERY,
  PROJECTS_PAGE_QUERY,
  PROJECT_QUERY,
  PROJECT_SLUGS_QUERY,
  SERVICES_PAGE_QUERY,
  SITEMAP_PROJECTS_QUERY,
  SITE_FRAME_QUERY,
} from "./queries";
import {
  fallbackAboutPage,
  fallbackClosingCta,
  fallbackContactPage,
  fallbackHomePage,
  fallbackNotFoundPage,
  fallbackPartners,
  fallbackPrivacyPolicy,
  fallbackProcess,
  fallbackProjectCategories,
  fallbackProjectDetails,
  fallbackProjects,
  fallbackProjectsPage,
  fallbackProjectTags,
  fallbackServices,
  fallbackServicesPage,
  fallbackSettings,
} from "@/sanity/fallback/content";
import type {
  AboutPage,
  ClosingCta,
  ContactPage,
  Cta,
  HomePage,
  HomePageContent,
  NavService,
  NotFoundPage,
  PageHero,
  Partner,
  PrivacyPolicy,
  ProcessStep,
  Project,
  ProjectCategory,
  ProjectFull,
  ProjectsIndexContent,
  ProjectsPage,
  ProjectTag,
  Service,
  ServicesPage,
  SiteFrame,
  SiteSettings,
  WhoWeAre,
} from "./types";

/** Revalidation window for CMS content. */
export const REVALIDATE = 300;

type Json = Record<string, unknown>;

/*
 * How CMS content is resolved against the fallback module.
 *
 * The fallback applies to a **document**, not to each field. A document that
 * does not exist - the site is not connected, the document has not been
 * created, the query failed - renders from the fallback whole, which is what
 * keeps every page up whatever the state of the CMS.
 *
 * A document that does exist is taken as published, including what the editor
 * cleared. This used to be a field-by-field merge, which made "clear it to
 * remove it" impossible: a cleared link, list or button came straight back
 * from the fallback, so several descriptions in the studio promised something
 * the site then refused to do. The exception is the short list of `required`
 * fields each document names below - a heading or a label the layout cannot
 * stand without - which come back from the fallback when empty, so no save can
 * leave a section headless.
 *
 * Collections follow the same rule: an answered query is the list, even an
 * empty one. Otherwise deleting the last placeholder project would bring all
 * four back, and those are records nobody has confirmed.
 */

function isPlainObject(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";

const isEmpty = (value: unknown): boolean =>
  value == null ||
  (typeof value === "string" && value.trim() === "") ||
  (Array.isArray(value) && value.length === 0) ||
  (isPlainObject(value) && Object.keys(value).length === 0);

/** Every named key holds text. */
const hasAll =
  (...keys: string[]) =>
  (item: Json): boolean =>
    keys.every((key) => hasText(item[key]));

/** A label and somewhere to go. Keeps whatever else the value carries, such as a button's style. */
function isLink<T>(value: T): value is T & Cta {
  return isPlainObject(value) && hasText(value.label) && hasText(value.href);
}

/**
 * Strips what the CMS sends for "not set": nulls, blank strings, empty lists,
 * and objects with nothing left in them.
 *
 * An image with no asset goes too, unless it carries a "Wanted photograph"
 * hint - that one is a placeholder slot on purpose. The image projection always
 * carries an `assetId` key, which is how an image is recognised here.
 */
function prune(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(prune).filter((item) => !isEmpty(item));
  }
  if (!isPlainObject(value)) return value;

  const out: Json = {};
  for (const [key, entry] of Object.entries(value)) {
    const pruned = prune(entry);
    if (!isEmpty(pruned)) out[key] = pruned;
  }

  if ("assetId" in value && !out.url && !out.slotHint) return undefined;
  return out;
}

/** An image in the fallback: left missing when absent, never defaulted to `{}`. */
const isImageShaped = (value: Json) =>
  "src" in value || "url" in value || "alt" in value || "slotHint" in value;

/**
 * Makes every list the fallback has into a list here too, however the CMS left
 * it, so no component has to ask. The fallback's shape is the schema's shape.
 */
function withShape(value: Json, shape: Json): Json {
  const out: Json = { ...value };

  for (const [key, template] of Object.entries(shape)) {
    if (Array.isArray(template)) {
      if (!Array.isArray(out[key])) out[key] = [];
    } else if (isPlainObject(template) && !isImageShaped(template)) {
      out[key] = withShape(isPlainObject(out[key]) ? (out[key] as Json) : {}, template);
    }
  }

  return out;
}

function getPath(source: unknown, keys: string[]): unknown {
  let current = source;
  for (const key of keys) {
    if (!isPlainObject(current)) return undefined;
    current = current[key];
  }
  return current;
}

function setPath(target: Json, keys: string[], value: unknown): void {
  let current = target;
  for (const key of keys.slice(0, -1)) {
    if (!isPlainObject(current[key])) current[key] = {};
    current = current[key] as Json;
  }
  current[keys[keys.length - 1]] = value;
}

/**
 * One CMS document, resolved against its fallback. See the note above for the
 * rules; `required` lists the dotted paths that may never be empty.
 */
function resolveDoc<T extends object>(
  fallback: T,
  incoming: unknown,
  required: readonly string[] = [],
): T {
  if (!isPlainObject(incoming)) return fallback;

  const pruned = prune(incoming);
  const doc = withShape(isPlainObject(pruned) ? pruned : {}, fallback as Json);

  for (const path of required) {
    const keys = path.split(".");
    if (!isEmpty(getPath(doc, keys))) continue;

    const value = getPath(fallback, keys);
    // Cloned, so a later write into the document can never reach the fallback.
    if (value !== undefined) setPath(doc, keys, structuredClone(value));
  }

  return doc as T;
}

/** A collection: the CMS's list when the query answered, normalised and checked. */
function resolveList<T>(
  incoming: unknown,
  fallback: T[],
  { shape = {}, valid }: { shape?: Json; valid: (item: Json) => boolean },
): T[] {
  if (!Array.isArray(incoming)) return fallback;

  return (prune(incoming) as unknown[])
    .filter(isPlainObject)
    .map((item) => withShape(item, shape))
    .filter(valid) as T[];
}

const SERVICE_ITEM = {
  shape: { features: [], fullDescription: [] },
  valid: hasAll("_id", "title", "slug"),
};

const TERM_ITEM = { valid: hasAll("_id", "title", "slug") };

const PROJECT_ITEM = {
  shape: { tags: [], divisions: [] },
  valid: hasAll("_id", "name", "slug"),
};

const PARTNER_ITEM = { valid: hasAll("_id", "name") };

const PROCESS_ITEM = { valid: hasAll("_id", "title") };

/** Drops the half-typed: a button needs a label and somewhere to go. */
function cleanHero(hero: PageHero): PageHero {
  return {
    ...hero,
    buttons: hero.buttons.filter(isLink).map((button) => ({
      ...button,
      style: button.style === "outline" || button.style === "solid" ? button.style : undefined,
    })),
  };
}

/** A tag or a division whose document was deleted comes back half-empty. */
function cleanProject<T extends Project>(project: T): T {
  const isTerm = hasAll("_id", "title", "slug");

  return {
    ...project,
    category:
      project.category && isTerm(project.category as unknown as Json)
        ? project.category
        : undefined,
    tags: project.tags.filter((tag) => isTerm(tag as unknown as Json)),
    divisions: project.divisions.filter((division) => isTerm(division as unknown as Json)),
  };
}

function cleanWhoWeAre(whoWeAre: WhoWeAre): WhoWeAre {
  return {
    ...whoWeAre,
    details: whoWeAre.details.filter((row) => hasText(row.label) && hasText(row.value)),
    highlights: whoWeAre.highlights.filter((item) => hasText(item.title)),
    cta: isLink(whoWeAre.cta) ? whoWeAre.cta : undefined,
  };
}

/**
 * The shared closing banner, with a page's own fields laid over it. Each field
 * a page sets replaces that field alone.
 */
function resolveClosingCta(incoming: unknown, override?: unknown): ClosingCta {
  const base = resolveDoc(fallbackClosingCta, incoming, ["heading"]);
  const pruned = isPlainObject(override) ? prune(override) : undefined;
  const own = isPlainObject(pruned) ? pruned : {};
  const merged = { ...base, ...own } as ClosingCta;

  if (merged.cta && !isLink(merged.cta)) {
    merged.cta = isLink(base.cta) ? base.cta : undefined;
  }

  return merged;
}

const SETTINGS_REQUIRED = [
  "companyName",
  "shortName",
  "nav",
  "headerCta.label",
  "headerCta.href",
  "footer.navHeading",
  "footer.servicesHeading",
  "footer.contactHeading",
  "footer.legalLinks",
] as const;

function resolveSettings(incoming: unknown): SiteSettings {
  const settings = resolveDoc(fallbackSettings, incoming, SETTINGS_REQUIRED);
  if (settings === fallbackSettings) return fallbackSettings;

  // A link with no label or no destination is dropped, not rendered broken.
  const nav = settings.nav.filter(isLink);
  const legalLinks = settings.footer.legalLinks.filter(isLink);

  return {
    ...settings,
    nav: nav.length > 0 ? nav : fallbackSettings.nav,
    phones: settings.phones.filter((phone) => hasText(phone.number)),
    socials: settings.socials.filter(
      (social) => hasText(social.platform) && hasText(social.url),
    ),
    footer: {
      ...settings.footer,
      legalLinks: legalLinks.length > 0 ? legalLinks : fallbackSettings.footer.legalLinks,
    },
  };
}

/**
 * Every fetch below follows the same contract: never throw, never return
 * nothing, and log loudly when the CMS is the reason. A content outage should
 * cost the site its freshness, not its pages.
 *
 * `resolve` turns whatever the query answered into the content, including an
 * answer of "nothing here"; `fallback` is only for when there was no answer.
 */
async function fetchOrFallback<T>(
  label: string,
  query: string,
  params: Record<string, unknown>,
  tag: string,
  fallback: T,
  resolve: (result: unknown) => T,
): Promise<T> {
  if (!isSanityConfigured || !client) return fallback;

  try {
    const result = await client.fetch(query, params, {
      next: { revalidate: REVALIDATE, tags: [tag] },
    });
    return resolve(result);
  } catch (error) {
    console.error(`[sanity] ${label} query failed, serving fallback content`, error);
    return fallback;
  }
}

const asObject = (result: unknown): Json => (isPlainObject(result) ? result : {});

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
      { settings: fallbackSettings, services: fallbackServices },
      (result) => {
        const frame = asObject(result);
        return {
          settings: resolveSettings(frame.settings),
          services: resolveList<NavService>(frame.services, fallbackServices, TERM_ITEM),
        };
      },
    ),
);

const HOME_REQUIRED = [
  "hero.heading",
  "divisionStrip",
  "capabilities.heading",
  "selectedWork.heading",
  "selectedWorkLimit",
] as const;

const WHO_WE_ARE_REQUIRED = ["heading"] as const;

/**
 * The Who we are block, read from the About page's document for the home
 * page's short version. No About document at all means the fallback block; an
 * About document with the block emptied means an emptied block.
 */
function resolveWhoWeAre(about: unknown): WhoWeAre {
  const block = isPlainObject(about) ? (about.whoWeAre ?? {}) : undefined;
  return cleanWhoWeAre(
    resolveDoc(fallbackAboutPage.whoWeAre, block, WHO_WE_ARE_REQUIRED),
  );
}

export const getHomePage = cache(
  (): Promise<HomePageContent> =>
    fetchOrFallback(
      "home",
      HOME_QUERY,
      {},
      "home",
      {
        page: fallbackHomePage,
        whoWeAre: fallbackAboutPage.whoWeAre,
        services: fallbackServices,
        projects: fallbackProjects,
        partners: fallbackPartners,
        closingCta: fallbackClosingCta,
      },
      (result) => {
        const content = asObject(result);
        const page = resolveDoc<HomePage>(fallbackHomePage, content.page, HOME_REQUIRED);

        return {
          page: { ...page, hero: cleanHero(page.hero) },
          whoWeAre: resolveWhoWeAre(content.about),
          services: resolveList<Service>(content.services, fallbackServices, SERVICE_ITEM),
          projects: resolveList<Project>(content.projects, fallbackProjects, PROJECT_ITEM).map(
            cleanProject,
          ),
          partners: resolveList<Partner>(content.partners, fallbackPartners, PARTNER_ITEM),
          closingCta: resolveClosingCta(content.closingCta, page.closingCta),
        };
      },
    ),
);

/*
 * An inner page's search title is required: empty, the page would inherit the
 * site-wide default and share the home page's title in every search result.
 * Its fallback is just the page's own name. The home page is the exception -
 * the site-wide default is its title.
 */
const ABOUT_REQUIRED = [
  "hero.heading",
  "whoWeAre.heading",
  "process.heading",
  "seo.title",
] as const;

export const getAboutPage = cache(
  (): Promise<{ page: AboutPage; process: ProcessStep[]; closingCta: ClosingCta }> =>
    fetchOrFallback(
      "about",
      ABOUT_PAGE_QUERY,
      {},
      "about",
      { page: fallbackAboutPage, process: fallbackProcess, closingCta: fallbackClosingCta },
      (result) => {
        const content = asObject(result);
        const page = resolveDoc<AboutPage>(fallbackAboutPage, content.page, ABOUT_REQUIRED);

        return {
          page: {
            ...page,
            hero: cleanHero(page.hero),
            whoWeAre: cleanWhoWeAre(page.whoWeAre),
          },
          process: resolveList<ProcessStep>(content.process, fallbackProcess, PROCESS_ITEM),
          closingCta: resolveClosingCta(content.closingCta, page.closingCta),
        };
      },
    ),
);

export const getServicesPage = cache(
  (): Promise<{ page: ServicesPage; services: Service[]; closingCta: ClosingCta }> =>
    fetchOrFallback(
      "services",
      SERVICES_PAGE_QUERY,
      {},
      "services",
      { page: fallbackServicesPage, services: fallbackServices, closingCta: fallbackClosingCta },
      (result) => {
        const content = asObject(result);
        const page = resolveDoc<ServicesPage>(fallbackServicesPage, content.page, [
          "hero.heading",
          "seo.title",
        ]);

        return {
          page: { ...page, hero: cleanHero(page.hero) },
          services: resolveList<Service>(content.services, fallbackServices, SERVICE_ITEM),
          closingCta: resolveClosingCta(content.closingCta, page.closingCta),
        };
      },
    ),
);

const DETAIL_LABELS = [
  "overview",
  "scope",
  "equipment",
  "gallery",
  "nextProject",
  "allProjects",
  "category",
  "location",
  "divisions",
  "status",
  "year",
  "client",
] as const;

const PROJECTS_REQUIRED = [
  "hero.heading",
  "seo.title",
  "filters.allLabel",
  "filters.projectSingular",
  "filters.projectPlural",
  "empty.heading",
  "more.heading",
  ...DETAIL_LABELS.map((label) => `detail.${label}`),
];

/**
 * The projects index, and the labels every project page is built from.
 * Cached because a project page asks for it as well as its own record.
 */
export const getProjectsIndex = cache(
  (): Promise<ProjectsIndexContent> =>
    fetchOrFallback(
      "projects",
      PROJECTS_PAGE_QUERY,
      {},
      "projects",
      {
        page: fallbackProjectsPage,
        projects: fallbackProjects,
        tags: fallbackProjectTags,
        categories: fallbackProjectCategories,
        closingCta: fallbackClosingCta,
      },
      (result) => {
        const content = asObject(result);
        const page = resolveDoc<ProjectsPage>(
          fallbackProjectsPage,
          content.page,
          PROJECTS_REQUIRED,
        );

        return {
          page: { ...page, hero: cleanHero(page.hero) },
          projects: resolveList<Project>(content.projects, fallbackProjects, PROJECT_ITEM).map(
            cleanProject,
          ),
          tags: resolveList<ProjectTag>(content.tags, fallbackProjectTags, TERM_ITEM),
          categories: resolveList<ProjectCategory>(
            content.categories,
            fallbackProjectCategories,
            TERM_ITEM,
          ),
          closingCta: resolveClosingCta(content.closingCta, page.closingCta),
        };
      },
    ),
);

const CONTACT_REQUIRED = [
  "hero.heading",
  "seo.title",
  "form.nameLabel",
  "form.companyLabel",
  "form.emailLabel",
  "form.phoneLabel",
  "form.subjectLabel",
  "form.subjectPlaceholder",
  "form.messageLabel",
  "form.submitLabel",
  "form.submittingLabel",
  "direct.heading",
  "direct.officeLabel",
  "direct.emailLabel",
  "direct.hoursLabel",
  "direct.closedLabel",
  "direct.checklistLabel",
] as const;

/**
 * The contact page, and the enquiry inbox. Cached because the page asks for it
 * twice in one render - once for its metadata, once for its body.
 */
export const getContactPage = cache(
  (): Promise<ContactPage> =>
    fetchOrFallback(
      "contact",
      CONTACT_QUERY,
      {},
      "contact",
      fallbackContactPage,
      (result) => {
        const page = resolveDoc<ContactPage>(fallbackContactPage, result, CONTACT_REQUIRED);
        if (page === fallbackContactPage) return fallbackContactPage;

        return {
          ...page,
          hero: cleanHero(page.hero),
          details: page.details.filter((row) => hasText(row.label) && hasText(row.value)),
        };
      },
    ),
);

export const getNotFoundPage = cache(
  (): Promise<{ page: NotFoundPage; closingCta: ClosingCta }> =>
    fetchOrFallback(
      "404",
      NOT_FOUND_QUERY,
      {},
      "notFound",
      { page: fallbackNotFoundPage, closingCta: fallbackClosingCta },
      (result) => {
        const content = asObject(result);
        const page = resolveDoc<NotFoundPage>(fallbackNotFoundPage, content.page, [
          "hero.heading",
        ]);

        return {
          page: { ...page, hero: cleanHero(page.hero) },
          closingCta: resolveClosingCta(content.closingCta, page.closingCta),
        };
      },
    ),
);

/**
 * The privacy policy. Taken as published, the heading excepted: a policy is the
 * one text on the site where the fallback's wording turning up in place of the
 * lawyer's would be worse than a gap.
 */
export const getPrivacyPolicy = cache(
  (): Promise<PrivacyPolicy> =>
    fetchOrFallback(
      "privacy policy",
      PRIVACY_POLICY_QUERY,
      {},
      "privacyPolicy",
      fallbackPrivacyPolicy,
      (result) => {
        const policy = resolveDoc<PrivacyPolicy>(fallbackPrivacyPolicy, result, [
          "heading",
          "seo.title",
        ]);
        if (policy === fallbackPrivacyPolicy) return fallbackPrivacyPolicy;

        return {
          ...policy,
          sections: policy.sections
            .filter((section) => hasText(section.heading))
            .map((section) => ({
              ...section,
              body: Array.isArray(section.body) ? section.body : [],
            })),
        };
      },
    ),
);

/**
 * Slugs for `generateStaticParams`. Falls back to the slugs the fallback
 * content carries, so the projects routes are never generated empty.
 */
export function getProjectSlugs(): Promise<string[]> {
  return fetchOrFallback(
    "project slugs",
    PROJECT_SLUGS_QUERY,
    {},
    "projects",
    fallbackProjects.map((project) => project.slug),
    (result) => (Array.isArray(result) ? result.filter(hasText) : []),
  );
}

/** The project pages cleared for search, for the sitemap. */
export function getSitemapProjects(): Promise<{ slug: string; updatedAt?: string }[]> {
  return fetchOrFallback(
    "sitemap projects",
    SITEMAP_PROJECTS_QUERY,
    {},
    "projects",
    [],
    (result) =>
      (Array.isArray(result) ? result : [])
        .filter((entry): entry is Json => isPlainObject(entry) && hasText(entry.slug))
        .map((entry) => ({
          slug: entry.slug as string,
          updatedAt: hasText(entry._updatedAt) ? entry._updatedAt : undefined,
        })),
  );
}

const PROJECT_FULL_SHAPE = {
  tags: [],
  divisions: [],
  description: [],
  scopeOfWorks: [],
  details: [],
  equipment: [],
  gallery: [],
  seo: {},
};

/**
 * A detail-page project out of the fallback content: the card fields, plus
 * whatever placeholder detail exists for that slug. Projects with no entry in
 * the details map render the sparse version rather than 404, which is what an
 * unfilled record genuinely looks like.
 */
function fallbackProject(slug: string): ProjectFull | null {
  const project = fallbackProjects.find((entry) => entry.slug === slug);
  if (!project) return null;

  // The empty lists go first, so the card's own tags and divisions win.
  return {
    ...structuredClone(PROJECT_FULL_SHAPE),
    ...project,
    ...fallbackProjectDetails[slug],
  } as ProjectFull;
}

function resolveProject(result: unknown): ProjectFull | null {
  if (!isPlainObject(result)) return null;

  const pruned = prune(result);
  if (!isPlainObject(pruned)) return null;

  const project = withShape(pruned, PROJECT_FULL_SHAPE) as ProjectFull;
  if (!hasAll("_id", "name", "slug")(project as unknown as Json)) return null;

  return cleanProject({
    ...project,
    gallery: project.gallery.filter((image) => Boolean(image.url || image.src)),
    equipment: project.equipment.filter((item) => hasText(item._id) && hasText(item.name)),
    details: project.details.filter((row) => hasText(row.label) && hasText(row.value)),
  });
}

/** One project, or `null` for a slug the CMS does not have - which is a 404. */
export const getProject = cache(
  (slug: string): Promise<ProjectFull | null> =>
    fetchOrFallback(
      `project "${slug}"`,
      PROJECT_QUERY,
      { slug },
      `project:${slug}`,
      fallbackProject(slug),
      resolveProject,
    ),
);
