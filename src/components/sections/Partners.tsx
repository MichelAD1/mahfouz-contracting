import Image from "next/image";
import { hasImage, imageSrc, sanityImageUrl } from "@/sanity/lib/image";
import type { Partner } from "@/sanity/lib/types";

/**
 * The equipment strip, as a seamless marquee.
 *
 * The track is rendered twice and travels -50%, so when the first copy clears
 * the frame the second is exactly where the first began. The duplicate is
 * `aria-hidden` — visually it is the same strip continuing, but to a screen
 * reader an unmarked copy is the whole list read a second time.
 *
 * Logos come from six different places and three of them were drawn in full
 * colour, so they are flattened to a single ink silhouette rather than shown as
 * supplied. A row of mismatched brand colours at 5% of their intended size is
 * what makes a partner bar look like a stock template; one tone at one weight
 * is what makes it look chosen.
 */

/** Baseline rendered height, for a logo around 2.6:1. */
const LOGO_HEIGHT = 26;

/**
 * Optical balance.
 *
 * Set every logo to the same height and the square ones look wrong, because
 * the eye compares area rather than height: Schneider's square mark beside the
 * Siemens wordmark reads as a fraction of its size at identical heights. So
 * squarer marks are given more height, scaled by the square root of the ratio
 * difference and capped at 1.5× so nothing towers over the row.
 *
 * This is the standard way logo strips are set, and it matters more here than
 * usual because the six assets are a mix of square glyphs and long wordmarks
 * from different sources.
 */
function logoHeight(ratio: number): number {
  const scale = Math.min(Math.max(Math.sqrt(2.6 / ratio), 1), 1.5);
  return Math.round(LOGO_HEIGHT * scale);
}

export function Partners({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  // Slower with more logos, so the strip reads at one speed however many there
  // are — otherwise adding a partner speeds the whole thing up.
  const duration = `${Math.max(partners.length * 6, 28)}s`;

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
      <p className="max-w-[24ch] t-body shrink-0 text-steel">
        Equipment and systems we specify, supply and install.
      </p>

      {/* The mask keeps logos from colliding with the section edge as they
          arrive and leave, so the strip reads as continuous rather than clipped. */}
      <div
        className="marquee relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]"
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        <ul className="animate-marquee flex w-max items-center">
          <Track partners={partners} />
          <Track partners={partners} duplicate />
        </ul>
      </div>
    </div>
  );
}

function Track({
  partners,
  duplicate = false,
}: {
  partners: Partner[];
  duplicate?: boolean;
}) {
  return (
    <li aria-hidden={duplicate || undefined}>
      <ul className="flex items-center">
        {partners.map((partner) => (
          <li
            key={partner._id}
            className="flex shrink-0 items-center px-[clamp(1.5rem,4vw,3.25rem)]"
          >
            <PartnerMark partner={partner} />
          </li>
        ))}
      </ul>
    </li>
  );
}

function PartnerMark({ partner }: { partner: Partner }) {
  if (!hasImage(partner.logo) || !partner.logo) {
    // No asset yet. The name set in the display face is a deliberate treatment
    // rather than a gap, and it sits at the same weight as the logos beside it.
    return (
      <span
        translate="no"
        className="display-narrow whitespace-nowrap text-[clamp(1rem,1.5vw,1.25rem)] font-medium text-ink/55 transition-opacity duration-300"
      >
        {partner.name}
      </span>
    );
  }

  const logo = partner.logo;
  const src = logo.url ? sanityImageUrl(logo.url, { width: 320 }) : imageSrc(logo)!;
  const ratio = logo.aspectRatio ?? 2.6;
  const height = logoHeight(ratio);

  return (
    <Image
      src={src}
      alt={logo.alt || partner.name}
      width={Math.round(height * ratio)}
      height={height}
      style={{ height }}
      // Shown in their own colours. Opacity holds the row back from competing
      // with the page, and lifts to full on hover.
      className="w-auto object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
    />
  );
}
