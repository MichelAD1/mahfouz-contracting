import { defineConfig } from "sanity";
import {
  structureTool,
  type StructureBuilder,
  type StructureResolver,
} from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes, singletonTypes } from "@/sanity/schemas";
import { apiVersion, dataset, projectId } from "@/sanity/lib/env";

/** A singleton opens straight into its one document. */
const singleton = (S: StructureBuilder, type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type).title(title));

/** A collection sorted the way the site sorts it, not alphabetically. */
const ordered = (S: StructureBuilder, type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .schemaType(type)
    .child(
      S.documentTypeList(type)
        .title(title)
        .defaultOrdering([{ field: "order", direction: "asc" }]),
    );

/**
 * Studio structure. It reads like the site: the settings every page shares,
 * then the pages in navigation order, then the things the pages are built from.
 */
const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singleton(S, "siteSettings", "Site settings"),
      S.listItem()
        .title("Pages")
        .id("pages")
        .child(
          S.list()
            .title("Pages")
            .items([
              singleton(S, "homePage", "Home"),
              singleton(S, "projectsPage", "Projects"),
              singleton(S, "servicesPage", "Services"),
              singleton(S, "aboutPage", "About"),
              singleton(S, "contact", "Contact"),
              S.divider(),
              singleton(S, "privacyPolicy", "Privacy policy"),
              singleton(S, "notFoundPage", "404 page"),
            ]),
        ),
      singleton(S, "closingCta", "Closing banner"),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
      ordered(S, "projectTag", "Project tags"),
      ordered(S, "projectCategory", "Project categories"),
      S.divider(),
      ordered(S, "service", "Services"),
      ordered(S, "process", "Process steps"),
      ordered(S, "partner", "Partners"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
    ]);

export default defineConfig({
  name: "mahfouz-contracting",
  title: "Mahfouz Contracting",
  basePath: "/studio",
  // Empty strings keep the studio importable before the project is created.
  projectId: projectId ?? "",
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons are reached through the structure above, never created ad hoc.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.includes(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.includes(schemaType)
        ? actions.filter(
            ({ action }) =>
              action && ["publish", "discardChanges", "restore"].includes(action),
          )
        : actions,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
