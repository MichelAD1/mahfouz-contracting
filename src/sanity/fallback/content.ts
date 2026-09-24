import type {
  AboutPage,
  ClosingCta,
  ContactPage,
  HomePage,
  NotFoundPage,
  Partner,
  PrivacyPolicy,
  ProcessStep,
  Project,
  ProjectCategory,
  ProjectDivision,
  ProjectFull,
  ProjectsPage,
  ProjectTag,
  Service,
  ServicesPage,
  SiteImage,
  SiteSettings,
} from "@/sanity/lib/types";

/**
 * Fallback content — used whenever no Sanity project is configured, when a
 * document has not been created yet, and as the seed for the dataset.
 *
 * Everything here is sourced from the client's own material: the design canvas
 * and the live site's REST API. Nothing is invented except where marked TODO.
 * Theme-demo filler on the live site (the "Prism" brand name, lorem ipsum
 * portfolio entries, placeholder emails, 0% counters) has been left out
 * deliberately — see temp/PLAN.md §4 and §8.
 *
 * Imports from this module must stay type-only: `scripts/seed.ts` runs it
 * through the Sanity CLI, outside Next.
 */

/**
 * Divisions as they appear on a project, mirroring the `service` documents by
 * `_id` so the same records come back once the dataset is populated.
 */
const DIVISION = {
  engineering: {
    _id: "svc-engineering",
    title: "Engineering",
    slug: "engineering-design-consultancy",
  },
  electrical: {
    _id: "svc-electrical",
    title: "Electrical",
    slug: "electrical-division",
  },
  mechanical: {
    _id: "svc-mechanical",
    title: "Mechanical",
    slug: "mechanical-division",
  },
  it: {
    _id: "svc-it",
    title: "IT & Automation",
    slug: "information-technology-automation-division",
  },
  maintenance: {
    _id: "svc-maintenance",
    title: "Maintenance",
    slug: "maintenance-facility-support",
  },
} satisfies Record<string, ProjectDivision>;

/**
 * Project tags: the filter buttons on /projects and the line under each card.
 *
 * They start out mirroring the divisions, because that is what the design
 * canvas tags projects with. They are their own documents so the client can
 * add a tag a division does not cover without creating a division for it.
 *
 * Ordered as the canvas orders its filter row.
 */
const TAG = {
  electrical: { _id: "tag-electrical", title: "Electrical", slug: "electrical" },
  mechanical: { _id: "tag-mechanical", title: "Mechanical", slug: "mechanical" },
  it: { _id: "tag-it-automation", title: "IT & Automation", slug: "it-automation" },
  maintenance: { _id: "tag-maintenance", title: "Maintenance", slug: "maintenance" },
  engineering: { _id: "tag-engineering", title: "Engineering", slug: "engineering" },
} satisfies Record<string, ProjectTag>;

export const fallbackProjectTags: ProjectTag[] = [
  TAG.electrical,
  TAG.mechanical,
  TAG.it,
  TAG.maintenance,
  TAG.engineering,
];

/**
 * Sectors. These five were a fixed list typed into the schema; they are
 * documents now, so the client can rename, reorder or add to them.
 */
const CATEGORY = {
  commercial: { _id: "cat-commercial", title: "Commercial", slug: "commercial" },
  industrial: { _id: "cat-industrial", title: "Industrial", slug: "industrial" },
  institutional: {
    _id: "cat-institutional",
    title: "Institutional",
    slug: "institutional",
  },
  residential: { _id: "cat-residential", title: "Residential", slug: "residential" },
  infrastructure: {
    _id: "cat-infrastructure",
    title: "Infrastructure",
    slug: "infrastructure",
  },
} satisfies Record<string, ProjectCategory>;

export const fallbackProjectCategories: ProjectCategory[] = [
  CATEGORY.commercial,
  CATEGORY.industrial,
  CATEGORY.institutional,
  CATEGORY.residential,
  CATEGORY.infrastructure,
];

