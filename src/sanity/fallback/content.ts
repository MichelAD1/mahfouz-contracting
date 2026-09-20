import type {
  Contact,
  HomePageContent,
  ProjectDivision,
  ProjectFull,
  SectionCopy,
} from "@/sanity/lib/types";

/**
 * Division tags, in the short form the project cards and the filter use. These
 * mirror the `service` documents by `_id`, so the same records come back once
 * the dataset is populated.
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
 * Fallback content — used whenever no Sanity project is configured.
 *
 * Everything here is sourced from the client's own material: the design canvas
 * and the live site's REST API. Nothing is invented except where marked TODO.
 * Theme-demo filler on the live site (the "Prism" brand name, lorem ipsum
 * portfolio entries, placeholder emails, 0% counters) has been left out
 * deliberately — see temp/PLAN.md §4 and §8.
 *
 * Once the Sanity project exists this module becomes the seed for the dataset.
 */
export const fallbackHome: HomePageContent = {
  settings: {
    companyName: "Mahfouz Contracting",
    shortName: "Mahfouz",
    descriptor: "Contracting",
    tagline: "Built right. Built to last.",
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
    // TODO(client): the live site's social links point at AxiomThemes accounts.
    socials: [],
    nav: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Projects", href: "/projects" },
      { label: "Contact", href: "/contact" },
    ],
    /**
     * Shown as the line under the home hero, in place of a "6 standards worked
     * to" metric. The count was meaningless — nobody cares that it is six, they
     * care that it is these six, and to the people who evaluate contractors
     * these read as credentials.
     */
    standards: ["IEC", "NEC", "BS", "NFPA", "ASHRAE", "SMACNA"],
    footerNote: "Engineering, contracting and maintenance",
  },

  hero: {
    headingLines: ["Engineering", "solutions.", "Built to last."],
    lead: "Integrated electrical, mechanical, IT and automation works for commercial, industrial and institutional clients — engineered, installed and maintained in-house.",
    primaryCta: { label: "Request a Quote", href: "/contact" },
    secondaryCta: { label: "See Our Work", href: "/projects" },
    background: {
      src: "/images/hero-skyline.webp",
      alt: "City skyline of high-rise towers seen from above at first light",
      aspectRatio: 16 / 9,
    },
  },

  about: {
    sheet: "About",
    statement: "Responsibility for the result stays in one place.",
    body: [
      "Mahfouz Contracting delivers integrated electrical, mechanical, IT and automation works for commercial, industrial and institutional clients. Design, supply, installation and commissioning are handled by our own divisions.",
      "The approach is straightforward: understand the requirement, engineer it properly, build it to standard, and support it for as long as it runs.",
    ],
    cta: { label: "See our capabilities", href: "/services" },
    // One image only. TODO(client): replace with a dedicated photograph of the
    // team on site — this file is also used by the Electrical division.
    images: [
      {
        src: "/images/divisions/electrical.webp",
        alt: "Electrical distribution panels with cable containment and conduit",
        aspectRatio: 1024 / 1536,
      },
    ],
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
  },

  /**
   * Ordered by the project lifecycle — design, build, integrate, support —
   * which mirrors the company's own four-stage process rather than an
   * arbitrary sequence. Copy condensed from the live site's division pages.
   */
  services: [
    {
      _id: "svc-engineering",
      code: "ED",
      title: "Engineering & Design Consultancy",
      shortTitle: "Engineering",
      slug: "engineering-design-consultancy",
      shortDescription:
        "Coordinated MEP and IT design — load calculations, BOQs, tender documents and BIM development, issued before work starts on site.",
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
       * leaves the tag on every project card reading "IT & Automation" —
       * which is what the design canvas specifies and what a client searches.
       */
      code: "IA",
      title: "Information Technology & Automation",
      shortTitle: "IT & Automation",
      slug: "information-technology-automation-division",
      shortDescription:
        "Structured cabling, networks, security and building automation, integrated with the electrical and mechanical scope.",
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
  ],

  /**
   * TODO(client): these four names are the only real portfolio data that
   * exists. Location, year, client and scope are all unknown, and the live
   * site's own entries are lorem ipsum on stock solar photography. The section
   * renders whatever metadata is present, so real records enrich it with no
   * code change. See temp/PLAN.md §8, item 2.
   *
   * TODO(client): the division tags below are inferred from the project names
   * and the design canvas, not confirmed by the client. They drive the tags on
   * every card and the filter on /projects, so they need checking before
   * launch. Location, year and client are deliberately left unset rather than
   * guessed — those are claims about specific work.
   */
  projects: [
    {
      _id: "prj-panels-maintenance",
      name: "Panels Maintenance",
      slug: "panels-maintenance",
      category: "Commercial",
      featured: true,
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
      category: "Commercial",
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
      category: "Commercial",
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
      category: "Commercial",
      divisions: [DIVISION.it],
      cover: {
        src: "/images/site-tower-construction.webp",
        alt: "Tower under construction with a crane above the exposed frame",
        aspectRatio: 1289 / 860,
      },
    },
  ],

  process: [
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
  ],

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
  partners: [
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
  ],

  closingCta: {
    heading: "Have a project in mind?",
    lead: "Send us the scope and we will come back with an engineered answer, not a guess.",
    cta: { label: "Request a Quote", href: "/contact" },
    background: {
      src: "/images/hero-skyline.webp",
      alt: "City skyline of high-rise towers seen from above at first light",
      aspectRatio: 16 / 9,
    },
  },
};

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
 * and it is deliberately limited to the one project the canvas specifies. The
 * other three render the sparse version, which is what an unfilled record
 * genuinely looks like. Project detail pages carry `noindex` until this is
 * resolved — see generateMetadata in src/app/projects/[slug]/page.tsx.
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
  },
};

