"use server";

import { sendEnquiry } from "@/lib/mail";
import {
  composeBody,
  composeSubject,
  isHoneypotTripped,
  isTooFast,
  readValues,
  validate,
} from "@/lib/enquiry";
import { getContact, getSiteFrame } from "@/sanity/lib/fetch";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Keyed by input name, so each field can show its own problem. */
  errors?: Record<string, string>;
  /**
   * Echoed back on failure. Without this a rejected submit clears the form and
   * the visitor retypes everything, which is how one mistake becomes a lost
   * enquiry.
   */
  values?: Record<string, string>;
};

export const initialContactState: ContactState = { status: "idle" };

/** Shown to whatever filled the form blind, so it learns nothing from the reply. */
const DISCARDED: ContactState = {
  status: "success",
  message: "Thank you — we will be in touch.",
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

  const [contact, { settings }] = await Promise.all([getContact(), getSiteFrame()]);
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
      message: `We could not send that just now (${result.reason}). Please call or email us directly — the details are beside this form.`,
      values,
    };
  }

  return {
    status: "success",
    message: `Thank you — your enquiry is with us and we will come back to you. If it is urgent, call ${settings.phones[0]?.number ?? "us"}.`,
  };
}
