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
  /** Standards the company works to, shown under the home hero. */
  standards?: string[];
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
  /** Short form for the hero strip, e.g. "IT & Automation". Falls back to title. */
  shortTitle?: string;
  shortDescription: string;
  /** One entry per paragraph. Only the services page renders this. */
  fullDescription?: string[];
  features: string[];
  image: SiteImage;
};

/** A division reduced to what the footer's list needs. */
export type NavService = Pick<Service, "_id" | "title" | "slug">;

/**
 * What the shared header and footer run on. Fetched by the root layout, so it
 * loads once per route rather than once per section.
 */
export type SiteFrame = {
  settings: SiteSettings;
  services: NavService[];
};

/** A label/value pair. Shared by project metadata and the contact page. */
export type DetailRow = {
  label: string;
  value: string;
};

/**
 * A division, as it appears on a project. Resolved from the `service`
 * reference, so the tag on a card and the division's own page cannot drift
 * apart — and so the projects filter has something stable to match on.
 */
export type ProjectDivision = {
  _id: string;
  title: string;
  slug: string;
};

/** A project as it appears in a listing: a card, and nothing more. */
export type Project = {
  _id: string;
  name: string;
  slug: string;
  category?: string;
  location?: string;
  year?: string;
  client?: string;
  status?: string;
  summary?: string;
  cover: SiteImage;
  details?: DetailRow[];
  divisions?: ProjectDivision[];
  featured?: boolean;
};

/**
 * A project plus the fields only its own page needs. Listings deliberately do
 * not carry these — a projects index should not fetch five galleries and three
 * bodies of copy to render four cards.
 */
export type ProjectFull = Project & {
  description?: string[];
  scopeOfWorks?: string[];
  /** Manufacturers whose equipment was specified — the same documents as the logo strip. */
  equipment?: { _id: string; name: string }[];
  gallery?: SiteImage[];
  related?: Project[];
};

export type ProcessStep = {
  _id: string;
  step: string;
  title: string;
  description: string;
  image?: SiteImage;
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

export type Contact = {
  heading: string;
  description?: string;
  /** Shown beside the form, e.g. Office, Hours, Response time. */
  details?: DetailRow[];
  /** Populates the enquiry-type field on the form. */
  formSubjects?: string[];
  /**
   * Where submissions are delivered. Kept in the CMS rather than in code so
   * the client can change their own enquiry inbox without a deploy.
   */
  recipientEmail?: string;
  map?: { latitude?: number; longitude?: number; label?: string };
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