export const fallbackSettings: SiteSettings = {
  companyName: "Mahfouz Contracting",
  shortName: "Mahfouz",
  descriptor: "Contracting",
  tagline: "Built right. Built to last.",
  /**
   * The MC mark from the brand identity presentation - Direction 01, page 5 -
   * without the lettering under it, taken from the PDF's own vector paths so
   * it stays crisp at any size. The colours are the brand's: the navy M and
   * the grey C on light grounds, and the whole mark in #fcfcf7 on dark ones,
   * which is the reversed version the same presentation shows on page 6.
   *
   * It is a symbol without the name, so the typeset wordmark stays beside it.
   */
  logo: {
    src: "/brand/mahfouz-mark.svg",
    alt: "Mahfouz Contracting",
    aspectRatio: 488.14 / 260.44,
  },
  logoOnDark: {
    src: "/brand/mahfouz-mark-light.svg",
    alt: "Mahfouz Contracting",
    aspectRatio: 488.14 / 260.44,
  },
  showNameWithLogo: true,
  /** The reversed mark on the brand navy, square - the tab and home-screen icon. */
  favicon: {
    src: "/brand/mahfouz-icon.png",
    alt: "Mahfouz Contracting",
    aspectRatio: 1,
  },
  phones: [
    { label: "Liberia", number: "+231 077 340 0671" },
    { label: "Lebanon", number: "+961 3 246 171" },
  ],
  // TODO(client): the live site shows theme placeholders (info@mail.com,
  // info@email.com). Confirm the real address before launch.
  emails: ["info@mahfouzcontracting.com"],
  address: {
    lines: [
      "Sink 14th Street",
      "Bishop Roland J. Diggs Building",
      "Monrovia, Montserrado County",
      "Liberia",
    ],
  },
  /** The same address in the parts Google reads. */
  postalAddress: {
    streetAddress: "Sink 14th Street, Bishop Roland J. Diggs Building",
    locality: "Monrovia",
    region: "Montserrado County",
    countryCode: "LR",
  },
  /** The only figures here taken from the live WordPress site. */
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "06:00",
      closes: "18:00",
    },
    { days: ["Saturday"], opens: "06:00", closes: "16:00" },
  ],
  areaServed: ["Liberia", "Lebanon"],
  // TODO(client): the live site's social links point at AxiomThemes accounts.
  socials: [],
  /**
   * Projects and About are swapped from the obvious order. The work comes
   * before the write-up: a contractor is judged on what they have built,
   * and About is the page people read last, if at all.
   *
   * This list is the one source. The header, the footer, the mobile menu and
   * the breadcrumbs all read it, so the order is changed here and in the
   * studio, and nowhere else.
   */
  nav: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  headerCta: { label: "Request a Quote", href: "/contact" },
  /**
   * Shown as the line under the home hero, in place of a "6 standards worked
   * to" metric. The count was meaningless — nobody cares that it is six, they
   * care that it is these six, and to the people who evaluate contractors
   * these read as credentials.
   */
  standards: ["IEC", "NEC", "BS", "NFPA", "ASHRAE", "SMACNA"],
  footerNote: "Engineering, contracting and maintenance",
  footer: {
    navHeading: "Navigate",
    servicesHeading: "Services",
    contactHeading: "Contact",
    legalLinks: [{ label: "Privacy", href: "/privacy-policy" }],
  },
  /**
   * The site-wide default: the title every page's template wraps, and the
   * description any page that has not set its own inherits.
   */
  seo: {
    title: "Mahfouz Contracting - Engineering, contracting and maintenance",
    description:
      "Integrated electrical, mechanical, IT and automation works for commercial, industrial and institutional clients. Engineered, installed and maintained in-house.",
  },
};

/**
 * Ordered by the project lifecycle — design, build, integrate, support —
 * which mirrors the company's own four-stage process rather than an
 * arbitrary sequence. Copy condensed from the live site's division pages.
 */
