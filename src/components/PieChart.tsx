import React from "react";
import { CATEGORIES, FONT } from "../theme";
import { polar, sectorPath, toSectors } from "../lib/pie";

type Props = {
  id: string;
  values: number[];
  radius: number;
  /** 0–1 clockwise reveal, clipped (the geometry itself never changes). */
  reveal?: number;
  /** Per-sector radius multiplier (used when slices first gather in). */
  sectorScale?: number[];
  /** Per-sector outward offset in px along the sector bisector. */
  lift?: number[];
  sectorOpacity?: number[];
  gap?: number;
  gapColor?: string;
  /** Integer labels drawn on slices; omit to hide. */
  labels?: number[];
  labelSize?: number;
  labelOpacity?: number;
  /** Minimum share (in %) required for an on-slice label. */
  labelMin?: number;
  /** Highlight the boundary that ends sector `index` (0 = Beauty/Travel). */
  boundary?: { index: number; strength: number };
  padding?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

export const PieChart: React.FC<Props> = ({
  id,
  values,
  radius,
  reveal = 1,
  sectorScale,
  lift,
  sectorOpacity,
  gap = 3,
  gapColor = "#FFFFFF",
  labels,
  labelSize = 18,
  labelOpacity = 1,
  labelMin = 9,
  boundary,
  padding = 40,
  children,
  style,
}) => {
  const sectors = toSectors(values);
  const half = radius + padding;
  const clipId = `reveal-${id}`;
  const useClip = reveal < 0.9999;

  return (
    <svg
      width={half * 2}
      height={half * 2}
      viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`}
      style={{ overflow: "visible", display: "block", ...style }}
    >
      {useClip ? (
        <defs>
          <clipPath id={clipId}>
            <path d={sectorPath(0, 0, half * 1.5, 0, Math.max(0.001, reveal * 360))} />
          </clipPath>
        </defs>
      ) : null}
      <g clipPath={useClip ? `url(#${clipId})` : undefined}>
        {sectors.map((sec) => {
          const scale = sectorScale?.[sec.index] ?? 1;
          const r = radius * scale;
          const off = lift?.[sec.index] ?? 0;
          const o = polar(0, 0, off, sec.mid);
          return (
            <path
              key={sec.index}
              d={sectorPath(0, 0, r, sec.start, sec.end)}
              transform={`translate(${o.x} ${o.y})`}
              fill={CATEGORIES[sec.index].color}
              stroke={gapColor}
              strokeWidth={gap}
              strokeLinejoin="round"
              opacity={sectorOpacity?.[sec.index] ?? 1}
            />
          );
        })}
        {boundary && boundary.strength > 0
          ? (() => {
              const angle = sectors[boundary.index].end;
              const p = polar(0, 0, radius + 4, angle);
              return (
                <line
                  x1={0}
                  y1={0}
                  x2={p.x}
                  y2={p.y}
                  stroke="#FFFFFF"
                  strokeWidth={gap + 3 * boundary.strength}
                  strokeLinecap="round"
                  opacity={0.6 + 0.4 * boundary.strength}
                />
              );
            })()
          : null}
        {labels
          ? sectors.map((sec) => {
              if (values[sec.index] < labelMin) return null;
              const off = lift?.[sec.index] ?? 0;
              const p = polar(0, 0, radius * 0.63 + off, sec.mid);
              return (
                <text
                  key={`l-${sec.index}`}
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily={FONT}
                  fontWeight={800}
                  fontSize={labelSize}
                  fill={CATEGORIES[sec.index].onColor}
                  opacity={(sectorOpacity?.[sec.index] ?? 1) * labelOpacity}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {labels[sec.index]}%
                </text>
              );
            })
          : null}
      </g>
      {children}
    </svg>
  );
};
