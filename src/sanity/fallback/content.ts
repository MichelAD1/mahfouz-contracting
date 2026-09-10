import type { HomePageContent } from "@/sanity/lib/types";

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
      { label: "About", href: "#about" },
      { label: "Capabilities", href: "#capabilities" },
      { label: "Work", href: "#work" },
      { label: "Process", href: "#process" },
      { label: "Contact", href: "#contact" },
    ],
    footerNote: "Engineering, contracting and maintenance",
  },

  hero: {
    headingLines: ["Engineering", "solutions.", "Built to last."],
    lead: "Integrated electrical, mechanical, IT and automation works for commercial, industrial and institutional clients — engineered, installed and maintained in-house.",
    primaryCta: { label: "Request a Quote", href: "#contact" },
    secondaryCta: { label: "See Our Work", href: "#work" },
    background: {
      alt: "",
      slotHint: "Wide site photograph — switchgear room, plant room or a live installation",
    },
    // Every figure here is checkable against the company's own material.
    metrics: [
      {
        figure: "5",
        countTo: 5,
        label: "In-house divisions",
        note: "Engineering, electrical, mechanical, IT, maintenance",
      },
      {
        figure: "2",
        countTo: 2,
        label: "Countries served",
        note: "Liberia and Lebanon",
      },
      {
        figure: "6",
        countTo: 6,
        label: "Standards worked to",
        note: "IEC, NEC, BS, NFPA, ASHRAE, SMACNA",
      },
      {
        figure: "1",
        countTo: 1,
        label: "Point of responsibility",
        note: "Design through commissioning and support",
      },
    ],
  },

  about: {
    sheet: "About",
    statement: "Responsibility for the result stays in one place.",
    body: [
      "Mahfouz Contracting delivers integrated electrical, mechanical, IT and automation works for commercial, industrial and institutional clients. Design, supply, installation and commissioning are handled by our own divisions.",
      "The approach is straightforward: understand the requirement, engineer it properly, build it to standard, and support it for as long as it runs.",
    ],
    cta: { label: "See our capabilities", href: "#capabilities" },
    // One image only. TODO(client): replace with a dedicated photograph of the
    // team on site — this file is also used by the Electrical division.
    images: [
      {
        src: "/images/divisions/electrical.webp",
        alt: "Electrical distribution panels with cable containment and conduit",
        aspectRatio: 1024 / 1536,
      },
    ],
    metrics: [
      { figure: "5", countTo: 5, label: "Divisions" },
      { figure: "2", countTo: 2, label: "Countries" },
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
      code: "IT",
      title: "Information Technology & Automation",
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
   */
  projects: [
    {
      _id: "prj-panels-maintenance",
      name: "Panels Maintenance",
      slug: "panels-maintenance",
      category: "Commercial",
      featured: true,
      cover: {
        alt: "",
        slotHint: "Distribution panels under maintenance — wide crop",
      },
    },
    {
      _id: "prj-green-enterprises",
      name: "Green Enterprises",
      slug: "green-enterprises",
      category: "Commercial",
      cover: {
        alt: "",
        slotHint: "Building exterior or plant room — vertical crop",
      },
    },
    {
      _id: "prj-reliable-energy",
      name: "Reliable Energy",
      slug: "reliable-energy",
      category: "Commercial",
      cover: {
        alt: "",
        slotHint: "Power backup, generator or switchgear installation",
      },
    },
    {
      _id: "prj-branding-ideas",
      name: "Branding Ideas",
      slug: "branding-ideas",
      category: "Commercial",
      cover: {
        alt: "",
        slotHint: "Fit-out or interior systems installation",
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
    },
    {
      _id: "prc-2",
      step: "02",
      title: "Design",
      description:
        "Drawings, load calculations and specifications are issued for approval.",
    },
    {
      _id: "prc-3",
      step: "03",
      title: "Build",
      description:
        "Installation, testing and commissioning by in-house crews across every discipline.",
    },
    {
      _id: "prc-4",
      step: "04",
      title: "Support",
      description:
        "Scheduled maintenance and fault response continue after handover.",
    },
  ],

  // TODO(client): vector logo assets, and confirmation of the right to display them.
  partners: [
    { _id: "ptn-legrand", name: "Legrand" },
    { _id: "ptn-schneider", name: "Schneider Electric" },
    { _id: "ptn-abb", name: "ABB" },
    { _id: "ptn-siemens", name: "Siemens" },
    { _id: "ptn-gewiss", name: "Gewiss" },
    { _id: "ptn-daikin", name: "Daikin" },
    { _id: "ptn-lg", name: "LG" },
  ],

  closingCta: {
    heading: "Have a project in mind?",
    lead: "Send us the scope and we will come back with an engineered answer, not a guess.",
    cta: { label: "Request a Quote", href: "#contact" },
    background: {
      alt: "",
      slotHint: "Wide building or site photograph for the closing banner",
    },
  },
};
