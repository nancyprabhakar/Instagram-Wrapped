import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, IG_GRADIENT_TEXT_CSS } from "../theme";
import { easeOut, progress } from "../lib/anim";

export const gradientText: React.CSSProperties = {
  backgroundImage: IG_GRADIENT_TEXT_CSS,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

/** Left-to-right gradient reveal over ink text. Frames are absolute. */
export const Wipe: React.FC<{ start: number; end: number; children: React.ReactNode }> = ({
  start,
  end,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start, end);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ color: COLORS.ink }}>{children}</span>
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          ...gradientText,
          clipPath: `inset(-10% ${(1 - p) * 100}% -10% 0)`,
        }}
      >
        {children}
      </span>
      <span
        style={{
          position: "absolute",
          left: 0,
          bottom: "0.02em",
          height: "0.09em",
          width: `${p * 100}%`,
          borderRadius: 999,
          backgroundImage: IG_GRADIENT_TEXT_CSS,
        }}
      />
    </span>
  );
};

/**
 * WATCH is set as solid, heavy ink with a flat underline; WANT is set in the
 * Instagram gradient. `revealAt` lets WANT arrive as ink and then light up.
 */
export const Accent: React.FC<{
  kind: "watch" | "want";
  revealAt?: number;
  children: React.ReactNode;
}> = ({ kind, revealAt, children }) => {
  const frame = useCurrentFrame();
  if (kind === "watch") {
    return (
      <span
        style={{
          fontWeight: 900,
          color: COLORS.ink,
          textDecoration: "underline",
          textDecorationThickness: "0.08em",
          textUnderlineOffset: "0.12em",
          textDecorationColor: "rgba(20,18,16,0.85)",
        }}
      >
        {children}
      </span>
    );
  }
  const p = revealAt === undefined ? 1 : progress(frame, revealAt, revealAt + 10, easeOut);
  return (
    <span style={{ position: "relative", display: "inline-block", fontWeight: 900 }}>
      <span style={{ opacity: 1 - p, color: COLORS.ink }}>{children}</span>
      <span style={{ position: "absolute", left: 0, top: 0, opacity: p, ...gradientText }}>{children}</span>
    </span>
  );
};

