import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { mailHref, telHref } from "@/lib/format";
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
 * The address, both phones and the hours sit beside the form rather than under
 * it, and they are plain links. If the form breaks — and email delivery is the
 * one part of this site with a dependency outside it — the page still does its
 * job. That is the whole reason this route exists.
 */
export default async function ContactPage() {
  const [contact, { settings }, copy] = await Promise.all([
    getContact(),
    getSiteFrame(),
    getSectionCopy(),
  ]);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        seed={3}
        heading={contact.heading}
        lead={contact.description}
      />

      <section className="shell py-[clamp(3rem,7vw,6rem)]">
        <div className="grid gap-[clamp(2.5rem,6vw,5.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] lg:items-start">
          <ContactForm
            subjects={contact.formSubjects ?? []}
            settings={settings}
            copy={copy.enquiryForm}
          />

          <aside className="border-t-2 border-ink pt-8">
            <h2 className="t-meta text-steel">{copy.contactDirect.heading}</h2>

            <address className="mt-6 flex flex-col gap-5 not-italic">
              <div>
                <p className="t-meta text-steel">
                  {copy.contactDirect.officeLabel}
                </p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/85">
                  {settings.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>

              {settings.phones.map((phone) => (
                <div key={phone.number}>
                  <p className="t-meta text-steel">{phone.label}</p>
                  <a
                    href={telHref(phone.number)}
                    className="mt-2 block py-2.5 text-[0.9375rem] text-ink transition-colors duration-300 hover:text-copper lg:py-0"
                  >
                    {phone.number}
                  </a>
                </div>
              ))}

              {settings.emails.map((email) => (
                <div key={email}>
                  <p className="t-meta text-steel">
                    {copy.contactDirect.emailLabel}
                  </p>
                  <a
                    href={mailHref(email)}
                    className="mt-2 block py-2.5 text-[0.9375rem] text-ink transition-colors duration-300 hover:text-copper lg:py-0"
                  >
                    {email}
                  </a>
                </div>
              ))}
            </address>

            {contact.details && contact.details.length > 0 ? (
              <dl className="mt-9 border-t border-rule pt-7">
                {contact.details
                  // TODO: matched on the literal label, so renaming the
                  // Office row in the studio makes the address print twice.
                  .filter((detail) => detail.label !== "Office")
                  .map((detail) => (
                    <div key={detail.label} className="not-first:mt-5">
                      <dt className="t-meta text-steel">{detail.label}</dt>
                      <dd className="mt-2 text-[0.9375rem] leading-relaxed text-ink/85">
                        {detail.value}
                      </dd>
                    </div>
                  ))}
              </dl>
            ) : null}
          </aside>
        </div>
      </section>
    </>
  );
}