/**
 * The contact page, used until a `contact` document exists.
 *
 * The hours are the only figures here taken from the live WordPress site; the
 * address and phone numbers are the same records as `settings` above, kept in
 * one place there rather than repeated.
 *
 * TODO(client): `recipientEmail` is deliberately unset. Every email address
 * published on the live site is a theme placeholder (info@mail.com,
 * info@email.com, info@yoursite.com), so there is no real inbox to point at
 * yet. Until one is confirmed the form delivers to CONTACT_RECIPIENT_EMAIL
 * from the environment, which is a developer address for testing only.
 */
export const fallbackContact: Contact = {
  heading: "Request a quote",
  description:
    "Send us the scope and we will come back with an engineered answer, not a guess. For tenders and prequalification we can issue project records and references on request.",
  details: [
    {
      label: "Office",
      value:
        "Sink 14th Street, Bishop Roland J. Diggs Building, Monrovia, Montserrado County, Liberia",
    },
    { label: "Hours", value: "Mon-Fri 06:00-18:00, Sat 06:00-16:00, Sun closed" },
    { label: "Enquiries", value: "Answered 24/7" },
  ],
  formSubjects: [
    "Electrical",
    "Mechanical",
    "IT & Automation",
    "Engineering & Design Consultancy",
    "Maintenance & Facility Support",
    "General enquiry",
  ],
};

/**
 * The site's own wording, outside the sections it labels.
 *
 * Every string here was typed into a component until Step 8. It has to keep
 * all of them: the merge in `getSectionCopy` fills each field the CMS leaves
 * empty from this module, so a string dropped here is a heading that
 * disappears the day the CMS has an outage.
 */
export const fallbackSectionCopy: SectionCopy = {
  divisionStrip: "Five divisions, one point of responsibility",

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

  aboutHero: {
    heading: "Engineering, contracting and maintenance, in-house.",
    lead: "Five divisions under one roof, working to a single project program, so design, supply, installation and commissioning meet where they are supposed to.",
  },

  aboutProcess: {
    label: "How we work",
    heading: "Four stages, from brief to ongoing support",
  },

  servicesHero: {
    heading: "Five divisions, one scope of responsibility.",
    lead: "Each division works in-house and to a single project program, so design, supply, installation and commissioning meet where they are supposed to.",
  },

  projectsHero: {
    heading: "Selected projects",
    lead: "Electrical, mechanical, IT and automation works delivered from design through commissioning, with maintenance carried on afterwards.",
  },

  projectsMore: {
    heading: "More work, on request",
    lead: "Further project records and references can be issued for tender or prequalification.",
    linkLabel: "Request references",
  },

  projectsEmpty: {
    heading: "No projects listed under this division yet.",
    lead: "Records for this division can be issued on request.",
  },

  projectsAllFilter: "All work",

  enquiryForm: {
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
      "We read every enquiry ourselves — you will get an answer from an engineer, not an autoresponder.",
  },

  contactDirect: {
    heading: "Reach us directly",
    officeLabel: "Office",
    emailLabel: "Email",
  },

  /**
   * The home entry is also the site-wide default: the root layout uses it for
   * the title every other page's template wraps, and for the description any
   * page that has not set its own inherits.
   */
  homeSeo: {
    title: "Mahfouz Contracting — Engineering, contracting and maintenance",
    description:
      "Integrated electrical, mechanical, IT and automation works for commercial, industrial and institutional clients. Engineered, installed and maintained in-house.",
  },

  aboutSeo: {
    title: "About",
    description:
      "Mahfouz Contracting delivers integrated electrical, mechanical, IT and automation works in-house, from design through commissioning and on into maintenance.",
  },

  servicesSeo: {
    title: "Services",
    description:
      "Five in-house divisions: electrical, mechanical, IT and automation, engineering and design consultancy, and maintenance and facility support.",
  },

  projectsSeo: {
    title: "Projects",
    description:
      "Electrical, mechanical, IT and automation works delivered from design through commissioning, with maintenance carried on afterwards.",
  },

  contactSeo: {
    title: "Contact",
    description:
      "Request a quote from Mahfouz Contracting. Send us the scope and we will come back with an engineered answer. Offices in Monrovia, Liberia.",
  },
};
