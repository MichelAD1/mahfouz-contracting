import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { About } from "@/components/sections/About";
import { Process } from "@/components/sections/Process";
import { ClosingCta } from "@/components/sections/ClosingCta";
import {
  getAbout,
  getClosingCta,
  getProcess,
  getSectionCopy,
  getSiteFrame,
} from "@/sanity/lib/fetch";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const [copy, { settings }] = await Promise.all([
    getSectionCopy(),
    getSiteFrame(),
  ]);

  return pageMetadata(copy.aboutSeo, "/about", settings.companyName);
}

/**
 * The full About write-up plus the four-stage process, which used to sit on the
 * home page. Both live here and only here — the home page carries the short
 * version and links across, so the two do not compete for the same search.
 */
export default async function AboutPage() {
  const [about, process, closingCta, copy] = await Promise.all([
    getAbout(),
    getProcess(),
    getClosingCta(),
    getSectionCopy(),
  ]);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        seed={1}
        heading={copy.aboutHero.heading}
        lead={copy.aboutHero.lead}
      />

      <About about={about} />

      <SectionShell
        id="process"
        label={copy.aboutProcess.label}
        className="bg-paper-bright"
      >
        <Process steps={process} heading={copy.aboutProcess.heading} />
      </SectionShell>

      <ClosingCta content={closingCta} />
    </>
  );
}
