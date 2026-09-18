import Link from "next/link";
import { LinkUnderline } from "@/components/primitives/Button";
import { SiteImage } from "@/components/primitives/SiteImage";
import { Reveal, StaggerItem, Stagger } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import type { Project } from "@/sanity/lib/types";

/**
 * Composed rather than gridded.
 *
 * The original design used `auto-fit minmax(300px, 1fr)` with mixed aspect
 * ratios, so the tiles landed wherever the viewport put them. Here the featured
 * project gets a title block of its own and the supporting tiles sit on a
 * deliberate 12-column rhythm with unequal widths and offsets.
 */

/**
 * Cycled so the composition holds for any number of supporting projects.
 * `span` positions the tile on the 12-column grid; `ratio` shapes its image.
 * They are separate because the caption sits outside the image box.
 */
const TILE_LAYOUTS = [
  { span: "lg:col-span-5", ratio: "aspect-4/5" },
  { span: "lg:col-span-7 lg:mt-20", ratio: "aspect-4/3" },
  { span: "lg:col-span-7 lg:col-start-6", ratio: "aspect-16/10" },
] as const;

export function SelectedWork({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  const [featured, ...rest] = projects;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <h2 className="display-sentence t-h2 max-w-[16ch] text-ink">
          Projects delivered end to end
        </h2>
        <LinkUnderline href="/projects">All projects</LinkUnderline>
      </div>

      {/* Featured */}
      <Reveal className="mt-[clamp(2.5rem,5vw,4rem)]">
        <div className="grid gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-8 lg:grid-cols-12 lg:items-end">
          <Link
            href={`/projects/${featured.slug}`}
            className="group block lg:col-span-8"
          >
            <Parallax className="relative aspect-16/11 w-full" distance={52}>
              <div className="absolute inset-0 transition-transform duration-[0.9s] ease-[var(--ease-out-expo)] group-hover:scale-[1.035]">
                <SiteImage
                  image={featured.cover}
                  sizes="(min-width: 1024px) 62vw, 100vw"
                  maxWidth={1800}
                  duotone
                  fallback="plate"
                />
              </div>
            </Parallax>
          </Link>

          {/* Title block — the drawing-sheet way to present metadata. */}
          <div className="lg:col-span-4">
            <Link href={`/projects/${featured.slug}`} className="group block">
              <h3 className="display-narrow t-h3 text-ink transition-colors duration-300 group-hover:text-copper">
                {featured.name}
              </h3>
            </Link>
            <TitleBlock project={featured} />
            {featured.summary ? (
              <p className="mt-5 max-w-[42ch] t-body text-steel">
                {featured.summary}
              </p>
            ) : null}
          </div>
        </div>
      </Reveal>

      {/* Supporting projects */}
      {rest.length > 0 ? (
        <Stagger
          className="mt-[clamp(2.5rem,5vw,4.5rem)] grid gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-[clamp(2.5rem,4vw,3.5rem)] lg:grid-cols-12"
          gap={0.16}
        >
          {rest.map((project, index) => {
            const layout = TILE_LAYOUTS[index % TILE_LAYOUTS.length];
            return (
              <StaggerItem key={project._id} className={layout.span}>
                <ProjectTile project={project} ratio={layout.ratio} seed={index + 1} />
              </StaggerItem>
            );
          })}
        </Stagger>
      ) : null}
    </div>
  );
}

/** Only renders the rows that actually have values. */
function TitleBlock({ project }: { project: Project }) {
  const rows = [
    { label: "Category", value: project.category },
    { label: "Location", value: project.location },
    { label: "Year", value: project.year },
    { label: "Client", value: project.client },
    ...(project.details ?? []),
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  if (rows.length === 0) return null;

  return (
    <dl className="mt-5 border-t border-ink">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-baseline justify-between gap-6 border-b border-rule py-2.5"
        >
          <dt className="t-meta text-steel">{row.label}</dt>
          <dd className="text-right text-[0.875rem] text-ink/85">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProjectTile({
  project,
  ratio,
  seed,
}: {
  project: Project;
  ratio: string;
  seed: number;
}) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className={`relative w-full overflow-hidden ${ratio}`}>
        <div className="absolute inset-0 transition-transform duration-[0.9s] ease-[var(--ease-out-expo)] group-hover:scale-[1.045]">
          <SiteImage
            image={project.cover}
            sizes="(min-width: 1024px) 45vw, 100vw"
            maxWidth={1400}
            duotone
            fallback="plate"
            fallbackSeed={seed}
          />
        </div>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-5 border-t border-ink pt-4">
        <h3 className="display-narrow text-[clamp(1.0625rem,1.5vw,1.375rem)] text-ink transition-colors duration-300 group-hover:text-copper">
          {project.name}
        </h3>
        {project.category ? (
          <span className="t-meta shrink-0 text-steel">{project.category}</span>
        ) : null}
      </div>
    </Link>
  );
}
