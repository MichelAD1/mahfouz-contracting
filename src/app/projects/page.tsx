import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LinkUnderline } from "@/components/primitives/Button";
import { ProjectsIndex } from "@/components/projects/ProjectsIndex";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { getClosingCta, getProjects } from "@/sanity/lib/fetch";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Electrical, mechanical, IT and automation works delivered from design through commissioning, with maintenance carried on afterwards.",
  alternates: { canonical: "/projects" },
};

/**
 * TODO(client): this wants a wide site photograph of its own. Borrowed from the
 * project photography for now; it becomes a `siteSettings` image once there is
 * one worth using.
 */
const HERO_IMAGE = {
  src: "/images/site-tower-construction.webp",
  alt: "Tower under construction with a crane above the exposed frame",
  aspectRatio: 1289 / 860,
};

export default async function ProjectsPage() {
  const [projects, closingCta] = await Promise.all([
    getProjects(),
    getClosingCta(),
  ]);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
        heading="Selected projects"
        lead="Electrical, mechanical, IT and automation works delivered from design through commissioning, with maintenance carried on afterwards."
        image={HERO_IMAGE}
        size="medium"
      />

      <ProjectsIndex projects={projects} />

      <section className="border-t-2 border-ink">
        <div className="shell flex flex-wrap items-end justify-between gap-x-10 gap-y-6 py-[clamp(2.5rem,5vw,4rem)]">
          <div>
            <h2 className="display-sentence t-h3 max-w-[20ch] text-ink">
              More work, on request
            </h2>
            <p className="mt-3 max-w-[48ch] t-body text-steel">
              Further project records and references can be issued for tender or
              prequalification.
            </p>
          </div>
          <LinkUnderline href="/contact">Request references</LinkUnderline>
        </div>
      </section>

      <ClosingCta content={closingCta} />
    </>
  );
}
