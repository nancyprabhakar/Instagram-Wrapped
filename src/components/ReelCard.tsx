import React from "react";
import { Img } from "remotion";
import { CATEGORIES, FONT } from "../theme";
import { reelImage, reelSrc } from "../media";
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

type Props = {
  index: number;
  width: number;
  height: number;
  variant?: number;
  /** Show the reel overlay (handle, tag, action icons). */
  chrome?: boolean;
  handle?: string;
  radius?: number;
  /** 0–1 wash of the category colour over the photo (used as cards become pie slices). */
  tint?: number;
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
  tint = 0,
  style,
}) => {
  const cat = CATEGORIES[index];
  const img = reelImage(index, variant);
  const scale = width / 380;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        position: "relative",
        background: "#1A1A1A",
        ...style,
      }}
    >
      <Img
        src={reelSrc(img)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: img.position,
        }}
      />
      {tint > 0 ? (
        <div style={{ position: "absolute", inset: 0, background: cat.color, opacity: tint }} />
      ) : null}
      {chrome ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
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
                {handle ?? img.handle}
              </span>
            </div>
            <span
              style={{
                alignSelf: "flex-start",
                fontWeight: 600,
                fontSize: 14 * scale,
                padding: `${4 * scale}px ${10 * scale}px`,
                borderRadius: 999,
                background: cat.color,
                color: cat.onColor,
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
