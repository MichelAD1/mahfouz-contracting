import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import type { ProcessStep } from "@/sanity/lib/types";

/**
 * The only section on the page that keeps its numbers.
 *
 * The original design numbered the services, the projects and the reasons to
 * hire as well — but numbering encodes sequence, and none of those are one.
 * This is, so it gets the numerals and a measured scale to sit on.
 */
export function Process({ steps }: { steps: ProcessStep[] }) {
  if (steps.length === 0) return null;

  return (
    <div>
      <h2 className="display-sentence t-h2 max-w-[21ch] text-ink">
        Four stages, from brief to ongoing support
      </h2>

      <Stagger
        className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-x-[clamp(1.5rem,3vw,2.5rem)] gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
        gap={0.07}
      >
        {steps.map((step) => (
          <StaggerItem key={step._id}>
            {/* The scale: a rule with the stage's own tick on it. */}
            <div aria-hidden="true" className="relative h-px w-full bg-rule-strong">
              <span className="absolute left-0 top-0 h-2 w-px bg-copper" />
            </div>

            <p className="mt-6 t-figure text-[clamp(2.75rem,5vw,4.25rem)] text-paper-deep">
              {step.step}
            </p>
            <h3 className="mt-4 display-narrow t-h4 text-ink">{step.title}</h3>
            <p className="mt-2.5 max-w-[30ch] t-body text-steel">
              {step.description}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
