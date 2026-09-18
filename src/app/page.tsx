import type { Metadata } from "next";
import { LinkUnderline } from "@/components/primitives/Button";
import { SectionShell } from "@/components/primitives/SectionShell";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Partners } from "@/components/sections/Partners";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { getHomePage } from "@/sanity/lib/fetch";

// Next requires a literal here — an imported constant fails the build. Keep in
// step with REVALIDATE in src/sanity/lib/fetch.ts.
export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * The home page sells; it does not carry the whole site.
 *
 * About and the process detail now live on /about, and the full division
 * write-ups on /services. What stays here is the shortest version of each that
 * still stands on its own, with a way through to the page that goes deeper —
 * so the two pages are not competing for the same search with the same words.
 */
export default async function HomePage() {
  const { settings, hero, about, services, projects, partners, closingCta } =
    await getHomePage();

  return (
    <>
      <Hero hero={hero} settings={settings} services={services} />

      <About about={about} condensed />

      <SectionShell id="services" label="Capabilities">
        <Capabilities services={services} />
        <div className="mt-[clamp(2rem,3.5vw,3rem)] border-t border-rule-strong pt-6">
          <LinkUnderline href="/services">All services</LinkUnderline>
        </div>
      </SectionShell>

      <SectionShell id="work" label="Selected work">
        <SelectedWork projects={projects} />
      </SectionShell>

      <SectionShell className="bg-paper-bright" size="compact">
        <Partners partners={partners} />
      </SectionShell>

      <ClosingCta content={closingCta} />
    </>
  );
}
