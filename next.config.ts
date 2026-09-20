import type { NextConfig } from "next";

/**
 * The WordPress site this replaces, redirected.
 *
 * Taken from the live `wp-sitemap.xml` rather than from memory: 26 pages, 38
 * portfolio entries, 5 service pages, 5 blog posts, 3 team members and a
 * category archive. Every one of them 404s at cutover unless it is handled
 * here, and whatever authority the domain has goes with them.
 *
 * Trailing slashes are absent on purpose. WordPress linked `/contact-us/` and
 * Next normalises that to `/contact-us` before these rules are consulted, so
 * listing both forms would add a rule that can never match.
 */
const WORDPRESS_REDIRECTS: { source: string; destination: string }[] = [
  // Pages with a genuine equivalent. Multi-page is what makes these worth
  // more than a home-page anchor would have been.
  { source: "/contact-us", destination: "/contact" },
  { source: "/our-services", destination: "/services" },
  { source: "/projects-2", destination: "/projects" },
  { source: "/projects-3", destination: "/projects" },

  /**
   * The five division pages. This site answers them with one `/services` page
   * and an anchor per division, so each lands on the section that replaced it
   * rather than on the top of the page.
   */
  { source: "/services/electrical-division", destination: "/services#electrical-division" },
  { source: "/services/mechanical-division", destination: "/services#mechanical-division" },
  {
    source: "/services/information-technology-automation-division",
    destination: "/services#information-technology-automation-division",
  },
  {
    source: "/services/engineering-design-consultancy",
    destination: "/services#engineering-design-consultancy",
  },
  {
    source: "/services/maintenance-facility-support",
    destination: "/services#maintenance-facility-support",
  },

  /**
   * 38 portfolio entries, nearly all of them the theme's solar demo content.
   * They go to the projects index rather than to a matching detail page: the
   * four slugs that do match carry `noindex` while their records are
   * placeholders, and landing inherited authority on a page excluded from
   * search would throw it away twice.
   */
  { source: "/portfolio/:slug", destination: "/projects" },

  // Three demo team members, none of whom work here. /about is the nearest
  // page that is about the company's people.
  { source: "/team/:slug", destination: "/about" },

  // Content with no equivalent. The home page is the honest destination.
  { source: "/our-clients", destination: "/" },
  { source: "/faq", destination: "/" },
  { source: "/blogs", destination: "/" },
  { source: "/category/:slug*", destination: "/" },
  { source: "/from-concept-to-commissioning-the-prism-way", destination: "/" },
  {
    source: "/the-power-of-integration-bridging-mechanical-electrical-it-systems",
    destination: "/",
  },
  { source: "/building-systems-that-stand-the-test-of-time", destination: "/" },
  {
    source: "/innovation-at-the-core-how-technology-is-shaping-modern-engineering",
    destination: "/",
  },
  { source: "/safety-and-quality-the-cornerstones-of-every-project", destination: "/" },

  /*
   * /privacy-policy is not in this list any more. It was redirected to the
   * home page for want of a destination; there is a real page on that exact
   * address now, so the old URL resolves to the thing it was always about.
   */
];

const nextConfig: NextConfig = {
  images: {
    // Sanity's CDN does the resizing; next/image just serves the result.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return WORDPRESS_REDIRECTS.map((redirect) => ({
      ...redirect,
      /**
       * 308, not 307. These moves are permanent, and a temporary redirect
       * leaves Google holding the old URL indefinitely — which is most of
       * what this list exists to prevent.
       */
      permanent: true,
    }));
  },
};

export default nextConfig;
