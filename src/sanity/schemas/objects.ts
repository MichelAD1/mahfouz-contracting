import { defineField, defineType } from "sanity";

/**
 * Shared objects. Sections reuse these so new content can be added without
 * schema changes.
 */

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

export const cta = defineType({
  name: "cta",
  title: "Call to action",
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
      description: "A path such as /contact, or an anchor such as #contact.",
      validation: (rule) => rule.required(),
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
      description: "1200×630 or larger.",
    }),
  ],
});

export const objects = [imageWithAlt, cta, detailRow, seo];
