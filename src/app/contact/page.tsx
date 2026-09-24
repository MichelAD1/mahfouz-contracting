import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { ContactForm } from "@/components/contact/ContactForm";
import { coordinates, mailHref, telHref } from "@/lib/format";
import { formatOpeningHours } from "@/lib/hours";
import { pageMetadata } from "@/lib/metadata";
import { navLabel } from "@/lib/nav";
import { getContactPage, getSiteFrame } from "@/sanity/lib/fetch";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const [page, { settings }] = await Promise.all([getContactPage(), getSiteFrame()]);

  return pageMetadata(page.seo, "/contact", {
    siteName: settings.companyName,
    defaults: settings.seo,
  });
}

/**
 * One row of the title block: a mono label, and the thing it labels beneath it.
 *
 * The rule is on the row rather than between rows, so the block takes any
 * number of them — two phones or five — without anything having to know how
 * many there are or which one is last.
 */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-rule-dark px-6 py-5 lg:px-7">
      <p className="t-meta text-steel-light">{label}</p>
      <div className="mt-2 text-[0.9375rem] leading-relaxed text-paper-bright">
        {children}
      </div>
    </div>
  );
}

/**
 * The enquiry page.
 *
 * The address, both phones and the hours sit beside the form rather than under
 * it, and they are plain links. If the form breaks — and email delivery is the
 * one part of this site with a dependency outside it — the page still does its
 * job. That is the whole reason this route exists.
 *
 * They are set as a **title block**, which is the third of them on the site
 * after the footer and the about section, and the same object in all three: an
 * ink panel of ruled, labelled fields.
 *
 * There is deliberately **no embedded map**. An iframe from a mapping provider
 * would load third-party script on the one page a visitor types their details
 * into, and would contradict what /privacy-policy says about this site in
 * writing. The coordinates are printed instead, as sheet metadata, which is
 * what a drawing would do and is enough to find a building.
 */
export default async function ContactPage() {
  const [page, { settings }] = await Promise.all([getContactPage(), getSiteFrame()]);
  const { direct } = page;

  const { latitude, longitude } = page.map ?? {};
  const grid =
    typeof latitude === "number" && typeof longitude === "number"
      ? coordinates(latitude, longitude)
      : null;

  // The same hours Google is given, from the one place they are entered.
  const hours = formatOpeningHours(settings.openingHours, direct.closedLabel);

  return (
    <>
      <PageHero
        crumbs={[
          { label: navLabel(settings.nav, "/", "Home"), href: "/" },
          { label: navLabel(settings.nav, "/contact", "Contact") },
        ]}
        seed={3}
        heading={page.hero.heading}
        lead={page.hero.lead}
        image={page.hero.image}
        buttons={page.hero.buttons}
      />

      <SectionShell label={direct.formLabel} divided={false}>
        <div className="grid gap-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)] lg:items-start">
          <ContactForm subjects={page.formSubjects} settings={settings} copy={page.form} />

          <aside>
            <div className="bg-ink text-paper-bright">
              <h2 className="px-6 pt-5 pb-4 t-meta text-copper-bright lg:px-7">
                {direct.heading}
              </h2>

              <address className="not-italic">
                {settings.address.lines.length > 0 || grid ? (
                  <Row label={direct.officeLabel}>
                    {settings.address.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                    {grid ? (
                      <span className="mt-2.5 block t-meta text-steel-light">{grid}</span>
                    ) : null}
                  </Row>
                ) : null}

                {settings.phones.map((phone) => (
                  <Row key={phone.number} label={phone.label || page.form.phoneLabel}>
                    <a
                      href={telHref(phone.number)}
                      className="block transition-colors duration-300 hover:text-copper-bright"
                    >
                      {phone.number}
                    </a>
                  </Row>
                ))}

                {settings.emails.map((email) => (
                  <Row key={email} label={direct.emailLabel}>
                    <a
                      href={mailHref(email)}
                      className="block break-words transition-colors duration-300 hover:text-copper-bright"
                    >
                      {email}
                    </a>
                  </Row>
                ))}
              </address>

              {hours ? <Row label={direct.hoursLabel}>{hours}</Row> : null}

              {/*
               * Whatever else the studio carries - response time, say. The
               * address, the phones, the email and the hours are not in this
               * list: they come from Site settings, the one place they are kept.
               */}
              {page.details.map((detail) => (
                <Row key={detail.label} label={detail.label}>
                  {detail.value}
                </Row>
              ))}
            </div>

            {page.enquiryChecklist.length > 0 ? (
              <div className="mt-[clamp(2rem,3.5vw,2.75rem)] border-t-2 border-ink pt-7">
                <h2 className="t-meta text-steel">{direct.checklistLabel}</h2>
                <ul className="mt-5 grid gap-2.5">
                  {page.enquiryChecklist.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[0.875rem] leading-relaxed text-ink/75"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2.5 block h-px w-3 shrink-0 bg-copper"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </SectionShell>
    </>
  );
}
