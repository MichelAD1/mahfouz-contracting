import Link from "next/link";
import { mailHref, telHref } from "@/lib/format";
import type { NavService, SiteSettings } from "@/sanity/lib/types";

/** Set as a drawing title block: labelled fields, hairlines, no ornament. */
export function Footer({
  settings,
  services,
}: {
  settings: SiteSettings;
  services: NavService[];
}) {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-ink text-paper-bright">
      <div className="shell pt-[clamp(3rem,6vw,5.5rem)] pb-8">
        <div className="grid gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-baseline gap-2.5 py-2 lg:py-0">
              <span className="display text-2xl leading-none" translate="no">
                {settings.shortName}
              </span>
              <span className="t-meta opacity-65" translate="no">
                {settings.descriptor}
              </span>
            </Link>
            <p className="mt-5 max-w-[32ch] text-[0.875rem] leading-relaxed text-steel-light">
              {settings.tagline}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="t-meta text-steel">Navigate</h2>
            <ul className="mt-5 flex flex-col gap-0 lg:gap-2.5">
              {settings.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-3.5 text-[0.9375rem] text-paper-bright/85 transition-colors duration-300 hover:text-copper-bright lg:py-0"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="t-meta text-steel">Services</h2>
            <ul className="mt-5 flex flex-col gap-0 lg:gap-2.5">
              {services.map((service) => (
                <li key={service._id}>
                  <Link
                    href={`/services#${service.slug}`}
                    className="block py-3.5 text-[0.9375rem] text-paper-bright/85 transition-colors duration-300 hover:text-copper-bright lg:py-0"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="t-meta text-steel">Contact</h2>
            <address className="mt-5 flex flex-col gap-0 not-italic lg:gap-2.5">
              <p className="text-[0.9375rem] leading-relaxed text-paper-bright/75">
                {settings.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              {settings.phones.map((phone) => (
                <a
                  key={phone.number}
                  href={telHref(phone.number)}
                  className="block py-3 text-[0.9375rem] text-paper-bright transition-colors duration-300 hover:text-copper-bright lg:py-0"
                >
                  <span className="t-meta mr-2 text-steel">{phone.label}</span>
                  {phone.number}
                </a>
              ))}
              {settings.emails.map((email) => (
                <a
                  key={email}
                  href={mailHref(email)}
                  className="block py-3 text-[0.9375rem] text-paper-bright transition-colors duration-300 hover:text-copper-bright lg:py-0"
                >
                  {email}
                </a>
              ))}
            </address>
          </div>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,4.5rem)] flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-rule-dark pt-6">
          <p className="t-meta text-steel">
            © {year} {settings.companyName}
          </p>
          <p className="t-meta text-steel">{settings.footerNote}</p>
        </div>
      </div>
    </footer>
  );
}
