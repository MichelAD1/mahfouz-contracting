import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { LinkUnderline } from "@/components/primitives/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCarousel } from "@/components/projects/ProjectCarousel";
import { projectMeta } from "@/components/projects/ProjectCard";
import { pad2 } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { navLabel } from "@/lib/nav";
import { ClosingCta } from "@/components/sections/ClosingCta";
import {
  getProject,
  getProjectSlugs,
  getProjectsIndex,
  getSiteFrame,
} from "@/sanity/lib/fetch";
import type { Project, ProjectDetailLabels, ProjectFull } from "@/sanity/lib/types";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [project, { settings }] = await Promise.all([getProject(slug), getSiteFrame()]);

  if (!project) return { title: "Project not found" };

  return {
    ...pageMetadata(
      {
        title: project.seo.title ?? project.name,
        description: project.seo.description ?? project.summary,
        image: project.seo.image ?? project.cover,
      },
      `/projects/${project.slug}`,
      { siteName: settings.companyName, defaults: settings.seo },
    ),
    /**
     * Held back from search until the studio says otherwise. These records
     * carry a name, a category and a stock cover; the rest is placeholder copy
     * awaiting the client's confirmation, and asking Google to rank unverified
     * claims about real work would cost more than it earns. "Show in search
     * engines" on the project lifts this and adds the page to the sitemap -
     * one switch, both readers, so the two can never disagree.
     */
    robots: project.searchVisible ? undefined : { index: false, follow: true },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, { page, projects, closingCta }, { settings }] = await Promise.all([
    getProject(slug),
    getProjectsIndex(),
    getSiteFrame(),
  ]);

  if (!project) notFound();

  const labels = page.detail;
  const position = projects.findIndex((entry) => entry.slug === project.slug);
  const following = projects[(Math.max(position, 0) + 1) % Math.max(projects.length, 1)];
  const next = following && following.slug !== project.slug ? following : null;

  return (
    <>
      <PageHero
        crumbs={[
          { label: navLabel(settings.nav, "/", "Home"), href: "/" },
          { label: navLabel(settings.nav, "/projects", "Projects"), href: "/projects" },
          { label: project.name },
        ]}
        index={position >= 0 ? pad2(position + 1) : undefined}
        heading={project.name}
        image={project.cover}
        size="tall"
      />

      <ProjectFacts project={project} labels={labels} />

      <Overview project={project} labels={labels} />

      <ProjectCarousel
        images={project.gallery}
        label={labels.gallery}
        projectName={project.name}
      />

      {next ? <NextProject project={next} labels={labels} /> : null}

      <ClosingCta content={closingCta} />
    </>
  );
}

/**
 * The dark strip directly under the hero. Cells with no value are dropped
 * rather than rendered empty, so a sparse record reads as a short bar instead
 * of four labelled blanks.
 *
 * The project's own "Project details" rows follow the fixed facts - the title
 * block the studio has always said they appear in, and until now never did.
 */
