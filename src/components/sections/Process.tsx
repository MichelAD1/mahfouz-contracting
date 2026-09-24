import { Parallax } from "@/components/motion/Parallax";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SiteImage } from "@/components/primitives/SiteImage";
import type { ProcessStep } from "@/sanity/lib/types";

/**
 * The only section on the page that keeps its numbers.
 *
 * The original design numbered the services, the projects and the reasons to
 * hire as well — but numbering encodes sequence, and none of those are one.
 * This is, so it gets the numerals and a measured scale to sit on.
 *
 * The stages step down the page rather than sitting on one baseline. A process
 * is the one thing here with a direction, and the descent is the cheapest way
 * to say so — no arrows, no connector lines, no "01 → 02" ornament. Each stage
 * also scrolls at its own depth, so the stair opens as you pass it.
 */

/**
 * The stair. Held as whole class strings because Tailwind scans source text —
 * a computed `lg:mt-[${n}rem]` would never reach the build.
 *
 * Two columns at `sm` alternate; four columns at `lg` descend once per stage.
 */
const STAIR = [
  "sm:mt-0 lg:mt-0",
  "sm:mt-[3rem] lg:mt-[2.5rem]",
  "sm:mt-0 lg:mt-[5rem]",
  "sm:mt-[3rem] lg:mt-[7.5rem]",
] as const;

/**
 * Parallax travel per stage, increasing left to right. Equal depth across four
 * columns reads as one sheet sliding; unequal depth reads as four.
 *
 * Brought down about 28% from 46-94. These cards are the one place two vertical
 * motions land on the same element — the card rises on its Reveal while the
 * photograph inside it travels on its own — and at the old depths the two
 * compounded into something that read as a rush rather than as depth.
 */
const DEPTH = [32, 44, 56, 68] as const;

export function Process({
  steps,
  heading,
  lead,
}: {
  steps: ProcessStep[];
  heading: string;
  lead?: string;
}) {
  if (steps.length === 0) return null;

  return (
    <div>
      <h2 className="display-sentence t-h2 max-w-[21ch] text-ink">{heading}</h2>
      {lead ? <p className="mt-6 max-w-[52ch] t-body text-steel">{lead}</p> : null}

      <Stagger
        className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-x-[clamp(1.5rem,3vw,2.5rem)] gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        gap={0.15}
      >
        {steps.map((step, index) => (
          <StaggerItem key={step._id} className={STAIR[index % STAIR.length]}>
            <Parallax
              className="relative aspect-3/4 w-full overflow-hidden bg-paper-deep"
              distance={DEPTH[index % DEPTH.length]}
            >
              <SiteImage
                image={step.image}
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                maxWidth={900}
              />
            </Parallax>

            {/* The scale: a rule with the stage's own tick on it. */}
            <div
              aria-hidden="true"
              className="relative mt-7 h-px w-full bg-rule-strong"
            >
              <span className="absolute left-0 top-0 h-2 w-px bg-copper" />
            </div>

            <p className="mt-5 t-figure text-[clamp(2.75rem,5vw,4.25rem)] text-paper-deep">
              {step.step}
            </p>
            <h3 className="mt-4 display-narrow t-h4 text-ink">{step.title}</h3>
            {step.description ? (
              <p className="mt-2.5 max-w-[30ch] t-body text-steel">{step.description}</p>
            ) : null}
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
