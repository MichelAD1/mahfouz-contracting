# Mahfouz Contracting — remaining work to launch

**Status:** Steps 1-11 code complete, plus an unplanned design pass. The site is
built, seeded and rendering from the CMS, and every word on it is now editable
in the Studio.

What is left is no longer code. It is the client's accounts, a domain, a
deployment, and one walkthrough — tracked in `docs/CLIENT-SETUP.md` and in the
three held items under Step 6 (Search Console, Business Profile, Lighthouse
against the deployed build). One item moved from my list to theirs on 20 Sep:
the privacy policy is written and live, and needs the client to read it.

Supersedes the previous draft. Companion to `temp/PLAN.md`, which covers the
original build; this file is only what is left.

---

## Deliverable running alongside the steps

**`docs/CLIENT-SETUP.md` — everything the client has to create themselves.**
**Written, in Step 7.** Ten items, each with what it is for in plain language,
what I need once it exists, and what breaks if it is skipped — plus a summary
table marking which four actually block launch. The list it was accumulated
from:

| What | Why | Raised in |
|---|---|---|
| **Resend** account + API key | Enquiry form delivery; the domain must be verified there or mail only reaches the account owner | Step 4 |
| **Sanity** account + organisation | Owns the CMS and all content; `wwicg618` is currently under a personal account and must transfer | Steps 1, 7 |
| **Vercel or Netlify** account | Hosting. Vercel's free tier is personal/non-commercial only, so a company site wants Pro (~$20/mo); Netlify's free tier permits commercial use | Step 7 |
| **Domain control** | DNS for the host, and the Resend sending records | Steps 4, 6 |
| **Google Search Console** | Verify the domain, submit the sitemap | Step 6 |
| **Google Business Profile** | For a contractor with a physical address this outranks most on-page work | Step 6 |
| **Written confirmation on partner logos** | Six marks are currently third-party stopgaps; official assets wanted, permission required either way | Step 5 |
| **A real enquiry inbox address** | Every email on the live site is a theme placeholder | Step 4 |
| **A logo file** (SVG, plus a square PNG) | The wordmark is set in type, so there is no logo asset. Schema.org `logo` and the Business Profile both want a real one, and inventing it would be worse than omitting it | Step 6 |
| **A privacy policy** | The old site published one and this one has no page to send it to. A form collecting a name, an email and a message wants one; `/privacy-policy/` currently redirects to the home page | Step 6 |

## Steps

- [x] Step 1: Sanity foundation — connect `wwicg618`, expand the project schema, finish the read layer
- [x] Step 2: Convert the single page into a multi-page site (nav, `/about`, `/services`, shared layout)
- [x] Step 3: Projects — home section, `/projects` index, `/projects/[slug]` detail
- [x] Step 4: Contact page with a working enquiry form
- [x] Step 5: Partner logo bar with an auto-scrolling marquee
- [x] Design pass (unplanned, requested after Step 5 — see below)
- [x] Step 6: SEO — canonicals, sitemap, robots, OG image, structured data, redirects
      (code complete; three items wait on a domain or a deployment)
- [x] Step 7: Seed the dataset, then hand Sanity over to the client
      (seeded and documented; the walkthrough and the account transfer need people)
- [x] Step 8: Move the remaining copy and the per-route metadata into Sanity
- [x] Step 9: Write the privacy policy, and close the three design questions
- [x] Step 10: Slow the scroll reveals, and rebuild the contact page
- [x] Step 11: Fix the sections landing dim after a client-side navigation

---

## Design pass — 18/19 Sep 2026

Requested after Step 5 and done before Step 6. All gates clean, `npm run build`
exit 0.

- [x] **Colour restored.** Photography was running through a greyscale duotone
      and the partner logos through `brightness(0)`. Both now show as they are,
      and the logos were re-sourced in colour so the strip is one consistent set
- [x] **LG logo clipping fixed.** My fault: I had cropped each viewBox to ink
      bounds measured by a parser that reads an arc's endpoint but not its
      bulge, so a circular glyph lost its widest point
- [x] **Schneider swapped** to the current single-line mark — the stacked
      version halves its type at a shared row height
- [x] **`S.01` / `S.02` sheet codes removed.** The margin column keeps its rule
      and label
- [x] **Inner-page heroes** use the blueprint plate instead of flat navy, each
      seeded to a different wash, with the home page's CSS entrance
- [x] **Navbar marks the current page** in copper (no underline — tried, removed
      on request). A project detail page still marks Projects
- [x] **Scroll reveal** resting opacity 0.15 → 0.34, arrival 0.52 → 0.64. At
      0.15 a section peeking above the fold sat visibly half-finished
- [x] **Home hero fills the viewport** (`min-h-svh`, no cap) with its whole
      content inside it
- [x] **The metrics band became a division strip** — see below

### The metrics band, replaced

`5 divisions · 2 countries · 6 standards · 1 point of responsibility` was cut.
Big numbers under a hero is the most worn pattern on the web, and only one of
those four earned its numeral: "2 countries" undersells, "6 standards" buried
the list that was the actual asset, and "1 point of responsibility" was a slogan
wearing a number.

It is now the five divisions, **named**, each linking to `/services#slug` — the
real differentiator, scannable in a second, and a route into the site rather
than a statistic. The standards moved to the sheet's footer line as credentials,
and gained a `standards` field on `siteSettings` so they are editable.

`hero.metrics` is gone — from the schema, the query, the fallback module and
the dataset. So is `about.metrics`, for the reason below. With both readers
removed the `metric` object type and the `Counter` that animated it had no
user left either, so they went with them. See Step 9.

### The three design questions, answered 20 Sep

All three were put to the client and decided; the work is in Step 9.

1. **`IT  IT & Automation`** in the division strip. Fixed at the **code**, not
   the name: `IT` became `IA`, the initial of each half of "Information
   Technology & Automation". It keeps the two-letter pattern the other four
   follow and leaves the short name alone, which matters because that name is
   also the tag on every project card and the label in the /projects filter.
   Shortening it to "Automation" would have been one character cheaper and
   would have dropped the half of the division most people name it by.
2. **The About section's "5 Divisions / 2 Countries".** The block stays; the
   counters go. It is a drawing title block of label/value rows now —
   "Operating in — Liberia, Lebanon" and "In-house divisions — Engineering,
   electrical, mechanical, IT, maintenance". Exactly the transformation the
   hero band got, for exactly the same reason: naming five divisions is the
   company's differentiator, counting them is not.
