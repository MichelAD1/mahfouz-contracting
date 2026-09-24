"use server";

import { sendEnquiry } from "@/lib/mail";
import {
  composeBody,
  composeSubject,
  isHoneypotTripped,
  isTooFast,
  readValues,
  validate,
  type ContactState,
} from "@/lib/enquiry";
import { getContactPage, getSiteFrame } from "@/sanity/lib/fetch";

/**
 * `ContactState` and `initialContactState` live in @/lib/enquiry, not here: a
 * `"use server"` module may export **only async functions**. Exporting a type
 * is erased and harmless, but exporting the initial-state object made every
 * submission fail at module evaluation with "A 'use server' file can only
 * export async functions, found object". Keep this file to actions.
 */

/** Shown to whatever filled the form blind, so it learns nothing from the reply. */
const DISCARDED: ContactState = {
  status: "success",
  message: "Thank you - we will be in touch.",
};

/**
 * A thin shell. The rules live in @/lib/enquiry so they can be tested without
 * a browser; this handles the parts that need the server: the recipient, the
 * send, and what the visitor is told when it does not work.
 */
export async function submitEnquiry(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const read = (field: string) => {
    const value = formData.get(field);
    return typeof value === "string" ? value : null;
  };

  if (isHoneypotTripped(read("hp"))) {
    console.warn("[contact] honeypot tripped, discarding submission");
    return DISCARDED;
  }

  if (isTooFast(read("startedAt"))) {
    console.warn("[contact] submitted too fast, discarding submission");
    return DISCARDED;
  }

  const values = readValues(read);
  const errors = validate(values);

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please check the fields marked below.",
      errors,
      values,
    };
  }

  const [contact, { settings }] = await Promise.all([getContactPage(), getSiteFrame()]);
  const to = contact.recipientEmail ?? process.env.CONTACT_RECIPIENT_EMAIL;

  if (!to) {
    console.error("[contact] no recipient configured; enquiry NOT delivered", values);
    return {
      status: "error",
      message: "We could not send that just now. Please call or email us directly.",
      values,
    };
  }

  const result = await sendEnquiry({
    to,
    replyTo: values.email,
    subject: composeSubject(values),
    text: composeBody(values),
  });

  if (!result.ok) {
    // sendEnquiry has already logged the whole submission, so the enquiry is
    // recoverable from the host's logs even though the email did not arrive.
    return {
      status: "error",
      message: `We could not send that just now (${result.reason}). Please call or email us directly - the details are beside this form.`,
      values,
    };
  }

  /**
   * The development no-op. Saying "thank you, we will be in touch" over an
   * email that was never sent is the precise failure this page exists to
   * prevent, so it says what actually happened instead.
   */
  if (!result.delivered) {
    return {
      status: "success",
      message:
        "Validated and composed, but NOT SENT - no RESEND_API_KEY is configured, so the enquiry was written to the server console instead. Set the key in .env.local to send for real.",
    };
  }

  return {
    status: "success",
    message: `Thank you - your enquiry is with us and we will come back to you. If it is urgent, call ${settings.phones[0]?.number ?? "us"}.`,
  };
}
