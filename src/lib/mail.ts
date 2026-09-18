/**
 * Enquiry delivery, over Resend's REST API.
 *
 * This module reads `RESEND_API_KEY` and must never reach the browser. Its only
 * importer is the `"use server"` action in app/contact/actions.ts, which keeps
 * it server-side. The `server-only` package would assert that at build time,
 * but it is not installed and is not worth a dependency for one file — so if
 * this ever gains a second importer, check what that importer is.
 *
 * Deliberately a `fetch` rather than the `resend` package. The SDK is a thin
 * wrapper over this one endpoint, and a dependency that ships on every deploy
 * to save eight lines is a poor trade — especially on a site whose whole
 * server-side surface is this file.
 *
 * Note `reply_to`, snake_case: that is the REST field name. The Node SDK
 * spells it `replyTo`, which is the kind of difference that fails silently.
 */

const ENDPOINT = "https://api.resend.com/emails";

export type MailResult = { ok: true; id: string } | { ok: false; reason: string };

export type Enquiry = {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

export async function sendEnquiry(enquiry: Enquiry): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM ?? "Mahfouz Contracting <onboarding@resend.dev>";

  /**
   * With no key configured, development logs the enquiry and reports success so
   * the form can be exercised end to end. Production does the opposite: no key
   * means no delivery, and saying otherwise would lose the enquiry silently,
   * which is the exact failure this whole page exists to prevent.
   */
  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[mail] RESEND_API_KEY is not set; enquiry NOT delivered", {
        replyTo: enquiry.replyTo,
        subject: enquiry.subject,
      });
      return { ok: false, reason: "delivery is not configured" };
    }

    console.warn("[mail] no RESEND_API_KEY — enquiry logged, not sent:\n", enquiry);
    return { ok: true, id: "dev-no-op" };
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [enquiry.to],
        reply_to: enquiry.replyTo,
        subject: enquiry.subject,
        text: enquiry.text,
      }),
    });

    if (!response.ok) {
      // Logged in full because an undelivered enquiry is otherwise lost: this
      // is the only record that someone tried to get in touch.
      const detail = await response.text().catch(() => "<unreadable>");
      console.error(
        `[mail] Resend returned ${response.status}; enquiry NOT delivered`,
        { detail, enquiry },
      );
      return { ok: false, reason: `delivery failed (${response.status})` };
    }

    const body = (await response.json()) as { id?: string };
    return { ok: true, id: body.id ?? "unknown" };
  } catch (error) {
    console.error("[mail] request to Resend threw; enquiry NOT delivered", {
      error,
      enquiry,
    });
    return { ok: false, reason: "delivery failed" };
  }
}
