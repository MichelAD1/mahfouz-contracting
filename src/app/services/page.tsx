import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { ClosingCta } from "@/components/sections/ClosingCta";
import {
  getClosingCta,
  getSectionCopy,
  getServices,
  getSiteFrame,
} from "@/sanity/lib/fetch";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const [copy, { settings }] = await Promise.all([
    getSectionCopy(),
    getSiteFrame(),
  ]);

  return pageMetadata(copy.servicesSeo, "/services", settings.companyName);
}

/**
 * Every division in full, each with its own anchor so the footer and the home
 * page can link straight to one.
 */
export default async function ServicesPage() {
  const [services, closingCta, copy] = await Promise.all([
    getServices(),
    getClosingCta(),
    getSectionCopy(),
  ]);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        seed={2}
        heading={copy.servicesHero.heading}
        lead={copy.servicesHero.lead}
      />

      <div className="shell pb-[clamp(2rem,5vw,4rem)]">
        {services.map((service, index) => (
          <ServiceDetail key={service._id} service={service} index={index} />
        ))}
      </div>

      <ClosingCta content={closingCta} />
    </>
  );
}
