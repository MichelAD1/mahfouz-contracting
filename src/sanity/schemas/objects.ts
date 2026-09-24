import { defineField, defineType } from "sanity";
import { WEEKDAYS } from "../../lib/hours";
import { SOCIAL_PLATFORMS } from "../../lib/social";

/**
 * Shared objects. Sections reuse these so new content can be added without
 * schema changes.
 */

/**
 * Where a link may point. Anything else is almost always a typo - a missing
 * slash turns `/contact` into a path relative to whatever page it sits on.
 */
const LINK_PATTERN = /^(\/|#|https?:\/\/|mailto:|tel:)/;

const linkValidation = (value: unknown) =>
  typeof value !== "string" || LINK_PATTERN.test(value)
    ? true
    : "Start with /, #, https://, mailto: or tel:";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description:
        "What the photograph shows, for screen readers and search. Leave empty only if the image is purely decorative.",
    }),
    defineField({
      name: "slotHint",
      title: "Wanted photograph",
      type: "string",
      description:
        "Describes the shot this slot needs. Shown as a labelled placeholder on the site until an image is uploaded.",
    }),
  ],
});

/**
 * A photograph in a project's gallery. The same as any other image, plus the
 * line printed under it in the carousel.
 */
export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description:
        "What the photograph shows, for screen readers and search, e.g. Distribution board after re-termination.",
    }),
    defineField({
      name: "caption",
      type: "string",
      description: "Optional. Printed under the photograph in the gallery.",
    }),
  ],
  preview: { select: { title: "caption", subtitle: "alt", media: "asset" } },
});

export const cta = defineType({
  name: "cta",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description:
        "A path such as /contact, an anchor such as #contact, or a full address starting https://.",
      validation: (rule) => rule.required().custom(linkValidation),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

/** A call to action drawn as a button, in one of the site's two styles. */
export const button = defineType({
  name: "button",
  title: "Button",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description:
        "A path such as /contact, a full address starting https://, or mailto: / tel: for an email or a call.",
      validation: (rule) => rule.required().custom(linkValidation),
    }),
    defineField({
      name: "style",
      type: "string",
      options: {
        list: [
          { title: "Solid", value: "solid" },
          { title: "Outline", value: "outline" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "solid",
      description: "Solid for the main action, outline for a second one beside it.",
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

/**
 * The plate a page opens on. Every page has its own, so changing the About
 * hero cannot touch the Services one.
 */
export const pageHero = defineType({
  name: "pageHero",
  title: "Page hero",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      type: "text",
      rows: 3,
      description:
        "Press Enter where a line should break. Without line breaks it wraps on its own.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lead",
      title: "Description",
      type: "text",
      rows: 3,
      description: "The paragraph under the heading. Optional.",
    }),
    defineField({
      name: "image",
      title: "Background image",
      type: "imageWithAlt",
      description:
        "A wide photograph, shown under a dark wash so the heading stays readable. Without one the hero is the blueprint plate. Set the hotspot on what must stay in frame.",
    }),
    defineField({
      name: "buttons",
      type: "array",
      of: [{ type: "button" }],
      description: "Up to two. Leave empty for none.",
      validation: (rule) => rule.max(2),
    }),
  ],
});

export const detailRow = defineType({
  name: "detailRow",
  title: "Detail",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "label", subtitle: "value" } },
});

/** One short point under the Who we are section. */
export const highlight = defineType({
  name: "highlight",
  title: "Highlight",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "text", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "title", subtitle: "text" } },
});

export const seo = defineType({
  name: "seo",
  title: "Search & sharing",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      validation: (rule) => rule.max(60).warning("Keep under 60 characters."),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160).warning("Keep under 160 characters."),
    }),
    defineField({
      name: "image",
      title: "Share image",
      type: "imageWithAlt",
      description:
        "Shown when a link is shared. 1200×630 or larger - it is cropped to that shape around the hotspot.",
    }),
  ],
});

export const sectionIntro = defineType({
  name: "sectionIntro",
  title: "Section",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "label",
      title: "Margin label",
      type: "string",
      description:
        "The small label in the sheet's left margin, e.g. Capabilities. Not every section has one.",
    }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "lead", type: "text", rows: 3 }),
    defineField({
      name: "linkLabel",
      title: "Link label",
      type: "string",
      description:
        "The wording on the link out of this section, e.g. All projects. Clear it to remove the link; where it goes is set in code.",
    }),
  ],
  preview: { select: { title: "heading", subtitle: "label" } },
});

/**
 * A page's own version of the closing banner. Every field is optional and
 * replaces only itself, so a page can change the heading and keep the rest.
 */
export const closingBanner = defineType({
  name: "closingBanner",
  title: "Closing banner",
  type: "object",
  options: { collapsible: true, collapsed: true },
  description:
    "Leave empty to use the site-wide closing banner. A field filled in here replaces that field on this page only.",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "lead", type: "text", rows: 2 }),
    defineField({ name: "cta", title: "Button", type: "cta" }),
    defineField({ name: "background", type: "imageWithAlt" }),
  ],
});

