import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /**
       * The Studio is the CMS, not a page. A prefix covers everything under
       * it, so `/studio/structure` and the rest need no entries of their own.
       *
       * Nothing else belongs here. In particular the project detail pages are
       * kept crawlable despite being `noindex`: a crawler has to fetch a page
       * to read the tag that excludes it, so disallowing them would preserve
       * exactly the indexing this site is trying to prevent.
       */
      disallow: "/studio",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
