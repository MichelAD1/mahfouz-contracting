import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { pageMetadata } from "@/lib/metadata";
import { getPrivacyPolicy, getSiteFrame } from "@/sanity/lib/fetch";

export const revalidate = 300;

/**
 * `/privacy-policy`, not `/privacy`.
 *
 * The old WordPress site published this address, and it was redirected to the
 * home page for want of anywhere better to send it. Answering on the same URL
 * means whatever authority it carries lands on the page it was always about,
 * and the redirect that stood in for it is gone.
 */
export async function generateMetadata(): Promise<Metadata> {
  const [policy, { settings }] = await Promise.all([
    getPrivacyPolicy(),
    getSiteFrame(),
  ]);

  return pageMetadata(policy.seo, "/privacy-policy", settings.companyName);
}

/**
 * A revision date is real sheet metadata, which is the only thing the margin
 * column is allowed to carry. Fixed to UTC so the server and any later build
 * agree about which day it is.
 */
const UPDATED = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatUpdated(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : `Updated ${UPDATED.format(date)}`;
}

/**
 * The one page on the site that does not end on the closing banner. Asking
 * someone reading a privacy policy whether they have a project in mind reads
 * as a company that was not listening.
 */
export default async function PrivacyPolicyPage() {
  const policy = await getPrivacyPolicy();
  const [opening, ...rest] = policy.intro;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
        seed={4}
        heading={policy.heading}
        lead={opening}
      />

      <SectionShell label={formatUpdated(policy.updated)} divided={false}>
        <div className="max-w-[68ch]">
          {rest.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="t-lead text-ink/85 not-first:mt-5"
            >
              {paragraph}
            </p>
          ))}

          {policy.sections.map((section) => (
            <section
              key={section.heading}
              className="mt-[clamp(2.5rem,5vw,3.5rem)] border-t border-rule pt-7"
            >
              <h2 className="display-narrow t-h3 text-ink">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="mt-4 t-body text-steel"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </SectionShell>
    </>
  );
}
