import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { getClosingCta, getServices } from "@/sanity/lib/fetch";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Five in-house divisions: electrical, mechanical, IT and automation, engineering and design consultancy, and maintenance and facility support.",
  alternates: { canonical: "/services" },
};

/**
 * Every division in full, each with its own anchor so the footer and the home
 * page can link straight to one.
 */
export default async function ServicesPage() {
  const [services, closingCta] = await Promise.all([
    getServices(),
    getClosingCta(),
  ]);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        code="S.02"
        heading="Five divisions, one scope of responsibility."
        lead="Each division works in-house and to a single project program, so design, supply, installation and commissioning meet where they are supposed to."
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
