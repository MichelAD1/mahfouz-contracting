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
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "officeLabel", title: "Office label", type: "string" }),
    defineField({ name: "emailLabel", title: "Email label", type: "string" }),
  ],
});

export const objects = [
  imageWithAlt,
  cta,
  detailRow,
  seo,
  sectionIntro,
  enquiryForm,
  contactDirect,
];
