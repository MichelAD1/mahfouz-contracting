/**
 * The drawing-sheet ground for dark surfaces.
 *
 * Stands in for the photography the client does not have yet (temp/PLAN.md §4)
 * and sits behind it once it arrives. A fine measured grid, a coarser one over
 * it, and a soft depth wash — no ornament, nothing that reads as an effect.
 *
 * The grid is built from CSS gradients rather than an SVG `<pattern>`: several
 * plates appear on one page, and SVG pattern ids would collide.
 *
 * `seed` shifts where the wash falls so those plates read as different
 * surfaces instead of a repeated tile.
 */

const WASHES = [
  "120% 90% at 18% 8%",
  "110% 85% at 82% 12%",
  "130% 95% at 50% 104%",
  "115% 90% at 6% 76%",
] as const;

const FINE = "rgba(234,232,227,0.045)";
const COARSE = "rgba(234,232,227,0.085)";

export function BlueprintPlate({
  className = "",
  seed = 0,
}: {
  className?: string;
  seed?: number;
}) {
  const wash = WASHES[seed % WASHES.length];

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 bg-ink ${className}`}
      style={{
        backgroundImage: [
          `radial-gradient(${wash}, rgba(36,69,122,0.55) 0%, rgba(10,22,40,0) 62%)`,
          `linear-gradient(to right, ${COARSE} 1px, transparent 1px)`,
          `linear-gradient(to bottom, ${COARSE} 1px, transparent 1px)`,
          `linear-gradient(to right, ${FINE} 1px, transparent 1px)`,
          `linear-gradient(to bottom, ${FINE} 1px, transparent 1px)`,
        ].join(", "),
        backgroundSize: "100% 100%, 208px 208px, 208px 208px, 26px 26px, 26px 26px",
      }}
    >
      {/* Grounds the lower edge so overlaid type always has contrast. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,22,40,0.25) 0%, rgba(10,22,40,0) 45%, rgba(10,22,40,0.6) 100%)",
        }}
      />
    </div>
  );
}
