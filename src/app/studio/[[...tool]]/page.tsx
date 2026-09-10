"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/lib/client";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return <NotConfigured />;
  }

  return <NextStudio config={config} />;
}

/**
 * Reached when no project id is set. Says exactly what to do rather than
 * throwing, because the site is expected to run without a CMS attached until
 * the owner creates the project.
 */
function NotConfigured() {
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-6 py-16 text-paper-bright">
      <div className="max-w-[34rem]">
        <h1 className="display text-xl">Studio not configured</h1>
        <p className="mt-4 t-body text-steel-light">
          Create a Sanity project, then add its id to <code>.env.local</code>:
        </p>
        <pre className="mt-4 overflow-x-auto bg-ink-soft p-4 text-[0.8125rem]">
          {`NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production`}
        </pre>
        <p className="mt-4 t-body text-steel-light">
          The site renders from its fallback content until then.
        </p>
      </div>
    </main>
  );
}
