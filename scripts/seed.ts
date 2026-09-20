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
 */
import { createReadStream } from "node:fs";
import { basename, join } from "node:path";
import { getCliClient } from "sanity/cli";
import {
  fallbackContact,
  fallbackHome,
  fallbackPrivacyPolicy,
  fallbackProjectDetails,
  fallbackSectionCopy,
} from "../src/sanity/fallback/content";
import type { SectionIntro, Seo, SiteImage } from "../src/sanity/lib/types";

const client = getCliClient();
const PUBLIC_DIR = join(process.cwd(), "public");

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
 * Uploads a local file once per run and returns it as an `imageWithAlt`.
 *
 * The alt text travels with the asset reference rather than being attached to
 * the file, because the same photograph is used in several places here and
 * describes something slightly different in each.
 */
async function image(source?: SiteImage): Promise<Record<string, unknown> | undefined> {
  if (!source?.src) return undefined;

  let assetId = assetIds.get(source.src);

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

  return {
    _type: "imageWithAlt",
    asset: { _type: "reference", _ref: assetId },
    ...(source.alt ? { alt: source.alt } : {}),
    ...(source.slotHint ? { slotHint: source.slotHint } : {}),
  };
}

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

function seoBlock(value: Seo): Record<string, unknown> {
  return {
    _type: "seo",
    ...(value.title ? { title: value.title } : {}),
    ...(value.description ? { description: value.description } : {}),
  };
}

/** Drops keys whose value is undefined, so documents carry no empty fields. */
function clean(doc: Record<string, unknown>): SanityDoc {
  return Object.fromEntries(
    Object.entries(doc).filter(([, value]) => value !== undefined),
  ) as SanityDoc;
}

