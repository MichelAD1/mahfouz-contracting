"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "./MobileMenu";
import { isActivePath } from "@/lib/nav";
import type { SiteSettings } from "@/sanity/lib/types";

/**
 * Transparent over the hero plate, paper with a hairline once you leave it.
 *
 * The scroll listener is passive and only ever flips one boolean, so it does no
 * layout reads and cannot thrash.
 */
export function Header({ settings }: { settings: SiteSettings }) {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ink = solid ? "text-ink" : "text-paper-bright";
  const hover = solid ? "hover:text-copper" : "hover:text-copper-bright";
  const accent = solid ? "text-copper" : "text-copper-bright";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-80 border-b transition-[background-color,border-color] duration-500 ease-[var(--ease-out-expo)] ${
          solid
            ? "border-rule bg-paper/95 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="shell flex h-20 items-center justify-between gap-6">
          <Link
            href="/"
            className={`flex items-baseline gap-2.5 py-3 transition-colors duration-500 ${ink}`}
          >
            <span className="display text-xl leading-none" translate="no">
              {settings.shortName}
            </span>
            <span className="t-meta opacity-65" translate="no">
              {settings.descriptor}
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {settings.nav.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <li key={item.href}>
                    {/* Colour alone marks the current page — no underline. */}
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`block py-1 display-narrow text-[0.875rem] transition-colors duration-300 ${
                        active ? `${accent} font-semibold` : `${ink} ${hover} font-medium`
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className={`hidden items-center px-6 py-3.5 display-narrow text-[0.75rem] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 lg:inline-flex ${
                solid
                  ? "bg-ink text-paper-bright hover:bg-copper"
                  : "bg-paper-bright/10 text-paper-bright ring-1 ring-inset ring-rule-dark-strong hover:bg-copper hover:ring-copper"
              }`}
            >
              Request a Quote
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              className={`flex size-11 items-center justify-center border transition-colors duration-300 lg:hidden ${
                solid
                  ? "border-rule-strong text-ink"
                  : "border-rule-dark-strong text-paper-bright"
              }`}
            >
              <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden="true">
                <path
                  d="M0 1h18M0 9h18"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        nav={settings.nav}
        settings={settings}
      />
    </>
  );
}
