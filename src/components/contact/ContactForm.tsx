"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { submitEnquiry } from "@/app/contact/actions";
import { initialContactState, type ContactState } from "@/lib/enquiry";
import { mailHref, telHref } from "@/lib/format";
import type { EnquiryFormCopy, SiteSettings } from "@/sanity/lib/types";

const FIELD =
  "w-full border border-rule-strong bg-paper-bright px-4 py-3.5 text-[0.9375rem] text-ink transition-colors duration-300 placeholder:text-steel-light focus-visible:border-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper";

const LABEL = "t-meta text-steel";

export function ContactForm({
  subjects,
  settings,
  copy,
}: {
  subjects: string[];
  settings: SiteSettings;
  copy: EnquiryFormCopy;
}) {
  const [state, formAction, pending] = useActionState(
    submitEnquiry,
    initialContactState,
  );
  const startedAt = useRef<HTMLInputElement>(null);
  const baseId = useId();

  /**
   * Stamped on mount rather than rendered on the server: this page is
   * statically generated, so a server-rendered timestamp would be the build
   * time and the too-fast check would never fire.
   */
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);

  if (state.status === "success") {
    return (
      <div className="border-t-2 border-ink pt-8">
        <p className="display-sentence t-h3 max-w-[22ch] text-ink">
          {state.message}
        </p>
        {copy.successLead ? (
          <p className="mt-4 max-w-[46ch] t-body text-steel">{copy.successLead}</p>
        ) : null}
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="border-t-2 border-ink pt-8">
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />

      {/*
       * Honeypot. Hidden from sight, from the tab order and from assistive
       * technology, and named so no browser autofill targets it.
       */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${baseId}-hp`}>Do not fill this in</label>
        <input
          id={`${baseId}-hp`}
          type="text"
          name="hp"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {state.status === "error" && state.message ? (
        <Problem message={state.message} settings={settings} />
      ) : null}

      <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
        <Field
          id={`${baseId}-name`}
          name="name"
          label={copy.nameLabel}
          required
          autoComplete="name"
          state={state}
        />
        <Field
          id={`${baseId}-company`}
          name="company"
          label={copy.companyLabel}
          autoComplete="organization"
          state={state}
        />
        <Field
          id={`${baseId}-email`}
          name="email"
          label={copy.emailLabel}
          type="email"
          required
          autoComplete="email"
          state={state}
        />
        <Field
          id={`${baseId}-phone`}
          name="phone"
          label={copy.phoneLabel}
          type="tel"
          autoComplete="tel"
          state={state}
        />

        {subjects.length > 0 ? (
          <div className="sm:col-span-2">
            <label htmlFor={`${baseId}-subject`} className={LABEL}>
              {copy.subjectLabel}
            </label>
            <select
              id={`${baseId}-subject`}
              name="subject"
              defaultValue={state.values?.subject ?? ""}
              className={`mt-2.5 ${FIELD}`}
            >
              <option value="">{copy.subjectPlaceholder}</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="sm:col-span-2">
          <Field
            id={`${baseId}-message`}
            name="message"
            label={copy.messageLabel}
            required
            multiline
            state={state}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-9 inline-flex items-center bg-ink px-8 py-4 display-narrow text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-paper-bright transition-colors duration-300 hover:bg-copper disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? copy.submittingLabel : copy.submitLabel}
      </button>
    </form>
  );
}

/**
 * The failure path does real work. Delivery is email-only, so a send that does
 * not land has to hand the visitor another way through rather than a shrug —
 * otherwise the enquiry is simply lost, which is the thing this page exists to
 * stop happening.
 */
function Problem({
  message,
  settings,
}: {
  message: string;
  settings: SiteSettings;
}) {
  return (
    <div
      role="alert"
      className="mb-8 border-l-2 border-copper bg-paper-bright px-5 py-4"
    >
      <p className="t-body text-ink">{message}</p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
        {settings.phones.map((phone) => (
          <a
            key={phone.number}
            href={telHref(phone.number)}
            className="text-[0.875rem] text-navy underline underline-offset-4 transition-colors duration-300 hover:text-copper"
          >
            {phone.number}
          </a>
        ))}
        {settings.emails.map((email) => (
          <a
            key={email}
            href={mailHref(email)}
            className="text-[0.875rem] text-navy underline underline-offset-4 transition-colors duration-300 hover:text-copper"
          >
            {email}
          </a>
        ))}
      </div>
    </div>
  );
}

function Field({
  id,
  name,
  label,
  state,
  type = "text",
  required = false,
  multiline = false,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  state: ContactState;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const error = state.errors?.[name];
  const errorId = `${id}-error`;

  const shared = {
    id,
    name,
    required,
    autoComplete,
    defaultValue: state.values?.[name] ?? "",
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: `mt-2.5 ${FIELD} ${error ? "border-copper" : ""}`,
  };

  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
        {required ? <span className="ml-1 text-copper">*</span> : null}
      </label>

      {multiline ? (
        <textarea {...shared} rows={6} />
      ) : (
        <input {...shared} type={type} />
      )}

      {error ? (
        <p id={errorId} className="mt-2 text-[0.8125rem] text-copper">
          {error}
        </p>
      ) : null}
    </div>
  );
}
