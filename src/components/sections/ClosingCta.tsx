import { ButtonLink } from "@/components/primitives/Button";
import { BlueprintPlate } from "@/components/primitives/BlueprintPlate";
import { SiteImage } from "@/components/primitives/SiteImage";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { hasImage } from "@/sanity/lib/image";
import type { ClosingCta as ClosingCtaContent } from "@/sanity/lib/types";

/** The third and last parallax surface on the page. */
export function ClosingCta({ content }: { content: ClosingCtaContent }) {
  const showPhoto = hasImage(content.background);

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <Parallax className="absolute inset-0 -z-10" distance={66}>
        {showPhoto ? (
          <>
            <SiteImage
              image={content.background}
              sizes="100vw"
              maxWidth={2400}
              fallback="plate"
            />
            {/*
             * Graded rather than a flat wash, so the photograph stays legible
             * as a photograph while the type keeps its contrast. Matches the
             * hero, which carries the same image.
             */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,22,40,0.72) 0%, rgba(10,22,40,0.78) 45%, rgba(10,22,40,0.9) 100%)",
              }}
            />
          </>
        ) : (
          <BlueprintPlate />
        )}
      </Parallax>

      <div className="shell py-[clamp(4.5rem,10vw,9rem)]">
        <Reveal>
          <h2 className="display-sentence t-plate max-w-[17ch] text-paper-bright">
            {content.heading}
          </h2>
          <p className="mt-6 max-w-[44ch] t-lead text-paper-bright/70">
            {content.lead}
          </p>
          <div className="mt-10">
            <ButtonLink href={content.cta.href} tone="onInk" variant="solid" withArrow>
              {content.cta.label}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
