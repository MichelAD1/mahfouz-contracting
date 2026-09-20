import { defineField, defineType } from "sanity";

/** One-of-a-kind documents: site-wide settings and the home page sections. */

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "contact", title: "Contact" },
    { name: "navigation", title: "Navigation" },
  ],
  fields: [
    defineField({
      name: "companyName",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortName",
      type: "string",
      group: "identity",
      description: "Used in the header wordmark, e.g. Mahfouz.",
    }),
    defineField({
      name: "descriptor",
      type: "string",
      group: "identity",
      description: "Sits beside the wordmark, e.g. Contracting.",
    }),
    defineField({
      name: "logo",
      type: "imageWithAlt",
      group: "identity",
      description: "Optional. The wordmark is used when no logo is uploaded.",
    }),
    defineField({ name: "tagline", type: "string", group: "identity" }),
    defineField({
      name: "standards",
      title: "Standards worked to",
      type: "array",
      of: [{ type: "string" }],
      group: "identity",
      description:
        "e.g. IEC, NEC, BS, NFPA. Shown as the line under the home page hero — credentials for the people who evaluate contractors.",
    }),
    defineField({
      name: "phones",
      type: "array",
      group: "contact",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "number", type: "string", title: "Number" },
          ],
          preview: { select: { title: "number", subtitle: "label" } },
        },
      ],
    }),
    defineField({
      name: "emails",
      type: "array",
      group: "contact",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "address",
      type: "object",
      group: "contact",
      fields: [
        {
          name: "lines",
          type: "array",
          title: "Address lines",
          of: [{ type: "string" }],
        },
      ],
    }),
    defineField({
      name: "socials",
      type: "array",
      group: "contact",
      of: [
        {
          type: "object",
          fields: [
            { name: "platform", type: "string" },
            { name: "url", type: "url" },
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        },
      ],
    }),
    defineField({
      name: "nav",
      title: "Header navigation",
      type: "array",
      group: "navigation",
      of: [{ type: "cta" }],
    }),
    defineField({
      name: "footerNote",
      type: "string",
      group: "navigation",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const hero = defineType({
  name: "hero",
  title: "Home — hero",
  type: "document",
  fields: [
    defineField({
      name: "headingLines",
      title: "Heading",
      type: "array",
      of: [{ type: "string" }],
      description:
        "One entry per line. Line breaks are deliberate at this size — do not rely on wrapping.",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "lead", type: "text", rows: 3 }),
    defineField({ name: "primaryCta", type: "cta" }),
    defineField({ name: "secondaryCta", type: "cta" }),
    defineField({
      name: "background",
      title: "Background image",
      type: "imageWithAlt",
    }),
  ],
  preview: { prepare: () => ({ title: "Home — hero" }) },
});

export const about = defineType({
  name: "about",
  title: "Home — about",
  type: "document",
  fields: [
    defineField({
      name: "sheet",
      title: "Sheet label",
      type: "string",
      description: "Shown in the left margin column, e.g. About.",
    }),
    defineField({
      name: "statement",
      type: "text",
      rows: 2,
      description: "The oversized line. Keep it to one sentence.",
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "One entry per paragraph.",
    }),
    defineField({ name: "cta", type: "cta" }),
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: "details",
      title: "Title block",
      type: "array",
      of: [{ type: "detailRow" }],
      description:
        "The labelled block set over the photograph, e.g. Operating in · Liberia, Lebanon. Name things rather than count them. Two rows read best; three is the ceiling.",
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: { prepare: () => ({ title: "Home — about" }) },
});

export const closingCta = defineType({
  name: "closingCta",
  title: "Home — closing banner",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "lead", type: "text", rows: 2 }),
    defineField({ name: "cta", type: "cta" }),
    defineField({ name: "background", type: "imageWithAlt" }),
  ],
  preview: { prepare: () => ({ title: "Home — closing banner" }) },
});

export const contact = defineType({
  name: "contact",
  title: "Contact",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "details",
      type: "array",
      of: [{ type: "detailRow" }],
      description:
        "Extra rows in the block beside the form, e.g. Hours, Response time. The address, the phones and the email are not entered here — they come from Site settings, so they are kept in one place and cannot disagree.",
    }),
    defineField({
      name: "enquiryChecklist",
      title: "What to send",
      type: "array",
      of: [{ type: "string" }],
      description:
        "A short list of what makes an enquiry answerable, shown under the contact block. Four entries reads best. Clear it to remove the list.",
    }),
    defineField({
      name: "formSubjects",
      title: "Enquiry types",
      type: "array",
      of: [{ type: "string" }],
      description: "Populates the subject field on the contact form.",
    }),
    defineField({
      name: "recipientEmail",
      type: "string",
      description: "Where form submissions are delivered.",
    }),
    defineField({
      name: "map",
      type: "object",
      fields: [
        { name: "latitude", type: "number" },
        { name: "longitude", type: "number" },
        { name: "label", type: "string" },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Contact" }) },
});

/**
 * Everything that used to be typed into a component.
 *
 * One document rather than a heading field scattered across each section's own
 * record: an editor changing the wording of the site is doing one job, and
 * five more singletons would make the studio read like a filing cabinet.
 */
export const sectionCopy = defineType({
  name: "sectionCopy",
  title: "Page copy",
  type: "document",
  groups: [
    { name: "home", title: "Home page", default: true },
    { name: "pages", title: "Inner pages" },
    { name: "contact", title: "Contact page" },
    { name: "search", title: "Search & sharing" },
  ],
  fields: [
    defineField({
      name: "divisionStrip",
      title: "Division strip label",
      type: "string",
      group: "home",
      description: "The line above the five divisions under the home hero.",
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities section",
      type: "sectionIntro",
      group: "home",
    }),
    defineField({
      name: "selectedWork",
      title: "Selected work section",
      type: "sectionIntro",
      group: "home",
    }),
    defineField({
      name: "aboutHero",
      title: "About — page hero",
      type: "sectionIntro",
      group: "pages",
    }),
    defineField({
      name: "aboutProcess",
      title: "About — how we work",
      type: "sectionIntro",
      group: "pages",
    }),
    defineField({
      name: "servicesHero",
      title: "Services — page hero",
      type: "sectionIntro",
      group: "pages",
    }),
    defineField({
      name: "projectsHero",
      title: "Projects — page hero",
      type: "sectionIntro",
      group: "pages",
    }),
    defineField({
      name: "projectsMore",
      title: "Projects — more work",
      type: "sectionIntro",
      group: "pages",
    }),
    defineField({
      name: "projectsEmpty",
      title: "Projects — nothing under this filter",
      type: "sectionIntro",
      group: "pages",
    }),
    defineField({
      name: "projectsAllFilter",
      title: "Projects — unfiltered label",
      type: "string",
      group: "pages",
      description: "The first filter button, which shows every project.",
    }),
    defineField({ name: "enquiryForm", type: "enquiryForm", group: "contact" }),
    defineField({ name: "contactDirect", type: "contactDirect", group: "contact" }),
    defineField({
      name: "homeSeo",
      title: "Home page, and the site-wide default",
      type: "seo",
      group: "search",
      description:
        "Used for the home page, and wherever a page below has not set its own.",
    }),
    defineField({ name: "aboutSeo", title: "About", type: "seo", group: "search" }),
    defineField({
      name: "servicesSeo",
      title: "Services",
      type: "seo",
      group: "search",
    }),
    defineField({
      name: "projectsSeo",
      title: "Projects",
      type: "seo",
      group: "search",
    }),
    defineField({ name: "contactSeo", title: "Contact", type: "seo", group: "search" }),
  ],
  preview: { prepare: () => ({ title: "Page copy" }) },
});

/**
 * The privacy policy, in the CMS rather than in the page.
 *
 * It is rarely edited and it is the one thing on this site most likely to be
 * replaced wholesale by somebody else's lawyer. That is exactly the case for
 * making it editable: the replacement should not need a developer.
 */
export const privacyPolicy = defineType({
  name: "privacyPolicy",
  title: "Privacy policy",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updated",
      title: "Last updated",
      type: "date",
      description:
        "Shown in the sheet margin. Change it whenever the wording below changes.",
    }),
    defineField({
      name: "intro",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description:
        "One entry per paragraph. The first is used as the lead under the page heading.",
    }),
    defineField({
      name: "sections",
      type: "array",
      of: [{ type: "policySection" }],
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Privacy policy" }) },
});

export const singletons = [
  siteSettings,
  sectionCopy,
  hero,
  about,
  closingCta,
  contact,
  privacyPolicy,
];

/** Types that should exist exactly once, used to shape the studio's structure. */
export const singletonTypes: string[] = singletons.map((s) => s.name);
