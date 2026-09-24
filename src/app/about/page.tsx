import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { WhoWeAre } from "@/components/sections/WhoWeAre";
import { Process } from "@/components/sections/Process";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { pageMetadata } from "@/lib/metadata";
import { navLabel } from "@/lib/nav";
import { getAboutPage, getSiteFrame } from "@/sanity/lib/fetch";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const [{ page }, { settings }] = await Promise.all([getAboutPage(), getSiteFrame()]);

  return pageMetadata(page.seo, "/about", {
    siteName: settings.companyName,
    defaults: settings.seo,
  });
}

/**
 * Who we are in full, then the four-stage process. The home page carries the
 * short version of the first and links across, so the two do not compete for
 * the same search with the same words.
 */
export default async function AboutPage() {
  const [{ page, process, closingCta }, { settings }] = await Promise.all([
    getAboutPage(),
    getSiteFrame(),
  ]);

  return (
    <>
      <PageHero
        crumbs={[
          { label: navLabel(settings.nav, "/", "Home"), href: "/" },
          { label: navLabel(settings.nav, "/about", "About") },
        ]}
        seed={1}
        heading={page.hero.heading}
        lead={page.hero.lead}
        image={page.hero.image}
        buttons={page.hero.buttons}
      />

      <WhoWeAre content={page.whoWeAre} />

      {process.length > 0 ? (
        <SectionShell id="process" label={page.process.label} className="bg-paper-bright">
          <Process steps={process} heading={page.process.heading} lead={page.process.lead} />
        </SectionShell>
      ) : null}

      <ClosingCta content={closingCta} />
    </>
  );
}