3. **Site-wide type scale. Left alone, deliberately.** The hero was tightened
   to fit one screen, which was a fix for a specific fault, not a decision
   about scale. Scaling the inner pages to match would change the site's
   character rather than its density, and would put every page back in review
   to buy nothing. Closed rather than carried forward again.

### Tooling worth reusing

Headless Chrome drives visual checks now — `scratchpad/shot.sh`. Two things it
taught: it cannot settle CSS animations under virtual time, so captures force
`prefers-reduced-motion` (which conveniently verifies that path); and screenshots
must be diffed by hash, because a change that renders identically is a change
that did nothing. That is how the first hero-height attempt was caught.

---

## Verified state — 18 Sep 2026

Dev server runs on `http://localhost:3333` (`npm run dev` — the port is now in the script).
Both quality gates are **clean** on `main`: `npm run lint` exit 0,
`npx tsc --noEmit` exit 0. There is no baseline noise to hide behind here.

| Route | Now | Fixed in |
|---|---|---|
| `/` | 200 | — |
| `/studio` | 200, and now on an allowed CORS origin | — |
| `/about` | 200 | done |
| `/services` | 200 | done |
| `/projects` | 200 | done |
| `/projects/<slug>` | 200, unknown slugs 404 | done |
| `/contact` | 200, form working | done |
| `/privacy-policy` | 200, and no longer a redirect to the home page | Step 9 |
| `/sitemap.xml` | 200 | Step 6 |
| `/robots.txt` | 200 | Step 6 |
| `/opengraph-image` | 200, a 1200×630 PNG | Step 6 |
| 26 old WordPress URLs | 200 after their redirect | Step 6 |
| 15 theme-demo URLs | **410 Gone**, on purpose | Step 6 |

Defects, and where they stand:

1. ~~`alternates: { canonical: "/" }` in the **root layout**, inherited by every
   new page~~ — **fixed in Step 2.** Canonicals are set per page and verified.
2. ~~The `contact` schema wired to nothing~~ — **fixed in Step 1.** It has a
   type, a query and a fetcher; the page that uses them arrives in Step 4.
3. ~~All three "Request a Quote" CTAs resolving to a footer `mailto:`~~ —
   **fixed.** Repointed to `/contact` in Step 2, and Step 4 made that route a
   working form. The site's primary call to action now works end to end.
4. ~~No Open Graph image — shared links still render a blank card~~ — **fixed
   in Step 6.** Drawn rather than photographed, in the site's own drawing-sheet
   language, and verified as a 1200×630 PNG rather than assumed.

---

## Sanity: `wwicg618`

Decided: use `wwicg618` for now, move to the client's project later.

**Resolved — the dev server now runs on `http://localhost:3333`.** That was the
one origin already registered on the project's CORS list, so moving the site to
it fixes Studio authentication without changing any project configuration. The
port is baked into `npm run dev`, so there is no flag to remember and no way to
land back on a blocked origin by accident.

**The dataset stays empty for now.** Decided: the site keeps rendering from
`src/sanity/fallback/content.ts`, which it already does for every pixel.
Seeding moves to Step 7 and is not a prerequisite for anything before it.

**`sanity.cli.ts` was missing** and is now added. Only `sanity.config.ts`
existed, so `sanity exec`, `sanity schema deploy` and `sanity dataset export`
had no project to act on. Verified with `sanity dataset list`, which now
resolves `wwicg618` from the same env vars the site reads.

**Worth knowing:** the `production` dataset is `aclMode: public`, so the site
reads published content with **no token at all**. Nothing secret needs to go
into the deployment for the site to work.

### Accounts — do not cross the streams

The **Sanity MCP in this session is signed into the AstroLabs work account**
(`gwFiCV9Ed`); it lists the six AstroLabs projects and cannot see `wwicg618`.
The **Sanity CLI** is signed into the personal account (`gGKlUc6Rk`), which owns
this project.

So: all Sanity work on this repo goes through the CLI, and **nothing in this
project touches a work-account project**. Standing rule for this repo.

---

## The design files

`~/Downloads/Project scope clarification/` — I read the **Projects** and
**Project Detail** canvases only, as asked, and left the Home canvas alone.
`~/Downloads/projects page.png` covers the home page's projects section.

**The designs are compatible with what is already built.** The canvas overrides
its design system's red accent to `#16305c`, which is exactly the
`--color-navy` already in `globals.css`, and both are set in Archivo. The only
drift is the ground: the canvas uses `#f3f2f2`, the site uses `#eae8e3`. The
site's tokens win — it is a warmer paper and the rest of the site is built on
it. No restyling needed, which is the best possible outcome here.

### What the designs specify

**Home projects section** (from the PNG): heading *"Projects delivered end to
end."*, a right-aligned `ALL PROJECTS →` link, and four cards in a staggered
grid — image slot, 2px rule, then `NN` index, title, and division tags
(`ELECTRICAL · MAINTENANCE`).

**`/projects`**: dark hero with a `Home / Projects` breadcrumb, heading
*"Selected projects"*; then a filter row — `All work · Electrical · Mechanical ·
IT & Automation · Maintenance` — with an `04 PROJECTS` count; then an auto-fit
grid (`minmax(min(100%,320px),1fr)`) of 4:3 greyscale cards; then a *"More work,
on request"* block and the closing CTA. Filtering is driven by a `data-cats`
attribute per card, so every project stays in the DOM — client-side filtering
with no URL variants and no SEO cost. I will keep that approach.

**`/projects/[slug]`**: breadcrumb → index + title → a facts grid (Category,
Location, Divisions engaged, Status) → Overview (a statement line plus body
paragraphs) → Scope of works (numbered 01–05) → Equipment specified (bordered
chips: Schneider Electric, Legrand, ABB) → Gallery ("On site", four crops) →
Next project → closing CTA.

### The filter is by division, not by category

Both designs tag projects as `Electrical · Maintenance`, `IT & Automation`,
`Electrical · Power` — **not** by the `Commercial / Industrial / Institutional`
list the `project` schema currently carries in `category`. The schema already
has a `services` reference array titled "Divisions involved", which is exactly
the right field. Step 1 makes the cards and the filter read from it.

---

## Step 1 — Sanity foundation

**Done.** `npm run lint` exit 0, `npx tsc --noEmit` exit 0, home page renders
unchanged at 200 with no runtime errors.

- [x] Move the dev server to port 3333, so it lands on the already-allowed
      CORS origin (`npm run dev` now carries the port)
- [x] Add `sanity.cli.ts` — verified with `sanity dataset list`, which resolves
      `wwicg618` from the same env vars the site uses
