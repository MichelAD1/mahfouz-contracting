/**
 * A heading typed with deliberate line breaks, as its lines.
 *
 * Headings are plain text fields in the studio, and pressing Enter is the one
 * formatting an editor can do there. The home hero sets and animates each line
 * on its own; everywhere else the lines are joined with a break.
 */
export function headingLines(heading: string): string[] {
  return heading
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
