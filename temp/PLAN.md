# Mahfouz Contracting — Website Rebuild Plan

**Status:** Steps 1-9 complete for the home page. Sanity project creation is with the owner (see §9). Project/service/about/contact pages deferred.
**Stack:** Next.js (App Router) · TypeScript · React · Tailwind CSS · Sanity CMS · Motion
**Repo:** `MichelAD1/mahfouz-contracting`

---

## 0. What exists today

Two sources were inspected before any code was written.

### A. The design canvas — `Mahfouz Contracting - Home.dc.html`
A single-artboard home page design on the "Modernist" design system (Archivo, zero radius,
hairline rules, navy accent `#16305c` overriding the system's red). Sections: hero,
credibility strip, about, services, projects, why-us, process, partners, closing CTA, footer.
Behaviour is real: sticky service panel with hover-swapped imagery, scroll-solidifying navbar,
IntersectionObserver reveals, mobile burger menu.

### B. The live site — `mahfouzcontracting.com`
WordPress + Elementor on an **AxiomThemes** solar/green-energy theme. Mined via its REST API
(`cpt_services`, `cpt_portfolio`, `cpt_testimonials`, `cpt_team`).

---

## 1. What is already working — keep it

1. **Navy over construction-yellow.** `#16305c` / `#0a1628` reads engineering-institutional
   rather than hi-vis. It is the client's existing equity and it is the right call. Keep.
2. **Hero composition.** Full-bleed image, content bottom-aligned, oversized tight-leading
   headline. Correct instinct; needs execution.
3. **The capabilities interaction.** Sticky image panel + hover-driven division list is the
   single best idea in the file. Keep it and make it the section it deserves to be.
4. **Rules and dividers instead of cards.** The right instinct for "not a template".
5. **The copy.** "Engineering solutions. Built to last." and "understand the requirement,
   engineer it properly, build it to standard, and support it for as long as it runs" are
   better than anything on the live site. Keep, tighten.
6. **Grayscale image treatment.** A smart response to mismatched photography. Promote it from
   a filter to a deliberate system (see §4).

## 2. What is weak — the refinements this rebuild makes

| # | Problem in the current design | Refinement |
|---|---|---|
| 1 | **One typeface at one weight.** Archivo 800 for every heading, number, label and button. It is the default "modernist system" face; it carries no point of view. | Two families with real contrast: **Archivo Expanded** (wide, industrial display) + **IBM Plex Sans/Mono** (engineering-documentation heritage, a real text face). |
| 2 | **Numbers used as decoration.** `01–05` on services, `01–04` on projects, `01–04` on why-us, `01–04` on process. Only *process* is actually a sequence. | Numbering survives on process only. Elsewhere it is cut, or replaced by information that means something (division code, project year). |
| 3 | **A tracked-out ALL-CAPS eyebrow above all five headings.** The most recognisable generated-page tell. | Deleted as a device. That information moves into a **left margin metadata column** — sheet-number + section name, read as drawing-sheet furniture rather than a label. |
| 4 | **Middle-dot meta strings** (`Electrical · Maintenance`) and **`→` appended to every link.** | Metadata gets a real structure (label/value rows). Arrows only where an arrow is the affordance, drawn as an icon, never typed into the text. |
| 5 | **Monotonous section rhythm.** Seven consecutive sections with the same 2px top border, same max-width, same clamp padding, same `h2` size. This is the main reason a good design still reads as a template. | A deliberate rhythm: paper sections alternating with full-bleed dark **plates** (hero, project feature, closing CTA), and *one* oversized editorial typographic moment rather than seven identical `h2`s. |
| 6 | **Projects is the weakest section** — `auto-fit minmax(300px, 1fr)` with mixed aspect ratios landing arbitrarily. The brief wants this to be the strongest. | A composed asymmetric editorial layout: one large featured project with a title-block metadata panel, then unequal supporting tiles. |
| 7 | **The credibility strip says nothing.** Four vague noun phrases ("Engineering Excellence", "Integrated Solutions") set at 40px in the most valuable space on the page. | Replaced with a **data strip** carrying real, checkable facts (divisions, countries, standards worked to, response commitment). Big type must be earned by content. |
| 8 | **Statistics are thin.** `05 Divisions / 02 Countries` is the whole proof set. The live site shows `0%` and `0%`. | An honest metric set, CMS-driven, with animated counters. Flagged for the client to supply real figures (§8). |
| 9 | **The accent never does any work.** Navy is used for eyebrows, numbers, arrows *and* buttons, so nothing reads as interactive, and the page is monochrome-cold. | Navy becomes structure. **Copper** `#A9673A` becomes the single accent, reserved for active/interactive state — subject-true for an electrical contractor (busbar, cable), and warm against navy without being decorative. |
| 10 | **Partners as typed brand names in bordered boxes.** Looks unfinished. | Quieter treatment, monochrome, pending real logo assets. |
| 11 | **Mobile loses the capabilities imagery entirely** (`display: none` under 900px). | An intentional mobile composition, not a hidden desktop one. |
| 12 | **Accessibility gaps.** `:focus { outline: none }` in the design system, nav as a div of links, no skip link, no alt text. | Built to the Web Interface Guidelines from the first commit. |

## 3. The visual direction

> **The engineering drawing set.**

The vernacular is not "architecture studio" — it is technical documentation: hairlines, a
measured grid, title blocks, revision columns, annotation. This is drawn from what the client
actually sells: *"Load schedules, shop drawings, and testing reports — everything is documented
so you always know how your system is built."* The identity comes out of the content rather
than being applied on top of it.

**Tokens**

```
ink       #0A1628   blueprint near-black — dark plates, headings on paper
navy      #16305C   structural navy — rules, fills, brand
steel     #5B6B7F   secondary text, annotation
paper     #EAE8E3   ground; a dull neutral, deliberately not the warm-cream default
paperDeep #DEDBD4   recessed bands, image mattes
copper    #A9673A   the only accent — active + interactive state
```

**Type**

| Role | Face | Notes |
|---|---|---|
| Display | Archivo (variable, `wdth 112–125`) | Wide industrial caps for headlines; the width axis is what makes it not-default-Archivo |
| Body | IBM Plex Sans | A real text face, humanist, engineering heritage |
| Data | IBM Plex Mono | Narrow use, and **only** where the content is genuinely data (codes, standards, figures, sheet metadata) |

Line length capped under 70ch. Headings `text-wrap: balance`, body `text-pretty`.

**Layout** — a 12-column measured grid with a persistent left metadata column on desktop:

```
┌──────────────────────────────────────────────────────────┐
│ MAHFOUZ ────────────── nav ───────────── [Request quote] │  transparent → paper
├──────────────────────────────────────────────────────────┤
│                                                          │
│   HERO · dark plate · full-bleed image · slow parallax   │
│   ENGINEERING                                            │
│   SOLUTIONS.                                             │  Archivo Expanded, huge
│   BUILT TO LAST.                                         │
│   ── copy ─────────────── [Request a quote] [See work]   │
│  ┌ data strip: real figures, mono ───────────────────┐   │
│  └───────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────┤
│ S.01 │  Responsibility for the result                    │  margin col replaces
│ ABOUT│  stays in one place.        ┌─────────┐           │  the eyebrow
│      │  body copy                  │ layered │           │
│      │                             └─────────┘           │
├──────────────────────────────────────────────────────────┤
│ S.02 │  CAPABILITIES        ┌──────────────┐             │
│      │  ▸ division rows     │ sticky image │             │  active row: copper
│      │  (copper rule)       │  crossfade   │             │  rule + duotone image
├──────────────────────────────────────────────────────────┤
│ S.03 │  SELECTED WORK                                    │
│      │ ┌───────────────────────┐ ┌────────────┐          │
│      │ │  featured, tall       │ │ title block│          │  asymmetric,
│      │ │                       │ └────────────┘          │  composed — not a grid
│      │ └───────────────────────┘ ┌────────────┐          │
│      │                           │ tile       │          │
├──────────────────────────────────────────────────────────┤
│ S.04 │  PROCESS — 01→04, the one place numbers are earned │
├──────────────────────────────────────────────────────────┤
│      DARK PLATE CTA · parallax · one line                │
├──────────────────────────────────────────────────────────┤
│      FOOTER · title-block treatment                      │
└──────────────────────────────────────────────────────────┘
```

Left-aligned throughout. Nothing centred except the closing CTA line.

**Was this plan generic?** The default answer to this brief would have been navy + off-white,
Archivo/Inter, ALL-CAPS eyebrows, a three-up service card grid, a four-up project grid, counters,
and fade-up on every section. Changed deliberately: the drawing-sheet margin column replacing
eyebrows; Archivo Expanded + IBM Plex instead of Archivo/Inter; copper reserved strictly for
state; the sticky capabilities panel over a card grid; a composed asymmetric projects section;
numbering only where a sequence exists; one orchestrated motion moment instead of scattered
reveals.

## 4. Photography — the real constraint

The client has **no project photography**. Findings:

- All 38 `cpt_portfolio` entries are lorem ipsum (`"Tesla Brand Book"`, `"Dicta sunt
  explicabo…"`) on licensed stock from the theme's solar demo.
- The 3 testimonials are the theme's generic off-grid-solar quotes, not Mahfouz clients.
- The 3 team members are lorem ipsum with `Solar Panels 80% / Wind Turbines 90%`.
- The homepage counters read `0%` and `0%`.
- Service copy still says **"Why Clients Choose Prism"** — the theme demo's brand name, live
  on the client's site in four places.
- The 5 division images *are* the client's own uploads, but they are AI-generated still-life
  renders (implausible cable routing; a spray bottle and a garden hose representing facility
  maintenance), in a green-grey/yellow palette that fights the brand navy.

**Design response — three moves, so the site is presentable today and excellent later:**

1. **Duotone as a system.** The 5 division renders are mapped to a navy→paper duotone. This
   neutralises the clashing yellow/green, makes a mismatched set cohere, and turns the weakest
   asset into a deliberate visual language. Full colour is reserved for real photography.
2. **A designed slot, not a broken image.** Where there is no asset (hero, project covers, CTA
   plate), a blueprint-toned `ImageSlot` renders — measured, labelled with the shot it wants,
   and intentional-looking rather than empty.
3. **Typography carries the page.** The layout is built so photography *elevates* it rather than
   holds it up. Real photos drop in through Sanity with no code change.

**Client action, highest priority:** a half-day site shoot across 3–4 live jobs — panel boards,
switchgear, plant rooms, cable containment, technicians working, one wide building exterior per
project. This is the single largest gap between this build and a site that looks expensive.

## 5. Architecture

```
src/
  app/
    layout.tsx                  fonts, metadata, skip link
    page.tsx                    home — server component, one query
    globals.css                 Tailwind v4 @theme tokens
    studio/[[...tool]]/page.tsx embedded Sanity Studio
  components/
    layout/      Header  MobileMenu  Footer  SkipLink
    primitives/  Button  SectionShell  SheetMeta  Rule  ImageSlot  SanityImage
    motion/      Reveal  Stagger  Parallax  Counter  useReducedMotionSafe
    sections/    Hero  DataStrip  About  Capabilities  SelectedWork  Process
                 Partners  ClosingCta
  sanity/
    schemas/     siteSettings hero about service project testimonial contact
                 process partner  + objects: seo, metric, imageWithAlt
    lib/         client.ts  image.ts  queries.ts  fetch.ts  types.ts
    fallback/    content.ts        seed content, used when no project is configured
```

Rules held to: sections are server components; `"use client"` only in `components/motion/*`,
`Header`, `MobileMenu`, and the capabilities interaction. No component owns a whole page.
Sanity code never imports UI; UI never imports the Sanity client.

## 6. Sanity content model

| Document | Fields |
|---|---|
| `siteSettings` (singleton) | company name, logo, tagline, phones[], emails[], address, socials[], nav[], footer columns, default SEO |
| `hero` (singleton) | eyebrow, heading, lead, primary CTA, secondary CTA, background image *or* video, data strip metrics[] |
| `about` (singleton) | sheet label, statement, body[], images[], metrics[] |
| `service` | title, code, short + full description (portable text), image, icon, features[], order |
| `project` | name, slug, location, category, year, client, description, cover, gallery[], details[] (label/value), featured, order |
| `testimonial` | name, company, role, quote, image, rating |
| `process` | step, title, description, order |
| `partner` | name, logo, url, order |
| `contact` (singleton) | heading, description, details, form config, map coords |

`metric`, `imageWithAlt` and `seo` are shared objects so new sections reuse them without schema
changes. Every image field carries a required `alt`.

## 7. Motion

**Motion** (`motion/react`) over GSAP: the work here is scroll-linked reveals and a few springs,
it is declarative in React, and it tree-shakes. Budget:

- One orchestrated hero entrance on load — the only non-user-triggered sequence above the fold.
- Section reveals: opacity + 12px translate, 500ms, `[0.16, 1, 0.3, 1]`, once, staggered children
  where there is a real list.
- Parallax on exactly three surfaces: hero background, project feature, closing plate. Disabled
  under 768px and under `prefers-reduced-motion`.
- Counters on the data strip and about metrics, `tabular-nums`, on first view only.
- Header: transparent over the hero, paper + hairline after 60px.
- Transform/opacity only. No `transition: all`. Every effect gated on `prefers-reduced-motion`.

## 8. Steps

- [x] Step 1: Inspect the existing design and live site; extract real content; write this plan
- [x] Step 2: Scaffold Next.js + TypeScript + Tailwind; design tokens, fonts, base layout
- [x] Step 3: Sanity schemas, client, typed GROQ queries, embedded studio, fallback content
- [x] Step 4: Primitives + motion components
- [x] Step 5: Header, mobile menu, footer
- [x] Step 6: Home sections — hero, data strip, about, capabilities
- [x] Step 7: Home sections — selected work, process, partners, closing CTA
- [x] Step 8: Responsive pass, a11y pass, performance pass, self-critique in a real browser
- [x] Step 9: Lint + typecheck + build green; commit; push

### Revisions made during the build, after reviewing it in a browser

1. **Caps pulled back to the hero only.** Every section heading was set in the
   expanded caps face. A whole sentence in caps at that size shouts; it read
   cheaper, not more premium. Added `display-sentence` — same face and width, no
   uppercase — for section headings and the about statement. Caps now signal the
   brand voice (hero headline, wordmark) and nothing else. This was the single
   biggest visual gain of the whole build.
2. **Blueprint plates replaced grey placeholders at hero scale.** With no
   project photography, Selected Work rendered as four grey voids. Covers with
   no image now draw the navy drawing-sheet plate, seeded so each reads as a
   different surface. Presentable and on-brand; still no substitute for photos.
3. **About re-composed.** The layered two-image idea put a grey placeholder over
   a real photograph, which looked worse than either alone. Now one real
   photograph with a solid ink title block overlapping its lower edge, carrying
   the two metrics.
4. **Scroll reveals rewritten as progressive enhancement.** Motion's `initial`
   bakes `opacity: 0` into the server HTML, so without JavaScript — or on a
   failed hydration — the page was blank below the hero. Reveals are now CSS
   behind a `.js` class set before first paint, driven by one
   IntersectionObserver, and they are server components with no per-instance JS.
   Verified: with JavaScript disabled all 7 sections and every heading render.
5. **`useMediaQuery` moved to `useSyncExternalStore`** — the React 19 lint rule
   correctly rejected `setState` in an effect.
6. **Partner strip made a slim band** rather than a full-height section.
7. **Hero headline lower bound dropped to 2.3rem** so the last line stops
   widowing at 390px, and the mobile CTAs are full width instead of ragged.

### Deferred beyond the home page
Project detail pages (`/projects/[slug]`), services detail pages, about page, contact page +
form handler, blog, FAQ, sitemap/robots, OG images.

### Open items for the client
1. **Photography** — see §4. Highest priority.
2. **Real project records** — 4 named projects exist (Panels Maintenance, Green Enterprises,
   Branding Ideas, Reliable Energy) with no real location, year, client, scope or images.
   "Branding Ideas" does not look like a contracting project.
3. **Metrics** — need honest figures: years operating, projects delivered, staff, response time.
4. **Contact details** — the live site mixes real numbers (Liberia `+231`, Lebanon `+961`) with
   theme placeholders (`info@mail.com`, `info@email.com`, `1-800-458-5697`) and AxiomThemes
   social accounts. Confirm the real set.
5. **"Prism"** — the theme demo brand is live in the service copy and needs removing at source.
6. **Testimonials** — the 3 live ones are theme filler; real client quotes needed.
7. **Partner logos** — vector assets for Legrand, Schneider Electric, ABB, Siemens, Gewiss,
   Daikin, LG, and confirmation the client is entitled to display them.
