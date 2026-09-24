import { validOpeningHours } from "@/lib/hours";
import { hasImage, sanityImageUrl } from "@/sanity/lib/image";
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
 * Everything here is read from Site settings, so the client can correct it
 * without a deploy. The address, the hours and the service area used to be
 * constants in this file beside a note saying to keep them in step with the
 * studio by hand; they are entered in the studio now, in the parts Google
 * reads, and the contact page prints the same hours from the same record.
 * A field left empty is left out, never emitted blank.
 */
function postalAddress(settings: SiteSettings): Record<string, unknown> | undefined {
  const { streetAddress, locality, region, postalCode, countryCode } =
    settings.postalAddress;

  const parts = {
    streetAddress,
    addressLocality: locality,
    addressRegion: region,
    postalCode,
    addressCountry: countryCode?.toUpperCase(),
  };

  const present = Object.fromEntries(
    Object.entries(parts).filter(([, value]) => Boolean(value)),
  );

  return Object.keys(present).length > 0
    ? { "@type": "PostalAddress", ...present }
    : undefined;
}

/** The uploaded logo, rasterised where the CDN can - Google's logo rules prefer it. */
function logoUrl(settings: SiteSettings): string | undefined {
  const logo = hasImage(settings.logo) ? settings.logo : settings.logoOnDark;
  if (!hasImage(logo)) return undefined;
  return logo.url ? sanityImageUrl(logo, { width: 600, format: "png" }) : absoluteUrl(logo.src!);
}

export function buildBusinessJsonLd({
  settings,
  services,
}: {
  settings: SiteSettings;
  services: NavService[];
}): Record<string, unknown> {
  const [primaryPhone] = settings.phones;
  const address = postalAddress(settings);
  const hours = validOpeningHours(settings.openingHours);
  const logo = logoUrl(settings);

  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    // A stable identifier, so anything added later can point at this node
    // rather than describing a second, competing copy of the company.
    "@id": `${siteUrl}/#business`,
    name: settings.companyName,
    ...(settings.footerNote ? { description: settings.footerNote } : {}),
    ...(settings.tagline ? { slogan: settings.tagline } : {}),
    url: siteUrl,
    ...(logo ? { logo } : {}),
    // The share card: the Site settings image, or the drawn card without one.
    image: absoluteUrl("/opengraph-image"),
    ...(address ? { address } : {}),
    ...(primaryPhone ? { telephone: primaryPhone.number } : {}),
    ...(settings.emails.length > 0 ? { email: settings.emails[0] } : {}),
    contactPoint: settings.phones.map((phone) => ({
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: phone.number,
      ...(phone.label ? { areaServed: phone.label } : {}),
      availableLanguage: "en",
    })),
    ...(hours.length > 0
      ? {
          openingHoursSpecification: hours.map((entry) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: entry.days,
            opens: entry.opens,
            closes: entry.closes,
          })),
        }
      : {}),
    ...(settings.areaServed.length > 0
      ? { areaServed: settings.areaServed.map((name) => ({ "@type": "Country", name })) }
      : {}),
    ...(settings.standards.length > 0 ? { knowsAbout: settings.standards } : {}),
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
