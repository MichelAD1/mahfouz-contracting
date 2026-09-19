/**
 * The site's own absolute address, resolved once.
 *
 * Everything that has to name the site from the outside reads from here:
 * canonicals, the sitemap, robots, Open Graph and the JSON-LD. Before this
 * module the origin was a `??` expression inside the root layout, which was
 * fine while the layout was the only file that needed it and would have become
 * four copies the moment this step added four more.
 */

/** The live domain. Also the last line of defence, below. */
const CANONICAL_ORIGIN = "https://mahfouzcontracting.com";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1", "[::1]"]);

/**
 * Resolving this wrong is silent and expensive.
 *
 * `NEXT_PUBLIC_SITE_URL` is `http://localhost:3333` in development, which is
 * correct there and catastrophic in production: every canonical, every sitemap
 * entry and every Open Graph URL would point at a machine Google cannot reach,
 * and the entire SEO step would be worth nothing while appearing to work. The
 * page would render, the tags would be present, and they would all be wrong.
 *
 * So a localhost origin in a production build is treated as a misconfiguration
 * rather than an instruction: the real domain is used, and the mistake is
 * logged loudly enough to find in the host's logs.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const isProduction = process.env.NODE_ENV === "production";

  if (!configured) {
    if (isProduction) {
      console.error(
        `[site] NEXT_PUBLIC_SITE_URL is not set. Falling back to ${CANONICAL_ORIGIN}. ` +
          "Set it in the deployment environment.",
      );
    }
    return CANONICAL_ORIGIN;
  }

  let parsed: URL;
  try {
    parsed = new URL(configured);
  } catch {
    console.error(
      `[site] NEXT_PUBLIC_SITE_URL is not a valid URL ("${configured}"). ` +
        `Falling back to ${CANONICAL_ORIGIN}.`,
    );
    return CANONICAL_ORIGIN;
  }

  if (isProduction && LOCAL_HOSTNAMES.has(parsed.hostname)) {
    console.error(
      `[site] NEXT_PUBLIC_SITE_URL points at ${parsed.origin} in a production build. ` +
        `Falling back to ${CANONICAL_ORIGIN} so canonicals and sitemap entries stay reachable.`,
    );
    return CANONICAL_ORIGIN;
  }

  return parsed.href.replace(/\/+$/, "");
}

export const siteUrl = resolveSiteUrl();

/** Joins a root-relative path onto the site origin. */
export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Whether project detail pages are fit to be indexed.
 *
 * Step 3 put `noindex` on them: they carry a real name and a stock cover, and
 * placeholder copy for everything else. Two places have to agree about that —
 * the page's own `robots` metadata and the sitemap — and if they ever disagree
 * the site asks Google to index pages it has told Google to ignore, which
 * Search Console reports as an error rather than a warning.
 *
 * One constant, both readers. Flip it to `true` once the client has verified
 * the project records and the detail pages enter the sitemap by themselves.
 */
export const PROJECT_DETAILS_INDEXABLE = false;
