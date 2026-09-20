import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LinkUnderline } from "@/components/primitives/Button";
import { ProjectsIndex } from "@/components/projects/ProjectsIndex";
import { ClosingCta } from "@/components/sections/ClosingCta";
import {
  getClosingCta,
  getProjects,
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

  return pageMetadata(copy.projectsSeo, "/projects", settings.companyName);
}

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
  const [projects, closingCta, copy] = await Promise.all([
    getProjects(),
    getClosingCta(),
    getSectionCopy(),
  ]);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
        heading={copy.projectsHero.heading}
        lead={copy.projectsHero.lead}
        image={HERO_IMAGE}
        size="medium"
      />

      <ProjectsIndex
        projects={projects}
        allLabel={copy.projectsAllFilter}
        empty={copy.projectsEmpty}
      />

      <section className="border-t-2 border-ink">
        <div className="shell flex flex-wrap items-end justify-between gap-x-10 gap-y-6 py-[clamp(2.5rem,5vw,4rem)]">
          <div>
            <h2 className="display-sentence t-h3 max-w-[20ch] text-ink">
              {copy.projectsMore.heading}
            </h2>
            {copy.projectsMore.lead ? (
              <p className="mt-3 max-w-[48ch] t-body text-steel">
                {copy.projectsMore.lead}
              </p>
            ) : null}
          </div>
          {copy.projectsMore.linkLabel ? (
            <LinkUnderline href="/contact">
              {copy.projectsMore.linkLabel}
            </LinkUnderline>
          ) : null}
        </div>
      </section>

      <ClosingCta content={closingCta} />
    </>
  );
}
