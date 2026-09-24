/**
 * Content shapes shared by the Sanity queries and the fallback content module.
 *
 * These are the contract between the CMS and the UI. UI components import from
 * here; they never import the Sanity client.
 *
 * What a type promises is what `fetch.ts` guarantees at runtime, not what the
 * CMS guarantees: every list is always an array (possibly empty), and a field
 * marked required here is filled from the fallback when the CMS leaves it
 * empty. Everything optional really can be missing, and components treat it so.
 */

import type { OpeningHours } from "@/lib/hours";

export type { OpeningHours };

/** The editor's crop, as fractions of the original image cut from each edge. */
export type ImageCrop = { top: number; bottom: number; left: number; right: number };

/** The editor's focal point, as fractions of the original image. */
export type ImageHotspot = { x: number; y: number; width: number; height: number };

/** An image that may come from Sanity, from a local file, or not exist yet. */
export type SiteImage = {
  /** Resolved Sanity CDN url, when the content came from the CMS. */
  url?: string;
  /** Local path under /public, used by fallback content. */
  src?: string;
  /** Empty only for an image that is purely decorative. */
  alt?: string;
  /** Low-quality image placeholder, when Sanity supplied one. */
  lqip?: string;
  aspectRatio?: number;
  /**
   * What photograph belongs in this slot. Rendered by `ImageSlot` when there is
   * no asset, so an empty slot reads as a measured placeholder rather than a
   * broken image. See temp/PLAN.md §4.
   */
  slotHint?: string;
  /** The Sanity asset id. With it the CDN can apply the editor's crop. */
  assetId?: string;
  crop?: ImageCrop;
  /** Kept in frame by `object-position` at every size the image is shown at. */
  hotspot?: ImageHotspot;
};

/** A photograph in a project's carousel. */
export type GalleryImage = SiteImage & { caption?: string };

export type Cta = {
  label: string;
  href: string;
};

export type NavItem = Cta;

export type ButtonStyle = "solid" | "outline";

export type Button = Cta & { style?: ButtonStyle };

/** The plate a page opens on. Every page owns one. */
export type PageHero = {
  /** Line breaks are deliberate: each line is set, and animated, on its own. */
  heading: string;
  lead?: string;
  image?: SiteImage;
  buttons: Button[];
};

export type SocialLink = {
  platform: string;
  url: string;
};

/** The address split into the parts search engines read. */
export type PostalAddress = {
  streetAddress?: string;
  locality?: string;
  region?: string;
  postalCode?: string;
  countryCode?: string;
};

export type FooterCopy = {
  navHeading: string;
  servicesHeading: string;
  contactHeading: string;
  /** The links in the bottom line, e.g. Privacy. */
  legalLinks: NavItem[];
  /** Printed after the © and the year. Falls back to the company name. */
  copyright?: string;
};

/** Search-and-sharing wording for one route. */
export type Seo = {
  title?: string;
  description?: string;
  image?: SiteImage;
};

export type SiteSettings = {
  companyName: string;
  shortName: string;
  descriptor?: string;
  tagline?: string;
  /** For light backgrounds. */
  logo?: SiteImage;
  /** For dark backgrounds. Without it, `logo` is shown in white. */
  logoOnDark?: SiteImage;
  showNameWithLogo?: boolean;
  favicon?: SiteImage;
  phones: { label: string; number: string }[];
  emails: string[];
  address: { lines: string[] };
  postalAddress: PostalAddress;
  openingHours: OpeningHours[];
  areaServed: string[];
  socials: SocialLink[];
  nav: NavItem[];
  /** The header's button, e.g. Request a Quote. */
  headerCta: Cta;
  /** Standards the company works to, shown under the home hero. */
  standards: string[];
  footerNote?: string;
  footer: FooterCopy;
  /** The site-wide default, used by any page that has not set its own. */
  seo: Seo;
};

