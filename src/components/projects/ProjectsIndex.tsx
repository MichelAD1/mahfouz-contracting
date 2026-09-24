"use client";

import { useMemo, useSyncExternalStore } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { pad2 } from "@/lib/format";
import type {
  Project,
  ProjectCategory,
  ProjectFilterCopy,
  ProjectTag,
  SectionIntro,
} from "@/sanity/lib/types";

/** No filter chosen. */
const ALL = "";

/** Dispatched after the filter rewrites the URL, which fires no event itself. */
const FILTER_EVENT = "projects-filter-change";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(FILTER_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(FILTER_EVENT, onChange);
  };
}

/**
 * The address bar is the filter's state, read as an external store: the
 * server has no query string, so it renders every project, and a shared link
 * such as /projects?tag=electrical filters as soon as the page hydrates.
 */
function useSearch(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
}

/**
 * Writes the choice into the address, so a filtered view can be linked to.
 * `replaceState` rather than `pushState`: flicking between filters should not
 * leave a trail of history entries for the Back button to wade through.
 */
function writeFilter(key: "tag" | "category", value: string) {
  const params = new URLSearchParams(window.location.search);
  if (value === ALL) params.delete(key);
  else params.set(key, value);

  const query = params.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
  );
  window.dispatchEvent(new Event(FILTER_EVENT));
}

type Term = { slug: string; title: string };

/**
 * The terms worth a button: in the studio's order, carried by at least one
 * project - and only if pressing one could change the grid. A category every
 * project shares is a button that does nothing, so its whole row is left off.
 *
 * `minimum` is how many must be in use before the row appears at all: one tag
 * is still a useful filter, while categories are promised in the studio as a
 * row that arrives with the second one.
 */
function usefulTerms<T extends Term>(
  terms: T[],
  projects: Project[],
  slugsOf: (project: Project) => string[],
  minimum = 1,
): T[] {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const slug of new Set(slugsOf(project))) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }

  const used = terms.filter((term) => counts.has(term.slug));
  const narrows = used.some((term) => (counts.get(term.slug) ?? 0) < projects.length);

  return narrows && used.length >= minimum ? used : [];
}

const tagSlugs = (project: Project) => project.tags.map((tag) => tag.slug);
const categorySlugs = (project: Project) =>
  project.category ? [project.category.slug] : [];

/**
 * The projects index, filtered by tag and, once there is more than one in use,
 * by category.
 *
 * Filtering is client-side and every project stays in the markup that ships,
 * which is the point: the server renders one complete list, a filtered address
 * still declares /projects as its canonical, and there is no request on a click.
 *
 * Nothing about the filter is written here. The buttons are the tags and
 * categories in the studio, in the studio's order, so a tag the client adds is
 * a button the moment a project carries it, and a tag nobody uses is not one.
 */
export function ProjectsIndex({
  projects,
  tags,
  categories,
  copy,
  empty,
}: {
  projects: Project[];
  tags: ProjectTag[];
  categories: ProjectCategory[];
  copy: ProjectFilterCopy;
  /** Shown when the chosen filter has nothing under it. */
  empty: SectionIntro;
}) {
  const tagFilters = useMemo(() => usefulTerms(tags, projects, tagSlugs), [tags, projects]);
  const categoryFilters = useMemo(
    () => usefulTerms(categories, projects, categorySlugs, 2),
    [categories, projects],
  );

  // A value in the address that is not a current button is ignored, so an old
  // link to a renamed tag shows everything rather than nothing.
  const search = useSearch();
  const params = new URLSearchParams(search);
  const requestedTag = params.get("tag") ?? ALL;
  const requestedCategory = params.get("category") ?? ALL;
  const tag = tagFilters.some((term) => term.slug === requestedTag) ? requestedTag : ALL;
  const category = categoryFilters.some((term) => term.slug === requestedCategory)
    ? requestedCategory
    : ALL;

  const visible = projects.filter(
    (project) =>
      (tag === ALL || tagSlugs(project).includes(tag)) &&
      (category === ALL || categorySlugs(project).includes(category)),
  );

  const hasFilters = tagFilters.length > 0 || categoryFilters.length > 0;

  // No projects at all is not a filter with nothing under it. The page's
  // "More work, on request" block below still says what to do.
  if (projects.length === 0) return null;

  return (
    <div className="shell py-[clamp(2.5rem,5vw,4.5rem)]">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-5 border-b border-rule pb-[1.375rem]">
        {hasFilters ? (
          <div className="grid gap-4">
            {tagFilters.length > 0 ? (
              <FilterRow
                name="Filter projects"
                allLabel={copy.allLabel}
                terms={tagFilters}
                active={tag}
                onSelect={(value) => writeFilter("tag", value)}
              />
            ) : null}

            {categoryFilters.length > 0 ? (
              <FilterRow
                name={copy.categoriesLabel ?? "Filter projects by category"}
                label={copy.categoriesLabel}
                allLabel={copy.allLabel}
                terms={categoryFilters}
                active={category}
                onSelect={(value) => writeFilter("category", value)}
              />
            ) : null}
          </div>
        ) : (
          <span aria-hidden="true" />
        )}

        <p aria-live="polite" className="t-meta text-steel">
          {pad2(visible.length)}{" "}
          {visible.length === 1 ? copy.projectSingular : copy.projectPlural}
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
          <p className="display-sentence t-h3 max-w-[24ch] text-ink">{empty.heading}</p>
          {empty.lead ? (
            <p className="mt-3 max-w-[44ch] t-body text-steel">{empty.lead}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function FilterRow({
  name,
  label,
  allLabel,
  terms,
  active,
  onSelect,
}: {
  /** The group's accessible name. */
  name: string;
  /** Printed before the buttons, when the row needs saying what it filters. */
  label?: string;
  allLabel: string;
  terms: Term[];
  active: string;
  onSelect: (slug: string) => void;
}) {
  const buttons = [{ slug: ALL, title: allLabel }, ...terms];

  return (
    <div role="group" aria-label={name} className="flex flex-wrap items-center gap-2">
      {label ? (
        <span aria-hidden="true" className="mr-2 t-meta text-steel">
          {label}
        </span>
      ) : null}
      {buttons.map((term) => {
        const isActive = term.slug === active;
        return (
          <button
            key={term.slug || "all"}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(term.slug)}
            className={`display-narrow border px-[1.125rem] py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${
              isActive
                ? "border-navy bg-navy text-paper-bright"
                : "border-rule-strong text-ink hover:border-navy hover:text-navy"
            }`}
          >
            {term.title}
          </button>
        );
      })}
    </div>
  );
}
