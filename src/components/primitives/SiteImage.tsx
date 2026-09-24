import Image from "next/image";
import { focalPoint, hasImage, imageSrc, sanityImageUrl } from "@/sanity/lib/image";
import type { SiteImage as SiteImageType } from "@/sanity/lib/types";
import { BlueprintPlate } from "./BlueprintPlate";
import { ImageSlot } from "./ImageSlot";

type Props = {
  image?: SiteImageType | null;
  /** Required: the responsive hint that decides which file the browser fetches. */
  sizes: string;
  className?: string;
  /** Above-the-fold images only. */
  priority?: boolean;
  /** Applies the brand duotone. Off for real photography. */
  duotone?: boolean;
  /**
   * `cover` fills the frame and crops, keeping the editor's hotspot in view.
   * `contain` shows the whole photograph inside it, for a gallery frame whose
   * shape the photograph does not share.
   */
  fit?: "cover" | "contain";
  /**
   * What to draw when there is no asset.
   *
   * `plate` is a designed navy drawing-sheet ground — used at hero scale, where
   * a grey placeholder would leave a void in the middle of the page.
   * `slot` is the measured grey placeholder with registration marks, for small
   * secondary images where saying "a photograph belongs here" is the honest
   * thing to show.
   */
  fallback?: "plate" | "slot";
  slotTone?: "onPaper" | "onInk";
  /** Varies the plate wash so several plates on a page differ. */
  fallbackSeed?: number;
  /** Widest render width, used to ask Sanity's CDN for a sensible file. */
  maxWidth?: number;
};

/**
 * Renders a CMS image, a local image, or a designed stand-in — the caller does
 * not have to branch. Always `fill`, so every call site owns its own aspect
 * ratio and no layout shift is possible.
 */
export function SiteImage({
  image,
  sizes,
  className = "",
  priority = false,
  duotone = false,
  fit = "cover",
  fallback = "slot",
  slotTone = "onPaper",
  fallbackSeed = 0,
  maxWidth = 1800,
}: Props) {
  if (!hasImage(image)) {
    if (fallback === "plate") {
      return <BlueprintPlate className={className} seed={fallbackSeed} />;
    }
    return <ImageSlot hint={image?.slotHint} tone={slotTone} className={className} />;
  }

  // Sanity assets are resized at the CDN; local files are served as they are.
  const resolved = image.url
    ? sanityImageUrl(image, { width: maxWidth })
    : imageSrc(image)!;

  return (
    <Image
      src={resolved}
      alt={image.alt ?? ""}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      placeholder={image.lqip ? "blur" : "empty"}
      blurDataURL={image.lqip}
      draggable={false}
      style={fit === "cover" ? { objectPosition: focalPoint(image) } : undefined}
      className={`${fit === "contain" ? "object-contain" : "object-cover"} ${
        duotone ? "duotone" : ""
      } ${className}`}
    />
  );
}
