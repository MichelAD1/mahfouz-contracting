import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSiteFrame } from "@/sanity/lib/fetch";
import { hasImage, isVector, sanityImageUrl } from "@/sanity/lib/image";
import type { SiteImage } from "@/sanity/lib/types";
import { siteUrl } from "@/lib/site";
import { titleTemplate } from "@/lib/metadata";
import { buildBusinessJsonLd, serializeJsonLd } from "@/lib/structured-data";
import "./globals.css";

/**
 * Archivo is loaded as a variable font with its width axis, which is what the
 * display type uses. Without `wdth` this is the same grotesque every other site
 * reaches for.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

/**
 * The browser-tab icon from Site settings, as PNGs cut square by the CDN.
 * Without one, nothing is declared and browsers fetch /favicon.ico as they
 * always have. An SVG is handed over as it is: browsers draw it at any size,
 * but it cannot stand in as the home-screen icon.
 */
function faviconIcons(favicon?: SiteImage): Metadata["icons"] {
  if (!hasImage(favicon)) return undefined;

  // A file in /public is served as it is; the CDN only sizes CMS uploads.
  if (!favicon.url) return { icon: [{ url: favicon.src! }], apple: [{ url: favicon.src! }] };

  if (isVector(favicon)) return { icon: [{ url: favicon.url, type: "image/svg+xml" }] };

  const square = (size: number) =>
    sanityImageUrl(favicon, { width: size, height: size, format: "png" });

  return {
    icon: [
      { url: square(32), sizes: "32x32", type: "image/png" },
      { url: square(192), sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: square(180), sizes: "180x180", type: "image/png" }],
  };
}

/**
 * The site's defaults, out of Site settings: the title every page's template
 * wraps, the description any page without its own inherits, and the icon.
 *
 * No canonical here on purpose. A canonical in the root layout is inherited
 * by every page, so each one would declare itself a duplicate of the home
 * page. Canonicals are set per page instead.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteFrame();

  const title = settings.seo.title ?? settings.companyName;
  const description = settings.seo.description;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: titleTemplate(settings.companyName) },
    description,
    icons: faviconIcons(settings.favicon),
    openGraph: {
      type: "website",
      siteName: settings.companyName,
      title,
      description,
      url: siteUrl,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#eae8e3",
  colorScheme: "light",
};

/**
 * The header and footer live here rather than in each page, so a new route
 * gets the site's chrome by existing. `<main id="main">` is here for the same
 * reason: the skip link cannot silently stop working on a page that forgot it.
 */
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { settings, services } = await getSiteFrame();

  /**
   * Built from the same settings the header and footer render, so the company
   * Google is told about and the company on the page cannot drift apart.
   */
  const businessJsonLd = serializeJsonLd(buildBusinessJsonLd({ settings, services }));

  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: businessJsonLd }}
        />
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-100 focus-visible:bg-ink focus-visible:px-5 focus-visible:py-3 focus-visible:t-meta focus-visible:text-paper-bright"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Header settings={settings} />
          <main id="main">{children}</main>
          <Footer settings={settings} services={services} />
        </MotionProvider>
      </body>
    </html>
  );
}