- [x] Expand the `project` schema for the detail design: `status`,
      `scopeOfWorks` (ordered strings), `equipment` (references to `partner`,
      reusing the documents the logo bar already needs)
- [x] Surface `services` as the division tags and the filter source
- [x] `types.ts` — `Contact`, `DetailRow`, `ProjectDivision`, and `ProjectFull`
      split from `Project` so a listing does not carry detail-page fields
- [x] `queries.ts` — `CONTACT_QUERY`, `PROJECTS_QUERY`, a shared `PROJECT_CARD`
      projection, and `PROJECT_QUERY` extended with the new fields
- [x] `fetch.ts` — `getProjects()`, `getProject(slug)`, `getContact()`,
      `getProjectSlugs()`, all through one `fetchOrFallback` helper so the
      never-throw contract is written once rather than copied four times
- [x] **Singleton merge is now field-level**
- [x] Add `CONTACT_RECIPIENT_EMAIL` to `.env.local` and `.env.example`

Two decisions taken while implementing, both worth knowing:

**`project.description` changed from Portable Text to `text[]`.** It was
`array of block`, which needs `@portabletext/react` to render. The design only
calls for plain paragraphs, and the `about` singleton already stores its body as
`text[]`, so this matches what is there and avoids a dependency. The dataset is
empty, so the change cost nothing. If you want rich text later (bold, inline
links) that is a real upgrade, and a new package.

**Fixed a deprecation warning in `src/sanity/lib/image.ts`** — it used the
deprecated default export of `@sanity/image-url` and logged on every render.
One line, in the Sanity layer this step owns.

That last item matters more than it looks. `mergeWithFallback` currently
replaces top-level keys **wholesale**: publish a `hero` document without a
background image and the hero loses its photograph, because the entire `hero`
key was swapped. For a CMS the client edits unsupervised, that is a trap. Merging
field by field costs a few lines and removes a class of "the site broke when I
saved it" calls.

**Risk:** `mergeWithFallback` is typed against `HomePageContent`. Generalising
it needs care to stay type-safe rather than sprawling into `any`.

---

## Step 2 — Multi-page conversion

The single biggest SEO change on the list, and the one everything else benefits
from. Google indexes **URLs**, not sections: `/#services` is not a result, it is
the home page. Five divisions across two countries currently compete for one
title, one description and one `<h1>`.

**Done.** `npm run lint` exit 0, `npx tsc --noEmit` exit 0, `npm run build`
exit 0 with `/`, `/about` and `/services` all statically prerendered.

- [x] Nav is **Home · About · Services · Projects · Contact**, in
      `fallback/content.ts`, and both CTAs now point at `/contact`
- [x] `Header`, `Footer` and `<main id="main">` moved into `app/layout.tsx`, so
      a new route gets the site's chrome — and a working skip link — by existing
- [x] `app/about/page.tsx`
- [x] `app/services/page.tsx`
- [x] Home carries the condensed About and links through; the full write-ups
      live on the dedicated pages only
- [x] Footer's "Divisions" column became "Services", now linking to
      `/services#<slug>` (all five anchors verified rendering)
- [x] **`alternates.canonical` removed from the root layout**, set per page.
      Verified: `/` → `/`, `/about` → `/about`, `/services` → `/services`
- [x] One `<h1>` per page, verified on all three

### What moved, and why

Duplicating the About and Capabilities copy across the home page and their own
pages would have made them compete for the same search with the same words,
which is the opposite of the reason for going multi-page. So:

- **The full About body and the four-stage process now live on `/about` only.**
  The home page keeps the statement, the first paragraph and a link across.
- **The full division write-ups live on `/services` only.** The home page keeps
  its accordion — it is the strongest thing in the original design and worth
  keeping — plus an "All services" link. The accordion shows a name, a sentence
  and four features; `/services` shows the full write-up, every feature and the
  photograph at a size worth looking at. Same subject, genuinely different
  depth, so both can exist.

**`Process` is no longer on the home page.** That is the one visible change to a
page you had already signed off, so flagging it rather than letting you find it.

### A structural constraint worth recording

Every inner page opens on a dark `PageHero`, and that is not a style choice. The
header is transparent until you scroll past 60px and sets its own type in paper
white; a light plate under it would leave the navigation invisible for the first
screen. `/projects` in the design canvas already works this way, so the pattern
was set — it just has to be kept for every new route.

### Two new fetchers

`getSiteFrame()` feeds the shared header and footer and is wrapped in React
`cache()`, so the layout and a page asking for it in one render resolve a single
query rather than two. `getClosingCta()` exists because four pages end on that
banner and pulling the entire home page to render it would be absurd.

---

## Step 3 — Projects: section, index, detail

**Done.** `npm run lint` exit 0, `npx tsc --noEmit` exit 0, `npm run build`
exit 0 with all four detail pages prerendered via `generateStaticParams`.

- [x] Home projects section rebuilt to the PNG: new heading, four cards with
      cycling aspect ratios so the rules step down the row, `All projects` link
- [x] `components/projects/ProjectCard.tsx`, shared by the home section and the
      index so the two cannot drift
- [x] `app/projects/page.tsx` — image-backed hero, breadcrumb, division filter,
      live count, card grid, "More work, on request", closing CTA
- [x] `app/projects/[slug]/page.tsx` — hero, facts bar, overview, scope of
      works, equipment chips, gallery, next project, closing CTA
- [x] `generateStaticParams` from `PROJECT_SLUGS_QUERY`
- [x] `generateMetadata` per project; OG image from the cover; `noindex`
- [x] `notFound()` for unknown slugs — verified, `/projects/does-not-exist` 404s
- [x] Empty state per the design

### Filters are derived, not hard-coded

The canvas hard-codes four filter buttons. Ours are built from the divisions
actually present on the projects, so a division the client stops working in
stops appearing on its own, and a new one needs no code. Verified rendering as
All work · Electrical · Maintenance · Mechanical · IT & Automation.

Every project stays in the server-rendered markup and the filter only hides
them, so there is no `?division=` variant for Google to treat as a near-duplicate
and no request per click.

### `shortTitle` added to the service schema

The canvas tags projects "Electrical · Maintenance" while our divisions are
named "Maintenance & Facility Support". Rather than shorten the division names —
the services page wants the full ones — the `DIVISION` projection resolves
`coalesce(shortTitle, title)`. A tag reads "Maintenance"; the division's own
page stays headed "Maintenance & Facility Support".

### Placeholder content, contained on purpose

