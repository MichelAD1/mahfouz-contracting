import type { ReactNode } from "react";

/**
 * The drawing-sheet margin column.
 *
 * This is what replaces the tracked-out eyebrow label that sat above every
 * heading in the original design. The same information — which section you are
 * in — now reads as sheet furniture in the margin, and it travels with the
 * section as you scroll.
 */
export function SheetMeta({
  code,
  label,
  tone = "onPaper",
}: {
  code: string;
  label: string;
  tone?: "onPaper" | "onInk";
}) {
  const line = tone === "onInk" ? "bg-rule-dark-strong" : "bg-rule-strong";
  const muted = tone === "onInk" ? "text-steel-light" : "text-steel";

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div className="flex items-baseline gap-4 lg:flex-col lg:items-start lg:gap-3">
        <span className={`t-meta ${muted}`}>{code}</span>
        <span aria-hidden="true" className={`h-px w-10 ${line} lg:w-full`} />
        <span className={`t-meta ${muted}`}>{label}</span>
      </div>
    </div>
  );
}

type SectionProps = {
  id?: string;
  /** Sheet number, e.g. S.02. Real metadata, not decoration. */
  code?: string;
  /** Section name for the margin column. */
  label?: string;
  tone?: "onPaper" | "onInk";
  className?: string;
  children: ReactNode;
  /** Draws the hairline that separates this section from the one above. */
  divided?: boolean;
  /** `compact` is for slim bands such as the partner strip. */
  size?: "default" | "compact";
};

export function SectionShell({
  id,
  code,
  label,
  tone = "onPaper",
  className = "",
  children,
  divided = true,
  size = "default",
}: SectionProps) {
  const hasMeta = Boolean(code && label);
  const border = tone === "onInk" ? "border-rule-dark" : "border-rule-strong";

  return (
    <section
      id={id}
      className={`${divided ? `border-t ${border}` : ""} ${className}`}
    >
      <div
        className={`shell ${
          size === "compact"
            ? "py-[clamp(2rem,4vw,3.25rem)]"
            : "py-[clamp(3.5rem,8vw,7.5rem)]"
        }`}
      >
        {hasMeta ? (
          <div className="sheet">
            <SheetMeta code={code!} label={label!} tone={tone} />
            <div>{children}</div>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
