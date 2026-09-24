import { defineField, defineType } from "sanity";

/**
 * One-of-a-kind documents: the site's settings, one document per page, and the
 * closing banner the pages share.
 *
 * Every page owns its own document, hero included, so editing one page cannot
 * reach another. This replaced a single "Page copy" document holding every
 * page's headings side by side: it kept the studio short, but it meant a page
 * hero could be changed in words and never in pictures, and the answer to
 * "where do I edit the About page" was four places.
 */

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "contact", title: "Contact" },
    { name: "social", title: "Social" },
    { name: "header", title: "Header" },
    { name: "footer", title: "Footer" },
    { name: "seo", title: "Search & sharing" },
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
      description:
        "The typeset wordmark, e.g. Mahfouz. Shown in the header and the footer until a logo is uploaded.",
      validation: (rule) => rule.required(),
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
      description:
        "The logo for light backgrounds: the header once the page scrolls. SVG, or a PNG with a transparent background. Replaces the typeset wordmark in the header and the footer.",
    }),
    defineField({
      name: "logoOnDark",
      title: "Logo for dark backgrounds",
      type: "imageWithAlt",
      group: "identity",
      description:
        "Optional. A white or light version, for the header over a photograph, the footer and the mobile menu. Without one, the logo above is shown in white there.",
    }),
    defineField({
      name: "showNameWithLogo",
      title: "Show the company name beside the logo",
      type: "boolean",
      group: "identity",
      initialValue: false,
      description: "Turn on if the logo is a symbol without the name in it.",
    }),
    defineField({
      name: "favicon",
      title: "Browser tab icon",
      type: "imageWithAlt",
      group: "identity",
      description:
        "A square PNG, 512×512 or larger. Also used when the site is saved to a phone's home screen.",
    }),
    defineField({
      name: "tagline",
      type: "string",
      group: "identity",
      description: "The line under the wordmark in the footer.",
    }),
    defineField({
      name: "standards",
      title: "Standards worked to",
      type: "array",
      of: [{ type: "string" }],
      group: "identity",
      description:
        "e.g. IEC, NEC, BS, NFPA. Shown as the line under the home page hero - credentials for the people who evaluate contractors.",
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
      description: "As it is printed in the footer and on the contact page.",
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
      name: "postalAddress",
      title: "Address, for Google",
      type: "object",
      group: "contact",
      options: { collapsible: true, collapsed: true },
      description:
        "The same address split into parts, which is how search engines read it. Keep it in step with the address lines above.",
      fields: [
        { name: "streetAddress", title: "Street", type: "string" },
        { name: "locality", title: "Town or city", type: "string" },
        { name: "region", title: "Region or county", type: "string" },
        { name: "postalCode", title: "Postcode", type: "string" },
        {
          name: "countryCode",
          title: "Country code",
          type: "string",
          description: "Two letters, e.g. LR for Liberia.",
          validation: (rule) => rule.length(2),
        },
      ],
    }),
    defineField({
      name: "openingHours",
      type: "array",
      group: "contact",
      of: [{ type: "openingHours" }],
      description:
        "One entry per set of hours, e.g. Monday to Friday 06:00-18:00. Days with no entry are shown as closed. Printed on the contact page and given to Google.",
    }),
    defineField({
      name: "areaServed",
      title: "Countries served",
      type: "array",
      of: [{ type: "string" }],
      group: "contact",
      description: "The countries you work in, e.g. Liberia, Lebanon. Given to Google.",
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      group: "social",
      of: [{ type: "socialLink" }],
      description:
        "Shown in the footer and given to Google. Leave empty until the profiles exist - an empty link is worse than none.",
    }),
    defineField({
      name: "nav",
      title: "Navigation",
      type: "array",
      group: "header",
      of: [{ type: "cta" }],
      description:
        "The pages in the header, in order. The footer and the mobile menu use the same list.",
    }),
    defineField({
      name: "headerCta",
      title: "Header button",
      type: "cta",
      group: "header",
      description: "The button at the right of the header, and at the foot of the mobile menu.",
    }),
    defineField({
      name: "footerNote",
      type: "string",
      group: "footer",
      description:
        "The line at the foot of every page, e.g. Engineering, contracting and maintenance. Also the company description Google is given.",
    }),
    defineField({
      name: "footer",
      title: "Footer labels",
      type: "object",
      group: "footer",
      fields: [
        defineField({ name: "navHeading", title: "Navigation heading", type: "string" }),
        defineField({ name: "servicesHeading", title: "Services heading", type: "string" }),
        defineField({ name: "contactHeading", title: "Contact heading", type: "string" }),
        defineField({
          name: "legalLinks",
          title: "Bottom-line links",
          type: "array",
          of: [{ type: "cta" }],
          description:
            "e.g. Privacy. If this is empty the footer still links the privacy policy.",
        }),
        defineField({
          name: "copyright",
          type: "string",
          description: "Printed after the © and the year. Defaults to the company name.",
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "Search & sharing defaults",
      type: "seo",
      group: "seo",
      description:
        "Used wherever a page has not set its own: the title in search results and browser tabs, the description, and the image shown when a link is shared. Without a share image the site draws its own card.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Sections" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({ name: "hero", type: "pageHero", group: "hero" }),
    defineField({
      name: "divisionStrip",
      title: "Division strip label",
      type: "string",
      group: "hero",
      description: "The line above the five divisions along the foot of the hero.",
    }),
    defineField({
      name: "standardsLabel",
      title: "Standards label",
      type: "string",
      group: "hero",
      description:
        "The words before the standards on the hero's last line, e.g. Worked to. The standards themselves are in Site settings.",
    }),
    defineField({
      name: "aboutLinkLabel",
      title: "Who we are - link label",
      type: "string",
      group: "sections",
      description:
        "The home page shows a short version of the About page's Who we are section. This is the wording on the link through to it. Clear it to remove the link.",
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities section",
      type: "sectionIntro",
      group: "sections",
    }),
    defineField({
      name: "selectedWork",
      title: "Selected work section",
      type: "sectionIntro",
      group: "sections",
    }),
    defineField({
      name: "selectedWorkLimit",
      title: "Projects shown",
      type: "number",
      group: "sections",
      description: "How many project cards the Selected work section shows. Featured projects come first.",
      initialValue: 4,
      validation: (rule) => rule.integer().min(1).max(8),
    }),
    defineField({ name: "closingCta", type: "closingBanner", group: "sections" }),
    defineField({
      name: "seo",
      type: "seo",
      group: "seo",
      description: "Leave empty to use the defaults in Site settings.",
    }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "whoWeAre", title: "Who we are" },
    { name: "sections", title: "Other sections" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({ name: "hero", type: "pageHero", group: "hero" }),
    defineField({
      name: "whoWeAre",
      title: "Who we are",
      type: "object",
      group: "whoWeAre",
      description:
        "The first section of the About page. The home page shows a short version of it: the heading, the first paragraph, the photograph and the title block.",
      fields: [
        defineField({
          name: "label",
          title: "Margin label",
          type: "string",
          description: "The section's name in the sheet margin, e.g. Who we are.",
        }),
        defineField({
          name: "heading",
          type: "text",
          rows: 2,
          description: "The oversized statement. Keep it to one sentence.",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "body",
          type: "array",
          of: [{ type: "text", rows: 4 }],
          description: "One entry per paragraph. The home page shows the first.",
        }),
        defineField({ name: "image", title: "Photograph", type: "imageWithAlt" }),
        defineField({
          name: "details",
          title: "Title block",
          type: "array",
          of: [{ type: "detailRow" }],
          description:
            "The labelled block set over the photograph, e.g. Operating in · Liberia, Lebanon. Name things rather than count them. Two rows read best; three is the ceiling.",
          validation: (rule) => rule.max(3),
        }),
        defineField({
          name: "highlights",
          type: "array",
          of: [{ type: "highlight" }],
          description:
            "Short points set under the section on the About page. Four read best. Leave empty for none.",
          validation: (rule) => rule.max(6),
        }),
        defineField({
          name: "cta",
          title: "Link",
          type: "cta",
          description: "The link at the end of the text, e.g. See our capabilities.",
        }),
      ],
    }),
    defineField({
      name: "process",
      title: "How we work section",
      type: "sectionIntro",
      group: "sections",
      description: "The heading over the four stages. The stages themselves are under Process steps.",
    }),
    defineField({ name: "closingCta", type: "closingBanner", group: "sections" }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "About page" }) },
});

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Sections" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({
      name: "hero",
      type: "pageHero",
      group: "hero",
      description: "The divisions below it are edited under Services.",
    }),
    defineField({ name: "closingCta", type: "closingBanner", group: "sections" }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Services page" }) },
});