`fallbackProjectDetails` carries the canvas copy for **Panels Maintenance
only** — overview, five-line scope, Schneider/Legrand/ABB, status. The other
three render the sparse version, which is what an unfilled record actually
looks like. That contrast is deliberate: it shows both layouts, and it keeps the
invented material to one page under a shouting TODO.

Division tags on all four are inferred from the project names and the canvas,
**not confirmed by the client** — they drive every card tag and the whole
filter, so they need checking. Location, year and client are left unset rather
than guessed; those are claims about specific work.

All four detail pages carry `noindex, follow`, verified in the rendered HTML.

**Next 16 note:** `params` is a `Promise` and must be awaited
(`params: Promise<{ slug: string }>`) — confirmed against
`node_modules/next/dist/docs`. Per `AGENTS.md` I will read the relevant doc
before each new file convention rather than working from memory.

### The content problem, stated plainly

The detail design is filled with convincing copy — *"Distribution panels
inspected, repaired and brought back to specification"*, a five-line scope of
works, Schneider/Legrand/ABB as equipment. **None of it is client-verified.** It
is design placeholder text, and it reads as fact.

What actually exists for these four projects is a name and a category. Location,
year, client, scope, equipment and photography are all unknown.

Publishing invented project records for a real contractor is not a design
detail — a prospective client could ask about work that never happened. So:

- I will build the pages to the design and seed them with the design's copy
  **marked as placeholder**, so the layout is real and reviewable
- The client confirms or replaces every field before launch
- Detail pages carry `noindex` until that happens

That last point was already my recommendation on thin content; the fabrication
risk makes it the only defensible option. Still your call, but I would not ship
it otherwise.

---

## Step 4 — Contact page with a real enquiry form

The primary call to action on the entire site currently opens a mail client.
For a business whose whole funnel is quote requests, this is the thing to fix.

**Done.** `npm run lint` exit 0, `npx tsc --noEmit` exit 0, `npm run build`
exit 0 with `/contact` prerendered. 32 behaviour checks pass against the rules
and the delivery adapter.

- [x] `app/contact/page.tsx` — address, both phones, hours and email stay
      visible beside the form, as plain links
- [x] `components/contact/ContactForm.tsx` — client component, `useActionState`
- [x] `app/contact/actions.ts` — a thin shell over `lib/enquiry.ts`
- [x] `lib/enquiry.ts` — validation, honeypot, time trap, message composition
- [x] `lib/mail.ts` — Resend delivery
- [x] The three CTAs and the nav item already pointed at `/contact` from Step 2,
      and now resolve to a working page
- [x] `#contact` still lands on the footer

### The failure path does real work

Delivery is email-only by your decision, so a send that does not land cannot
just shrug:

- The form says what went wrong **and renders both phone numbers and the direct
  email inline**, so the visitor has a way through
- `lib/mail.ts` logs the entire submission on any failure, so the enquiry is
  recoverable from the host's logs even though no email arrived
- A success state is never shown for a send that did not succeed. In
  **production** a missing `RESEND_API_KEY` fails loudly; in **development** it
  logs the enquiry and reports success so the form can be exercised. Both are
  covered by checks.
- A rejected submit echoes the values back, so nobody retypes a scope because
  they mistyped an email

### The bug this step shipped, and what it changes

The first version exported `initialContactState` from `actions.ts`. A
`"use server"` module may export **only async functions**, so every submission
died at module evaluation:

> A "use server" file can only export async functions, found object.

`ContactState` and `initialContactState` now live in `lib/enquiry.ts`. A type
export is erased and harmless; a value export is not.

**Why it was not caught:** the checks covered the rules and the delivery
adapter, and the build passes — this fails at runtime on POST, not at compile
time. Attempts to replay the action with `curl` returned "Connection closed",
which I read as a `curl` limitation. It was the bug, surfacing as a broken
stream, and reading it as a tooling limit is what let it ship.

**The lesson, worth keeping:** "the pure logic is tested and the build is green"
is not the same as "the feature works". Anything with a framework seam needs
that seam exercised. A `"use server"` file should be audited for non-async
exports:

```
for f in $(grep -rl '^"use server"' src/); do grep -nE '^export ' "$f"; done
```

### How it is verified now

The action was exercised end to end through a temporary route handler that
calls `submitEnquiry` in the real Next runtime, then deleted. All four paths
confirmed:

| Input | Result |
|---|---|
| Valid enquiry | `success`, with the phone number resolved from site settings |
| Bad email, one-char name, two-char message | `error` with all three field messages **and the values echoed back** |
| Honeypot filled | Silent discard — indistinguishable from success, so a bot learns nothing |
| Submitted instantly | Silent discard |

The recipient resolved to `CONTACT_RECIPIENT_EMAIL`, and the composed subject
and body were confirmed in the server log.

Alongside that, the rules live in `lib/enquiry.ts` with no framework attached
and are exercised directly with Node's type stripping: 25 checks on validation,
the honeypot, the time trap and composition, plus 7 on the delivery adapter.

Those checks live in the scratchpad, not the repo — this repo has no test setup
and adding one was not in scope. They need no dependencies, so they are cheap to
adopt properly if wanted.

One behaviour worth calling out: **a missing time stamp passes.** The stamp is
written on mount, so no stamp means JavaScript never ran. That is the
progressive-enhancement path, not a bot, and rejecting it would silently turn
away real people.

### Delivery — Resend, to `michel.a.abidaoud@gmail.com` for now

**No `resend` package was needed.** Its REST API is one
`POST https://api.resend.com/emails` with a bearer token; the SDK wraps that
single endpoint, so it would have been a dependency shipped on every deploy to
save eight lines. `lib/mail.ts` calls it with `fetch`.

The REST body field is **`reply_to`**, snake_case — the Node SDK spells it
`replyTo`. Getting that wrong loses the reply address silently, so a check
asserts it.

**The constraint worth knowing now:** until a sending domain is verified,
Resend only sends **from** `onboarding@resend.dev` and only **to** the address
that owns the Resend account. So testing to `michel.a.abidaoud@gmail.com` works
only if that is the Resend signup address. Everything else — validation,
states, the whole form — can be built and tested before any DNS exists.

The recipient reads from Sanity `contact.recipientEmail`, with a
`CONTACT_RECIPIENT_EMAIL` env fallback, so switching to the client's real inbox
later is one field in the Studio and no code change.

### Email-only means failure has to be loud

No `enquiry` document in Sanity — decided. That leaves email as a single point
of failure, so the failure path has to do real work:

- [x] If the send throws, say so plainly and render the phone numbers and direct
      email inline, so the visitor has an immediate way through — `Problem` in
      `ContactForm.tsx`
