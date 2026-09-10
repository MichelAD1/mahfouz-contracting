import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionShell } from "@/components/primitives/SectionShell";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Process } from "@/components/sections/Process";
import { Partners } from "@/components/sections/Partners";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { getHomePage } from "@/sanity/lib/fetch";

// Next requires a literal here — an imported constant fails the build. Keep in
// step with REVALIDATE in src/sanity/lib/fetch.ts.
export const revalidate = 300;

export default async function HomePage() {
  const { settings, hero, about, services, projects, process, partners, closingCta } =
    await getHomePage();

  return (
    <>
      <Header settings={settings} />

      <main id="main">
        <Hero hero={hero} settings={settings} />

        <About about={about} />

        <SectionShell id="capabilities" code="S.02" label="Capabilities">
          <Capabilities services={services} />
        </SectionShell>

        <SectionShell id="work" code="S.03" label="Selected work">
          <SelectedWork projects={projects} />
        </SectionShell>

        <SectionShell
          id="process"
          code="S.04"
          label="How we work"
          className="bg-paper-bright"
        >
          <Process steps={process} />
        </SectionShell>

        <SectionShell className="bg-paper-bright" size="compact">
          <Partners partners={partners} />
        </SectionShell>

        <ClosingCta content={closingCta} />
      </main>

      <Footer settings={settings} services={services} />
    </>
  );
}
