import { defineCliConfig } from "sanity/cli";

/**
 * CLI configuration, kept separate from `sanity.config.ts`.
 *
 * `sanity.config.ts` is what the embedded studio at /studio renders from. This
 * file is what `sanity exec`, `sanity schema deploy` and `sanity dataset
 * export` read to know which project they are acting on — without it those
 * commands have no target at all.
 *
 * Both read the same environment variables, so pointing the site at the
 * client's project later is an env change and nothing else.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  },
});
