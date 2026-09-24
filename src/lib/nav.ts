import type { NavItem } from "@/sanity/lib/types";

/**
 * Which navigation item the current URL belongs to.
 *
 * `/` has to match exactly or it would claim every page, since every path
 * starts with a slash. Everything else matches its own subtree, so a project
 * detail page still marks "Projects" as the section you are in — which is what
 * a visitor deep in the site needs to know.
 *
 * Anchors are ignored rather than matched: `#contact` on the home page is not a
 * section of its own, and treating it as one would light up two items at once.
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (href.startsWith("#") || !href.startsWith("/")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The navigation's own word for a route, for its breadcrumb. Renaming
 * "Projects" in Site settings renames the crumb that leads back to it too.
 */
export function navLabel(nav: NavItem[], href: string, fallback: string): string {
  return nav.find((item) => item.href === href)?.label ?? fallback;
}
