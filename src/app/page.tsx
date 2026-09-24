import type { Metadata } from "next";
import { LinkUnderline } from "@/components/primitives/Button";
import { SectionShell } from "@/components/primitives/SectionShell";
import { Hero } from "@/components/sections/Hero";
import { WhoWeAre } from "@/components/sections/WhoWeAre";
import { Capabilities } from "@/components/sections/Capabilities";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Partners } from "@/components/sections/Partners";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { pageMetadata } from "@/lib/metadata";
import { getHomePage, getSiteFrame } from "@/sanity/lib/fetch";

// Next requires a literal here — an imported constant fails the build. Keep in
// step with REVALIDATE in src/sanity/lib/fetch.ts.
export const revalidate = 300;

/**
 * The home page's title is the whole title - set absolutely, so the layout's
 * template does not append the company name a second time. With nothing set
 * on the Home page document it is the Site settings default.
 */
export async function generateMetadata(): Promise<Metadata> {
  const [{ page }, { settings }] = await Promise.all([getHomePage(), getSiteFrame()]);

  return pageMetadata(page.seo, "/", {
    siteName: settings.companyName,
    defaults: settings.seo,
    absoluteTitle: true,
  });
}

/**
 * The home page sells; it does not carry the whole site.
 *
 * About and the process detail now live on /about, and the full division
 * write-ups on /services. What stays here is the shortest version of each that
 * still stands on its own, with a way through to the page that goes deeper —
 * so the two pages are not competing for the same search with the same words.
 */
export default async function HomePage() {
  const [{ page, whoWeAre, services, projects, partners, closingCta }, { settings }] =
    await Promise.all([getHomePage(), getSiteFrame()]);

  const limit = Math.min(Math.max(Math.round(page.selectedWorkLimit) || 4, 1), 8);

  return (
    <>
      <Hero
        hero={page.hero}
        settings={settings}
        services={services}
        stripLabel={page.divisionStrip}
        standardsLabel={page.standardsLabel}
      />

      <WhoWeAre
        content={whoWeAre}
        condensed={{
          link: page.aboutLinkLabel ? { label: page.aboutLinkLabel, href: "/about" } : undefined,
        }}
      />

      {services.length > 0 ? (
        <SectionShell id="services" label={page.capabilities.label}>
          <Capabilities services={services} copy={page.capabilities} />
          {page.capabilities.linkLabel ? (
            <div className="mt-[clamp(2rem,3.5vw,3rem)] border-t border-rule-strong pt-6">
              <LinkUnderline href="/services">{page.capabilities.linkLabel}</LinkUnderline>
            </div>
          ) : null}
        </SectionShell>
      ) : null}

      {projects.length > 0 ? (
        <SectionShell id="work" label={page.selectedWork.label}>
          <SelectedWork projects={projects.slice(0, limit)} copy={page.selectedWork} />
        </SectionShell>
      ) : null}

      {partners.length > 0 ? (
        <SectionShell className="bg-paper-bright" size="compact">
          <Partners partners={partners} />
        </SectionShell>
      ) : null}

      <ClosingCta content={closingCta} />
    </>
  );
}
