/**
 * The enquiry form's rules, with no framework attached.
 *
 * Kept apart from the server action so they can be exercised directly. A Next
 * server action is awkward to call from outside a browser — its arguments are
 * encoded into the React flight stream — so logic left inside one is logic that
 * only ever gets tested by hand.
 */

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

/**
 * Lives here rather than beside the action because a `"use server"` module may
 * only export async functions — exporting this object from there makes every
 * submission fail with "A 'use server' file can only export async functions".
 */
export const initialContactState: ContactState = { status: "idle" };

/** Deliberately loose. The only authority on whether an address works is sending to it. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Long enough to catch a form filled instantly, short enough to never catch a person. */
export const MIN_FILL_MS = 2000;

export const MAX_MESSAGE = 5000;

export const FIELDS = [
  "name",
  "company",
  "email",
  "phone",
  "subject",
  "message",
] as const;

export type EnquiryValues = Record<(typeof FIELDS)[number], string>;

export function readValues(get: (field: string) => string | null): EnquiryValues {
  return Object.fromEntries(
    FIELDS.map((field) => [field, (get(field) ?? "").trim()]),
  ) as EnquiryValues;
}

export function validate(values: EnquiryValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (values.name.length < 2) {
    errors.name = "Please give us a name we can reply to.";
  }
  if (!EMAIL.test(values.email)) {
    errors.email = "We need a valid email address to send the answer to.";
  }
  if (values.message.length < 10) {
    errors.message = "Tell us a little about the scope, even in one line.";
  } else if (values.message.length > MAX_MESSAGE) {
    errors.message = "That is longer than this form can send. Please email it instead.";
  }

  return errors;
}

/** A field no human sees and no browser autofills; anything in it came from a bot. */
export function isHoneypotTripped(value: string | null): boolean {
  return (value ?? "").length > 0;
}

/**
 * The client stamps mount time, so this measures how long the form was on
 * screen. A missing or zero stamp means JavaScript never ran — that is the
 * progressive-enhancement path, and it must not be treated as a bot.
 */
export function isTooFast(startedAt: string | null, now = Date.now()): boolean {
  const stamp = Number(startedAt ?? 0);
  if (!Number.isFinite(stamp) || stamp <= 0) return false;
  return now - stamp < MIN_FILL_MS;
}

export function composeSubject(values: EnquiryValues): string {
  return `Website enquiry — ${values.subject || "General"} — ${values.name}`;
}

export function composeBody(values: EnquiryValues): string {
  return [
    `Name:     ${values.name}`,
    `Email:    ${values.email}`,
    values.company ? `Company:  ${values.company}` : null,
    values.phone ? `Phone:    ${values.phone}` : null,
    values.subject ? `Enquiry:  ${values.subject}` : null,
    "",
    values.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
