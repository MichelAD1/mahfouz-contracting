import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { RevealObserver } from "@/components/motion/RevealObserver";
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
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#eae8e3",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}
      // The inline script below adds a `js` class to this element before
      // hydration, which React would otherwise report as a className mismatch.
      suppressHydrationWarning
    >
      <head>
        {/*
         * Marks the document as scripted before first paint, which is what
         * arms the scroll reveals in globals.css. Without it every section
         * renders visible — the reveals are an enhancement, not a dependency.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-100 focus-visible:bg-ink focus-visible:px-5 focus-visible:py-3 focus-visible:t-meta focus-visible:text-paper-bright"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
