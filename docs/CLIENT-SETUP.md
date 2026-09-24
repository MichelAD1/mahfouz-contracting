# What Mahfouz Contracting needs to set up

Everything below has to be created under **your own accounts**, with the
developer added as a collaborator — not the other way round.

This is not a trust question. If the accounts are mine, your content lives
somewhere you cannot reach without me, your bills run through my card, and you
have an unpaid sysadmin as a permanent dependency. It costs nothing to do
correctly at the start and is painful to unwind later.

Each item below says what it is for, what I need from you once it exists, and
what happens if it is skipped.

---

## 1. Sanity — the content management system

**What it is.** Where all the text and photographs on the site live. You edit
them at `yoursite.com/studio`, and the site updates within five minutes without
anyone touching code.

**What to do.** Create an account at [sanity.io](https://www.sanity.io), make an
organisation called *Mahfouz Contracting*, and invite me as Administrator.

**What I need.** The invitation, and nothing else.

**Note.** The site is currently running on a Sanity project under a personal
account, already filled with your content. Sanity can transfer a project
between organisations, so nothing needs rebuilding — but **do this before you
start editing**, not after.

**If skipped.** The site still works. Your content stays in an account you do
not control, which is the exact problem this list exists to prevent.

---

## 2. Hosting — Vercel or Netlify

**What it is.** The machine that serves the website.

**What to do.** Create an account with one of them and invite me as a
collaborator.

**Which one.** Vercel's free tier is for personal, non-commercial projects, so a
company site belongs on their paid plan — budget roughly $20 a month. Netlify's
free tier permits commercial use and runs this site perfectly well. Check the
current terms before deciding; both change their pricing. If the choice is a
coin flip, Netlify costs nothing and Vercel is slightly simpler to operate.

**What I need.** Collaborator access, and confirmation of which one you chose.

**If skipped.** There is nowhere to put the site.

---

## 3. The domain

**What to do.** Keep `mahfouzcontracting.com` registered in your own name. I
only ever need permission to add DNS records, never ownership of the domain.

**What I need.** Either access to the DNS settings, or someone who can add
records I send you. There will be a handful: one set to point the domain at the
host, one to let the enquiry form send email, and one to verify the site with
Google.

**If skipped.** The new site cannot go live on your address.

---

## 4. Resend — enquiry form delivery

**What it is.** The service that turns a submitted contact form into an email in
your inbox.

**What to do.** Create an account at [resend.com](https://resend.com) and verify
`mahfouzcontracting.com` there, using the DNS records it gives you.

**What I need.** An API key from the account.

**Why the domain verification matters.** Until the domain is verified, Resend
will only deliver to the address that opened the account. Every other enquiry
silently goes nowhere.

**If skipped.** The contact form cannot deliver. The site tells the visitor so
and shows your phone numbers instead, so nothing is lost silently — but the
enquiry still has to be made twice.

---

## 5. A real enquiry inbox address

**What to do.** Tell me the email address enquiries should go to.

**Why this is on the list.** Every email address published on your current
website is a placeholder that came with the theme — `info@mail.com`,
`info@email.com`, `info@yoursite.com`. None of them are yours. Right now there
is no working address for a customer to write to.

Once it exists you can change it yourself in the Studio at any time, without a
developer.

**If skipped.** Enquiries go to a developer's test inbox.

---

## 6. Google Search Console

**What it is.** Google's own report on how your site appears in search.

**What to do.** Go to
[search.google.com/search-console](https://search.google.com/search-console),
add `mahfouzcontracting.com`, and verify it with the DNS record it gives you.
Then add me as a user.

**This can be done now**, before the new site is live — verification only needs
the domain.

**If skipped.** The site is still indexed. You simply have no visibility into
it, and no way to be told about problems.

---

## 7. Google Business Profile

**What it is.** The panel that appears on the right of a Google search for your
company, and the pin on Google Maps.

**What to do.** Claim the Monrovia address at
[business.google.com](https://business.google.com). Verification usually means
a phone call or a postcard, so **start this early** — it is the slowest item on
this list.

**Why it matters more than it looks.** For a contractor with a physical address
and a service area, this outranks almost everything that can be done on the
website itself. It is the single highest-value item here.

**If skipped.** You are absent from local search results, which is where most
people looking for a contractor start.

---

## 8. Written confirmation on the partner logos

**What it is.** The strip of manufacturer logos on the home page — Legrand,
Schneider Electric, ABB, Siemens, Daikin, LG.

**What to do.** Two things. Confirm in writing that you are permitted to display
these marks, and ideally supply the official logo files from your supplier
relationships.

**Why.** The six logos currently on the site are stand-ins I sourced publicly,
not assets anyone gave us. The trademarks belong to their owners either way.
Manufacturer brand guidelines usually permit "authorised dealer" use and
prohibit anything implying endorsement, so this is normally a formality — but it
should be a formality someone has actually completed.

**If skipped.** A legal risk that is small, real, and entirely avoidable.

---

## 9. A logo file

**Done from the brand identity presentation — confirm the direction.** The MC
mark from **Direction 01** (page 5) is on the site: extracted as a vector from
the PDF, in its own colours on light grounds and the deck's reversed off-white
on dark ones, plus a square icon for the browser tab. The presentation shows
three directions; tell me if Direction 01 is not the chosen one, and send the
final artwork files once the designer issues them.

**To change it later**, upload in the Studio: **Site settings → Identity**.
There are three slots, and only the first is needed:

- **Logo** — the version for light backgrounds. An **SVG** if one exists,
  otherwise a PNG with a transparent background.
- **Logo for dark backgrounds** — a white or light version, for the header over
  a photograph, the footer and the mobile menu. Without it the site shows the
  logo above as a white silhouette there, which works for a one-colour mark and
  loses detail in a multi-colour one.
- **Browser tab icon** — a **square PNG** at 512×512 or larger.

The moment one is published it replaces the typeset wordmark in the header and
the footer, and it is given to Google as the company's logo.

**Why.** There is no logo file anywhere in your current site — the name is set
in type. Google's business listing wants a real image, and the browser tab still
shows the web framework's default icon until one is uploaded.

**If skipped.** The site keeps using the typeset wordmark, which looks
deliberate and works. The Google listing looks emptier than your competitors',
and the browser tab icon is not yours.

---

## 10. A privacy policy — drafted, needs your review

**What to do.** Read the policy at `/privacy-policy` on the new site and tell
me what is wrong with it, or replace it with your own.

**What I need.** Either "that is fine", or a corrected version. Once the site
is live you can edit it yourself in the Studio, so a later change needs no
developer.

**Why this is not finished.** I have written the draft, and it is a real page
on the new site — your old address `/privacy-policy` now answers with it
instead of redirecting to the home page. **It has not been read by a lawyer.**

It was written to describe what this website actually does rather than to
cover everything a policy can cover, because a policy describing cookies and
tracking that do not exist here is a claim nobody checked. It currently asserts
four things, all true of the site as built:

- the enquiry form collects only the fields visible on it
- a submission is emailed to you and never written to a database
- the site sets no cookies of its own
- the typefaces are served from your own domain, not from Google

Adding analytics, a chat widget, or anything that stores enquiries breaks one
of them, and the policy has to change at the same time.

**If skipped.** The page stands as written. Better than the nothing that was
there, worse than a policy somebody with authority has read.

---

## Summary

| # | Item | Who creates it | Blocking launch? |
|---|---|---|---|
| 1 | Sanity account + organisation | You | No, but do it before editing |
| 2 | Hosting account | You | **Yes** |
| 3 | Domain + DNS access | You | **Yes** |
| 4 | Resend account + API key | You | **Yes**, for the contact form |
| 5 | Real enquiry inbox | You | **Yes**, for the contact form |
| 6 | Google Search Console | You | No — but do it now, it is free |
| 7 | Google Business Profile | You | No — **start early**, it is slow |
| 8 | Partner logo permission | You | No, but before launch |
| 9 | Logo — **in place** from Direction 01; confirm the direction | You | No |
| 10 | Privacy policy | **Drafted** — you review it | No |