function ProjectFacts({
  project,
  labels,
}: {
  project: ProjectFull;
  labels: ProjectDetailLabels;
}) {
  const divisions = project.divisions.map((division) => division.title);

  const facts = [
    { label: labels.category, value: project.category?.title },
    { label: labels.location, value: project.location },
    { label: labels.divisions, value: divisions.join(", ") || undefined },
    { label: labels.status, value: project.status },
    { label: labels.year, value: project.year },
    { label: labels.client, value: project.client },
    ...project.details,
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  if (facts.length === 0) return null;

  return (
    <section className="bg-ink text-paper-bright">
      <div className="shell">
        {/*
         * Hairlines come from a 1px gap showing the container through, not from
         * per-cell borders. With the cells wrapping, any `:last-child` rule
         * would leave a stray edge on one row or another.
         *
         * The cells **grow to fill the row**, which is the point rather than a
         * detail. This was a four-column grid, so a record carrying three facts
         * — which is what every project carries today, the rest being
         * deliberately unset until the client confirms them — left the
         * fourth column showing the container's rule colour: a blank cell in a
         * bar of labelled ones, which reads as a field somebody forgot to fill
         * rather than as a field that does not apply. Filling the row means
         * there is no empty cell to misread, at any count from one to six.
         */}
        <dl className="flex flex-wrap gap-px border-t border-rule-dark bg-rule-dark">
          {facts.map((fact, index) => (
            <div
              key={`${index}-${fact.label}`}
              className="grow basis-[12rem] bg-ink py-[clamp(1.5rem,3vw,2.25rem)] sm:px-7 sm:first:pl-0"
            >
              <dt className="t-meta text-steel-light">{fact.label}</dt>
              <dd className="mt-2.5 display-narrow text-[1.0625rem] text-paper-bright">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Overview({
  project,
  labels,
}: {
  project: ProjectFull;
  labels: ProjectDetailLabels;
}) {
  const body = project.description;
  const scope = project.scopeOfWorks;
  const equipment = project.equipment;

  if (!project.summary && body.length === 0 && scope.length === 0 && equipment.length === 0) {
    return null;
  }

  return (
    <section className="shell py-[clamp(3.5rem,8vw,7.5rem)]">
      <div className="grid gap-[clamp(2.25rem,6vw,5.5rem)] lg:grid-cols-2 lg:items-start">
        <div>
          <Reveal>
            <p className="t-meta text-copper">{labels.overview}</p>
            {project.summary ? (
              <h2 className="mt-5 display-sentence t-h2 max-w-[22ch] text-ink">
                {project.summary}
              </h2>
            ) : null}
          </Reveal>

          {body.length > 0 ? (
            <Reveal order={0.12}>
              <div className="mt-7 max-w-[58ch]">
                {body.map((paragraph, index) => (
                  <p
                    key={paragraph.slice(0, 32)}
                    className={`t-lead ${index > 0 ? "mt-5 text-steel" : "text-ink/85"}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>

        <div>
          {scope.length > 0 ? (
            <Reveal order={0.08}>
              <p className="t-meta text-copper">{labels.scope}</p>
              <ol className="mt-5 border-t-2 border-ink">
                {scope.map((item, index) => (
                  <li
                    key={item}
                    /*
                     * `items-baseline`, so the numeral sits on the same line as
                     * the text rather than near it. The two spans are different
                     * sizes with different line-heights — 12px on the display
                     * face at 0.94, 16px on the body face at 1.625 — and the
                     * default `stretch` lines up their boxes, which leaves the
                     * smaller box's baseline floating above the larger one's.
                     * It was being corrected with a hand-tuned `leading-[1.6]`
                     * on the numeral, which moves the box and so gets close
                     * without ever being right.
                     */
                    className="grid grid-cols-[auto_1fr] items-baseline gap-5 border-b border-rule py-[1.125rem]"
                  >
                    <span className="display text-[0.75rem] text-navy">
                      {pad2(index + 1)}
                    </span>
                    <span className="text-[1rem] leading-relaxed text-ink/85">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          ) : null}

          {equipment.length > 0 ? (
            <Reveal order={0.16}>
              <p className={`${scope.length > 0 ? "mt-10" : ""} t-meta text-copper`}>
                {labels.equipment}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {equipment.map((item) => (
                  <li
                    key={item._id}
                    className="border border-rule-strong px-3 py-2 t-meta text-ink/80"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function NextProject({
  project,
  labels,
}: {
  project: Project;
  labels: ProjectDetailLabels;
}) {
  const meta = projectMeta(project);

  return (
    <section className="border-t-2 border-ink">
      <div className="shell flex flex-wrap items-end justify-between gap-x-10 gap-y-6 py-[clamp(2.5rem,5vw,4rem)]">
        <div>
          <p className="t-meta text-steel">{labels.nextProject}</p>
          <Link href={`/projects/${project.slug}`} className="group mt-4 block">
            <span className="block display-sentence t-h3 text-ink transition-colors duration-300 group-hover:text-copper">
              {project.name}
            </span>
            {meta ? <span className="mt-2 block t-meta text-steel">{meta}</span> : null}
          </Link>
        </div>
        <LinkUnderline href="/projects">{labels.allProjects}</LinkUnderline>
      </div>
    </section>
  );
}
