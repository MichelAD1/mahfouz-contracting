"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { pad2 } from "@/lib/format";
import type { Project, SectionIntro } from "@/sanity/lib/types";

const ALL = "all";

/**
 * The projects index, filtered by division.
 *
 * Filtering is client-side and every project stays mounted in the markup that
 * ships, which is the point: the server renders one complete list, so there is
 * no `?division=` variant of this page for Google to treat as a near-duplicate,
 * and no request on each click.
 *
 * The filter list is derived from the projects rather than hard-coded, so a
 * division the client stops working in stops appearing on its own.
 */
export function ProjectsIndex({
  projects,
  allLabel,
  empty,
}: {
  projects: Project[];
  /** The first filter button, which clears the division filter. */
  allLabel: string;
  /** Shown when the chosen division has nothing under it. */
  empty: SectionIntro;
}) {
  const [active, setActive] = useState(ALL);

  const divisions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const project of projects) {
      for (const division of project.divisions ?? []) {
        seen.set(division.slug, division.title);
      }
    }
    return [...seen].map(([slug, title]) => ({ slug, title }));
  }, [projects]);

  const visible = useMemo(
    () =>
      active === ALL
        ? projects
        : projects.filter((project) =>
            project.divisions?.some((division) => division.slug === active),
          ),
    [projects, active],
  );

  const filters = [{ slug: ALL, title: allLabel }, ...divisions];

  return (
    <div className="shell py-[clamp(2.5rem,5vw,4.5rem)]">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-5 border-b border-rule pb-[1.375rem]">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = filter.slug === active;
            return (
              <button
                key={filter.slug}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(filter.slug)}
                className={`display-narrow border px-[1.125rem] py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${
                  isActive
                    ? "border-navy bg-navy text-paper-bright"
                    : "border-rule-strong text-ink hover:border-navy hover:text-navy"
                }`}
              >
                {filter.title}
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="t-meta text-steel">
          {pad2(visible.length)} {visible.length === 1 ? "project" : "projects"}
        </p>
      </div>

      {visible.length > 0 ? (
        <div className="mt-[clamp(2rem,4vw,3.5rem)] grid items-start gap-[clamp(1.5rem,3.5vw,3.5rem)] sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, index) => (
            <ProjectCard key={project._id} project={project} index={index} />
          ))}
        </div>
      ) : (
        <div className="mt-[clamp(2rem,4vw,3.5rem)] border-t-2 border-ink pt-8">
          <p className="display-sentence t-h3 max-w-[24ch] text-ink">
            {empty.heading}
          </p>
          {empty.lead ? (
            <p className="mt-3 max-w-[44ch] t-body text-steel">{empty.lead}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
