import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "solid" | "outline";
type Tone = "onPaper" | "onInk";

const base =
  "group relative inline-flex items-center gap-3 px-7 py-[1.15rem] display-narrow text-[0.8125rem] font-semibold uppercase tracking-[0.08em] " +
  "transition-[background-color,border-color,color] duration-300 ease-[var(--ease-out-expo)]";

const styles: Record<Tone, Record<Variant, string>> = {
  onPaper: {
    solid: "bg-ink text-paper-bright hover:bg-copper",
    outline:
      "border border-rule-strong text-ink hover:border-copper hover:text-copper",
  },
  onInk: {
    solid: "bg-paper-bright text-ink hover:bg-copper hover:text-paper-bright",
    outline:
      "border border-rule-dark-strong text-paper-bright hover:border-copper-bright hover:text-copper-bright",
  },
};

/** Drawn, not typed — a literal arrow character in the label is a copy smell. */
function Arrow() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="8"
      viewBox="0 0 16 8"
      fill="none"
      className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
    >
      <path
        d="M0 4h14.5M11 .8 14.8 4 11 7.2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  tone?: Tone;
  withArrow?: boolean;
  className?: string;
};

type LinkButtonProps = ButtonProps & { href: string };
type ActionButtonProps = ButtonProps &
  Omit<ComponentProps<"button">, "children" | "className">;

/** Navigation. Renders an anchor so modifier-click and middle-click work. */
export function ButtonLink({
  children,
  href,
  variant = "solid",
  tone = "onPaper",
  withArrow = false,
  className = "",
}: LinkButtonProps) {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  const classes = `${base} ${styles[tone][variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {withArrow ? <Arrow /> : null}
    </>
  );

  if (!isInternal) {
    return (
      <a href={href} className={classes} rel="noopener noreferrer" target="_blank">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

/** Actions only — submitting, opening, toggling. */
export function Button({
  children,
  variant = "solid",
  tone = "onPaper",
  withArrow = false,
  className = "",
  type = "button",
  ...rest
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={`${base} ${styles[tone][variant]} ${className}`}
      {...rest}
    >
      <span>{children}</span>
      {withArrow ? <Arrow /> : null}
    </button>
  );
}

/**
 * A text link sitting on a rule. The rule is the affordance, so it brightens on
 * hover instead of the text changing colour.
 */
export function LinkUnderline({
  href,
  children,
  tone = "onPaper",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const ink =
    tone === "onInk"
      ? "text-paper-bright hover:text-copper-bright"
      : "text-ink hover:text-copper";

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 pb-2 display-narrow text-[0.8125rem] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${ink} ${className}`}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute -bottom-2 left-0 h-px w-full bg-current opacity-40 transition-opacity duration-300 group-hover:opacity-100"
        />
      </span>
      <Arrow />
    </Link>
  );
}
