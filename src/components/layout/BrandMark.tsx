import Image from "next/image";
import {
  croppedAspectRatio,
  hasImage,
  isVector,
  sanityImageUrl,
} from "@/sanity/lib/image";
import type { SiteImage, SiteSettings } from "@/sanity/lib/types";

type Surface = "dark" | "light";
type Size = keyof typeof SIZES;

/**
 * Rendered heights, per place the mark appears. `base` is for a long wordmark
 * logo; squarer marks are given more height, up to `max`, and nothing is ever
 * wider than `maxWidth` - a phone header has room for the mark and a button.
 */
const SIZES = {
  header: { base: 30, max: 46, maxWidth: 200 },
  menu: { base: 28, max: 42, maxWidth: 180 },
  footer: { base: 36, max: 56, maxWidth: 240 },
} as const;

/**
 * Optical balance, the same rule the partner strip uses: set at one height, a
 * square mark reads as a fraction of the size of a long one, because the eye
 * compares area rather than height.
 */
function logoHeight(ratio: number, size: Size): number {
  const { base, max } = SIZES[size];
  const scale = Math.min(Math.max(Math.sqrt(3 / ratio), 1), max / base);
  return Math.round(base * scale);
}

type Choice = { image: SiteImage; silhouette: boolean };

/**
 * Which upload suits this ground. With only one version uploaded, it is shown
 * as a one-colour silhouette on the other ground - white on dark, ink on
 * light - rather than disappearing into it.
 */
function choose(settings: SiteSettings, surface: Surface): Choice | null {
  const { logo, logoOnDark } = settings;
  const [preferred, other] = surface === "dark" ? [logoOnDark, logo] : [logo, logoOnDark];

  if (hasImage(preferred)) return { image: preferred, silhouette: false };
  if (hasImage(other)) return { image: other, silhouette: true };
  return null;
}

function LogoImage({
  choice,
  surface,
  size,
  alt,
  eager,
  className = "",
}: {
  choice: Choice;
  surface: Surface;
  size: Size;
  alt: string;
  eager?: boolean;
  className?: string;
}) {
  const { image, silhouette } = choice;
  const ratio = croppedAspectRatio(image) ?? 3;
  const height = logoHeight(ratio, size);
  const width = Math.round(height * ratio);
  const vector = isVector(image);

  // Twice the rendered width, for high-density screens. An SVG ignores it.
  const src = image.url
    ? sanityImageUrl(image, { width: Math.min(width * 2, 800) })
    : image.src!;

  const tone = silhouette ? (surface === "dark" ? "brightness-0 invert" : "brightness-0") : "";

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized={vector}
      loading={eager ? "eager" : undefined}
      draggable={false}
      style={{ height, width: "auto", maxWidth: SIZES[size].maxWidth }}
      className={`object-contain object-left ${tone} ${className}`}
    />
  );
}

/** The typeset wordmark: what the site had before any logo existed. */
function Wordmark({ settings, size }: { settings: SiteSettings; size: Size }) {
  const scale = size === "footer" ? "text-2xl" : size === "menu" ? "text-lg" : "text-xl";

  return (
    <span className="flex items-baseline gap-2.5">
      <span className={`display ${scale} leading-none`} translate="no">
        {settings.shortName}
      </span>
      {settings.descriptor && size !== "menu" ? (
        <span className="t-meta opacity-65" translate="no">
          {settings.descriptor}
        </span>
      ) : null}
    </span>
  );
}

/**
 * The company's mark: the logo from Site settings, or the typeset wordmark
 * until one is uploaded.
 *
 * `crossfade` renders both versions stacked and shows the one for `surface`.
 * The header needs it: it sits transparent over a dark photograph and turns to
 * paper once the page scrolls, and a single image cannot be legible on both.
 */
export function BrandMark({
  settings,
  size,
  surface,
  crossfade = false,
}: {
  settings: SiteSettings;
  size: Size;
  surface: Surface;
  crossfade?: boolean;
}) {
  const dark = choose(settings, "dark");
  const light = choose(settings, "light");

  if (!dark || !light) return <Wordmark settings={settings} size={size} />;

  const withName = Boolean(settings.showNameWithLogo);
  // With the name set beside it the logo is decorative; the text names the link.
  const alt = withName ? "" : settings.companyName;
  const eager = size === "header";

  const mark = crossfade ? (
    <span className="grid items-center [&>*]:col-start-1 [&>*]:row-start-1">
      {(["dark", "light"] as const).map((ground) => {
        const shown = ground === surface;
        return (
          <LogoImage
            key={ground}
            choice={ground === "dark" ? dark : light}
            surface={ground}
            size={size}
            alt={shown ? alt : ""}
            eager={eager}
            className={`transition-opacity duration-500 ${shown ? "opacity-100" : "opacity-0"}`}
          />
        );
      })}
    </span>
  ) : (
    <LogoImage
      choice={surface === "dark" ? dark : light}
      surface={surface}
      size={size}
      alt={alt}
      eager={eager}
    />
  );

  return (
    <span className="flex items-center gap-3">
      {mark}
      {withName ? <Wordmark settings={settings} size={size} /> : null}
    </span>
  );
}
