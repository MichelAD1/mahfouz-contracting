import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSiteFrame } from "@/sanity/lib/fetch";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mahfouzcontracting.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mahfouz Contracting — Engineering, contracting and maintenance",
    template: "%s — Mahfouz Contracting",
  },
  description:
    "Integrated electrical, mechanical, IT and automation works for commercial, industrial and institutional clients. Engineered, installed and maintained in-house.",
  openGraph: {
    type: "website",
    siteName: "Mahfouz Contracting",
    title: "Mahfouz Contracting — Engineering, contracting and maintenance",
    description:
      "Integrated electrical, mechanical, IT and automation works, engineered and maintained in-house.",
    url: siteUrl,
  },
  // No canonical here on purpose. A canonical in the root layout is inherited
  // by every page, so each one would declare itself a duplicate of the home
  // page. Canonicals are set per page instead.
};

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

  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body>
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
