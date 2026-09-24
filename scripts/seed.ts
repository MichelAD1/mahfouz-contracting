/**
 * Seeds the Sanity dataset from the fallback content module.
 *
 *   npx sanity exec scripts/seed.ts --with-user-token
 *
 * Handing a client an empty Studio and asking them to type several hundred
 * fields is not a handover. This writes everything the site already renders
 * into the CMS, so the first thing they see is their own content, editable.
 *
 * `src/sanity/fallback/content.ts` is the single source: whatever the site
 * falls back to is exactly what gets seeded, so the two cannot describe
 * different companies.
 *
 * Safe to re-run. Every document id is deterministic and every write is a
 * `createOrReplace`, so a second run updates in place rather than producing a
 * second copy of the site. Asset uploads dedupe on content hash at Sanity's
 * end, so re-running does not accumulate images either.
 *
 * It does overwrite. Re-running after the client has edited a document
 * replaces their edit with the fallback value — this is a seeding tool, not a
 * sync, and once they are editing it has done its job.
 *
 * The documents the site no longer reads - `hero`, `about` and `sectionCopy`,
 * whose content moved into the page documents - are left alone unless asked:
 *
 *   npx sanity exec scripts/seed.ts --with-user-token -- --prune-legacy
 *
 * To see what would be written without uploading or writing anything - no
 * login needed - pass `--dry-run`, optionally with `--out=<file>` for the JSON:
 *
 *   npx sanity exec scripts/seed.ts -- --dry-run --out=seed-preview.json
 */
import { createReadStream, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { getCliClient } from "sanity/cli";
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
} from "../src/sanity/fallback/content";
import type {
  ClosingCtaOverride,
  Cta,
  GalleryImage,
  PageHero,
  ProjectTag,
  SectionIntro,
  Seo,
  SiteImage,
} from "../src/sanity/lib/types";

const client = getCliClient();
const PUBLIC_DIR = join(process.cwd(), "public");

const DRY_RUN = process.argv.includes("--dry-run");
const OUT = process.argv.find((arg) => arg.startsWith("--out="))?.slice("--out=".length);

/** Retired singletons: their content lives in the page documents now. */
const LEGACY_IDS = ["hero", "about", "sectionCopy"];

type SanityDoc = Record<string, unknown> & { _id: string; _type: string };

/**
 * Sanity requires a `_key` on every item in an array of objects, and arrays of
 * plain strings must not have one. Keys are derived from the field and index
 * rather than random, so re-seeding produces identical documents instead of
 * rewriting every key.
 */
function keyed<T extends object>(items: T[], prefix: string): (T & { _key: string })[] {
  return items.map((item, index) => ({ ...item, _key: `${prefix}-${index}` }));
}

function reference(id: string, prefix: string, index: number) {
  return { _type: "reference", _ref: id, _key: `${prefix}-${index}` };
}

function slug(current: string) {
  return { _type: "slug", current };
}

const assetIds = new Map<string, string>();
let uploadCount = 0;

/**
 * Uploads a local file once per run and returns it as an image field.
 *
 * The alt text travels with the asset reference rather than being attached to
 * the file, because the same photograph is used in several places here and
 * describes something slightly different in each.
 */
async function image(
  source?: SiteImage | GalleryImage,
  type: "imageWithAlt" | "galleryImage" = "imageWithAlt",
): Promise<Record<string, unknown> | undefined> {
  if (!source?.src) return undefined;

  let assetId = assetIds.get(source.src);

  if (!assetId && DRY_RUN) {
    // A stand-in in the shape of a real asset id, so the preview reads true.
    assetId = `image-dryrun${assetIds.size}-1x1-${source.src.split(".").pop()}`;
    assetIds.set(source.src, assetId);
  }

  if (!assetId) {
    const filePath = join(PUBLIC_DIR, source.src);
    const asset = await client.assets.upload("image", createReadStream(filePath), {
      filename: basename(source.src),
    });
    assetId = asset._id;
    assetIds.set(source.src, assetId);
    uploadCount += 1;
    console.log(`  uploaded ${source.src} -> ${assetId}`);
  }

  const caption = "caption" in source ? source.caption : undefined;

  return {
    _type: type,
    asset: { _type: "reference", _ref: assetId },
    ...(source.alt ? { alt: source.alt } : {}),
    ...(source.slotHint && type === "imageWithAlt" ? { slotHint: source.slotHint } : {}),
    ...(caption ? { caption } : {}),
  };
}

