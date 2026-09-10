/**
 * Content shapes shared by the Sanity queries and the fallback content module.
 *
 * These are the contract between the CMS and the UI. UI components import from
 * here; they never import the Sanity client.
 */

/** An image that may come from Sanity, from a local file, or not exist yet. */
export type SiteImage = {
  /** Resolved Sanity CDN url, when the content came from the CMS. */
  url?: string;
  /** Local path under /public, used by fallback content. */
  src?: string;
  alt: string;
  /** Low-quality image placeholder, when Sanity supplied one. */
  lqip?: string;
  aspectRatio?: number;
  /**
   * What photograph belongs in this slot. Rendered by `ImageSlot` when there is
   * no asset, so an empty slot reads as a measured placeholder rather than a
   * broken image. See temp/PLAN.md §4.
   */
  slotHint?: string;
};

export type Metric = {
  figure: string;
  label: string;
  note?: string;
  /** Drives the animated counter. Omit for non-numeric figures. */
  countTo?: number;
  prefix?: string;
  suffix?: string;
};

export type Cta = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type SiteSettings = {
  companyName: string;
  shortName: string;
  descriptor: string;
  tagline: string;
  phones: { label: string; number: string }[];
  emails: string[];
  address: { lines: string[] };
  socials: { platform: string; url: string }[];
  nav: NavItem[];
  footerNote: string;
};

export type Hero = {
  headingLines: string[];
  lead: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  background: SiteImage;
  metrics: Metric[];
};

export type About = {
  sheet: string;
  statement: string;
  body: string[];
  cta: Cta;
  images: SiteImage[];
  metrics: Metric[];
};

export type Service = {
  _id: string;
  title: string;
  /** Two-letter division code — real metadata, used instead of a decorative 01–05. */
  code: string;
  slug: string;
  shortDescription: string;
  features: string[];
  image: SiteImage;
};

export type ProjectDetail = {
  label: string;
  value: string;
};

export type Project = {
  _id: string;
  name: string;
  slug: string;
  category?: string;
  location?: string;
  year?: string;
  client?: string;
  summary?: string;
  cover: SiteImage;
  details?: ProjectDetail[];
  featured?: boolean;
};

export type ProcessStep = {
  _id: string;
  step: string;
  title: string;
  description: string;
};

export type Partner = {
  _id: string;
  name: string;
  logo?: SiteImage;
  url?: string;
};

export type Testimonial = {
  _id: string;
  name: string;
  company?: string;
  role?: string;
  quote: string;
  image?: SiteImage;
  rating?: number;
};

export type ClosingCta = {
  heading: string;
  lead: string;
  cta: Cta;
  background: SiteImage;
};

/** Everything the home page needs, in one query. */
export type HomePageContent = {
  settings: SiteSettings;
  hero: Hero;
  about: About;
  services: Service[];
  projects: Project[];
  process: ProcessStep[];
  partners: Partner[];
  closingCta: ClosingCta;
};
