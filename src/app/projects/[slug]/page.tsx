import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { LinkUnderline } from "@/components/primitives/Button";
import { SiteImage } from "@/components/primitives/SiteImage";
import { ImageReveal, Reveal } from "@/components/motion/Reveal";
import { pad2, projectMeta } from "@/components/projects/ProjectCard";
import { ClosingCta } from "@/components/sections/ClosingCta";
import {
  getClosingCta,
  getProject,
  getProjectSlugs,
  getProjects,
} from "@/sanity/lib/fetch";
import type { Project, ProjectFull } from "@/sanity/lib/types";

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
  const project = await getProject(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.name,
    description: project.summary ?? undefined,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: project.cover?.url
      ? { images: [{ url: project.cover.url }] }
      : undefined,
    /**
     * Held back from search on purpose. These records carry a name, a category
     * and a stock cover; the rest is placeholder copy awaiting the client's
     * confirmation. Asking Google to rank four near-empty pages of unverified
     * claims about real work would cost more than it earns. Lift this once the
     * records are real.
     */
    robots: { index: false, follow: true },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, projects, closingCta] = await Promise.all([
    getProject(slug),
    getProjects(),
    getClosingCta(),
  ]);

  if (!project) notFound();

  const position = projects.findIndex((entry) => entry.slug === project.slug);
  const next =
    projects.length > 1
      ? projects[(Math.max(position, 0) + 1) % projects.length]
      : null;

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: project.name },
        ]}
        index={position >= 0 ? pad2(position + 1) : undefined}
        heading={project.name}
        image={project.cover}
        size="tall"
      />

      <ProjectFacts project={project} />

      <Overview project={project} />

      <Gallery project={project} />

      {next ? <NextProject project={next} /> : null}

      <ClosingCta content={closingCta} />
    </>
  );
}

/**
 * The dark strip directly under the hero. Cells with no value are dropped
 * rather than rendered empty, so a sparse record reads as a short bar instead
 * of four labelled blanks.
 */
function ProjectFacts({ project }: { project: ProjectFull }) {
  const divisions = project.divisions?.map((division) => division.title) ?? [];

  const facts = [
    { label: "Category", value: project.category },
    { label: "Location", value: project.location },
    { label: "Divisions engaged", value: divisions.join(", ") || undefined },
    { label: "Status", value: project.status },
    { label: "Year", value: project.year },
    { label: "Client", value: project.client },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  if (facts.length === 0) return null;

  return (
    <section className="bg-ink text-paper-bright">
      <div className="shell">
        {/*
         * Hairlines come from a 1px grid gap showing the container through,
         * not from per-cell borders. With the column count changing across
         * three breakpoints, any `:last-child` rule would leave a stray edge
         * on one of them.
         */}
        <dl className="grid gap-px border-t border-rule-dark bg-rule-dark sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="bg-ink py-[clamp(1.5rem,3vw,2.25rem)] sm:px-7 sm:first:pl-0"
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

function Overview({ project }: { project: ProjectFull }) {
  const body = project.description ?? [];
  const scope = project.scopeOfWorks ?? [];
  const equipment = project.equipment ?? [];

  if (!project.summary && body.length === 0 && scope.length === 0) return null;

  return (
    <section className="shell py-[clamp(3.5rem,8vw,7.5rem)]">
      <div className="grid gap-[clamp(2.25rem,6vw,5.5rem)] lg:grid-cols-2 lg:items-start">
        <div>
          <Reveal>
            <p className="t-meta text-copper">Overview</p>
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
              <p className="t-meta text-copper">Scope of works</p>
              <ol className="mt-5 border-t-2 border-ink">
                {scope.map((item, index) => (
                  <li
                    key={item}
                    className="grid grid-cols-[auto_1fr] gap-5 border-b border-rule py-[1.125rem]"
                  >
                    <span className="display text-[0.75rem] leading-[1.6] text-navy">
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
              <p className="mt-10 t-meta text-copper">Equipment specified</p>
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

/** Three uprights and a wide crop beneath, per the design. */
function Gallery({ project }: { project: ProjectFull }) {
  const gallery = project.gallery ?? [];
  if (gallery.length === 0) return null;

  // The last image runs full width beneath the others; everything before it is
  // an upright. A gallery of one is therefore just the wide crop.
  const uprights = gallery.slice(0, -1);
  const wide = gallery[gallery.length - 1];

  return (
    <section className="border-t-2 border-ink bg-paper-bright">
      <div className="shell py-[clamp(3rem,6vw,5.5rem)]">
        <p className="t-meta text-copper">On site</p>

        {uprights.length > 0 ? (
          <div className="mt-7 grid gap-[clamp(1rem,2.5vw,2rem)] sm:grid-cols-2 lg:grid-cols-3">
            {uprights.map((image, index) => (
              <ImageReveal
                key={image.url ?? image.src ?? index}
                className="relative aspect-4/5 w-full"
              >
                <SiteImage
                  image={image}
                  sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 100vw"
                  maxWidth={1100}
                />
              </ImageReveal>
            ))}
          </div>
        ) : null}

        <ImageReveal className="relative mt-[clamp(1rem,2.5vw,2rem)] aspect-16/7 w-full">
          <SiteImage image={wide} sizes="100vw" maxWidth={2000} />
        </ImageReveal>
      </div>
    </section>
  );
}

function NextProject({ project }: { project: Project }) {
  const meta = projectMeta(project);

  return (
    <section className="border-t-2 border-ink">
      <div className="shell flex flex-wrap items-end justify-between gap-x-10 gap-y-6 py-[clamp(2.5rem,5vw,4rem)]">
        <div>
          <p className="t-meta text-steel">Next project</p>
          <Link href={`/projects/${project.slug}`} className="group mt-4 block">
            <span className="block display-sentence t-h3 text-ink transition-colors duration-300 group-hover:text-copper">
              {project.name}
            </span>
            {meta ? <span className="mt-2 block t-meta text-steel">{meta}</span> : null}
          </Link>
        </div>
        <LinkUnderline href="/projects">All projects</LinkUnderline>
      </div>
    </section>
  );
}