const cta = (value?: Cta) => (value ? { _type: "cta", label: value.label, href: value.href } : undefined);

/**
 * Nested objects need their `_type` or the studio cannot tell what it is
 * editing, and empty keys are dropped so an unset field reads as unset rather
 * than as an empty string somebody typed.
 */
function intro(value: SectionIntro): Record<string, unknown> {
  return {
    _type: "sectionIntro",
    ...(value.label ? { label: value.label } : {}),
    heading: value.heading,
    ...(value.lead ? { lead: value.lead } : {}),
    ...(value.linkLabel ? { linkLabel: value.linkLabel } : {}),
  };
}

function seoBlock(value: Seo): Record<string, unknown> | undefined {
  if (!value.title && !value.description) return undefined;
  return {
    _type: "seo",
    ...(value.title ? { title: value.title } : {}),
    ...(value.description ? { description: value.description } : {}),
  };
}

async function hero(value: PageHero): Promise<Record<string, unknown>> {
  return {
    _type: "pageHero",
    heading: value.heading,
    ...(value.lead ? { lead: value.lead } : {}),
    ...(value.image ? { image: await image(value.image) } : {}),
    buttons: keyed(
      value.buttons.map((button) => ({
        _type: "button",
        label: button.label,
        href: button.href,
        ...(button.style ? { style: button.style } : {}),
      })),
      "button",
    ),
  };
}

async function closingBanner(
  value?: ClosingCtaOverride,
): Promise<Record<string, unknown> | undefined> {
  if (!value || Object.keys(value).length === 0) return undefined;
  return {
    _type: "closingBanner",
    ...(value.heading ? { heading: value.heading } : {}),
    ...(value.lead ? { lead: value.lead } : {}),
    ...(value.cta ? { cta: cta(value.cta) } : {}),
    ...(value.background ? { background: await image(value.background) } : {}),
  };
}

/** Drops keys whose value is undefined, so objects carry no empty fields. */
function compact(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}

/** `compact`, for a whole document. */
function clean(doc: Record<string, unknown> & { _id: string; _type: string }): SanityDoc {
  return compact(doc) as SanityDoc;
}

function terms(items: ProjectTag[], type: "projectTag" | "projectCategory"): SanityDoc[] {
  return items.map((item, index) =>
    clean({
      _id: item._id,
      _type: type,
      title: item.title,
      slug: slug(item.slug),
      order: index,
    }),
  );
}