export const fallbackServices: Service[] = [
  {
    _id: "svc-engineering",
    code: "ED",
    title: "Engineering & Design Consultancy",
    shortTitle: "Engineering",
    slug: "engineering-design-consultancy",
    shortDescription:
      "Coordinated MEP and IT design - load calculations, BOQs, tender documents and BIM development, issued before work starts on site.",
    fullDescription: [],
    features: [
      "Mechanical, electrical and plumbing design",
      "IT and low-voltage system planning",
      "Load calculations and system simulations",
      "Bills of quantities and tender documents",
    ],
    image: {
      src: "/images/divisions/engineering.webp",
      alt: "Engineering drawings and design review materials",
      aspectRatio: 1024 / 1536,
    },
  },
  {
    _id: "svc-electrical",
    code: "EL",
    title: "Electrical",
    slug: "electrical-division",
    shortDescription:
      "Power distribution, panels, protection and low-current works, engineered and tested to IEC, NEC and BS.",
    fullDescription: [],
    features: [
      "LV distribution, panels and lighting",
      "MV and HV transformers, switchgear and substations",
      "CCTV, access control and fire alarm systems",
      "Generators, ATS, UPS and load management",
    ],
    image: {
      src: "/images/divisions/electrical.webp",
      alt: "Electrical distribution panels with cable containment and conduit",
      aspectRatio: 1024 / 1536,
    },
  },
  {
    _id: "svc-mechanical",
    code: "ME",
    title: "Mechanical",
    slug: "mechanical-division",
    shortDescription:
      "HVAC, plumbing, pumping and NFPA-compliant firefighting, sized on real load calculations rather than oversized for safety.",
    fullDescription: [],
    features: [
      "Chillers, VRF and VRV, and air handling units",
      "Water supply, drainage and process piping",
      "Fire sprinklers, hydrants, pumps and tanks",
      "Pressure testing and commissioning",
    ],
    image: {
      src: "/images/divisions/mechanical.webp",
      alt: "Mechanical plant equipment and pipework",
      aspectRatio: 1024 / 1536,
    },
  },
  {
    _id: "svc-it",
    /**
     * IA, not IT. The hero's division strip sets the code beside the short
     * name, so an "IT" code next to "IT & Automation" printed the same two
     * letters twice in one row. IA takes the initial of each half of the
     * full title, keeps the two-letter pattern the other four follow, and
     * leaves the short name reading "IT & Automation" — which is what the
     * design canvas specifies and what a client searches.
     */
    code: "IA",
    title: "Information Technology & Automation",
    shortTitle: "IT & Automation",
    slug: "information-technology-automation-division",
    shortDescription:
      "Structured cabling, networks, security and building automation, integrated with the electrical and mechanical scope.",
    fullDescription: [],
    features: [
      "Data and fiber optic cabling",
      "Server rooms, switches and wireless access",
      "Access control and intrusion detection",
      "Building management and energy monitoring",
    ],
    image: {
      src: "/images/divisions/it-automation.webp",
      alt: "Network and automation control equipment",
      aspectRatio: 1024 / 1536,
    },
  },
  {
    _id: "svc-maintenance",
    code: "MF",
    title: "Maintenance & Facility Support",
    shortTitle: "Maintenance",
    slug: "maintenance-facility-support",
    shortDescription:
      "Preventive and corrective programs, annual contracts and compliance testing that keep installed systems performing after handover.",
    fullDescription: [],
    features: [
      "Scheduled preventive maintenance",
      "Emergency fault isolation and repair",
      "Annual maintenance contracts",
      "Thermal imaging and compliance audits",
    ],
    image: {
      src: "/images/divisions/maintenance.webp",
      alt: "Maintenance tools and servicing equipment",
      aspectRatio: 1024 / 1536,
    },
  },
];

/**
 * TODO(client): these four names are the only real portfolio data that
 * exists. Location, year, client and scope are all unknown, and the live
 * site's own entries are lorem ipsum on stock solar photography. The section
 * renders whatever metadata is present, so real records enrich it with no
 * code change. See temp/PLAN.md §8, item 2.
 *
 * TODO(client): the tags and divisions below are inferred from the project
 * names and the design canvas, not confirmed by the client. They drive the
 * whole filter on /projects, so they need checking before launch. Year and
 * client are deliberately left unset rather than guessed — those are claims
 * about specific work.
 *
 * TODO(client): the city and country are the company's own address, set as a
 * stand-in so the cards have a line under the name. Replace each with where
 * the work actually was.
 */
export const fallbackProjects: Project[] = [
  {
    _id: "prj-panels-maintenance",
    name: "Panels Maintenance",
    slug: "panels-maintenance",
    category: CATEGORY.commercial,
    city: "Monrovia",
    country: "Liberia",
    featured: true,
    tags: [TAG.electrical, TAG.maintenance],
    divisions: [DIVISION.electrical, DIVISION.maintenance],
    cover: {
      src: "/images/switchgear-assembly.webp",
      alt: "Electricians assembling and wiring switchgear panels in a workshop",
      aspectRatio: 1,
    },
  },
  {
    _id: "prj-green-enterprises",
    name: "Green Enterprises",
    slug: "green-enterprises",
    category: CATEGORY.commercial,
    city: "Monrovia",
    country: "Liberia",
    tags: [TAG.electrical, TAG.mechanical],
    divisions: [DIVISION.electrical, DIVISION.mechanical],
    cover: {
      src: "/images/site-team-review.webp",
      alt: "Site team reviewing drawings in front of a concrete frame",
      aspectRatio: 1,
    },
  },
  {
    _id: "prj-reliable-energy",
    name: "Reliable Energy",
    slug: "reliable-energy",
    category: CATEGORY.commercial,
    city: "Monrovia",
    country: "Liberia",
    tags: [TAG.electrical],
    divisions: [DIVISION.electrical],
    cover: {
      src: "/images/switchgear-assembly.webp",
      alt: "Electricians assembling and wiring switchgear panels in a workshop",
      aspectRatio: 1,
    },
  },
  {
    _id: "prj-branding-ideas",
    name: "Branding Ideas",
    slug: "branding-ideas",
    category: CATEGORY.commercial,
    city: "Monrovia",
    country: "Liberia",
    tags: [TAG.it],
    divisions: [DIVISION.it],
    cover: {
      src: "/images/site-tower-construction.webp",
      alt: "Tower under construction with a crane above the exposed frame",
      aspectRatio: 1289 / 860,
    },
  },
];

