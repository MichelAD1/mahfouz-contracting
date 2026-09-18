"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { EASE } from "@/components/motion/ease";
import { isActivePath } from "@/lib/nav";
import type { NavItem, SiteSettings } from "@/sanity/lib/types";
import { telHref } from "@/lib/format";

type Props = {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
  settings: SiteSettings;
};

export function MobileMenu({ open, onClose, nav, settings }: Props) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes, Tab stays inside the panel, and the page behind cannot scroll.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed inset-0 z-90 flex flex-col overflow-y-auto overscroll-contain bg-ink px-[var(--gutter)] pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] lg:hidden"
        >
          <div className="flex h-11 items-center justify-between">
            <span className="display text-lg text-paper-bright">
              {settings.shortName}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="flex size-11 items-center justify-center border border-rule-dark-strong text-paper-bright transition-colors duration-300 hover:border-copper-bright hover:text-copper-bright"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                />
              </svg>
            </button>
          </div>

          <nav aria-label="Main" className="mt-12">
            <ul className="border-t border-rule-dark">
              {nav.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <li key={item.href} className="border-b border-rule-dark">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-baseline gap-4 py-5 display text-[clamp(1.9rem,9vw,2.75rem)] transition-colors duration-300 hover:text-copper-bright ${
                        active ? "text-copper-bright" : "text-paper-bright"
                      }`}
                    >
                      {item.label}
                      {active ? (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 shrink-0 self-center bg-copper-bright"
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto pt-12">
            <ul className="flex flex-col gap-2">
              {settings.phones.map((phone) => (
                <li key={phone.number}>
                  <a
                    href={telHref(phone.number)}
                    className="t-meta text-steel-light transition-colors duration-300 hover:text-copper-bright"
                  >
                    {phone.label} {phone.number}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              onClick={onClose}
              className="mt-6 flex w-full items-center justify-center bg-paper-bright px-6 py-5 display-narrow text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-ink transition-colors duration-300 hover:bg-copper hover:text-paper-bright"
            >
              Request a Quote
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
