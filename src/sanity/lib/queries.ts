import { groq } from "next-sanity";

/**
 * Image projection: resolves the asset once so the UI never has to know about
 * Sanity refs. `slotHint` lets an editor describe the photograph a slot wants
 * before the photograph exists.
 */
const IMAGE = groq`{
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "aspectRatio": asset->metadata.dimensions.aspectRatio,
  "alt": coalesce(alt, ""),
  slotHint
}`;

const CTA = groq`{ label, href }`;

/**
 * A division, dereferenced from the service it points at.
 *
 * `shortTitle` wins here and only here: a project tag reads "Maintenance"
 * where the division's own page is headed "Maintenance & Facility Support".
 */
const DIVISION = groq`{ _id, "title": coalesce(shortTitle, title), "slug": slug.current }`;

/** Site-wide settings. Shared by the home query and the layout frame. */
const SETTINGS = groq`{
  companyName, shortName, descriptor, tagline,
  phones[]{ label, number },
  emails,
  address{ lines },
  socials[]{ platform, url },
  nav[]{ label, href },
  standards,
  footerNote
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
  _id, name, "slug": slug.current, category, location, year, status, summary, featured,
  "cover": cover${IMAGE},
  "divisions": services[]->${DIVISION}
}`;

/**
 * The whole home page in a single round trip. Sections are server components
 * so there is no client-side fetching and no request waterfall.
 */
export const HOME_QUERY = groq`{
  "settings": *[_type == "siteSettings"][0]${SETTINGS},
  "hero": *[_type == "hero"][0]{
    headingLines, lead,
    "primaryCta": primaryCta${CTA},
    "secondaryCta": secondaryCta${CTA},
    "background": background${IMAGE}
  },
  "about": *[_type == "about"][0]{
    sheet, statement, body,
    "cta": cta${CTA},
    "images": images[]${IMAGE},
    "details": details[]{ label, value }
  },
  "services": *[_type == "service"]|order(order asc)${SERVICE},
  "projects": *[_type == "project"]|order(featured desc, order asc)${PROJECT_CARD},
  "process": *[_type == "process"]|order(order asc){
    _id, step, title, description,
    "image": image${IMAGE}
  },
  "partners": *[_type == "partner"]|order(order asc){
    _id, name, url, "logo": logo${IMAGE}
  },
  "closingCta": *[_type == "closingCta"][0]{
    heading, lead,
    "cta": cta${CTA},
    "background": background${IMAGE}
  }
}`;

/**
 * Everything the shared header and footer need, and nothing a page owns.
 *
 * The layout renders on every route, so this is the one query that runs on all
 * of them. Keeping it separate from HOME_QUERY means an inner page pulls the
 * navigation and the footer without also pulling the home page's hero.
 */
export const SITE_FRAME_QUERY = groq`{
  "settings": *[_type == "siteSettings"][0]${SETTINGS},
  "services": *[_type == "service"]|order(order asc){ _id, title, "slug": slug.current }
}`;

export const SERVICES_QUERY = groq`*[_type == "service"]|order(order asc)${SERVICE}`;

export const PROCESS_QUERY = groq`*[_type == "process"]|order(order asc){
  _id, step, title, description,
  "image": image${IMAGE}
}`;

/** The closing banner, which every page ends on. */
export const CLOSING_CTA_QUERY = groq`*[_type == "closingCta"][0]{
  heading, lead,
  "cta": cta${CTA},
  "background": background${IMAGE}
}`;

export const ABOUT_QUERY = groq`*[_type == "about"][0]{
  sheet, statement, body,
  "cta": cta${CTA},
  "images": images[]${IMAGE},
  "details": details[]{ label, value }
}`;

export const PROJECT_SLUGS_QUERY = groq`*[_type == "project" && defined(slug.current)].slug.current`;

/** The projects index. Same shape as the home section, unfiltered and unlimited. */
export const PROJECTS_QUERY = groq`*[_type == "project"]|order(featured desc, order asc)${PROJECT_CARD}`;

export const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0]{
  _id, name, "slug": slug.current, category, location, year, client, status, summary, featured,
  "cover": cover${IMAGE},
  "gallery": gallery[]${IMAGE},
  "details": details[]{ label, value },
  "divisions": services[]->${DIVISION},
  "description": description[],
  scopeOfWorks,
  "equipment": equipment[]->{ _id, name },
  "related": *[_type == "project" && slug.current != $slug]|order(featured desc, order asc)[0..2]${PROJECT_CARD}
}`;

export const CONTACT_QUERY = groq`*[_type == "contact"][0]{
  heading, description,
  "details": details[]{ label, value },
  formSubjects, recipientEmail,
  map{ latitude, longitude, label }
}`;
