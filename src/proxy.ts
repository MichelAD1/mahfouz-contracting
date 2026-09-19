import { NextResponse } from "next/server";

/**
 * The old theme's demo pages, answered with 410 Gone.
 *
 * These are not content that moved. They are the AxiomThemes demo — typography
 * specimens, four blog layout variants, a shop nobody ever sold anything
 * through — published by accident and indexed anyway. Redirecting them to the
 * home page would ask Google to keep them, then quietly reclassify them as
 * soft 404s. 410 says the page is gone deliberately, which is the one status
 * that gets a URL dropped from the index quickly.
 *
 * This is the only reason the project has a proxy at all. Next's `redirects`
 * config cannot express a status other than 307 or 308, and the alternative —
 * a route handler per dead path — is fifteen files to return one header.
 *
 * `matcher` is exhaustive and exact, so anything reaching this function is by
 * definition on the list; there is no second check to keep in step with it.
 * Nothing else in the app is matched, so no live route pays for this.
 */
const GONE_BODY = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Page removed — Mahfouz Contracting</title>
  </head>
  <body style="font-family: system-ui, sans-serif; background: #eae8e3; color: #0a1628; margin: 0; display: grid; place-items: center; min-height: 100vh;">
    <main style="max-width: 32rem; padding: 2rem;">
      <h1 style="font-size: 1.5rem; margin: 0 0 1rem;">This page has been removed</h1>
      <p style="margin: 0 0 1.5rem; line-height: 1.6;">
        It belonged to the previous version of this site and no longer exists.
      </p>
      <a href="/" style="color: #a9673a;">Go to the home page</a>
    </main>
  </body>
</html>
`;

export function proxy() {
  return new NextResponse(GONE_BODY, {
    status: 410,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export const config = {
  matcher: [
    "/typography",
    "/shortcodes",
    "/service-plus",
    "/newsletter-popup",
    "/cart",
    "/checkout",
    "/blog-masonry-2-columns",
    "/blog-masonry-3-columns",
    "/blog-masonry-4-columns",
    "/blog-grid-2-columns",
    "/blog-grid-3-columns",
    "/blog-grid-4-columns",
    "/blog-portfolio-3-columns",
    "/blog-portfolio-4-columns",
    "/blog-list",
  ],
};
