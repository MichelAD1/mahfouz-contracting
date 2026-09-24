import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LinkUnderline } from "@/components/primitives/Button";
import { ProjectsIndex } from "@/components/projects/ProjectsIndex";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { pageMetadata } from "@/lib/metadata";
import { navLabel } from "@/lib/nav";
import { getProjectsIndex, getSiteFrame } from "@/sanity/lib/fetch";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const [{ page }, { settings }] = await Promise.all([getProjectsIndex(), getSiteFrame()]);

  return pageMetadata(page.seo, "/projects", {
    siteName: settings.companyName,
    defaults: settings.seo,
  });
}

export default async function ProjectsPage() {
  const [{ page, projects, tags, categories, closingCta }, { settings }] = await Promise.all([
    getProjectsIndex(),
    getSiteFrame(),
  ]);

  return (
    <>
      <PageHero
        crumbs={[
          { label: navLabel(settings.nav, "/", "Home"), href: "/" },
          { label: navLabel(settings.nav, "/projects", "Projects") },
        ]}
        heading={page.hero.heading}
        lead={page.hero.lead}
        image={page.hero.image}
        buttons={page.hero.buttons}
        size="medium"
      />

      <ProjectsIndex
        projects={projects}
        tags={tags}
        categories={categories}
        copy={page.filters}
        empty={page.empty}
      />

      <section className="border-t-2 border-ink">
        <div className="shell flex flex-wrap items-end justify-between gap-x-10 gap-y-6 py-[clamp(2.5rem,5vw,4rem)]">
          <div>
            <h2 className="display-sentence t-h3 max-w-[20ch] text-ink">
              {page.more.heading}
            </h2>
            {page.more.lead ? (
              <p className="mt-3 max-w-[48ch] t-body text-steel">{page.more.lead}</p>
            ) : null}
          </div>
          {page.more.linkLabel ? (
            <LinkUnderline href="/contact">{page.more.linkLabel}</LinkUnderline>
          ) : null}
        </div>
      </section>

      <ClosingCta content={closingCta} />
    </>
  );
}
