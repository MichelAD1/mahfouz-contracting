import { defineConfig } from "sanity";
import { structureTool, type StructureResolver } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes, singletonTypes } from "@/sanity/schemas";
import { apiVersion, dataset, projectId } from "@/sanity/lib/client";

/**
 * Studio structure: singletons open straight into their document, collections
 * open as lists. The home page sections are grouped so an editor sees the page
 * in the order it renders.
 */
const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Page copy")
        .id("sectionCopy")
        .child(S.document().schemaType("sectionCopy").documentId("sectionCopy")),
      S.divider(),
      S.listItem()
        .title("Home page")
        .id("home")
        .child(
          S.list()
            .title("Home page")
            .items([
              S.listItem()
                .title("Hero")
                .id("hero")
                .child(S.document().schemaType("hero").documentId("hero")),
              S.listItem()
                .title("About")
                .id("about")
                .child(S.document().schemaType("about").documentId("about")),
              S.listItem()
                .title("Closing banner")
                .id("closingCta")
                .child(
                  S.document().schemaType("closingCta").documentId("closingCta"),
                ),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("process").title("Process steps"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("partner").title("Partners"),
      S.divider(),
      S.listItem()
        .title("Contact")
        .id("contact")
        .child(S.document().schemaType("contact").documentId("contact")),
      S.listItem()
        .title("Privacy policy")
        .id("privacyPolicy")
        .child(
          S.document().schemaType("privacyPolicy").documentId("privacyPolicy"),
        ),
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