/**
 * The site's own photograph library, for the galleries below. Every one is a
 * stand-in: none of them shows any of these projects.
 */
const LIBRARY = {
  tower: {
    src: "/images/site-tower-construction.webp",
    alt: "Tower under construction with a crane above the exposed frame",
    aspectRatio: 1289 / 860,
  },
  panels: {
    src: "/images/divisions/electrical.webp",
    alt: "Electrical distribution panels with cable containment and conduit",
    aspectRatio: 1024 / 1536,
  },
  team: {
    src: "/images/site-team-review.webp",
    alt: "Site team reviewing drawings in front of a concrete frame",
    aspectRatio: 1,
  },
  tools: {
    src: "/images/divisions/maintenance.webp",
    alt: "Servicing tools laid out for a scheduled maintenance visit",
    aspectRatio: 1024 / 1536,
  },
  plant: {
    src: "/images/divisions/mechanical.webp",
    alt: "Air conditioning unit, pipework and fire protection symbols",
    aspectRatio: 1024 / 1536,
  },
  controls: {
    src: "/images/divisions/it-automation.webp",
    alt: "Security camera, access keypad and building controls",
    aspectRatio: 1024 / 1536,
  },
  drawings: {
    src: "/images/divisions/engineering.webp",
    alt: "Rolled drawings, a floor plan on a clipboard and a pair of dividers",
    aspectRatio: 1024 / 1536,
  },
  skyline: {
    src: "/images/hero-skyline.webp",
    alt: "City skyline of high-rise towers seen from above at first light",
    aspectRatio: 16 / 9,
  },
} satisfies Record<string, SiteImage>;

/**
 * Detail-page content, keyed by slug.
 *
 * TODO(client): EVERYTHING BELOW IS PLACEHOLDER AND MUST BE CONFIRMED OR
 * REPLACED BEFORE LAUNCH. It is transcribed from the design canvas, which was
 * written to show the layout, not to record what was actually done on this
 * job. It reads as fact and is not — a prospective client could ask about work
 * that never happened.
 *
 * It is here so the detail layout can be reviewed against real-looking copy,
 * and the copy is deliberately limited to the one project the canvas
 * specifies; the other three carry a gallery and nothing else. Every project
 * page carries `noindex` until its "Show in search engines" switch is turned
 * on in the studio.
 *
 * TODO(client): every gallery is library photography, not pictures of these
 * jobs, captioned by what each photograph shows rather than as the project's.
 * Replace them with site photography.
 */
