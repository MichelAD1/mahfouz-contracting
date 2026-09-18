import { defineField, defineType } from "sanity";

/** Repeatable documents: services, projects, process steps, partners, testimonials. */

const orderField = defineField({
  name: "order",
  title: "Order",
  type: "number",
  description: "Lower numbers appear first.",
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
        "Used on project tags and the projects filter, where the full title is too long — e.g. Maintenance for Maintenance & Facility Support. Falls back to the title.",
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
      name: "category",
      type: "string",
      group: "meta",
      options: {
        list: [
          "Commercial",
          "Industrial",
          "Institutional",
          "Residential",
          "Infrastructure",
        ],
      },
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
        "Drives the tags on each project card and the filter on the projects index. A project with no divisions cannot be filtered to.",
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
      of: [{ type: "imageWithAlt" }],
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "main",
      description: "Featured projects lead the Selected Work section.",
      initialValue: false,
    }),
    { ...orderField, group: "main" },
    defineField({ name: "seo", type: "seo", group: "main" }),
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
    select: { title: "name", category: "category", year: "year", media: "cover" },
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
      description: "Optional — links the quote to the work it refers to.",
    }),
    orderField,
  ],
  preview: {
    select: { title: "name", subtitle: "company", media: "image" },
  },
});

export const collections = [service, project, process, partner, testimonial];
