import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { pageMetadata } from "@/lib/metadata";
import { navLabel } from "@/lib/nav";
import { getServicesPage, getSiteFrame } from "@/sanity/lib/fetch";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const [{ page }, { settings }] = await Promise.all([getServicesPage(), getSiteFrame()]);

  return pageMetadata(page.seo, "/services", {
    siteName: settings.companyName,
    defaults: settings.seo,
  });
}

/**
 * Every division in full, each with its own anchor so the footer and the home
 * page can link straight to one.
 */
export default async function ServicesPage() {
  const [{ page, services, closingCta }, { settings }] = await Promise.all([
    getServicesPage(),
    getSiteFrame(),
  ]);

  return (
    <>
      <PageHero
        crumbs={[
          { label: navLabel(settings.nav, "/", "Home"), href: "/" },
          { label: navLabel(settings.nav, "/services", "Services") },
        ]}
        seed={2}
        heading={page.hero.heading}
        lead={page.hero.lead}
        image={page.hero.image}
        buttons={page.hero.buttons}
      />

      {services.length > 0 ? (
        <div className="shell pb-[clamp(2rem,5vw,4rem)]">
          {services.map((service, index) => (
            <ServiceDetail key={service._id} service={service} index={index} />
          ))}
        </div>
      ) : null}

      <ClosingCta content={closingCta} />
    </>
  );
}