async function buildDocuments(): Promise<SanityDoc[]> {
  const settings = fallbackSettings;
  const documents: SanityDoc[] = [];

  console.log("Uploading images...");

  documents.push(
    clean({
      _id: "siteSettings",
      _type: "siteSettings",
      companyName: settings.companyName,
      shortName: settings.shortName,
      descriptor: settings.descriptor,
      tagline: settings.tagline,
      showNameWithLogo: settings.showNameWithLogo ?? false,
      standards: settings.standards,
      phones: keyed(settings.phones, "phone"),
      emails: settings.emails,
      address: { lines: settings.address.lines },
      postalAddress: settings.postalAddress,
      openingHours: keyed(
        settings.openingHours.map((entry) => ({ _type: "openingHours", ...entry })),
        "hours",
      ),
      areaServed: settings.areaServed,
      socials: keyed(
        settings.socials.map((social) => ({ _type: "socialLink", ...social })),
        "social",
      ),
      nav: keyed(settings.nav.map((item) => cta(item)!), "nav"),
      headerCta: cta(settings.headerCta),
      footerNote: settings.footerNote,
      footer: {
        navHeading: settings.footer.navHeading,
        servicesHeading: settings.footer.servicesHeading,
        contactHeading: settings.footer.contactHeading,
        legalLinks: keyed(settings.footer.legalLinks.map((item) => cta(item)!), "legal"),
        ...(settings.footer.copyright ? { copyright: settings.footer.copyright } : {}),
      },
      seo: seoBlock(settings.seo),
    }),
  );

  const home = fallbackHomePage;
  documents.push(
    clean({
      _id: "homePage",
      _type: "homePage",
      hero: await hero(home.hero),
      divisionStrip: home.divisionStrip,
      standardsLabel: home.standardsLabel,
      aboutLinkLabel: home.aboutLinkLabel,
      capabilities: intro(home.capabilities),
      selectedWork: intro(home.selectedWork),
      selectedWorkLimit: home.selectedWorkLimit,
      closingCta: await closingBanner(home.closingCta),
      seo: seoBlock(home.seo),
    }),
  );

  const about = fallbackAboutPage;
  documents.push(
    clean({
      _id: "aboutPage",
      _type: "aboutPage",
      hero: await hero(about.hero),
      whoWeAre: compact({
        label: about.whoWeAre.label,
        heading: about.whoWeAre.heading,
        body: about.whoWeAre.body,
        image: await image(about.whoWeAre.image),
        details: keyed(
          about.whoWeAre.details.map((row) => ({ _type: "detailRow", ...row })),
          "detail",
        ),
        highlights: keyed(
          about.whoWeAre.highlights.map((item) => ({ _type: "highlight", ...item })),
          "highlight",
        ),
        cta: cta(about.whoWeAre.cta),
      }),
      process: intro(about.process),
      closingCta: await closingBanner(about.closingCta),
      seo: seoBlock(about.seo),
    }),
  );

  const services = fallbackServicesPage;
  documents.push(
    clean({
      _id: "servicesPage",
      _type: "servicesPage",
      hero: await hero(services.hero),
      closingCta: await closingBanner(services.closingCta),
      seo: seoBlock(services.seo),
    }),
  );

  const projectsPage = fallbackProjectsPage;
  documents.push(
    clean({
      _id: "projectsPage",
      _type: "projectsPage",
      hero: await hero(projectsPage.hero),
      filters: { _type: "projectFilters", ...projectsPage.filters },
      empty: intro(projectsPage.empty),
      more: intro(projectsPage.more),
      detail: { _type: "projectDetailLabels", ...projectsPage.detail },
      closingCta: await closingBanner(projectsPage.closingCta),
      seo: seoBlock(projectsPage.seo),
    }),
  );

  /**
   * `recipientEmail` is left unset on purpose. Writing a developer's address
   * into the client's CMS would look like a decision rather than a placeholder,
   * and the form already falls back to CONTACT_RECIPIENT_EMAIL until a real
   * inbox exists.
   */
  const contact = fallbackContactPage;
  documents.push(
    clean({
      _id: "contact",
      _type: "contact",
      hero: await hero(contact.hero),
      form: { _type: "enquiryForm", ...contact.form },
      formSubjects: contact.formSubjects,
      direct: { _type: "contactDirect", ...contact.direct },
      details: keyed(
        contact.details.map((row) => ({ _type: "detailRow", ...row })),
        "detail",
      ),
      enquiryChecklist: contact.enquiryChecklist,
      seo: seoBlock(contact.seo),
    }),
  );

  documents.push(
    clean({
      _id: "notFoundPage",
      _type: "notFoundPage",
      hero: await hero(fallbackNotFoundPage.hero),
      closingCta: await closingBanner(fallbackNotFoundPage.closingCta),
    }),
  );

  documents.push(
    clean({
      _id: "privacyPolicy",
      _type: "privacyPolicy",
      heading: fallbackPrivacyPolicy.heading,
      heroImage: await image(fallbackPrivacyPolicy.heroImage),
      updated: fallbackPrivacyPolicy.updated,
      intro: fallbackPrivacyPolicy.intro,
      sections: keyed(
        fallbackPrivacyPolicy.sections.map((section) => ({
          _type: "policySection",
          ...section,
        })),
        "section",
      ),
      seo: seoBlock(fallbackPrivacyPolicy.seo),
    }),
  );

  documents.push(
    clean({
      _id: "closingCta",
      _type: "closingCta",
      heading: fallbackClosingCta.heading,
      lead: fallbackClosingCta.lead,
      cta: cta(fallbackClosingCta.cta),
      background: await image(fallbackClosingCta.background),
    }),
  );

  for (const [index, service] of fallbackServices.entries()) {
    documents.push(
      clean({
        _id: service._id,
        _type: "service",
        title: service.title,
        code: service.code,
        shortTitle: service.shortTitle,
        slug: slug(service.slug),
        shortDescription: service.shortDescription,
        fullDescription: service.fullDescription.length > 0 ? service.fullDescription : undefined,
        features: service.features,
        image: await image(service.image),
        order: index,
      }),
    );
  }

  documents.push(...terms(fallbackProjectTags, "projectTag"));
  documents.push(...terms(fallbackProjectCategories, "projectCategory"));

  for (const [index, partner] of fallbackPartners.entries()) {
    documents.push(
      clean({
        _id: partner._id,
        _type: "partner",
        name: partner.name,
        logo: await image(partner.logo),
        url: partner.url,
        order: index,
      }),
    );
  }

  for (const [index, step] of fallbackProcess.entries()) {
    documents.push(
      clean({
        _id: step._id,
        _type: "process",
        step: step.step,
        title: step.title,
        description: step.description,
        image: await image(step.image),
        order: index,
      }),
    );
  }

  for (const [index, project] of fallbackProjects.entries()) {
    // The detail-page copy lives in a separate map keyed by slug, so a project
    // that has one is seeded complete rather than as a card with a stub page.
    const detail = fallbackProjectDetails[project.slug] ?? {};

    const gallery = await Promise.all(
      (detail.gallery ?? []).map((entry) => image(entry, "galleryImage")),
    );

    documents.push(
      clean({
        _id: project._id,
        _type: "project",
        name: project.name,
        slug: slug(project.slug),
        summary: detail.summary ?? project.summary,
        description: detail.description,
        scopeOfWorks: detail.scopeOfWorks,
        tags: project.tags.map((tag, i) => reference(tag._id, "tag", i)),
        category: project.category
          ? { _type: "reference", _ref: project.category._id }
          : undefined,
        location: project.location,
        year: project.year,
        client: project.client,
        status: detail.status ?? project.status,
        featured: project.featured ?? false,
        cover: await image(project.cover),
        gallery: keyed(
          gallery.filter((entry): entry is Record<string, unknown> => Boolean(entry)),
          "gallery",
        ),
        services: project.divisions.map((division, i) =>
          reference(division._id, "service", i),
        ),
        equipment: (detail.equipment ?? []).map((entry, i) =>
          reference(entry._id, "equipment", i),
        ),
        // Placeholder records stay out of search until someone confirms them.
        searchVisible: false,
        order: index,
      }),
    );
  }

  return documents;
}

