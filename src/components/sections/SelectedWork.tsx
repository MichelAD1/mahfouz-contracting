import { LinkUnderline } from "@/components/primitives/Button";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Project } from "@/sanity/lib/types";

/**
 * Four projects on one row, each image a different shape.
 *
 * The cards align at the top and the captions land wherever their photograph
 * ends, so the rules step down the row instead of ruling one straight line
 * across it. That stagger is the whole composition — it is why this reads as a
 * contact sheet rather than four search results, and it comes from the varying
 * ratios rather than from any offset applied to the cards.
 */
const CARD_RATIOS = [
  "aspect-4/3",
  "aspect-3/4",
  "aspect-4/3",
  "aspect-square",
] as const;

export function SelectedWork({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <h2 className="display-sentence t-h2 max-w-[14ch] text-ink">
          Projects delivered end to end.
        </h2>
        <LinkUnderline href="/projects">All projects</LinkUnderline>
      </div>

      <Stagger
        className="mt-[clamp(2.5rem,5vw,4rem)] grid items-start gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-[clamp(2.5rem,4vw,3.5rem)] sm:grid-cols-2 lg:grid-cols-4"
        gap={0.14}
      >
        {projects.map((project, index) => (
          <StaggerItem key={project._id}>
            <ProjectCard
              project={project}
              index={index}
              ratio={CARD_RATIOS[index % CARD_RATIOS.length]}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