async function buildDocuments(): Promise<SanityDoc[]> {
  const { settings, hero, about, services, projects, process: processSteps, partners, closingCta } =
    fallbackHome;

  console.log("Uploading images...");

  const documents: SanityDoc[] = [];

  documents.push(
    clean({
      _id: "siteSettings",
      _type: "siteSettings",
      companyName: settings.companyName,
      shortName: settings.shortName,
      descriptor: settings.descriptor,
      tagline: settings.tagline,
      standards: settings.standards,
      phones: keyed(settings.phones, "phone"),
      emails: settings.emails,
      address: { lines: settings.address.lines },
      socials: keyed(settings.socials, "social"),
      nav: keyed(
        settings.nav.map((item) => ({ _type: "cta", ...item })),
        "nav",
      ),
      footerNote: settings.footerNote,
    }),
  );

  documents.push(
    clean({
      _id: "sectionCopy",
      _type: "sectionCopy",
      divisionStrip: fallbackSectionCopy.divisionStrip,
      capabilities: intro(fallbackSectionCopy.capabilities),
      selectedWork: intro(fallbackSectionCopy.selectedWork),
      aboutHero: intro(fallbackSectionCopy.aboutHero),
      aboutProcess: intro(fallbackSectionCopy.aboutProcess),
      servicesHero: intro(fallbackSectionCopy.servicesHero),
      projectsHero: intro(fallbackSectionCopy.projectsHero),
      projectsMore: intro(fallbackSectionCopy.projectsMore),
      projectsEmpty: intro(fallbackSectionCopy.projectsEmpty),
      projectsAllFilter: fallbackSectionCopy.projectsAllFilter,
      enquiryForm: { _type: "enquiryForm", ...fallbackSectionCopy.enquiryForm },
      contactDirect: { _type: "contactDirect", ...fallbackSectionCopy.contactDirect },
      homeSeo: seoBlock(fallbackSectionCopy.homeSeo),
      aboutSeo: seoBlock(fallbackSectionCopy.aboutSeo),
      servicesSeo: seoBlock(fallbackSectionCopy.servicesSeo),
      projectsSeo: seoBlock(fallbackSectionCopy.projectsSeo),
      contactSeo: seoBlock(fallbackSectionCopy.contactSeo),
    }),
  );

  documents.push(
    clean({
      _id: "hero",
      _type: "hero",
      headingLines: hero.headingLines,
      lead: hero.lead,
      primaryCta: { _type: "cta", ...hero.primaryCta },
      secondaryCta: { _type: "cta", ...hero.secondaryCta },
      background: await image(hero.background),
    }),
  );

  const aboutImages = await Promise.all(about.images.map((entry) => image(entry)));

  documents.push(
    clean({
      _id: "about",
      _type: "about",
      sheet: about.sheet,
      statement: about.statement,
      body: about.body,
      cta: { _type: "cta", ...about.cta },
      images: keyed(
        aboutImages.filter((entry): entry is Record<string, unknown> => Boolean(entry)),
        "image",
      ),
      details: keyed(
        about.details.map((row) => ({ _type: "detailRow", ...row })),
        "detail",
      ),
    }),
  );

  documents.push(
    clean({
      _id: "closingCta",
      _type: "closingCta",
      heading: closingCta.heading,
      lead: closingCta.lead,
      cta: { _type: "cta", ...closingCta.cta },
      background: await image(closingCta.background),
    }),
  );

  /**
   * `recipientEmail` is left unset on purpose. Writing a developer's address
   * into the client's CMS would look like a decision rather than a placeholder,
   * and the form already falls back to CONTACT_RECIPIENT_EMAIL until a real
   * inbox exists.
   */
  documents.push(
    clean({
      _id: "contact",
      _type: "contact",
      heading: fallbackContact.heading,
      description: fallbackContact.description,
      details: keyed(
        (fallbackContact.details ?? []).map((row) => ({ _type: "detailRow", ...row })),
        "detail",
      ),
      formSubjects: fallbackContact.formSubjects,
    }),
  );

  documents.push(
    clean({
      _id: "privacyPolicy",
      _type: "privacyPolicy",
      heading: fallbackPrivacyPolicy.heading,
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

  for (const [index, service] of services.entries()) {
    documents.push(
      clean({
        _id: service._id,
        _type: "service",
        title: service.title,
        code: service.code,
        shortTitle: service.shortTitle,
        slug: slug(service.slug),
        shortDescription: service.shortDescription,
        fullDescription: service.fullDescription,
        features: service.features,
        image: await image(service.image),
        order: index,
      }),
    );
  }

  for (const [index, partner] of partners.entries()) {
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

  for (const [index, step] of processSteps.entries()) {
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

  for (const [index, project] of projects.entries()) {
    // The detail-page copy lives in a separate map keyed by slug, so a project
    // that has one is seeded complete rather than as a card with a stub page.
    const detail = fallbackProjectDetails[project.slug] ?? {};

    documents.push(
      clean({
        _id: project._id,
        _type: "project",
        name: project.name,
        slug: slug(project.slug),
        summary: detail.summary ?? project.summary,
        description: detail.description,
        scopeOfWorks: detail.scopeOfWorks,
        category: project.category,
        location: project.location,
        year: project.year,
        client: project.client,
        status: detail.status ?? project.status,
        featured: project.featured ?? false,
        cover: await image(project.cover),
        services: (project.divisions ?? []).map((division, i) =>
          reference(division._id, "service", i),
        ),
        equipment: (detail.equipment ?? []).map((entry, i) =>
          reference(entry._id, "equipment", i),
        ),
        order: index,
      }),
    );
  }

  return documents;
}

async function seed() {
  const { projectId, dataset } = client.config();
  console.log(`Seeding ${projectId}/${dataset}\n`);

  const documents = await buildDocuments();

  const transaction = client.transaction();
  for (const doc of documents) transaction.createOrReplace(doc);
  await transaction.commit();

  const counts = documents.reduce<Record<string, number>>((totals, doc) => {
    totals[doc._type] = (totals[doc._type] ?? 0) + 1;
    return totals;
  }, {});

  console.log(`\nWrote ${documents.length} documents, ${uploadCount} images uploaded.`);
  for (const [type, count] of Object.entries(counts).sort()) {
    console.log(`  ${count.toString().padStart(2)}  ${type}`);
  }
  console.log("\nDone. The site now renders from the CMS, not the fallback.");
}

seed().catch((error) => {
  console.error("\nSeed failed. Nothing partial is left behind: documents are");
  console.error("written in one transaction, so this is all-or-nothing.\n");
  console.error(error);
  process.exit(1);
});
