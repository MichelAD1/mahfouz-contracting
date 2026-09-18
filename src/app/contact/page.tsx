import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { mailHref, telHref } from "@/lib/format";
import { getContact, getSiteFrame } from "@/sanity/lib/fetch";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a quote from Mahfouz Contracting. Send us the scope and we will come back with an engineered answer. Offices in Monrovia, Liberia.",
  alternates: { canonical: "/contact" },
};

/**
 * The address, both phones and the hours sit beside the form rather than under
 * it, and they are plain links. If the form breaks — and email delivery is the
 * one part of this site with a dependency outside it — the page still does its
 * job. That is the whole reason this route exists.
 */
export default async function ContactPage() {
  const [contact, { settings }] = await Promise.all([getContact(), getSiteFrame()]);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        heading={contact.heading}
        lead={contact.description}
      />

      <section className="shell py-[clamp(3rem,7vw,6rem)]">
        <div className="grid gap-[clamp(2.5rem,6vw,5.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] lg:items-start">
          <ContactForm subjects={contact.formSubjects ?? []} settings={settings} />

          <aside className="border-t-2 border-ink pt-8">
            <h2 className="t-meta text-steel">Reach us directly</h2>

            <address className="mt-6 flex flex-col gap-5 not-italic">
              <div>
                <p className="t-meta text-steel">Office</p>
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
                    className="mt-2 block text-[0.9375rem] text-ink transition-colors duration-300 hover:text-copper"
                  >
                    {phone.number}
                  </a>
                </div>
              ))}

              {settings.emails.map((email) => (
                <div key={email}>
                  <p className="t-meta text-steel">Email</p>
                  <a
                    href={mailHref(email)}
                    className="mt-2 block text-[0.9375rem] text-ink transition-colors duration-300 hover:text-copper"
                  >
                    {email}
                  </a>
                </div>
              ))}
            </address>

            {contact.details && contact.details.length > 0 ? (
              <dl className="mt-9 border-t border-rule pt-7">
                {contact.details
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
