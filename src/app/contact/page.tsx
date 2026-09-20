import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { ContactForm } from "@/components/contact/ContactForm";
import { coordinates, mailHref, telHref } from "@/lib/format";
import { getContact, getSectionCopy, getSiteFrame } from "@/sanity/lib/fetch";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const [copy, { settings }] = await Promise.all([
    getSectionCopy(),
    getSiteFrame(),
  ]);

  return pageMetadata(copy.contactSeo, "/contact", settings.companyName);
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
 * They are set as a **title block** now, which is the third of them on the site
 * after the footer and the about section, and the same object in all three: an
 * ink panel of ruled, labelled fields. Before, this column was bare text on
 * paper with a hairline over it, which is the one part of the page that looked
 * unfinished rather than quiet — nothing on the page carried any weight, so the
 * form had nothing to sit against.
 *
 * There is deliberately **no embedded map**. An iframe from a mapping provider
 * would load third-party script on the one page a visitor types their details
 * into, and would contradict what /privacy-policy now says about this site in
 * writing. The coordinates are printed instead, as sheet metadata, which is
 * what a drawing would do and is enough to find a building.
 */
export default async function ContactPage() {
  const [contact, { settings }, copy] = await Promise.all([
    getContact(),
    getSiteFrame(),
    getSectionCopy(),
  ]);

  const { latitude, longitude, label } = contact.map ?? {};
  const grid =
    typeof latitude === "number" && typeof longitude === "number"
      ? { label: label ?? "Coordinates", value: coordinates(latitude, longitude) }
      : null;

  const checklist = contact.enquiryChecklist ?? [];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        seed={3}
        heading={contact.heading}
        lead={contact.description}
      />

      <SectionShell label={copy.contactDirect.formLabel} divided={false}>
        <div className="grid gap-[clamp(2.5rem,5vw,4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)] lg:items-start">
          <ContactForm
            subjects={contact.formSubjects ?? []}
            settings={settings}
            copy={copy.enquiryForm}
          />

          <aside>
            <div className="bg-ink text-paper-bright">
              <h2 className="px-6 pt-5 pb-4 t-meta text-copper-bright lg:px-7">
                {copy.contactDirect.heading}
              </h2>

              <address className="not-italic">
                <Row label={copy.contactDirect.officeLabel}>
                  {settings.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                  {grid ? (
                    <span className="mt-2.5 block t-meta text-steel-light">
                      {grid.value}
                    </span>
                  ) : null}
                </Row>

                {settings.phones.map((phone) => (
                  <Row key={phone.number} label={phone.label}>
                    <a
                      href={telHref(phone.number)}
                      className="block transition-colors duration-300 hover:text-copper-bright"
                    >
                      {phone.number}
                    </a>
                  </Row>
                ))}

                {settings.emails.map((email) => (
                  <Row key={email} label={copy.contactDirect.emailLabel}>
                    <a
                      href={mailHref(email)}
                      className="block break-words transition-colors duration-300 hover:text-copper-bright"
                    >
                      {email}
                    </a>
                  </Row>
                ))}
              </address>

              {/*
               * Whatever else the studio carries — hours, response time. The
               * address, the phones and the email are not in this list: they
               * come from Site settings, which is the one place they are kept.
               */}
              {(contact.details ?? []).map((detail) => (
                <Row key={detail.label} label={detail.label}>
                  {detail.value}
                </Row>
              ))}
            </div>

            {checklist.length > 0 ? (
              <div className="mt-[clamp(2rem,3.5vw,2.75rem)] border-t-2 border-ink pt-7">
                <h2 className="t-meta text-steel">
                  {copy.contactDirect.checklistLabel}
                </h2>
                <ul className="mt-5 grid gap-2.5">
                  {checklist.map((item) => (
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