export const fallbackProjectDetails: Record<string, Partial<ProjectFull>> = {
  "panels-maintenance": {
    status: "Delivered, under maintenance",
    summary:
      "Distribution panels inspected, repaired and brought back to specification.",
    description: [
      "Mahfouz Contracting surveyed the existing distribution boards, recorded their condition and loads, and set out the corrective works required. Damaged components were replaced, terminations remade and circuits re-labelled, with the installation tested before being returned to service.",
      "The panels are now covered by a scheduled maintenance programme, with periodic inspection, thermal checks and a record kept of every intervention.",
    ],
    scopeOfWorks: [
      "Condition survey and load recording",
      "Component replacement and re-termination",
      "Circuit identification and as-built records",
      "Testing and return to service",
      "Scheduled preventive maintenance",
    ],
    equipment: [
      { _id: "ptn-schneider", name: "Schneider Electric" },
      { _id: "ptn-legrand", name: "Legrand" },
      { _id: "ptn-abb", name: "ABB" },
    ],
    // A mix of shapes on purpose - landscape, portrait and square - so the
    // carousel is reviewed against all three.
    gallery: [
      { ...LIBRARY.tower, caption: "Structure under construction" },
      { ...LIBRARY.panels, caption: "Distribution panels and cable containment" },
      { ...LIBRARY.team, caption: "Drawings reviewed on site" },
      { ...LIBRARY.tools, caption: "Tools for a scheduled maintenance visit" },
    ],
  },
  "green-enterprises": {
    gallery: [
      { ...LIBRARY.plant, caption: "Air conditioning, pipework and fire protection" },
      { ...LIBRARY.panels, caption: "Distribution panels and cable containment" },
      { ...LIBRARY.tower, caption: "Structure under construction" },
    ],
  },
  "reliable-energy": {
    gallery: [
      { ...LIBRARY.panels, caption: "Distribution panels and cable containment" },
      { ...LIBRARY.team, caption: "Drawings reviewed on site" },
      { ...LIBRARY.tools, caption: "Tools for a scheduled maintenance visit" },
    ],
  },
  "branding-ideas": {
    gallery: [
      { ...LIBRARY.controls, caption: "Access control, security and building controls" },
      { ...LIBRARY.drawings, caption: "Drawings and design review" },
      { ...LIBRARY.skyline, caption: "High-rise towers" },
    ],
  },
};

export const fallbackProcess: ProcessStep[] = [
  {
    _id: "prc-1",
    step: "01",
    title: "Understand",
    description:
      "Requirements, site conditions and constraints are established before anything is priced.",
    image: {
      src: "/images/site-team-review.webp",
      alt: "Site team reviewing drawings in front of a concrete frame",
      aspectRatio: 1,
    },
  },
  {
    _id: "prc-2",
    step: "02",
    title: "Design",
    description:
      "Drawings, load calculations and specifications are issued for approval.",
    image: {
      src: "/images/divisions/engineering.webp",
      alt: "Rolled drawings, a floor plan on a clipboard and a pair of dividers",
      aspectRatio: 1,
    },
  },
  {
    _id: "prc-3",
    step: "03",
    title: "Build",
    description:
      "Installation, testing and commissioning by in-house crews across every discipline.",
    image: {
      src: "/images/site-tower-construction.webp",
      alt: "Tower under construction with a crane above the exposed frame",
      aspectRatio: 1289 / 860,
    },
  },
  {
    _id: "prc-4",
    step: "04",
    title: "Support",
    description:
      "Scheduled maintenance and fault response continue after handover.",
    image: {
      src: "/images/divisions/maintenance.webp",
      alt: "Servicing tools laid out for a scheduled maintenance visit",
      aspectRatio: 1,
    },
  },
];

/**
 * TODO(client): these six SVGs are stand-ins, not supplied assets. Four come
 * from simple-icons (CC0) and two from Wikimedia Commons; the trademarks
 * belong to their owners either way. Before launch the client needs to
 * confirm in writing that they may display these marks — manufacturer brand
 * guidelines usually permit "authorised dealer" use and prohibit anything
 * implying endorsement — and ideally supply the official assets from their
 * supplier relationships.
 *
 * Gewiss is deliberately left without one: no clean vector was available, and
 * a traced approximation of somebody's trademark is worse than a wordmark.
 * The strip renders the name instead, which is also what every partner looked
 * like before this step.
 *
 * `aspectRatio` is each file's own viewBox ratio, so the strip sizes by
 * height and nothing is stretched.
 */
export const fallbackPartners: Partner[] = [
  {
    _id: "ptn-legrand",
    name: "Legrand",
    logo: {
      src: "/images/partners/legrand.svg",
      alt: "Legrand",
      aspectRatio: 250 / 62.096,
    },
  },
  {
    _id: "ptn-schneider",
    name: "Schneider Electric",
    logo: {
      src: "/images/partners/schneider-electric.svg",
      alt: "Schneider Electric",
      aspectRatio: 188.74001 / 57,
    },
  },
  {
    _id: "ptn-abb",
    name: "ABB",
    logo: { src: "/images/partners/abb.svg", alt: "ABB", aspectRatio: 88.2 / 35 },
  },
  {
    _id: "ptn-siemens",
    name: "Siemens",
    logo: {
      src: "/images/partners/siemens.svg",
      alt: "Siemens",
      aspectRatio: 210 / 50,
    },
  },
  { _id: "ptn-gewiss", name: "Gewiss" },
  {
    _id: "ptn-daikin",
    name: "Daikin",
    logo: {
      src: "/images/partners/daikin.svg",
      alt: "Daikin",
      aspectRatio: 300 / 64.616861,
    },
  },
  {
    _id: "ptn-lg",
    name: "LG",
    logo: { src: "/images/partners/lg.svg", alt: "LG", aspectRatio: 113.983 / 17.009 },
  },
];