export const projectsPage = defineType({
  name: "projectsPage",
  title: "Projects page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "listing", title: "Listing" },
    { name: "detail", title: "Project pages" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({ name: "hero", type: "pageHero", group: "hero" }),
    defineField({
      name: "filters",
      type: "projectFilters",
      group: "listing",
      description:
        "The filter buttons themselves are the Project tags and Project categories in use on at least one project.",
    }),
    defineField({
      name: "empty",
      title: "Nothing under this filter",
      type: "sectionIntro",
      group: "listing",
    }),
    defineField({
      name: "more",
      title: "More work, on request",
      type: "sectionIntro",
      group: "listing",
      description: "The block under the grid. Its link goes to the contact page.",
    }),
    defineField({
      name: "detail",
      title: "Project page labels",
      type: "projectDetailLabels",
      group: "detail",
      description: "The headings every project's own page is built from.",
    }),
    defineField({ name: "closingCta", type: "closingBanner", group: "listing" }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Projects page" }) },
});

export const contact = defineType({
  name: "contact",
  title: "Contact page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "form", title: "Form" },
    { name: "details", title: "Beside the form" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({ name: "hero", type: "pageHero", group: "hero" }),
    defineField({ name: "form", title: "Form labels", type: "enquiryForm", group: "form" }),
    defineField({
      name: "formSubjects",
      title: "Enquiry types",
      type: "array",
      of: [{ type: "string" }],
      group: "form",
      description: "Populates the enquiry-type field. Leave empty to leave that field off the form.",
    }),
    defineField({
      name: "recipientEmail",
      type: "string",
      group: "form",
      description: "Where form submissions are delivered.",
      validation: (rule) => rule.email(),
    }),
    defineField({ name: "direct", title: "Labels", type: "contactDirect", group: "details" }),
    defineField({
      name: "details",
      title: "Extra rows",
      type: "array",
      of: [{ type: "detailRow" }],
      group: "details",
      description:
        "Rows added to the block beside the form, e.g. Response time. The address, phones, email and opening hours are not entered here - they come from Site settings, so they are kept in one place.",
    }),
    defineField({
      name: "enquiryChecklist",
      title: "What to send",
      type: "array",
      of: [{ type: "string" }],
      group: "details",
      description:
        "A short list of what makes an enquiry answerable, shown under the contact block. Four entries read best. Clear it to remove the list.",
    }),
    defineField({
      name: "map",
      type: "object",
      group: "details",
      description: "Printed under the address as coordinates. There is no embedded map, by design.",
      fields: [
        { name: "latitude", type: "number" },
        { name: "longitude", type: "number" },
        { name: "label", type: "string" },
      ],
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Contact page" }) },
});

export const notFoundPage = defineType({
  name: "notFoundPage",
  title: "404 page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      type: "pageHero",
      description:
        "What someone sees at an address that does not exist. The navigation above it is the way out, so buttons are optional.",
    }),
    defineField({ name: "closingCta", type: "closingBanner" }),
  ],
  preview: { prepare: () => ({ title: "404 page" }) },
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
      name: "heroImage",
      title: "Hero background image",
      type: "imageWithAlt",
      description: "Optional. Without one the hero is the blueprint plate.",
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

/** The banner most pages end on. A page can override any field of it. */
export const closingCta = defineType({
  name: "closingCta",
  title: "Closing banner",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "lead", type: "text", rows: 2 }),
    defineField({ name: "cta", title: "Button", type: "cta" }),
    defineField({ name: "background", type: "imageWithAlt" }),
  ],
  preview: { prepare: () => ({ title: "Closing banner" }) },
});

export const singletons = [
  siteSettings,
  homePage,
  aboutPage,
  servicesPage,
  projectsPage,
  contact,
  notFoundPage,
  privacyPolicy,
  closingCta,
];

/** Types that should exist exactly once, used to shape the studio's structure. */
export const singletonTypes: string[] = singletons.map((s) => s.name);
