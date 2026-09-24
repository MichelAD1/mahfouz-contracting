import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { mailHref, telHref } from "@/lib/format";
import { socialLabel } from "@/lib/social";
import type { NavService, SiteSettings } from "@/sanity/lib/types";

const LINK =
  "block py-3.5 text-[0.9375rem] text-paper-bright/85 transition-colors duration-300 hover:text-copper-bright lg:py-0";

/** Set as a drawing title block: labelled fields, hairlines, no ornament. */
export function Footer({
  settings,
  services,
}: {
  settings: SiteSettings;
  services: NavService[];
}) {
  const year = new Date().getFullYear();
  const { footer } = settings;

  return (
    <footer id="contact" className="bg-ink text-paper-bright">
      <div className="shell pt-[clamp(3rem,6vw,5.5rem)] pb-8">
        <div className="grid gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center py-2 lg:py-0">
              <BrandMark settings={settings} size="footer" surface="dark" />
            </Link>
            {settings.tagline ? (
              <p className="mt-5 max-w-[32ch] text-[0.875rem] leading-relaxed text-steel-light">
                {settings.tagline}
              </p>
            ) : null}

            {/*
             * Named rather than drawn. A row of brand glyphs is the one
             * ornament a title block would never carry, and the names say
             * where each link goes without anyone having to recognise a logo.
             */}
            {settings.socials.length > 0 ? (
              <ul aria-label="Social media" className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
                {settings.socials.map((social) => (
                  <li key={social.url}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-meta block py-2.5 text-steel-light transition-colors duration-300 hover:text-copper-bright"
                    >
                      {socialLabel(social.platform)}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Footer">
            <h2 className="t-meta text-steel">{footer.navHeading}</h2>
            <ul className="mt-5 flex flex-col gap-0 lg:gap-2.5">
              {settings.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={LINK}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {services.length > 0 ? (
            <div>
              <h2 className="t-meta text-steel">{footer.servicesHeading}</h2>
              <ul className="mt-5 flex flex-col gap-0 lg:gap-2.5">
                {services.map((service) => (
                  <li key={service._id}>
                    <Link href={`/services#${service.slug}`} className={LINK}>
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <h2 className="t-meta text-steel">{footer.contactHeading}</h2>
            <address className="mt-5 flex flex-col gap-0 not-italic lg:gap-2.5">
              {settings.address.lines.length > 0 ? (
                <p className="text-[0.9375rem] leading-relaxed text-paper-bright/75">
                  {settings.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              ) : null}
              {settings.phones.map((phone) => (
                <a
                  key={phone.number}
                  href={telHref(phone.number)}
                  className="block py-3 text-[0.9375rem] text-paper-bright transition-colors duration-300 hover:text-copper-bright lg:py-0"
                >
                  {phone.label ? (
                    <span className="t-meta mr-2 text-steel">{phone.label}</span>
                  ) : null}
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
            © {year} {footer.copyright ?? settings.companyName}
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-1">
            {footer.legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="t-meta py-2.5 text-steel transition-colors duration-300 hover:text-copper-bright lg:py-0"
              >
                {link.label}
              </Link>
            ))}
            {settings.footerNote ? (
              <p className="t-meta text-steel">{settings.footerNote}</p>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