- [x] Log the full submission server-side on failure, so a lost enquiry is at
      least recoverable from the host's logs — both the non-2xx and the thrown
      paths in `lib/mail.ts` log the whole enquiry
- [x] Never show a success state for a send that did not succeed — including
      the development no-op, which says what actually happened

These three were built in Step 4 and left unticked here by mistake. Ticked
after re-reading the code on 19 Sep, not after doing the work again.

**Still blocked on:** the client's real address. Every email published on the
live WordPress site is a theme placeholder (`info@mail.com`, `info@email.com`,
`info@yoursite.com`), so right now nobody has a working address to write to.

---

## Step 5 — Partner logo bar with auto-scrolling marquee

**Done.** `npm run lint` exit 0, `npx tsc --noEmit` exit 0, `npm run build`
exit 0.

- [x] SVG logos for **six of seven**, in `public/images/partners/`
- [x] Referenced from the fallback; the Sanity `partner.logo` field already
      exists, so Step 7 uploads the same assets and nothing in code changes
- [x] `Partners.tsx` rebuilt as a marquee: the track rendered twice and
      translated -50%, so the loop has no seam; `aria-hidden` on the duplicate
      so a screen reader does not read every brand a second time
- [x] Pauses on hover **and** `focus-within` — without the latter, tabbing to a
      logo scrolls the thing you are trying to reach
- [x] `prefers-reduced-motion` holds it **static**, not slowed
- [x] Edges masked, so logos fade in and out rather than being clipped
- [x] Duration scales with the number of logos, so adding a partner changes how
      far the track travels, not how fast it reads

### Where the logos came from, and why that matters

Four are from **simple-icons** (CC0), two from **Wikimedia Commons**. The
trademarks belong to their owners either way, so this is a stopgap: **the
client needs to confirm in writing that they may display these marks**, and
ideally supply official assets from their supplier relationships.

**Gewiss has no logo.** No clean vector was available, and tracing somebody's
trademark by hand is worse than not having it. The strip renders the name in
the display face instead, which is what all seven looked like before this step.

### Two problems the assets had, and what was done

**They were mismatched in kind.** Legrand and Daikin are full-colour wordmarks
with inline `fill` styles; the simple-icons four are monochrome glyphs. A row
of mismatched brand colours at a fraction of their intended size is exactly
what makes a partner bar look like a stock template. Every logo is therefore
flattened to one ink silhouette with `brightness(0)`, and opacity carries the
tone — so the strip holds together whatever an editor uploads next.

**They were mismatched in size, badly.** I measured the ink bounds of each file
rather than trusting the viewBox, and the numbers were damning:

| | Ink fills this much of its viewBox height |
|---|---|
| Siemens | **17%** |
| ABB | 38% |
| LG | 44% |
| Schneider, Legrand, Daikin | ~100% |

At a 26px row height the Siemens wordmark would have rendered **4px tall** —
illegible. Each viewBox is now cropped to its ink, so all six fill 94–107% of
their box.

Then the row is optically balanced: a square mark at the same height as a long
wordmark reads as much smaller, because the eye compares area rather than
height. Squarer marks get up to 1.5× the height, so Schneider's square glyph
renders at 39px beside Siemens at 26px. That is how logo strips are set, and it
matters here because the six assets are a mix of glyphs and wordmarks.

**Still worth saying:** a consistent official set would beat all of this. The
component does not care which arrives.

**Why vectors, concretely.** The seven files in `~/Downloads` are not usable
as-is: only `abb.png` has transparency, the other six are opaque white
rectangles that render as visible white boxes on the paper ground, and five are
225–320px squares with the wordmark floating in padding, so at a uniform bar
height the marks come out at wildly different optical sizes. I rendered them on
the real background colour to confirm before recommending the replacement.

Schneider, ABB, Siemens, Legrand and Daikin all publish vector press kits; LG
and Gewiss are the two likely to need hunting. Where a clean SVG genuinely
cannot be found I will say so rather than quietly substituting the raster.

**One legal note, once:** manufacturer brand guidelines generally permit
"authorised dealer" use and prohibit anything implying endorsement. Worth the
client confirming in writing that they may display these seven. Flagging it,
not blocking on it.

---

## Step 6 — SEO — code complete 19 Sep 2026

Step 2 does the structural heavy lifting. This step makes it legible to Google.

- [x] `app/opengraph-image.tsx` — 1200×630, verified as a real PNG at that size
- [x] `app/sitemap.ts` — home, services, projects index, about, contact
- [x] `app/robots.ts` — allow all, point at the sitemap, **disallow `/studio`**
- [x] JSON-LD in the root layout: `GeneralContractor`, the Monrovia address,
      both phones as `contactPoint`, `openingHours` Mo-Fr 06:00-18:00 / Sa
      06:00-16:00, `areaServed` Liberia and Lebanon, `hasOfferCatalog` of the
      five divisions. `sameAs` is omitted until real socials exist rather than
      emitted empty
- [x] `generateMetadata` on every page — unique title and description. Already
      true from Steps 2 and 3; verified rather than changed
- [x] One `<h1>` per page, no skipped heading levels — verified against the
      rendered HTML of all six route types, not the source
- [x] Redirects from the WordPress URLs — below
- [x] The `NEXT_PUBLIC_SITE_URL` trap, closed in code — below
- [ ] Google Search Console: verify by DNS TXT (can be done before cutover),
      submit the sitemap
- [ ] Google Business Profile — for a contractor with a physical address this
      outranks most on-page work
- [ ] Lighthouse against the deployed build, not locally

The last three need a domain or a deployment and cannot be done from here.

### Two couplings this step created, both deliberate

1. **`PROJECT_DETAILS_INDEXABLE` in `lib/site.ts`.** The plan said the sitemap
   would carry every project slug. It does not, because Step 3 put `noindex` on
   those pages, and submitting a noindexed URL is a Search Console error
   against the whole sitemap rather than a note about one page. One constant
   now drives both the page's `robots` metadata and its presence in the
   sitemap, so the two cannot disagree. Flip it when the records are real.
2. **The address and hours are constants in `lib/structured-data.ts`**, not CMS
   reads, while name, phones, email and socials still come from Sanity.
   `settings.address.lines` is display text and the Hours row is free text;
   `PostalAddress` and `openingHoursSpecification` have to parse. Guessing
   which line is the locality would break silently. **Changing the hours or the
   address means changing both the Studio and that file.**

### Redirects — verified against the old site, not from memory

`wp-sitemap.xml` is still live, so the inventory is real: 26 pages, 38
portfolio entries, 5 service pages, 5 blog posts, 3 team members, 1 category
archive. Every one resolves now, checked end to end:

