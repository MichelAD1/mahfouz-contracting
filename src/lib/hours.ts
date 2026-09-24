/**
 * Opening hours: the one list the contact page prints and Google reads.
 *
 * They used to be written twice - as free text in a contact-page row, and as
 * constants in the structured data - and the two had to be kept in step by
 * hand. They are entered once now, in Site settings, and both are derived.
 *
 * The Studio schema imports this module as well as the site, so it stays free
 * of framework imports.
 */

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export type OpeningHours = {
  days: Weekday[];
  /** 24-hour time, e.g. 06:00. */
  opens: string;
  closes: string;
};

const SHORT: Record<Weekday, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

const isWeekday = (value: unknown): value is Weekday =>
  typeof value === "string" && (WEEKDAYS as readonly string[]).includes(value);

/**
 * The entries that can actually be used: a time either side, and at least
 * one day that exists. Anything else is a half-typed row in the Studio.
 */
export function validOpeningHours(hours: OpeningHours[]): OpeningHours[] {
  return hours
    .map((entry) => ({ ...entry, days: (entry.days ?? []).filter(isWeekday) }))
    .filter((entry) => entry.opens && entry.closes && entry.days.length > 0);
}

/**
 * "Mon-Fri 06:00-18:00, Sat 06:00-16:00, Sun closed".
 *
 * Consecutive days with the same hours collapse into a range, and any day no
 * entry covers is closed. Returns an empty string when nothing is entered, so
 * the row is dropped rather than printed as seven days of "closed".
 */
export function formatOpeningHours(hours: OpeningHours[], closedLabel = "closed"): string {
  const byDay = new Map<Weekday, string>();

  for (const entry of validOpeningHours(hours)) {
    for (const day of entry.days) {
      if (!byDay.has(day)) byDay.set(day, `${entry.opens}-${entry.closes}`);
    }
  }

  if (byDay.size === 0) return "";

  const groups: { from: Weekday; to: Weekday; value: string }[] = [];

  for (const day of WEEKDAYS) {
    const value = byDay.get(day) ?? closedLabel;
    const last = groups[groups.length - 1];

    if (last && last.value === value) last.to = day;
    else groups.push({ from: day, to: day, value });
  }

  return groups
    .map(({ from, to, value }) =>
      `${from === to ? SHORT[from] : `${SHORT[from]}-${SHORT[to]}`} ${value}`,
    )
    .join(", ");
}