export const fallbackClosingCta: ClosingCta = {
  heading: "Have a project in mind?",
  lead: "Send us the scope and we will come back with an engineered answer, not a guess.",
  cta: { label: "Request a Quote", href: "/contact" },
  background: {
    src: "/images/hero-skyline.webp",
    alt: "City skyline of high-rise towers seen from above at first light",
    aspectRatio: 16 / 9,
  },
};

export const fallbackHomePage: HomePage = {
  hero: {
    heading: "Engineering\nsolutions.\nBuilt to last.",
    lead: "Integrated electrical, mechanical, IT and automation works for commercial, industrial and institutional clients - engineered, installed and maintained in-house.",
    image: {
      src: "/images/hero-skyline.webp",
      alt: "City skyline of high-rise towers seen from above at first light",
      aspectRatio: 16 / 9,
    },
    /**
     * One button, outlined. The quote request is already the header's button
     * and the closing banner's single job, so the hero points at the work.
     */
    buttons: [{ label: "See Our Work", href: "/projects", style: "outline" }],
  },
  divisionStrip: "Five divisions, one point of responsibility",
  standardsLabel: "Worked to",
  aboutLinkLabel: "More about us",
  capabilities: {
    label: "Capabilities",
    heading: "Five divisions, one scope of responsibility",
    lead: "Each division works in-house and to a single project program, so the scopes meet where they are supposed to.",
    linkLabel: "All services",
  },
  selectedWork: {
    label: "Selected work",
    heading: "Projects delivered end to end.",
    linkLabel: "All projects",
  },
  selectedWorkLimit: 4,
  /** Empty on purpose: the defaults in Site settings are the home page's. */
  seo: {},
};

/*
 * TODO(client): every page hero below borrows a photograph from the site's own
 * library - the page heroes all take one now, and a real photograph of the
 * company's work belongs in each. Swap them in the studio.
 */

export const fallbackAboutPage: AboutPage = {
  hero: {
    heading: "Engineering, contracting and maintenance, in-house.",
    lead: "Five divisions under one roof, working to a single project program, so design, supply, installation and commissioning meet where they are supposed to.",
    image: LIBRARY.team,
    buttons: [],
  },
  whoWeAre: {
    label: "Who we are",
    heading: "Responsibility for the result stays in one place.",
    body: [
      "Mahfouz Contracting delivers integrated electrical, mechanical, IT and automation works for commercial, industrial and institutional clients. Design, supply, installation and commissioning are handled by our own divisions.",
      "The approach is straightforward: understand the requirement, engineer it properly, build it to standard, and support it for as long as it runs.",
    ],
    // TODO(client): replace with a dedicated photograph of the team on site —
    // this file is also used by the Electrical division.
    image: {
      src: "/images/divisions/electrical.webp",
      alt: "Electrical distribution panels with cable containment and conduit",
      aspectRatio: 1024 / 1536,
    },
    /**
     * The title block over the photograph. It read "5 Divisions" and "2
     * Countries" — the same counting pattern, and the same weak figures,
     * as the hero band that was replaced before it. Named, the two rows
     * say what the numbers only implied.
     */
    details: [
      { label: "Operating in", value: "Liberia · Lebanon" },
      {
        label: "In-house divisions",
        value: "Engineering, electrical, mechanical, IT, maintenance",
      },
    ],
    /**
     * TODO(client): assembled from what the site already says - the About
     * text, the Capabilities line, the division write-ups and the fourth
     * process stage - rather than written fresh, so every claim here is one
     * the site was already making. Confirm the wording.
     */
    highlights: [
      {
        title: "In-house divisions",
        text: "Design, supply, installation and commissioning are handled by our own engineering, electrical, mechanical, IT and maintenance divisions.",
      },
      {
        title: "One project program",
        text: "Every division works to a single program, so the scopes meet where they are supposed to.",
      },
      {
        title: "Worked to standard",
        text: "Installations are engineered and tested to recognised standards, including IEC, NEC, BS and NFPA.",
      },
      {
        title: "Support after handover",
        text: "Scheduled maintenance and fault response continue after handover, for as long as the installation runs.",
      },
    ],
    cta: { label: "See our capabilities", href: "/services" },
  },
  process: {
    label: "How we work",
    heading: "Four stages, from brief to ongoing support",
  },
  seo: {
    title: "About",
    description:
      "Mahfouz Contracting delivers integrated electrical, mechanical, IT and automation works in-house, from design through commissioning and on into maintenance.",
  },
};

