import type { NavService, SiteSettings } from "@/sanity/lib/types";
import { absoluteUrl, siteUrl } from "./site";

/**
 * The business, described to search engines.
 *
 * `GeneralContractor` is a `LocalBusiness` subtype, which is the point: for a
 * contractor with a physical address and a service area, the local result is
 * worth more than any on-page work, and it is the part of Google that reads
 * structured data rather than prose.
 *
 * Name, phones, email and socials are read from the CMS, so the client can
 * correct them without a deploy. The address, hours and service area are
 * constants here instead, and that is deliberate — see below.
 */

/**
 * The machine-readable twin of the address the contact page prints.
 *
 * `settings.address.lines` is four lines of display text, and turning it into
 * a `PostalAddress` means guessing which line is the locality and mapping a
 * country name onto an ISO code. That guess would be silent when it broke, so
 * the structured form is written out once and kept beside the display form.
 *
 * Keep in step with `fallbackHome.settings.address` and the contact document.
 */
const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Sink 14th Street, Bishop Roland J. Diggs Building",
  addressLocality: "Monrovia",
  addressRegion: "Montserrado County",
  addressCountry: "LR",
} as const;

/**
 * Structured hours, the twin of the contact page's "Hours" row.
 *
 * Same reasoning: that row is free text the client can type anything into, and
 * `openingHoursSpecification` has to parse. Changing the hours means changing
 * both — which is recorded in the plan as a known coupling rather than left to
 * be discovered.
 */
const OPENING_HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "06:00",
    closes: "18:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Saturday",
    opens: "06:00",
    closes: "16:00",
  },
] as const;

const AREA_SERVED = ["Liberia", "Lebanon"] as const;

export function buildBusinessJsonLd({
  settings,
  services,
}: {
  settings: SiteSettings;
  services: NavService[];
}): Record<string, unknown> {
  const [primaryPhone] = settings.phones;

  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    // A stable identifier, so anything added later can point at this node
    // rather than describing a second, competing copy of the company.
    "@id": `${siteUrl}/#business`,
    name: settings.companyName,
    description: settings.footerNote,
    slogan: settings.tagline,
    url: siteUrl,
    /**
     * The Open Graph card, reused. There is no logo asset in the repo — the
     * wordmark is set in type — and inventing one would be worse than leaving
     * `logo` out, so a real logo file stays on the client's list.
     */
    image: absoluteUrl("/opengraph-image"),
    address: POSTAL_ADDRESS,
    ...(primaryPhone ? { telephone: primaryPhone.number } : {}),
    ...(settings.emails.length > 0 ? { email: settings.emails[0] } : {}),
    contactPoint: settings.phones.map((phone) => ({
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: phone.number,
      areaServed: phone.label,
      availableLanguage: "en",
    })),
    openingHoursSpecification: OPENING_HOURS,
    areaServed: AREA_SERVED.map((name) => ({ "@type": "Country", name })),
    knowsAbout: settings.standards,
    ...(settings.socials.length > 0
      ? { sameAs: settings.socials.map((social) => social.url) }
      : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Divisions",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          url: absoluteUrl(`/services#${service.slug}`),
          provider: { "@id": `${siteUrl}/#business` },
        },
      })),
    },
  };
}

/**
 * Serialises for a `<script>` tag.
 *
 * `JSON.stringify` does not escape `<`, so a closing-script sequence arriving
 * from a CMS field would end the tag early and turn the rest of the content
 * into markup. The unicode escape is inert inside JSON and closes that off.
 * Kept here so the escape travels with the data rather than depending on
 * whoever renders it remembering to do it.
 */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
