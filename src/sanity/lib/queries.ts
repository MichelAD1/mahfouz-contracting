import { groq } from "next-sanity";

/**
 * Image projection: resolves the asset once so the UI never has to know about
 * Sanity refs. `slotHint` lets an editor describe the photograph a slot wants
 * before the photograph exists.
 *
 * The asset id, the crop and the hotspot travel with it, because without them
 * the studio's crop tool and focal point were decoration: set in the editor,
 * ignored by the site.
 */
const IMAGE_FIELDS = `
  "url": asset->url,
  "assetId": asset._ref,
  "lqip": asset->metadata.lqip,
  "aspectRatio": asset->metadata.dimensions.aspectRatio,
  alt,
  slotHint,
  "crop": crop{ top, bottom, left, right },
  "hotspot": hotspot{ x, y, width, height }
`;

const IMAGE = groq`{${IMAGE_FIELDS}}`;

const GALLERY_IMAGE = groq`{${IMAGE_FIELDS}, caption}`;

const CTA = groq`{ label, href }`;

const BUTTON = groq`{ label, href, style }`;

const SEO = groq`{ title, description, "image": image${IMAGE} }`;

const SECTION_INTRO = groq`{ label, heading, lead, linkLabel }`;

const PAGE_HERO = groq`{
  heading, lead,
  "image": image${IMAGE},
  "buttons": buttons[]${BUTTON}
}`;

/** The shared closing banner, and a page's override of it - same shape. */
const CLOSING_BANNER = groq`{
  heading, lead,
  "cta": cta${CTA},
  "background": background${IMAGE}
}`;

/** A tag or a category: a label, and a slug to filter on. */
const TERM = groq`{ _id, title, "slug": slug.current }`;

/**
 * A division, dereferenced from the service it points at.
 *
 * `shortTitle` wins here and only here: a project page lists "Maintenance"
 * where the division's own section is headed "Maintenance & Facility Support".
 */
const DIVISION = groq`{ _id, "title": coalesce(shortTitle, title), "slug": slug.current }`;

/** Site-wide settings. Shared by every query that renders the frame. */
const SETTINGS = groq`{
  companyName, shortName, descriptor, tagline,
  "logo": logo${IMAGE},
  "logoOnDark": logoOnDark${IMAGE},
  showNameWithLogo,
  "favicon": favicon${IMAGE},
  phones[]{ label, number },
  emails,
  address{ lines },
  postalAddress{ streetAddress, locality, region, postalCode, countryCode },
  openingHours[]{ days, opens, closes },
  areaServed,
  socials[]{ platform, url },
  "nav": nav[]${CTA},
  "headerCta": headerCta${CTA},
  standards,
  footerNote,
  footer{
    navHeading, servicesHeading, contactHeading, copyright,
    "legalLinks": legalLinks[]${CTA}
  },
  "seo": seo${SEO}
}`;

const SERVICE = groq`{
  _id, title, shortTitle, code, "slug": slug.current, shortDescription, fullDescription, features,
  "image": image${IMAGE}
}`;

/**
 * Everything a project card needs and nothing else. Shared by the home page
 * section and the projects index so the two cannot drift, and so a listing
 * never drags galleries and body copy across the wire to render a thumbnail.
 */
const PROJECT_CARD = groq`{
  _id, name, "slug": slug.current, city, country, location, year, status, summary, featured,
  "category": category->${TERM},
  "cover": cover${IMAGE},
  "tags": tags[]->${TERM},
  "divisions": services[]->${DIVISION}
}`;

/** Projects in the order the site shows them: featured first, then by hand. */
const PROJECTS = groq`*[_type == "project" && defined(slug.current)]|order(featured desc, order asc)`;

const WHO_WE_ARE = groq`{
  label, heading, body,
  "image": image${IMAGE},
  "details": details[]{ label, value },
  "highlights": highlights[]{ title, text },
  "cta": cta${CTA}
}`;

const CLOSING_CTA = groq`*[_type == "closingCta"][0]${CLOSING_BANNER}`;

/**
 * Everything the shared header and footer need, and nothing a page owns.
 *
 * The layout renders on every route, so this is the one query that runs on all
 * of them. Keeping it apart from the page queries means an inner page pulls the
 * navigation and the footer without also pulling the home page's hero.
 */
export const SITE_FRAME_QUERY = groq`{
  "settings": *[_type == "siteSettings"][0]${SETTINGS},
  "services": *[_type == "service" && defined(slug.current)]|order(order asc){ _id, title, "slug": slug.current }
}`;

/**
 * The whole home page in a single round trip. Sections are server components
 * so there is no client-side fetching and no request waterfall.
 *
 * The Who we are block is read from the About page's document: the home page
 * carries the short version of it, so the two can never say different things.
 */