async function seed() {
  const { projectId, dataset } = client.config();
  const pruneLegacy = process.argv.includes("--prune-legacy");
  console.log(`${DRY_RUN ? "Dry run for" : "Seeding"} ${projectId}/${dataset}\n`);

  const documents = await buildDocuments();

  if (DRY_RUN) {
    if (OUT) writeFileSync(OUT, JSON.stringify(documents, null, 2));
    console.log(
      `\nWould write ${documents.length} documents and upload ${assetIds.size} images.` +
        (OUT ? ` Written to ${OUT}.` : "") +
        " Nothing was uploaded or written.",
    );
    return;
  }

  const transaction = client.transaction();
  for (const doc of documents) transaction.createOrReplace(doc);
  if (pruneLegacy) for (const id of LEGACY_IDS) transaction.delete(id);
  await transaction.commit();

  const counts = documents.reduce<Record<string, number>>((totals, doc) => {
    totals[doc._type] = (totals[doc._type] ?? 0) + 1;
    return totals;
  }, {});

  console.log(`\nWrote ${documents.length} documents, ${uploadCount} images uploaded.`);
  for (const [type, count] of Object.entries(counts).sort()) {
    console.log(`  ${count.toString().padStart(2)}  ${type}`);
  }
  console.log(
    pruneLegacy
      ? `\nDeleted the retired documents: ${LEGACY_IDS.join(", ")}.`
      : `\nLeft the retired documents in place (${LEGACY_IDS.join(", ")}); nothing reads them. Re-run with -- --prune-legacy to delete them.`,
  );
  console.log("\nDone. The site now renders from the CMS, not the fallback.");
}

seed().catch((error) => {
  console.error("\nSeed failed. Nothing partial is left behind: documents are");
  console.error("written in one transaction, so this is all-or-nothing.\n");
  console.error(error);
  process.exit(1);
});
