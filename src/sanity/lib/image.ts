import createImageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "./client";
import type { SiteImage } from "./types";

const builder =
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }) : null;

/**
 * Sanity's CDN handles resizing and format negotiation, so `next/image` is
 * pointed at an already-sized url rather than re-optimising the asset.
 */
export function sanityImageUrl(
  source: string,
  { width, quality = 80 }: { width: number; quality?: number },
): string {
  if (!builder) return source;
  return builder
    .image(source)
    .width(width)
    .quality(quality)
    .fit("max")
    .auto("format")
    .url();
}

/** True when there is something to render for this slot. */
export function hasImage(image?: SiteImage | null): boolean {
  return Boolean(image && (image.url || image.src));
}

export function imageSrc(image: SiteImage): string | undefined {
  return image.url ?? image.src;
}
