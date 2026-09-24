import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./env";
import type { SiteImage } from "./types";

const builder =
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }) : null;

type UrlOptions = {
  width: number;
  /** With a height the CDN crops to that shape, centred on the hotspot. */
  height?: number;
  quality?: number;
  /** Force a format - `png` for the favicon and the share card. */
  format?: "png" | "jpg" | "webp";
};

/**
 * A CDN URL for a CMS image, sized for where it is shown.
 *
 * Sanity's CDN handles resizing and format negotiation, so `next/image` is
 * pointed at an already-sized url rather than re-optimising the asset. Given
 * the asset id it also applies the editor's crop, which a bare URL cannot
 * carry. Local fallback files are returned as they are.
 */
export function sanityImageUrl(
  image: SiteImage,
  { width, height, quality = 80, format }: UrlOptions,
): string {
  const source = image.url ?? image.src ?? "";
  if (!builder || !image.url) return source;

  let url = builder
    .image(
      image.assetId
        ? { asset: { _ref: image.assetId }, crop: image.crop, hotspot: image.hotspot }
        : image.url,
    )
    .width(width)
    .quality(quality);

  url = height ? url.height(height).fit("crop") : url.fit("max");
  url = format ? url.format(format) : url.auto("format");

  return url.url();
}

/** An image with a file behind it - from the CMS, or from /public. */
export type ResolvedImage = SiteImage & ({ url: string } | { src: string });

/**
 * True when there is something to render for this slot. An image without a
 * file can still carry a "Wanted photograph" hint, so `false` does not mean
 * "no image object".
 */
export function hasImage(image?: SiteImage | null): image is ResolvedImage {
  return Boolean(image && (image.url || image.src));
}

export function imageSrc(image: SiteImage): string | undefined {
  return image.url ?? image.src;
}

/** SVGs are never rasterised by the CDN, so sizing and format options do nothing to them. */
export function isVector(image: SiteImage): boolean {
  const source = image.assetId ?? image.url ?? image.src ?? "";
  return /[-.]svg(\?|$)/i.test(source);
}

/**
 * The aspect ratio the image is shown at once the editor's crop is applied.
 * The asset's own ratio describes the uncropped original.
 */
export function croppedAspectRatio(image: SiteImage): number | undefined {
  const ratio = image.aspectRatio;
  if (!ratio) return undefined;

  const crop = image.crop;
  if (!crop) return ratio;

  const width = 1 - crop.left - crop.right;
  const height = 1 - crop.top - crop.bottom;
  return width > 0 && height > 0 ? (ratio * width) / height : ratio;
}

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/**
 * The editor's focal point as a CSS `object-position`, so an image cropped by
 * `object-cover` keeps what matters in frame at every shape it is shown at.
 * The hotspot is stored against the original, so it is re-expressed against
 * the crop the CDN returns.
 */
export function focalPoint(image: SiteImage): string | undefined {
  const hotspot = image.hotspot;
  if (!hotspot) return undefined;

  const left = image.crop?.left ?? 0;
  const right = image.crop?.right ?? 0;
  const top = image.crop?.top ?? 0;
  const bottom = image.crop?.bottom ?? 0;

  const x = (hotspot.x - left) / Math.max(1 - left - right, 0.0001);
  const y = (hotspot.y - top) / Math.max(1 - top - bottom, 0.0001);

  return `${Math.round(clamp01(x) * 1000) / 10}% ${Math.round(clamp01(y) * 1000) / 10}%`;
}