- `/contact-us/` → `/contact`, `/our-services/` → `/services`
- `/services/<division>/` → `/services#<division>` — each of the five lands on
  its own section rather than the top of the page
- `/projects-2/`, `/projects-3/`, and all 38 `/portfolio/<slug>/` → `/projects`
- `/team/<slug>/` → `/about`
- `/our-clients/`, `/faq/`, `/blogs/`, `/category/<slug>/`, the five blog posts
  and `/privacy-policy/` → `/`
- The theme demo — `/typography/`, `/shortcodes/`, `/cart/`, `/checkout/`,
  `/service-plus/`, `/newsletter-popup/` and the eight blog-layout variants —
  answers **410 Gone** via `src/proxy.ts`, so Google drops them instead of
  reclassifying home-page redirects as soft 404s

Two notes worth keeping. Trailing-slash URLs take two hops (`/contact-us/` →
`/contact-us` → `/contact`): Next normalises before custom redirects are
consulted, so listing both forms would add rules that can never match. And 410
is the only status `redirects` cannot express, which is the entire reason the
project now has a proxy — its matcher is exhaustive and exact, so no live route
pays for it.

**`/portfolio/<slug>` goes to the index, not to a matching detail page.** Four
of those slugs do match real records, but those pages are `noindex` while their
content is placeholder, so inherited authority would land somewhere excluded
from search. Worth revisiting once the records are verified.

### The `NEXT_PUBLIC_SITE_URL` trap — closed

It is still `http://localhost:3333` in `.env.local`, which is correct there.
What changed is that shipping it is no longer silent: `lib/site.ts` treats a
localhost origin in a production build as a misconfiguration, falls back to the
real domain, and logs it. It still has to be set properly in the deployment
environment — the guard is a net, not a substitute — and it still gets verified
against the deployed HTML.

---

## Step 7 — Seed the dataset, then hand Sanity over

This is the "so you can edit text and change photos yourself" part, and the
answer to "when the client's project exists, we just connect it".

Handing over an empty Studio and asking the client to type several hundred
fields is not a handover. So:

- [x] `scripts/seed.ts` — reads `fallbackHome` and `fallbackContact`, uploads
      everything in `public/images/` as Sanity assets, writes documents with
      deterministic `_id`s so re-running updates rather than duplicates
- [x] Run via `npx sanity exec scripts/seed.ts --with-user-token` — the `sanity`
      CLI is already a dependency and **confirmed logged in as the personal
      account**, checked with `npx sanity debug` rather than assumed. No new
      package and no API token
- [x] Seed `wwicg618` and verify the site renders from the CMS rather than the
      fallback — **25 documents, 15 images**, and every page verified
- [x] Walk every section: change a heading in the Studio, confirm it changes on
      the site — done through the CLI rather than the Studio UI, same write
      path. The edit appeared in under three minutes, inside the 300s window,
      and was reverted afterwards

### Verifying this is harder than it looks, and the reason is the design

The fallback renders the *same text* as the seeded CMS, because the CMS was
seeded from the fallback. So a page that looks perfect proves nothing: it looks
identical whether Sanity is connected, misconfigured, or down.

The only honest tell is the images, which are local paths on the fallback and
`cdn.sanity.io` URLs from the CMS:

```
curl -s http://localhost:3333/ | grep -o "cdn.sanity.io" | wc -l
```

Home 181, about 70, services 65, projects 58, a project page 32. Contact is
legitimately 0 — that page has no photography. This is written into
`docs/CONNECT-SANITY.md` because it is the step most likely to be skipped by
someone who loads the page, sees the site, and assumes.

One thing worth knowing: **partner logos are SVG**, and Next refuses to run SVG
through its image optimiser. It passes them through to Sanity's CDN untouched
instead, which works — verified 200 `image/svg+xml` — so no `dangerouslyAllowSVG`
was needed. Sanity does not rasterise SVG either, so the `?w=320` on those URLs
is inert rather than broken.

### Connecting the client's project later

Once the seeded dataset exists, moving is two commands:

```
npx sanity dataset export production                 # from wwicg618
npx sanity dataset import production.tar.gz production --project <their-id>
```

The only code-side change is the env vars — `client.ts` is already fully
env-driven, so nothing in `src/` is touched. The remaining manual steps are CORS
origins (localhost, preview domain, production domain, **with credentials**) and
`npx sanity schema deploy`.

- [x] Write this up as `docs/CONNECT-SANITY.md` so it is repeatable without me
      — including the transfer-instead-of-migrate route, which is preferable and
      was not in this plan, and the two failure modes that cost the most time
      (a CORS origin without credentials, and env vars set locally but not on
      the host)
- [ ] 30–45 minute Studio walkthrough with whoever will be editing — needs a
      person, not a commit

### Accounts and ownership

Everything should be created under the **client's own accounts**, with me added
as a collaborator. Not a trust question — if the accounts are mine, I am their
unpaid sysadmin forever, their billing runs through my card, and their content
lives somewhere they cannot reach without me. Costs nothing to do correctly at
the start and is painful to unwind later.

- [ ] Client creates a Sanity account → organisation "Mahfouz Contracting" →
      invites me as Administrator
- [ ] Client creates a Vercel account → invites me as a collaborator
- [ ] Domain stays registered to the client; I only need DNS records

`wwicg618` sits under your personal Sanity account. Sanity can transfer a
project between organisations if you are an admin of both
(`sanity.io/manage` → project → Settings), so it does not need rebuilding —
but do it before the client enters content, not after.

**Worth checking:** Vercel's free Hobby tier is for personal, non-commercial
projects; a company site is meant to be on Pro at about $20/month. Netlify's
free tier permits commercial use and runs Next.js fine, if we would rather not
add a bill.

---

## Decisions taken — 18 Sep 2026

| | Decision |
|---|---|
| Site structure | **Multi-page**: Home, About, Services, Projects, Contact |
| Sanity project | **`wwicg618`** for now; move to the client's project at handover |
| Dev port | **3333** — matches the project's existing CORS origin |
| Dataset | **Stays empty**; the site renders from fallback content until Step 7 |
| Detail pages | **`noindex`** until the client verifies the project records |
| Work account | **Never touched** from this repo |
| Form delivery | **Resend**, test recipient `michel.a.abidaoud@gmail.com` |
| Enquiry records | **Email only** — so Step 4 carries a loud-failure path instead |
| Partner logos | **Source proper SVGs**, not the downloaded rasters |
| Uncommitted work | **Commit to `main` first**, then a branch per step |

