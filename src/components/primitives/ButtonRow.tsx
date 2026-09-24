import type { CSSProperties } from "react";
import { ButtonLink } from "./Button";
import type { Button } from "@/sanity/lib/types";

/**
 * A hero's buttons, as the page's document lists them.
 *
 * The first is solid and any second outlined unless the editor picked a style,
 * which is the usual weighting of a main action and a quieter one beside it.
 */
export function ButtonRow({
  buttons,
  className = "",
  style,
}: {
  buttons: Button[];
  className?: string;
  style?: CSSProperties;
}) {
  if (buttons.length === 0) return null;

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`} style={style}>
      {buttons.map((button, index) => (
        <ButtonLink
          key={`${button.href}-${index}`}
          href={button.href}
          tone="onInk"
          variant={button.style ?? (index === 0 ? "solid" : "outline")}
          withArrow
          className="justify-center sm:justify-start"
        >
          {button.label}
        </ButtonLink>
      ))}
    </div>
  );
}
