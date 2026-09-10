import type { Metadata } from "next";

/**
 * The studio's metadata lives here rather than on the page, because the page
 * has to be a client component: `sanity` pulls in `swr`, whose react-server
 * entry point has no default export, so it cannot be imported from the RSC
 * graph at all.
 */
export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
