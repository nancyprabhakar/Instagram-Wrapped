import React from "react";
import { CATEGORIES, FONT } from "../theme";
import { HeartIcon, CommentIcon, SendIcon } from "./instagram/Icons";

const shade = (hex: string, amount: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) =>
    Math.max(0, Math.min(255, Math.round(amount < 0 ? v * (1 + amount) : v + (255 - v) * amount)));
  const r = ch((n >> 16) & 255);
  const g = ch((n >> 8) & 255);
  const b = ch(n & 255);
  return `rgb(${r}, ${g}, ${b})`;
};

/** Original abstract artwork for each category, drawn in a 100 × 160 box. */
const Art: React.FC<{ index: number; variant: number }> = ({ index, variant }) => {
  const c = CATEGORIES[index].color;
  const light = shade(c, 0.55);
  const lighter = shade(c, 0.78);
  const dark = shade(c, -0.35);
  const v = variant % 2;
  switch (CATEGORIES[index].id) {
    case "beauty":
      return (
        <g>
          <circle cx={v ? 64 : 50} cy={62} r={34} fill={light} />
          <circle cx={v ? 64 : 50} cy={62} r={22} fill={lighter} />
          <rect x={v ? 18 : 70} y={84} width={14} height={44} rx={7} fill={dark} />
          <rect x={v ? 18 : 70} y={76} width={14} height={16} rx={5} fill={lighter} />
        </g>
      );
    case "travel":
      return (
        <g>
          <circle cx={v ? 30 : 68} cy={52} r={18} fill={shade("#FFD166", 0.2)} />
          <path d="M0 104 Q 25 84 50 100 T 100 96 V160 H0Z" fill={light} />
          <path d="M0 122 Q 30 106 60 120 T 100 116 V160 H0Z" fill={lighter} />
        </g>
      );
    case "food":
      return (
        <g>
          <circle cx={50} cy={74} r={36} fill={lighter} />
          <circle cx={50} cy={74} r={26} fill={light} />
          <circle cx={v ? 42 : 58} cy={68} r={8} fill={dark} />
          <circle cx={v ? 58 : 44} cy={82} r={6} fill={shade("#FFD166", 0.1)} />
        </g>
      );
    case "comedy":
      return (
        <g>
          <rect x={16} y={42} width={68} height={46} rx={23} fill={lighter} />
          <path d="M34 86 L 30 102 L 46 88 Z" fill={lighter} />
          <circle cx={36} cy={65} r={5} fill={dark} />
          <circle cx={50} cy={65} r={5} fill={dark} />
          <circle cx={64} cy={65} r={5} fill={dark} />
        </g>
      );
    case "design":
      return (
        <g>
          <path d="M26 128 V78 a24 24 0 0 1 48 0 V128 Z" fill={lighter} />
          <rect x={v ? 18 : 58} y={40} width={24} height={24} rx={3} fill={light} />
          <circle cx={v ? 72 : 30} cy={52} r={10} fill={dark} />
        </g>
      );
  }
};

type Props = {
  index: number;
  width: number;
  height: number;
  variant?: number;
  /** Show the reel overlay (handle, tag, action icons). */
  chrome?: boolean;
  handle?: string;
  radius?: number;
  style?: React.CSSProperties;
};

export const ReelCard: React.FC<Props> = ({
  index,
  width,
  height,
  variant = 0,
  chrome = true,
  handle,
  radius = 18,
  style,
}) => {
  const cat = CATEGORIES[index];
  const scale = width / 380;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        position: "relative",
        background: `linear-gradient(160deg, ${shade(cat.color, 0.12)} 0%, ${cat.color} 55%, ${shade(cat.color, -0.18)} 100%)`,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 100 160"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <Art index={index} variant={variant} />
      </svg>
      {chrome ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,0.32) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 14 * scale,
              bottom: 22 * scale,
              display: "flex",
              flexDirection: "column",
              gap: 20 * scale,
              alignItems: "center",
            }}
          >
            <HeartIcon size={28 * scale} color="#fff" />
            <CommentIcon size={28 * scale} color="#fff" />
            <SendIcon size={28 * scale} color="#fff" />
          </div>
          <div
            style={{
              position: "absolute",
              left: 18 * scale,
              bottom: 22 * scale,
              display: "flex",
              flexDirection: "column",
              gap: 10 * scale,
              fontFamily: FONT,
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 * scale }}>
              <div
                style={{
                  width: 32 * scale,
                  height: 32 * scale,
                  borderRadius: "50%",
                  background: shade(cat.color, 0.6),
                  border: `${2 * scale}px solid #fff`,
                  boxSizing: "border-box",
                }}
              />
              <span style={{ fontWeight: 700, fontSize: 17 * scale }}>
                {handle ?? `${cat.id}.daily`}
              </span>
            </div>
            <span
              style={{
                alignSelf: "flex-start",
                fontWeight: 600,
                fontSize: 14 * scale,
                padding: `${4 * scale}px ${10 * scale}px`,
                borderRadius: 999,
                background: "rgba(255,255,255,0.24)",
              }}
            >
              {cat.label}
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
};