export const HOME_QUERY = groq`{
  "page": *[_type == "homePage"][0]{
    "hero": hero${PAGE_HERO},
    divisionStrip, standardsLabel, aboutLinkLabel,
    "capabilities": capabilities${SECTION_INTRO},
    "selectedWork": selectedWork${SECTION_INTRO},
    selectedWorkLimit,
    "closingCta": closingCta${CLOSING_BANNER},
    "seo": seo${SEO}
  },
  "about": *[_type == "aboutPage"][0]{ "whoWeAre": whoWeAre${WHO_WE_ARE} },
  "services": *[_type == "service" && defined(slug.current)]|order(order asc)${SERVICE},
  "projects": ${PROJECTS}${PROJECT_CARD},
  "partners": *[_type == "partner"]|order(order asc){ _id, name, url, "logo": logo${IMAGE} },
  "closingCta": ${CLOSING_CTA}
}`;

export const ABOUT_PAGE_QUERY = groq`{
  "page": *[_type == "aboutPage"][0]{
    "hero": hero${PAGE_HERO},
    "whoWeAre": whoWeAre${WHO_WE_ARE},
    "process": process${SECTION_INTRO},
    "closingCta": closingCta${CLOSING_BANNER},
    "seo": seo${SEO}
  },
  "process": *[_type == "process"]|order(order asc){
    _id, step, title, description,
    "image": image${IMAGE}
  },
  "closingCta": ${CLOSING_CTA}
}`;

export const SERVICES_PAGE_QUERY = groq`{
  "page": *[_type == "servicesPage"][0]{
    "hero": hero${PAGE_HERO},
    "closingCta": closingCta${CLOSING_BANNER},
    "seo": seo${SEO}
  },
  "services": *[_type == "service" && defined(slug.current)]|order(order asc)${SERVICE},
  "closingCta": ${CLOSING_CTA}
}`;

/**
 * The projects index, and the labels every project page shares.
 *
 * Every tag and category comes back in the studio's order; the filter shows the
 * ones at least one project carries, so a tag nobody uses yet is not a button
 * that empties the grid.
 */
export const PROJECTS_PAGE_QUERY = groq`{
  "page": *[_type == "projectsPage"][0]{
    "hero": hero${PAGE_HERO},
    filters{ allLabel, categoriesLabel, projectSingular, projectPlural },
    "empty": empty${SECTION_INTRO},
    "more": more${SECTION_INTRO},
    detail{
      overview, scope, equipment, gallery, nextProject, allProjects,
      category, location, site, tags, divisions, status, year, client
    },
    "closingCta": closingCta${CLOSING_BANNER},
    "seo": seo${SEO}
  },
  "projects": ${PROJECTS}${PROJECT_CARD},
  "tags": *[_type == "projectTag" && defined(slug.current)]|order(order asc, title asc)${TERM},
  "categories": *[_type == "projectCategory" && defined(slug.current)]|order(order asc, title asc)${TERM},
  "closingCta": ${CLOSING_CTA}
}`;

export const PROJECT_SLUGS_QUERY = groq`*[_type == "project" && defined(slug.current)].slug.current`;

/** Only the project pages the studio has cleared for search. */
export const SITEMAP_PROJECTS_QUERY = groq`*[_type == "project" && searchVisible == true && defined(slug.current)]{
  "slug": slug.current, _updatedAt
}`;

export const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0]{
  _id, name, "slug": slug.current, city, country, location, year, client, status, summary, featured, searchVisible,
  "category": category->${TERM},
  "cover": cover${IMAGE},
  "gallery": gallery[]${GALLERY_IMAGE},
  "details": details[]{ label, value },
  "tags": tags[]->${TERM},
  "divisions": services[]->${DIVISION},
  description,
  scopeOfWorks,
  "equipment": equipment[]->{ _id, name },
  "seo": seo${SEO}
}`;

export const CONTACT_QUERY = groq`*[_type == "contact"][0]{
  "hero": hero${PAGE_HERO},
  form{
    nameLabel, companyLabel, emailLabel, phoneLabel,
    subjectLabel, subjectPlaceholder, messageLabel,
    submitLabel, submittingLabel, successLead
  },
  formSubjects,
  recipientEmail,
  direct{
    formLabel, heading, officeLabel, emailLabel,
    hoursLabel, closedLabel, checklistLabel
  },
  "details": details[]{ label, value },
  enquiryChecklist,
  map{ latitude, longitude, label },
  "seo": seo${SEO}
}`;

export const NOT_FOUND_QUERY = groq`{
  "page": *[_type == "notFoundPage"][0]{
    "hero": hero${PAGE_HERO},
    "closingCta": closingCta${CLOSING_BANNER}
  },
  "closingCta": ${CLOSING_CTA}
}`;

export const PRIVACY_POLICY_QUERY = groq`*[_type == "privacyPolicy"][0]{
  heading, updated, intro,
  "heroImage": heroImage${IMAGE},
  sections[]{ heading, body },
  "seo": seo${SEO}
}`;
