import Link from "next/link";
import { SiteImage } from "@/components/primitives/SiteImage";
import { pad2 } from "@/lib/format";
import type { Project } from "@/sanity/lib/types";

/**
 * The meta line under a project's name.
 *
 * Its tags first - the same words as the filter buttons, so a card says why it
 * is under the button that was pressed - then where the work was. A project
 * with no tags falls back to naming its divisions. Everything is optional and
 * the line degrades to whatever exists; a project with nothing renders no line
 * at all rather than an empty rule.
 */
export function projectMeta(project: Project): string | null {
  const labels = (project.tags.length > 0 ? project.tags : project.divisions).map(
    (term) => term.title,
  );
  const parts: string[] = [];

  if (labels.length > 0) parts.push(labels.join(" · "));
  if (project.location) parts.push(project.location);

  return parts.length > 0 ? parts.join(" - ") : null;
}

/** A card's position in the grid, numbered from 01 rather than 00. */
export function projectIndex(index: number): string {
  return pad2(index + 1);
}

export function ProjectCard({
  project,
  index,
  ratio = "aspect-4/3",
}: {
  project: Project;
  index: number;
  /** Tailwind aspect class. The home page varies it per card; the index does not. */
  ratio?: string;
}) {
  const meta = projectMeta(project);

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className={`relative w-full overflow-hidden ${ratio}`}>
        <div className="absolute inset-0 transition-transform duration-[0.9s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
          <SiteImage
            image={project.cover}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            maxWidth={1200}
            fallback="plate"
            fallbackSeed={index}
          />
        </div>
      </div>

      <div className="mt-[1.125rem] grid grid-cols-[auto_1fr] gap-4 border-t-2 border-ink pt-[1.125rem]">
        <span className="display text-[0.8125rem] leading-none text-navy">
          {projectIndex(index)}
        </span>
        <span>
          <span className="block display-sentence text-[clamp(1.25rem,2vw,1.75rem)] text-ink transition-colors duration-300 group-hover:text-copper">
            {project.name}
          </span>
          {meta ? (
            <span className="mt-2 block t-meta text-steel">{meta}</span>
          ) : null}
        </span>
      </div>
    </Link>
  );
}