export type Service = {
  _id: string;
  title: string;
  /** Two-letter division code — real metadata, used instead of a decorative 01–05. */
  code?: string;
  slug: string;
  /** Short form for the hero strip, e.g. "IT & Automation". Falls back to title. */
  shortTitle?: string;
  shortDescription?: string;
  /** One entry per paragraph. Only the services page renders this. */
  fullDescription: string[];
  features: string[];
  image?: SiteImage;
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
 * reference, so the division named on a project page and the division's own
 * section on /services cannot drift apart.
 */
export type ProjectDivision = {
  _id: string;
  title: string;
  slug: string;
};

/** A label a project carries, and a button in the projects filter. */
export type ProjectTag = {
  _id: string;
  title: string;
  slug: string;
};

/** The sector a project was for. One per project. */
export type ProjectCategory = ProjectTag;

/** A project as it appears in a listing: a card, and nothing more. */
export type Project = {
  _id: string;
  name: string;
  slug: string;
  category?: ProjectCategory;
  city?: string;
  /** The one fact a card prints under the project's name. */
  country?: string;
  /** More specific than the city - a district, a building or a site. */
  location?: string;
  year?: string;
  client?: string;
  status?: string;
  summary?: string;
  cover?: SiteImage;
  tags: ProjectTag[];
  divisions: ProjectDivision[];
  featured?: boolean;
};

/**
 * A project plus the fields only its own page needs. Listings deliberately do
 * not carry these — a projects index should not fetch five galleries and three
 * bodies of copy to render four cards.
 */
export type ProjectFull = Project & {
  description: string[];
  scopeOfWorks: string[];
  details: DetailRow[];
  /** Manufacturers whose equipment was specified — the same documents as the logo strip. */
  equipment: { _id: string; name: string }[];
  gallery: GalleryImage[];
  /** Whether the page may be indexed and listed in the sitemap. */
  searchVisible?: boolean;
  seo: Seo;
};

export type ProcessStep = {
  _id: string;
  step: string;
  title: string;
  description?: string;
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

/** The banner most pages end on. */
export type ClosingCta = {
  heading: string;
  lead?: string;
  cta?: Cta;
  background?: SiteImage;
};

/** A page's own version of it: whichever fields are set replace the shared ones. */
export type ClosingCtaOverride = Partial<ClosingCta>;

/**
 * A section's furniture: the label in the sheet margin, the heading, the lead
 * under it, and the wording on the link out of it. No section uses all four.
 */
export type SectionIntro = {
  label?: string;
  heading: string;
  lead?: string;
  linkLabel?: string;
};

/** One short point under the Who we are section. */
export type Highlight = {
  title: string;
  text?: string;
};

/**
 * The first section of the About page, and the short version of it the home
 * page carries.
 */
export type WhoWeAre = {
  /** The margin label, e.g. Who we are. */
  label?: string;
  /** The oversized statement. */
  heading: string;
  /** One entry per paragraph; the home page shows the first. */
  body: string[];
  image?: SiteImage;
  /**
   * The title block over the photograph. Label/value rows rather than
   * counters: this carried "5 Divisions" and "2 Countries", which is the
   * pattern the hero band was cut for. Named, the same space says which
   * divisions and which countries.
   */
  details: DetailRow[];
  highlights: Highlight[];
  cta?: Cta;
};

export type HomePage = {
  hero: PageHero;
  /** The line above the division strip. */
  divisionStrip: string;
  /** Printed before the standards on the hero's last line, e.g. Worked to. */
  standardsLabel?: string;
  /** The link from the home page's short Who we are through to /about. */
  aboutLinkLabel?: string;
  capabilities: SectionIntro;
  selectedWork: SectionIntro;
  /** How many project cards Selected work shows. */
  selectedWorkLimit: number;
  closingCta?: ClosingCtaOverride;
  seo: Seo;
};

export type AboutPage = {
  hero: PageHero;
  whoWeAre: WhoWeAre;
  process: SectionIntro;
  closingCta?: ClosingCtaOverride;
  seo: Seo;
};

export type ServicesPage = {
  hero: PageHero;
  closingCta?: ClosingCtaOverride;
  seo: Seo;
};

export type ProjectFilterCopy = {
  allLabel: string;
  categoriesLabel?: string;
  projectSingular: string;
  projectPlural: string;
};

export type ProjectDetailLabels = {
  overview: string;
  scope: string;
  equipment: string;
  gallery: string;
  nextProject: string;
  allProjects: string;
  category: string;
  /** The fact for the city and the country. */
  location: string;
  /** The fact for the site or district. */
  site: string;
  tags: string;
  divisions: string;
  status: string;
  year: string;
  client: string;
};

export type ProjectsPage = {
  hero: PageHero;
  filters: ProjectFilterCopy;
  /** Shown when the chosen filter has nothing under it. */
  empty: SectionIntro;
  /** "More work, on request", under the grid. */
  more: SectionIntro;
  detail: ProjectDetailLabels;
  closingCta?: ClosingCtaOverride;
  seo: Seo;
};

export type EnquiryFormCopy = {
  nameLabel: string;
  companyLabel: string;
  emailLabel: string;
  phoneLabel: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  submitLabel: string;
  submittingLabel: string;
  successLead?: string;
};

/** The column beside the enquiry form. */
export type ContactDirectCopy = {
  /** The margin label beside the form, in the sheet's left column. */
  formLabel?: string;
  heading: string;
  officeLabel: string;
  emailLabel: string;
  hoursLabel: string;
  closedLabel: string;
  checklistLabel: string;
};

export type ContactPage = {
  hero: PageHero;
  form: EnquiryFormCopy;
  /** Populates the enquiry-type field on the form. */
  formSubjects: string[];
  /**
   * Where submissions are delivered. Kept in the CMS rather than in code so
   * the client can change their own enquiry inbox without a deploy.
   */
  recipientEmail?: string;
  direct: ContactDirectCopy;
  /** Extra rows beside the form, e.g. Response time. */
  details: DetailRow[];
  /** What makes an enquiry answerable, listed under the contact block. */
  enquiryChecklist: string[];
  map?: { latitude?: number; longitude?: number; label?: string };
  seo: Seo;
};

export type NotFoundPage = {
  hero: PageHero;
  closingCta?: ClosingCtaOverride;
};

export type PolicySection = {
  heading: string;
  body: string[];
};

/**
 * The privacy policy. `seo` sits on the document rather than in the page copy
 * because this is the one route whose metadata belongs with its own text -
 * the same place a replacement policy would arrive.
 */
export type PrivacyPolicy = {
  heading: string;
  heroImage?: SiteImage;
  /** ISO date, rendered in the sheet margin. */
  updated?: string;
  /** One entry per paragraph; the first becomes the lead under the heading. */
  intro: string[];
  sections: PolicySection[];
  seo: Seo;
};

/** Everything the home page renders, in one query. */
export type HomePageContent = {
  page: HomePage;
  whoWeAre: WhoWeAre;
  services: Service[];
  projects: Project[];
  partners: Partner[];
  closingCta: ClosingCta;
};

/** Everything the projects index renders. */
export type ProjectsIndexContent = {
  page: ProjectsPage;
  projects: Project[];
  /** Every tag, in the order the studio sets. The filter shows those in use. */
  tags: ProjectTag[];
  categories: ProjectCategory[];
  closingCta: ClosingCta;
};
