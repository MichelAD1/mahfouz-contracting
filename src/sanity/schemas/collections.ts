import { defineField, defineType } from "sanity";

/**
 * Repeatable documents: services, projects and the tags and categories that
 * sort them, process steps, partners, testimonials.
 */

const orderField = defineField({
  name: "order",
  title: "Order",
  type: "number",
  description: "Lower numbers appear first.",
});

/**
 * A label a project can carry, and a button in the projects filter.
 *
 * Its own document rather than a word typed onto each project, so "Electrical"
 * is spelled one way everywhere, renaming it renames every card at once, and
 * the filter can never grow two buttons for the same thing.
 */
export const projectTag = defineType({
  name: "projectTag",
  title: "Project tag",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description:
        "As it reads on the filter button and under a project card, e.g. Electrical.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      description:
        "Used in the address of a filtered view, e.g. /projects?tag=electrical.",
      validation: (rule) => rule.required(),
    }),
    orderField,
  ],
  orderings: [
    { name: "manual", title: "Manual order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});

/**
 * The sector a project was for: commercial, industrial and so on. One per
 * project, where tags can be several - so it is a fact on the project page, and
 * a second filter row once more than one is in use.
 */
export const projectCategory = defineType({
  name: "projectCategory",
  title: "Project category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "e.g. Commercial, Industrial, Institutional.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      description:
        "Used in the address of a filtered view, e.g. /projects?category=industrial.",
      validation: (rule) => rule.required(),
    }),
    orderField,
  ],
  orderings: [
    { name: "manual", title: "Manual order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "code",
      title: "Division code",
      type: "string",
      description:
        "Two letters, e.g. EL for Electrical. Shown beside the title as real metadata.",
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "shortTitle",
      title: "Short name",
      type: "string",
      description:
        "Used on project tags and the projects filter, where the full title is too long - e.g. Maintenance for Maintenance & Facility Support. Falls back to the title.",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      type: "text",
      rows: 3,
      description: "One or two sentences. Used on the home page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fullDescription",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description:
        "One entry per paragraph, shown on the services page. Falls back to the short description when empty.",
    }),
    defineField({
      name: "features",
      type: "array",
      of: [{ type: "string" }],
      description: "Four reads best on the home page.",
    }),
    defineField({ name: "image", type: "imageWithAlt" }),
    defineField({
      name: "icon",
      type: "imageWithAlt",
      description: "Optional SVG or PNG.",
    }),
    orderField,
    defineField({ name: "seo", type: "seo" }),
  ],
  orderings: [
    { name: "manual", title: "Manual order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "code", media: "image" } },
});

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "main", title: "Project", default: true },
    { name: "media", title: "Media" },
    { name: "meta", title: "Metadata" },
    { name: "search", title: "Search & sharing" },
  ],
  fields: [
    defineField({
      name: "name",
      type: "string",
      group: "main",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "main",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      group: "main",
      description: "Shown on the project card and as the lead on its page.",
    }),
    defineField({
      name: "description",
      title: "Body",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      group: "main",
      description:
        "One entry per paragraph. Plain text, matching the About section, so no rich-text renderer is needed.",
    }),
    defineField({
      name: "scopeOfWorks",
      title: "Scope of works",
      type: "array",
      of: [{ type: "string" }],
      group: "main",
      description:
        "One entry per line of work, in the order it was carried out. Numbered automatically on the project page.",
    }),
    defineField({
      name: "tags",
      type: "array",
      group: "main",
      of: [{ type: "reference", to: [{ type: "projectTag" }] }],
      description:
        "Drive the filter on the projects page and the line under each project card, e.g. Electrical, Maintenance. New tags are created under Project tags.",
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "category",
      type: "reference",
      group: "meta",
      to: [{ type: "projectCategory" }],
      description:
        "The sector, e.g. Commercial. Shown on the project page, and offered as a filter once two or more categories are in use.",
    }),
    defineField({ name: "location", type: "string", group: "meta" }),
    defineField({
      name: "year",
      type: "string",
      group: "meta",
      description: "Year of completion, or a range such as 2023–2024.",
    }),
    defineField({ name: "client", type: "string", group: "meta" }),
    defineField({
      name: "status",
      type: "string",
      group: "meta",
      description:
        "Where the work stands, e.g. Delivered, or Delivered and under maintenance.",
    }),
    defineField({
      name: "services",
      title: "Divisions involved",
      type: "array",
      group: "meta",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      description:
        "Which of your divisions worked on it. Shown on the project page as Divisions engaged, and under the card when the project has no tags.",
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "equipment",
      title: "Equipment specified",
      type: "array",
      group: "meta",
      of: [{ type: "reference", to: [{ type: "partner" }] }],
      description:
        "The manufacturers whose equipment was specified. These are the same partner documents as the logo strip, so a brand is described once.",
    }),
    defineField({
      name: "details",
      title: "Project details",
      type: "array",
      group: "meta",
      of: [{ type: "detailRow" }],
      description:
        "Label and value pairs shown in the title block, e.g. Scope, Duration, Contract type.",
    }),
    defineField({
      name: "cover",
      title: "Cover image",
      type: "imageWithAlt",
      group: "media",
    }),
    defineField({
      name: "gallery",
      type: "array",
      group: "media",
      of: [{ type: "galleryImage" }],
      options: { layout: "grid" },
      description:
        "Photographs for the carousel on the project page, in the order they are shown - drag to reorder. Two or more get arrows, swiping and a counter.",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "main",
      description: "Featured projects lead the Selected Work section.",
      initialValue: false,
    }),
    { ...orderField, group: "main" },
    defineField({
      name: "searchVisible",
      title: "Show in search engines",
      type: "boolean",
      group: "search",
      initialValue: false,
      description:
        "Leave off until every fact on this project's page is confirmed. Turning it on lists the page in the sitemap and lets Google index it.",
    }),
    defineField({
      name: "seo",
      type: "seo",
      group: "search",
      description:
        "Leave empty to use the project's name, summary and cover image.",
    }),
  ],
  orderings: [
    {
      name: "manual",
      title: "Featured, then manual order",
      by: [
        { field: "featured", direction: "desc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      category: "category.title",
      year: "year",
      media: "cover",
    },
    prepare: ({ title, category, year, media }) => ({
      title,
      subtitle: [category, year].filter(Boolean).join(", "),
      media,
    }),
  },
});

export const process = defineType({
  name: "process",
  title: "Process step",
  type: "document",
  fields: [
    defineField({
      name: "step",
      type: "string",
      description: "Two digits, e.g. 01.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      type: "imageWithAlt",
      description:
        "Portrait crop. The four stage images step down the page, so tall images sit best.",
    }),
    orderField,
  ],
  orderings: [
    { name: "manual", title: "Manual order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "step", media: "image" } },
});

export const partner = defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      type: "imageWithAlt",
      description: "SVG preferred. Monochrome versions sit best in the strip.",
    }),
    defineField({ name: "url", type: "url" }),
    orderField,
  ],
  preview: { select: { title: "name", media: "logo" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({
      name: "quote",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "image", type: "imageWithAlt" }),
    defineField({
      name: "rating",
      type: "number",
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: "project",
      type: "reference",
      to: [{ type: "project" }],
      description: "Optional - links the quote to the work it refers to.",
    }),
    orderField,
  ],
  preview: {
    select: { title: "name", subtitle: "company", media: "image" },
  },
});

export const collections = [
  service,
  project,
  projectTag,
  projectCategory,
  process,
  partner,
  testimonial,
];
