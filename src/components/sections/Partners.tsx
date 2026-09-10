import Image from "next/image";
import { hasImage, imageSrc, sanityImageUrl } from "@/sanity/lib/image";
import type { Partner } from "@/sanity/lib/types";

/**
 * Quiet on purpose.
 *
 * The original design set these as typed brand names inside a seven-cell
 * bordered grid, which read as unfinished. Until real vector logos exist
 * (temp/PLAN.md §8, item 7) a single measured row of names is the honest
 * treatment — and it stays right once logos replace the text.
 */
export function Partners({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-baseline lg:gap-16">
      <p className="max-w-[24ch] t-body shrink-0 text-steel">
        Equipment and systems we specify, supply and install.
      </p>

      <ul className="flex flex-wrap items-center gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-6">
        {partners.map((partner) => (
          <li key={partner._id}>
            {hasImage(partner.logo) && partner.logo ? (
              <Image
                src={
                  partner.logo.url
                    ? sanityImageUrl(partner.logo.url, { width: 320 })
                    : imageSrc(partner.logo)!
                }
                alt={partner.logo.alt || partner.name}
                width={140}
                height={40}
                className="h-8 w-auto object-contain opacity-55 transition-opacity duration-300 hover:opacity-100"
              />
            ) : (
              <span
                translate="no"
                className="display-narrow text-[clamp(1rem,1.5vw,1.25rem)] font-medium text-steel"
              >
                {partner.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