export const openingHours = defineType({
  name: "openingHours",
  title: "Opening hours",
  type: "object",
  fields: [
    defineField({
      name: "days",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: WEEKDAYS.map((day) => ({ title: day, value: day })),
        layout: "grid",
      },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "opens",
      type: "string",
      description: "24-hour time, e.g. 06:00.",
      validation: (rule) =>
        rule.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "24-hour time" }),
    }),
    defineField({
      name: "closes",
      type: "string",
      description: "24-hour time, e.g. 18:00.",
      validation: (rule) =>
        rule.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "24-hour time" }),
    }),
  ],
  preview: {
    select: { days: "days", opens: "opens", closes: "closes" },
    prepare: ({ days, opens, closes }) => ({
      title: Array.isArray(days) && days.length > 0 ? days.join(", ") : "No days selected",
      subtitle: `${opens ?? "--:--"} to ${closes ?? "--:--"}`,
    }),
  },
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Social link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      type: "string",
      options: { list: SOCIAL_PLATFORMS.map(({ title, value }) => ({ title, value })) },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Address",
      type: "url",
      description: "The full address of the profile, starting https://.",
      validation: (rule) => rule.required().uri({ scheme: ["https", "http"] }),
    }),
  ],
  preview: { select: { title: "platform", subtitle: "url" } },
});

export const enquiryForm = defineType({
  name: "enquiryForm",
  title: "Enquiry form",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "nameLabel", title: "Name", type: "string" }),
    defineField({ name: "companyLabel", title: "Company", type: "string" }),
    defineField({ name: "emailLabel", title: "Email", type: "string" }),
    defineField({ name: "phoneLabel", title: "Phone", type: "string" }),
    defineField({ name: "subjectLabel", title: "Enquiry type", type: "string" }),
    defineField({
      name: "subjectPlaceholder",
      title: "Enquiry type placeholder",
      type: "string",
      description: "The unselected option, e.g. Select one.",
    }),
    defineField({ name: "messageLabel", title: "Message", type: "string" }),
    defineField({ name: "submitLabel", title: "Submit button", type: "string" }),
    defineField({
      name: "submittingLabel",
      title: "Submit button, while sending",
      type: "string",
    }),
    defineField({
      name: "successLead",
      title: "After a successful send",
      type: "text",
      rows: 3,
      description:
        "The line under the thank-you. What the visitor is told went wrong is written in code, because some of it reports a fault rather than a message.",
    }),
  ],
});

export const contactDirect = defineType({
  name: "contactDirect",
  title: "Beside the form",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "formLabel",
      title: "Margin label",
      type: "string",
      description: "The small label in the sheet margin beside the form.",
    }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "officeLabel", title: "Office label", type: "string" }),
    defineField({ name: "emailLabel", title: "Email label", type: "string" }),
    defineField({
      name: "hoursLabel",
      title: "Hours label",
      type: "string",
      description: "The row that prints the opening hours from Site settings.",
    }),
    defineField({
      name: "closedLabel",
      title: "Closed",
      type: "string",
      description: "The word for a day with no hours, e.g. closed.",
    }),
    defineField({
      name: "checklistLabel",
      title: "What-to-send heading",
      type: "string",
    }),
  ],
});

/** The projects index's own wording. */
export const projectFilters = defineType({
  name: "projectFilters",
  title: "Filters",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "allLabel",
      title: "Unfiltered button",
      type: "string",
      description: "The first filter button, which shows every project, e.g. All work.",
    }),
    defineField({
      name: "categoriesLabel",
      title: "Category row label",
      type: "string",
      description:
        "Printed before the category buttons, e.g. Sector. That row only appears once two or more categories are in use.",
    }),
    defineField({
      name: "projectSingular",
      title: "Count, one",
      type: "string",
      description: "The word after the count when there is one project, e.g. project.",
    }),
    defineField({
      name: "projectPlural",
      title: "Count, several",
      type: "string",
      description: "The word after the count otherwise, e.g. projects.",
    }),
  ],
});

/** The headings and labels a project's own page is built from. */
export const projectDetailLabels = defineType({
  name: "projectDetailLabels",
  title: "Project page labels",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "overview", title: "Overview heading", type: "string" }),
    defineField({ name: "scope", title: "Scope of works heading", type: "string" }),
    defineField({ name: "equipment", title: "Equipment heading", type: "string" }),
    defineField({ name: "gallery", title: "Gallery heading", type: "string" }),
    defineField({ name: "nextProject", title: "Next project label", type: "string" }),
    defineField({ name: "allProjects", title: "All projects link", type: "string" }),
    defineField({ name: "category", title: "Category fact", type: "string" }),
    defineField({
      name: "location",
      title: "Location fact",
      type: "string",
      description: "The fact that prints the city and the country.",
    }),
    defineField({
      name: "site",
      title: "Site fact",
      type: "string",
      description: "The fact that prints the site or district, when a project has one.",
    }),
    defineField({ name: "tags", title: "Tags fact", type: "string" }),
    defineField({ name: "divisions", title: "Divisions fact", type: "string" }),
    defineField({ name: "status", title: "Status fact", type: "string" }),
    defineField({ name: "year", title: "Year fact", type: "string" }),
    defineField({ name: "client", title: "Client fact", type: "string" }),
  ],
});

export const policySection = defineType({
  name: "policySection",
  title: "Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "One entry per paragraph.",
    }),
  ],
  preview: { select: { title: "heading" } },
});

export const objects = [
  imageWithAlt,
  galleryImage,
  cta,
  button,
  pageHero,
  detailRow,
  highlight,
  seo,
  sectionIntro,
  closingBanner,
  openingHours,
  socialLink,
  enquiryForm,
  contactDirect,
  projectFilters,
  projectDetailLabels,
  policySection,
];
