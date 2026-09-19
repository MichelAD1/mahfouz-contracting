import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Mahfouz Contracting — engineering, contracting and maintenance. Five in-house divisions operating in Liberia and Lebanon.";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

/**
 * The card is drawn rather than photographed, for the same reason the site is:
 * the photography is mismatched stock, and a title block made of real facts
 * survives being shrunk to a thumbnail in a chat window. It is also the only
 * part of the brand most people will ever see at 300 pixels wide.
 *
 * The fonts are read from disk instead of `next/font`, which exists to emit
 * CSS for a browser and has nothing to hand a renderer that rasterises on the
 * server. Satori needs the actual outlines, and it cannot read woff2 — hence
 * two plain TrueType files under `assets/fonts`, both OFL. Read at module
 * scope, at build time, because this route has no request-time input and is
 * generated once.
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

export default async function Image() {
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
              fontFamily: "IBM Plex Mono",
              fontSize: 20,
              letterSpacing: 6,
              color: COPPER,
            }}
          >
            MAHFOUZ CONTRACTING
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "Archivo",
                fontSize: 86,
                lineHeight: 1.04,
                letterSpacing: -2,
                color: PAPER,
              }}
            >
              <div style={{ display: "flex" }}>Engineering, contracting</div>
              <div style={{ display: "flex" }}>and maintenance.</div>
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

          <div
            style={{
              display: "flex",
              borderTop: `1px solid ${RULE}`,
              paddingTop: 28,
            }}
          >
            <TitleBlockCell label="DIVISIONS" value="Five, in-house" first />
            <TitleBlockCell label="OPERATING" value="Liberia & Lebanon" />
            <TitleBlockCell label="STANDARDS" value="IEC NEC BS NFPA" last />
          </div>
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
