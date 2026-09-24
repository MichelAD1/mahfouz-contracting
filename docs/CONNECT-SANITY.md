# Connecting this site to a different Sanity project

Written so this is repeatable by someone who is not me.

The site currently runs on project **`wwicg618`**, dataset **`production`**,
which sits under a personal Sanity account. At handover the content moves to a
project the client owns. Nothing in `src/` changes — `sanity/lib/client.ts` and
`sanity.cli.ts` both read the same environment variables, so the move is
configuration and data, not code.

---

## Before you start

Decide which of the two you are doing:

- **Transfer the existing project.** Preferred. Sanity can move a project
  between organisations if you are an administrator of both
  (`sanity.io/manage` → the project → Settings). The project id stays the same,
  so there is no export, no import, and no env change at all. Do it *before* the
  client starts editing.
- **Move the content into a project they created themselves.** Everything
  below. Also what you do if the two accounts cannot see each other.

---

## 1. Export the current dataset

```bash
npx sanity dataset export production
```

Writes `production.tar.gz` in the working directory: every document plus every
uploaded image. Keep this file — it is a complete backup of the site's content
and worth taking before any of the steps below, whether or not you use it.

## 2. Import into the new project

```bash
npx sanity dataset import production.tar.gz production --project <new-project-id>
```

If the target dataset does not exist yet, create it first in `sanity.io/manage`,
or with `npx sanity dataset create production`.

Add `--replace` only if you mean it: it overwrites documents with matching ids.
On a dataset that has never been edited that is harmless. On one the client has
been working in, it discards their work.

## 3. Point the site at it

Three variables, in **both** `.env.local` and the hosting provider's
environment settings:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<new-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
```

Do not change `NEXT_PUBLIC_SANITY_API_VERSION` casually. It pins the query
behaviour the site was built and tested against; a newer date is a different
API, not an upgrade.

Setting these locally and forgetting the host is the most common way this goes
wrong: the site keeps working on your machine and serves the old project's
content, or no content at all, in production.

## 4. Deploy the schema

```bash
npx sanity schema deploy
```

The schema lives in this repository, not in Sanity. A new project has no idea
what a `project` or a `service` document looks like until this runs.

## 5. Add the CORS origins

In `sanity.io/manage` → the project → API → CORS origins, add every address the
embedded Studio is opened from:

| Origin | Credentials |
|---|---|
| `http://localhost:3333` | **Yes** |
| The preview/deploy URL | **Yes** |
| `https://mahfouzcontracting.com` | **Yes** |

**Allow credentials must be ticked.** Without it the Studio loads, shows a
login screen, and refuses to authenticate, with an error that does not mention
CORS. This is the single most common cause of "the Studio is broken".

Note the port: this project's dev server runs on **3333**, not 3000, precisely
so it matches an origin that is already allowed.

## 6. Seed, if the new dataset is empty

```bash
npx sanity exec scripts/seed.ts --with-user-token
```

Writes every document the site renders, from `src/sanity/fallback/content.ts`,
and uploads the images in `public/images/` as Sanity assets.

To see what it would write first — no login needed, nothing uploaded or
written — add `-- --dry-run --out=seed-preview.json` in place of
`--with-user-token`. The documents the site stopped reading in Step 14
(`hero`, `about`, `sectionCopy`) are left in place unless you add
`-- --prune-legacy` to a real run; nothing reads them either way.

Safe to re-run: ids are deterministic and writes are `createOrReplace`, so a
second run updates in place rather than duplicating the site. Assets dedupe on
content hash at Sanity's end.

**It overwrites.** Re-running after the client has edited replaces their edits
with the original content. It is a seeding tool, not a sync — once someone is
editing, it has done its job and should not be run again.

Prefer the export/import route over seeding when content already exists, since
export/import carries the client's edits and seeding does not.

## 7. Verify, rather than assume

```bash
npm run dev
```

The site renders from `src/sanity/fallback/content.ts` whenever Sanity is
unreachable or unconfigured, by design — so a page that looks correct is **not**
evidence that the CMS is connected. The text is identical either way.

The way to tell them apart is the images:

```bash
curl -s http://localhost:3333/ | grep -c "cdn.sanity.io"
```

A number greater than zero means the page is reading from the CMS. Zero means
it is on the fallback, whatever the page looks like.

Then change a heading in the Studio and reload after five minutes. Content is
cached for 300 seconds (`REVALIDATE` in `src/sanity/lib/fetch.ts`), so an edit
is not expected to appear instantly.

---

## What does not change

- Anything in `src/`. The client is fully environment-driven.
- The schema definitions in `src/sanity/schemas/`.
- The fallback content. It stays as the safety net, and as the seed.

## If something goes wrong

| Symptom | Cause |
|---|---|
| Studio shows a login loop | CORS origin missing, or added without credentials |
| Site renders but images are local paths | `NEXT_PUBLIC_SANITY_PROJECT_ID` not set in that environment |
| Studio is empty, site is fine | Schema deployed but dataset not seeded or imported |
| Fields exist in the site but not in the Studio | `npx sanity schema deploy` not run after a schema change |
| Edits do not appear | Fewer than 300 seconds have passed |
