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

const METRIC = groq`{ figure, label, note, countTo, prefix, suffix }`;

const CTA = groq`{ label, href }`;

/** A division, dereferenced from the service it points at. */
const DIVISION = groq`{ _id, title, "slug": slug.current }`;

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
  "settings": *[_type == "siteSettings"][0]{
    companyName, shortName, descriptor, tagline,
    phones[]{ label, number },
    emails,
    address{ lines },
    socials[]{ platform, url },
    nav[]{ label, href },
    footerNote
  },
  "hero": *[_type == "hero"][0]{
    headingLines, lead,
    "primaryCta": primaryCta${CTA},
    "secondaryCta": secondaryCta${CTA},
    "background": background${IMAGE},
    "metrics": metrics[]${METRIC}
  },
  "about": *[_type == "about"][0]{
    sheet, statement, body,
    "cta": cta${CTA},
    "images": images[]${IMAGE},
    "metrics": metrics[]${METRIC}
  },
  "services": *[_type == "service"]|order(order asc){
    _id, title, code, "slug": slug.current, shortDescription, features,
    "image": image${IMAGE}
  },
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
