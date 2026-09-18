import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { About } from "@/components/sections/About";
import { Process } from "@/components/sections/Process";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { getAbout, getClosingCta, getProcess } from "@/sanity/lib/fetch";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About",
  description:
    "Mahfouz Contracting delivers integrated electrical, mechanical, IT and automation works in-house, from design through commissioning and on into maintenance.",
  alternates: { canonical: "/about" },
};

/**
 * The full About write-up plus the four-stage process, which used to sit on the
 * home page. Both live here and only here — the home page carries the short
 * version and links across, so the two do not compete for the same search.
 */
export default async function AboutPage() {
  const [about, process, closingCta] = await Promise.all([
    getAbout(),
    getProcess(),
    getClosingCta(),
  ]);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        seed={1}
        heading="Engineering, contracting and maintenance, in-house."
        lead="Five divisions under one roof, working to a single project program, so design, supply, installation and commissioning meet where they are supposed to."
      />

      <About about={about} />

      <SectionShell
        id="process"
       
        label="How we work"
        className="bg-paper-bright"
      >
        <Process steps={process} />
      </SectionShell>

      <ClosingCta content={closingCta} />
    </>
  );
}
