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
  "projects": *[_type == "project"]|order(featured desc, order asc){
    _id, name, "slug": slug.current, category, location, year, client, summary, featured,
    "cover": cover${IMAGE},
    "details": details[]{ label, value }
  },
  "process": *[_type == "process"]|order(order asc){ _id, step, title, description },
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

export const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0]{
  _id, name, "slug": slug.current, category, location, year, client, summary, featured,
  "cover": cover${IMAGE},
  "gallery": gallery[]${IMAGE},
  "details": details[]{ label, value },
  "related": *[_type == "project" && slug.current != $slug]|order(featured desc, order asc)[0..2]{
    _id, name, "slug": slug.current, category, year,
    "cover": cover${IMAGE}
  }
}`;
