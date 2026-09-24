import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getSiteFrame } from "@/sanity/lib/fetch";
import { hasImage, isVector, sanityImageUrl } from "@/sanity/lib/image";

export const alt = "Mahfouz Contracting - engineering, contracting and maintenance.";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

/**
 * Redrawn when Site settings change, on the same window as the pages. It used
 * to be generated once at build time, which is why its wording had to live in
 * code; it reads the studio now.
 */
export const revalidate = 300;

/**
 * The share card: whatever a link to this site shows when it is pasted into a
 * chat, a post or an email. Every page without its own share image points here.
 *
 * With a share image set in Site settings, that image is served, cut to the
 * card's shape around its hotspot. Without one the card is drawn rather than
 * photographed, for the same reason the site is: the photography is mismatched
 * stock, and a title block made of real facts survives being shrunk to a
 * thumbnail in a chat window.
 *
 * The fonts are read from disk instead of `next/font`, which exists to emit
 * CSS for a browser and has nothing to hand a renderer that rasterises on the
 * server. Satori needs the actual outlines, and it cannot read woff2 — hence
 * two plain TrueType files under `assets/fonts`, both OFL.
 */
const archivo = await readFile(join(process.cwd(), "assets/fonts/Archivo-Bold.ttf"));
const plexMono = await readFile(
  join(process.cwd(), "assets/fonts/IBMPlexMono-Regular.ttf"),
);

const INK = "#0a1628";
const PAPER = "#f4f2ee";
const COPPER = "#c9854f";
const STEEL = "#8b98a6";
const RULE = "rgba(255, 255, 255, 0.14)";

const NUMBER_WORDS = [
  "None",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
];

/** The drawing grid, as positioned hairlines. */
function Grid() {
  const columns = [120, 240, 360, 480, 600, 720, 840, 960, 1080];
  const rows = [105, 210, 315, 420, 525];

  return (
    <div style={{ display: "flex", position: "absolute", inset: 0 }}>
      {columns.map((x) => (
        <div
          key={`c${x}`}
          style={{
            position: "absolute",
            left: x,
            top: 0,
            width: 1,
            height: 630,
            background: "rgba(255, 255, 255, 0.05)",
          }}
        />
      ))}
      {rows.map((y) => (
        <div
          key={`r${y}`}
          style={{
            position: "absolute",
            left: 0,
            top: y,
            width: 1200,
            height: 1,
            background: "rgba(255, 255, 255, 0.05)",
          }}
        />
      ))}
    </div>
  );
}

function TitleBlockCell({
  label,
  value,
  first,
  last,
}: {
  label: string;
  value: string;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        // The first cell carries no indent, so the block's first character sits
        // on the same vertical as the headline above it.
        paddingLeft: first ? 0 : 24,
        borderRight: last ? "none" : `1px solid ${RULE}`,
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "IBM Plex Mono",
          fontSize: 17,
          letterSpacing: 2,
          color: STEEL,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "IBM Plex Mono",
          fontSize: 24,
          color: PAPER,
          marginTop: 10,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/**
 * The logo for dark grounds, as a data URI Satori can draw - read from the CDN
 * when it is an upload, from /public when it is the fallback. Only the dark
 * version: the card is ink, and the colour logo would vanish into it.
 */
async function markDataUri(
  image: Parameters<typeof sanityImageUrl>[0] | undefined,
): Promise<{ uri: string; ratio: number } | null> {
  if (!hasImage(image)) return null;

  try {
    let bytes: Buffer;
    let type: string;

    if (image.url) {
      const response = await fetch(sanityImageUrl(image, { width: 400 }), {
        next: { revalidate },
      });
      if (!response.ok) return null;
      bytes = Buffer.from(await response.arrayBuffer());
      type = response.headers.get("content-type") ?? "image/png";
    } else {
      bytes = await readFile(join(process.cwd(), "public", image.src!));
      type = image.src!.endsWith(".svg") ? "image/svg+xml" : "image/png";
    }

    return {
      uri: `data:${type};base64,${bytes.toString("base64")}`,
      ratio: image.aspectRatio ?? 2,
    };
  } catch (error) {
    console.error("[share card] the logo could not be read", error);
    return null;
  }
}

/**
 * The uploaded share image, as PNG bytes - or nothing, and the card is drawn.
 * SVGs are skipped: the CDN does not rasterise them.
 */
async function uploadedCard(
  image: Parameters<typeof sanityImageUrl>[0] | undefined,
): Promise<Response | null> {
  if (!hasImage(image) || !image.url || isVector(image)) return null;

  try {
    const response = await fetch(
      sanityImageUrl(image, { width: size.width, height: size.height, format: "png" }),
      { next: { revalidate } },
    );
    if (!response.ok || !response.body) return null;

    return new Response(response.body, { headers: { "content-type": contentType } });
  } catch (error) {
    console.error("[share card] the Site settings share image could not be fetched", error);
    return null;
  }
}

export default async function Image() {
  const { settings, services } = await getSiteFrame();

  const uploaded = await uploadedCard(settings.seo.image);
  if (uploaded) return uploaded;

  const mark = await markDataUri(settings.logoOnDark);
  const MARK_HEIGHT = 40;

  const headline = `${settings.footerNote ?? settings.tagline ?? settings.companyName}.`.replace(
    /\.+$/,
    ".",
  );

  const cells = [
    {
      label: "DIVISIONS",
      value:
        services.length > 0
          ? `${NUMBER_WORDS[services.length] ?? services.length}, in-house`
          : "",
    },
    { label: "OPERATING", value: settings.areaServed.join(" & ") },
    { label: "STANDARDS", value: settings.standards.slice(0, 4).join(" ") },
  ].filter((cell) => cell.value);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: INK,
          position: "relative",
        }}
      >
        <Grid />

        {/* The left margin column the whole site is built around. */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 0,
            width: 1,
            height: 630,
            background: RULE,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "56px 72px 56px 112px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "IBM Plex Mono",
              fontSize: 20,
              letterSpacing: 6,
              color: COPPER,
            }}
          >
            {mark ? (
              // eslint-disable-next-line @next/next/no-img-element -- Satori draws <img>, not next/image
              <img
                src={mark.uri}
                alt=""
                width={Math.round(MARK_HEIGHT * mark.ratio)}
                height={MARK_HEIGHT}
                style={{ marginRight: 22 }}
              />
            ) : null}
            {settings.companyName.toUpperCase()}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Archivo",
                fontSize: 86,
                lineHeight: 1.04,
                letterSpacing: -2,
                color: PAPER,
                maxWidth: 1000,
              }}
            >
              {headline}
            </div>
            <div
              style={{
                display: "flex",
                width: 132,
                height: 3,
                background: COPPER,
                marginTop: 36,
              }}
            />
          </div>

          {cells.length > 0 ? (
            <div
              style={{
                display: "flex",
                borderTop: `1px solid ${RULE}`,
                paddingTop: 28,
              }}
            >
              {cells.map((cell, index) => (
                <TitleBlockCell
                  key={cell.label}
                  label={cell.label}
                  value={cell.value}
                  first={index === 0}
                  last={index === cells.length - 1}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex" }} />
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: archivo, weight: 700, style: "normal" },
        { name: "IBM Plex Mono", data: plexMono, weight: 400, style: "normal" },
      ],
    },
  );
}