All three previously open questions are now settled:

- **Project detail pages carry `noindex`** until the client verifies the
  content. The design copy is invented and the pages are otherwise thin.
- **`/about` and `/services` get built** from the existing home sections in the
  established design language, for review afterwards rather than design first.
- **CORS is untouched** — the port move to 3333 made the change unnecessary.

## Step 8 — The copy moved into Sanity — done 20 Sep 2026

Deferred on 19 Sep, done now. Until this, the CMS held the content and the code
held the furniture: the client could rewrite what a section said but not what it
was called, and could not touch a single page title or description — which is
the copy that decides whether anyone arrives at all.

One new singleton, **Page copy**, with four tabs:

| Tab | What it holds |
|---|---|
| Home page | the division strip label, and the Capabilities and Selected work sections |
| Inner pages | the About, Services and Projects hero headings and leads, the process heading, "More work, on request", the empty-filter state and the "All work" filter label |
| Contact page | every label on the enquiry form, both button states, the line after a successful send, and the "Reach us directly" column |
| Search & sharing | an `seo` object per route |

One document rather than a heading field added to each section's own record.
Rewriting the site is one job, and five more singletons would make the studio
read like a filing cabinet.

### Three things worth knowing

**The merge needed a second level.** `mergeObject` stops one level deep on
purpose — below that are images and links, where half of one and half of
another is worse than either whole. But a section here is a nested object of
four strings, so merged at the top level an editor who rewrote a heading and
left the lead empty would publish `{ heading }` and take the lead off the page.
That is the identical trap, one level down. `mergeCopy` closes it, and is used
only by documents that are copy all the way down.

**Declaring `openGraph` on a page silently deletes the share card.** Next
shallow-merges metadata, so a page's `openGraph` replaces the layout's resolved
one outright — file-convention image included. Caught on the running site: all
four inner pages went to zero `og:image` tags while every other tag stayed
correct. That is the shape of failure that ships, because everything visible
looks right. `pageMetadata` names the card explicitly now, and a share image
set per page in the studio replaces it for that page alone.

**`homeSeo` does two jobs** — the home page's own metadata, and the default
every other route inherits. So the home page still declares nothing but its
canonical: a title set there would run through the template and print the
company name twice. `siteSettings.seo` went the way of `hero.metrics` — in the
schema, never read, now gone, with one field doing the job.

### Deliberately still in code

- **What a visitor is told when a send fails.** Some of it reports a fault
  rather than addressing a person, including the development-mode line that
  says the email was composed but never sent.
- **The Open Graph card's own wording.** It is drawn at build time, so copy
  moved there would not follow a studio edit until the next deploy.
- **The footer's column headings** (Navigate, Services, Contact) and the
  "Privacy" link label. Interface furniture, consistent with each other.

---

## Step 9 — The privacy policy, and the design questions — done 20 Sep 2026

**The privacy policy is written and live at `/privacy-policy`.** That is the
address the old WordPress site published, and it was in the redirect table
pointing at the home page for want of anywhere better to send it. It is out of
that table now, so whatever authority the old URL carries lands on the page it
was always about. The trailing-slash form still normalises to it in one hop.

It is a **draft and has not been read by a lawyer**, which is said plainly in
the fallback module and in `docs/CLIENT-SETUP.md`, where item 10 has moved from
"supply the text" to "read this and tell me what is wrong". It lives in the CMS,
so a replacement from the client's own lawyer needs no developer.

It describes what this site actually does rather than covering everything a
policy can cover. Boilerplate about cookie categories and profiling would have
been faster and would have been a claim nobody checked. It asserts four
specific things, all true of the code as it stands:

- the enquiry form collects only the fields visible on it
- a submission is emailed and never written to a database
- the site sets no cookies of its own
- the typefaces are served from this origin, not from Google

**Adding analytics, a chat widget or a stored enquiry log breaks one of them,
and has to change that text in the same commit.** The condition is recorded in
the fallback module beside the policy so it is read by whoever breaks it.

Two departures from the rest of the site, both deliberate. It is the only page
that does not end on the closing banner — asking someone reading a privacy
policy whether they have a project in mind reads as a company that was not
listening. And the margin column carries the revision date, which is genuine
sheet metadata rather than the decorative label that column is not allowed to
hold.

The three design questions are answered above. `hero.metrics`, `about.metrics`,
the `metric` object type and the `Counter` component are all gone.

### Verified, 20 Sep 2026

Gates clean on the branch: `npm run lint` exit 0, `npx tsc --noEmit` exit 0.

The dataset was reseeded: **27 documents**, 15 images deduped on hash rather
than re-added. `svc-it.code` reads `IA`, `about.details` carries the two named
rows, `hero.metrics` is null, and the two new documents exist. Checked by GROQ
against the dataset, not inferred from the page.

Every route 200, and the `cdn.sanity.io` count per page matches the figures
`docs/CONNECT-SANITY.md` records for a connected CMS — home 181, about 70,
services 65, projects 58, a project page 32, contact 0. Zero
"serving fallback content" warnings in the server log, which is the only proof
that every query was actually answered rather than quietly falling back. The
share card is a real 1200x630 PNG on all five pages again.

---

## Step 10 — Motion and the contact page — done 20 Sep 2026

Three notes from review, before the branch merges.

### "The sections animate too fast"

They are scrubbed by scroll position, not played on a timer, so this is never a
duration — it is the window. `ENTER 0.9` to `ARRIVE 0.64` is **0.26 of a
viewport**: 234px on a 900px screen for a block to go from 0.34 opacity and 32px
low to settled. The travel was right; the run-up was not.

`ENTER` is **1.06** now, past 1, so a scene starts below the fold and is a
seventh of the way through before any of it can be seen. `ARRIVE` is untouched
— it was measured twice (0.74 too early, 0.52 too late) and nothing should
finish later on screen than that says.

| | before | after |
|---|---|---|
| range | 0.26 vh (234px) | 0.42 vh (378px) |
| visible part of it | 182px | 324px |
| opacity on entering | 0.34 | 0.46 |

The opacity stop moved 0.7 — 0.8 with it. It is a fraction of the range, and
the range got longer, so leaving it would have pulled full opacity to a higher
point on the screen than the measurement that set it.

### "Images appear suddenly from the bottom"

Worse than it sounded, and a real fault rather than a preference. On `ENTER` a
photograph reached the bottom edge of the viewport with its clip-path still at
`inset(100%)` — so the first thing anyone saw of it was **nothing**, and then
all of it inside a quarter of a viewport of scroll.

