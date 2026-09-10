/**
 * A measured placeholder for a photograph that does not exist yet.
 *
 * The client has no project photography (temp/PLAN.md §4), so an empty slot has
 * to look deliberate rather than broken. This borrows the registration marks of
 * a drawing sheet and states, in the margin, which shot belongs here — useful
 * on the live site and useful as a brief for the photographer.
 */
export function ImageSlot({
  hint,
  tone = "onPaper",
  className = "",
}: {
  hint?: string;
  tone?: "onPaper" | "onInk";
  className?: string;
}) {
  const onInk = tone === "onInk";
  const surface = onInk ? "bg-ink-soft" : "bg-paper-deep";
  const rule = onInk ? "border-rule-dark" : "border-rule";
  const mark = onInk ? "bg-steel" : "bg-steel-light";
  const text = onInk ? "text-steel-light" : "text-steel";

  return (
    <div
      className={`relative flex h-full w-full items-end overflow-hidden border ${rule} ${surface} ${className}`}
      role="img"
      aria-label={hint ? `Photograph pending: ${hint}` : "Photograph pending"}
    >
      {/* Registration marks */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {(
          [
            "left-4 top-4",
            "right-4 top-4",
            "left-4 bottom-4",
            "right-4 bottom-4",
          ] as const
        ).map((position) => (
          <span key={position} className={`absolute ${position} block size-3`}>
            <span className={`absolute inset-x-0 top-1/2 h-px ${mark} opacity-50`} />
            <span className={`absolute inset-y-0 left-1/2 w-px ${mark} opacity-50`} />
          </span>
        ))}
        <span
          className={`absolute left-1/2 top-1/2 h-px w-16 -translate-x-1/2 ${mark} opacity-25`}
        />
      </div>

      {hint ? (
        <p
          className={`relative m-5 max-w-[34ch] t-meta ${text} normal-case tracking-[0.08em]`}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