export const fallbackServicesPage: ServicesPage = {
  hero: {
    heading: "Five divisions, one scope of responsibility.",
    lead: "Each division works in-house and to a single project program, so design, supply, installation and commissioning meet where they are supposed to.",
    image: {
      src: "/images/switchgear-assembly.webp",
      alt: "Electricians assembling and wiring switchgear panels in a workshop",
      aspectRatio: 1,
    },
    buttons: [],
  },
  seo: {
    title: "Services",
    description:
      "Five in-house divisions: electrical, mechanical, IT and automation, engineering and design consultancy, and maintenance and facility support.",
  },
};

export const fallbackProjectsPage: ProjectsPage = {
  hero: {
    heading: "Selected projects",
    lead: "Electrical, mechanical, IT and automation works delivered from design through commissioning, with maintenance carried on afterwards.",
    /**
     * TODO(client): this wants a wide site photograph of its own. Borrowed
     * from the project photography for now, and replaceable in the studio.
     */
    image: {
      src: "/images/site-tower-construction.webp",
      alt: "Tower under construction with a crane above the exposed frame",
      aspectRatio: 1289 / 860,
    },
    buttons: [],
  },
  filters: {
    allLabel: "All work",
    categoriesLabel: "Sector",
    projectSingular: "project",
    projectPlural: "projects",
  },
  empty: {
    heading: "No projects listed under this filter yet.",
    lead: "Records for this kind of work can be issued on request.",
  },
  more: {
    heading: "More work, on request",
    lead: "Further project records and references can be issued for tender or prequalification.",
    linkLabel: "Request references",
  },
  detail: {
    overview: "Overview",
    scope: "Scope of works",
    equipment: "Equipment specified",
    gallery: "On site",
    nextProject: "Next project",
    allProjects: "All projects",
    category: "Category",
    location: "Location",
    site: "Site",
    tags: "Tags",
    divisions: "Divisions engaged",
    status: "Status",
    year: "Year",
    client: "Client",
  },
  seo: {
    title: "Projects",
    description:
      "Electrical, mechanical, IT and automation works delivered from design through commissioning, with maintenance carried on afterwards.",
  },
};

/**
 * The contact page.
 *
 * The address, phones and opening hours are not here: they are the same
 * records as `fallbackSettings`, kept in one place there rather than repeated.
 *
 * TODO(client): `recipientEmail` is deliberately unset. Every email address
 * published on the live site is a theme placeholder (info@mail.com,
 * info@email.com, info@yoursite.com), so there is no real inbox to point at
 * yet. Until one is confirmed the form delivers to CONTACT_RECIPIENT_EMAIL
 * from the environment, which is a developer address for testing only.
 */
export const fallbackContactPage: ContactPage = {
  hero: {
    heading: "Request a quote",
    lead: "Send us the scope and we will come back with an engineered answer, not a guess. For tenders and prequalification we can issue project records and references on request.",
    image: LIBRARY.panels,
    buttons: [],
  },
  form: {
    nameLabel: "Name",
    companyLabel: "Company",
    emailLabel: "Email",
    phoneLabel: "Phone",
    subjectLabel: "Enquiry type",
    subjectPlaceholder: "Select one",
    messageLabel: "Scope",
    submitLabel: "Send enquiry",
    submittingLabel: "Sending…",
    successLead:
      "We read every enquiry ourselves - you will get an answer from an engineer, not an autoresponder.",
  },
  formSubjects: [
    "Electrical",
    "Mechanical",
    "IT & Automation",
    "Engineering & Design Consultancy",
    "Maintenance & Facility Support",
    "General enquiry",
  ],
  direct: {
    formLabel: "Enquiry",
    heading: "Reach us directly",
    officeLabel: "Office",
    emailLabel: "Email",
    hoursLabel: "Hours",
    closedLabel: "closed",
    checklistLabel: "What to send",
  },
  /**
   * Response time only. The hours used to be a row here, typed as free text,
   * while the structured data carried its own copy of them in code; they
   * come from Site settings now, which feeds both.
   */
  details: [{ label: "Enquiries", value: "Answered 24/7" }],
  /**
   * TODO(client): written by me, not by you. It is the four things that make
   * a quote possible to price without a phone call, and it is editable in the
   * studio — change it to whatever you actually want to be sent.
   */
  enquiryChecklist: [
    "Drawings or a scope of works, if you have them",
    "Where the site is, and what stage it is at",
    "Any standards or approvals the work has to meet",
    "When you need it finished",
  ],
  seo: {
    title: "Contact",
    description:
      "Request a quote from Mahfouz Contracting. Send us the scope and we will come back with an engineered answer. Offices in Monrovia, Liberia.",
  },
};