`ImageReveal` has its own `ENTER_IMAGE` of **1.2**. A photograph is about 40%
uncovered by the time it is visible at all, and the rest of the wipe runs over
0.56 of a viewport instead of 0.26.

The `Process` and `ServiceDetail` parallax depths came down about 28%. The
process cards are the one place two vertical motions land on the same element
— the card rises on its `Reveal` while the photograph inside travels on its
own — and at 46-94 the two compounded into a rush rather than depth.

`animate-rise` went 1.35s — 1.6s and then **back to 1.35s**. The theory was
that timed motion above the fold and scrubbed motion below it should read as one
system; the answer on review was that the heroes were never the complaint and
are the first thing anyone waits through. The reveals below the fold keep the
longer run-up. `animate-wipe-up` had no caller anywhere in `src/`; the scroll
wipe replaced it and left the utility, its keyframes and its reduced-motion
branch behind. Removed, and it stays removed.

**Verified from `framer-motion`'s source, not assumed:** `resolveEdge`
multiplies a numeric edge by the container length with no clamp, so an offset
past 1 resolves below the fold exactly as intended.

### "The contact page is bland"

It was a form on paper with a column of small text beside it under a hairline.
Nothing on the page carried any weight, so the form had nothing to sit against.

- **The contact column is a title block** — an ink panel of ruled, labelled
  fields. The third of them on the site after the footer and the about section,
  and deliberately the same object rather than a new idea for one page. It takes
  any number of rows, so two phones or five need nothing to know how many.
- **The section gained its margin label, "Enquiry".** Every other section sits
  in the sheet grid with its name in the left column; this one was a bare shell,
  which is a quiet part of why it read as a different site.
- **"What to send"** — four things that make a quote possible to price without a
  phone call. New copy, marked `TODO(client)`, and a field on the contact
  document so it is theirs to change or clear.
- **`contact.map` finally renders.** In the schema since Step 1 with no reader
  — the same class of thing as `hero.metrics` and `animate-wipe-up`. It stays
  unset, so nothing shows until the client supplies coordinates, which print as
  sheet metadata under the address.

**No embedded map, deliberately.** An iframe from a mapping provider would load
third-party script on the one page a visitor types their name, email and phone
number into, and would make a liar of `/privacy-policy`, which this same branch
publishes saying the site does no such thing. Coordinates find a building and
cost nobody anything.

Fixed on the way past: the Office row is gone from `contact.details`. It
duplicated `settings.address`, and the page filtered it back out by matching the
literal string `"Office"`, so renaming that row in the studio printed the
address twice. One source, no filter, and the `TODO` from Step 8 goes with it.

### Verified, 20 Sep 2026

Gates clean, `npm run build` exit 0. Contact checked in a real browser at 1440
rather than from the markup: six ruled rows, no duplicate address, four
checklist items, the panel top aligned with the form's rule. Every route still
200, 404 still 404, per-page `cdn.sanity.io` counts unchanged, no
"serving fallback content" warnings.

Reseeded again for the contact changes. **Worth knowing:** the stale render
survived deleting `.next/cache/fetch-cache` and a server restart — it took
removing the whole `.next` directory. Budget for that after any reseed.

**Not pixel-verified: phone width.** The stacking order is right in the markup
(form, panel, checklist) but headless Chrome here clips the right edge of every
page, including ones this branch never touched, so the capture proves nothing
either way.

---

## Step 11 — The soft-navigation dimming — done 20 Sep 2026

Reported on `/services`: the first block under the hero is right on a hard load,
but navigate away and back and it sits dimmed and stays there. **Two faults, both
only reachable by a client-side navigation**, which is why every check up to here
had missed them.

### The guard was measuring at the wrong moment

An element inside the first screenful must not be held at rest opacity — there
is no scroll above it to drive a reveal. The test for that was *"is it on screen
when the page first paints"*.

On a soft nav the new page mounts while the **old** scroll position is still in
force, and the router does not jump to the top, it **animates** there. Traced over
CDP, arriving at `/services` from a home page at 2000px:

| t | scrollY | article top | on screen |
|---|---|---|---|
| 130ms | 1983 | -1492 | no |
| 330ms | 1200 | -709 | **yes** |
| 870ms | 0 | 491 | yes |

The measurement at mount saw it far below the fold and left the effect enabled.
Re-measuring for a few frames was the obvious fix and was still a race — it
would have had to outlast the whole 870ms animation.

**Adding the scroll offset back removes the race instead of racing it.**
`rect.top + scrollY` is the element's position in the *document*, which does not
change while the page scrolls, so the answer is identical at every point during
that animation, on a hard load, and on a restored back navigation. No timers, no
listeners, nothing to settle. The hook is `useInFirstScreen`.

### Fixing that exposed the second fault, which was worse

Motion drives these through MotionValues **straight onto the node**, and
`style={undefined}` does not put back what it wrote — it only stops updating
it. So the moment the guard correctly opted an element out, that element froze at
whatever the last frame had written: `0.34` and `translateY(32px)`, permanently.
Worse than the bug being fixed, because at least that one came back when you
scrolled.

The disabled branch states the finished position now (`SETTLED`, `UNCOVERED`)
rather than hoping the enabled one never ran. **Anything that disables a Motion
style has to say what the element should look like instead.**

### A transform conflict, unpicked on the way

The about block's overhang was a `lg:translate-y-8` on the same element as a
`Reveal`. A Reveal owns the transform of what it wraps — Motion writes one
inline — so the class was overwritten whenever the scene had any progress at
all. Moved to the `dl` inside it. One element, one owner of its transform.

### Verified, 20 Sep 2026

Over CDP at a 900px viewport, all three ways in — hard load, soft nav from a
home page scrolled to 2000, and browser Back — zero dimmed elements on screen
in each. Reveals still work: scrolling `/about`, a below-fold block climbs
0.34 — 0.39 — 1 as it comes up, so this opts out the first screenful and
nothing else. The about title block was screenshotted — the overhang still
hangs. Gates clean (exit codes checked, not just output), `npm run build` exit 0.

**Worth keeping:** driving a real client-side navigation needs a browser. Node 22
has a global `WebSocket`, so CDP can be driven with no dependencies at all —
launch the Playwright chromium with `--remote-debugging-port`, connect to the page
target, and `Runtime.evaluate`. That is how both faults were found and how the fix
was proved; neither is visible in the markup or on a hard load.

---

## Out of scope

Priced separately if wanted later: a page per division (beyond the single
`/services` page), blog or case studies, Arabic or French localisation,
analytics beyond the host's built-in, live chat, quote calculator, client
portal, ongoing content entry after handover.