export const fallbackNotFoundPage: NotFoundPage = {
  hero: {
    heading: "That page is not in the set.",
    lead: "The address you followed does not exist, or what used to be there has moved. Everywhere the site does go is in the navigation above.",
    image: LIBRARY.tools,
    buttons: [],
  },
};

/**
 * The privacy policy.
 *
 * TODO(client): THIS IS A DRAFT AND HAS NOT BEEN REVIEWED BY A LAWYER. It was
 * written to be accurate about what this site actually does rather than to be
 * exhaustive, because a policy describing cookies and profiling that do not
 * exist here is worse than none: it is a claim nobody checked. Read it, correct
 * anything that does not match how enquiries are really handled, and replace it
 * outright if you would rather have your own. It is editable in the studio, so
 * a replacement needs no developer.
 *
 * What it asserts, and what has to stay true: the form collects only the
 * fields in `ContactForm`, a submission is emailed and never written to a
 * database, the site sets no cookies of its own, and the typefaces are served
 * from this origin rather than from Google. All four are true of the code as
 * it stands. Adding analytics, a chat widget or a stored enquiry log breaks
 * one of them, and this text has to change in the same commit.
 */
export const fallbackPrivacyPolicy: PrivacyPolicy = {
  heading: "Privacy policy",
  heroImage: LIBRARY.drawings,
  updated: "2026-09-20",
  intro: [
    "This policy explains what this website collects, why, and what happens to it afterwards.",
    "It is short because the site does little. There is one form, and there is no advertising, no analytics and nothing that follows you anywhere.",
  ],
  sections: [
    {
      heading: "Who this is about",
      body: [
        "Mahfouz Contracting is responsible for the information described here. Our address, telephone numbers and email address are on the contact page, and anything to do with this policy can be sent to the same place.",
      ],
    },
    {
      heading: "What the enquiry form collects",
      body: [
        "The form asks for your name and an email address to reply to. Your company, telephone number and the type of enquiry are optional. The message is sent as you wrote it.",
        "Nothing else is collected, and nothing about you is inferred or bought in from anywhere else.",
      ],
    },
    {
      heading: "What happens to an enquiry",
      body: [
        "A submitted form is composed into an email and sent to our own inbox. It is not written to a database, and this website keeps no record of it - the email is the only copy.",
        "The service that delivers it handles the message in transit in order to do so. Once it arrives it sits in our inbox like any other correspondence, and it is used to answer you and for nothing else.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        "This site sets no cookies. There is no analytics, no advertising and no third-party script watching the page.",
        "The only cookies anywhere on this domain belong to the content management system at /studio, which is how our own staff sign in to edit the site. A visitor never reaches it.",
      ],
    },
    {
      heading: "What a page loads from elsewhere",
      body: [
        "Photographs are served from our content system's image network, which therefore sees the request for the image.",
        "Typefaces are served from this site rather than from a font provider, so opening a page does not tell anyone else that you did.",
        "Our hosting provider keeps ordinary server logs, including the network address a request came from, for security and diagnosis.",
      ],
    },
    {
      heading: "How long anything is kept",
      body: [
        "An enquiry stays in the inbox for as long as it is useful to the work it concerns, and is deleted sooner if you ask.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "You can ask what we hold about you, ask for it to be corrected, or ask for it to be deleted. Write to us using the details on the contact page.",
        "There is no account to close and no profile to export. In practice what we hold is an email thread, and nothing else.",
      ],
    },
    {
      heading: "Changes to this policy",
      body: [
        "If this changes, the new wording replaces this page and the date in the margin changes with it. We do not keep an archive of earlier versions.",
      ],
    },
  ],
  seo: {
    title: "Privacy policy",
    description:
      "What this website collects, what happens to an enquiry, and what it does not do: no analytics, no advertising and no cookies of its own.",
  },
};
