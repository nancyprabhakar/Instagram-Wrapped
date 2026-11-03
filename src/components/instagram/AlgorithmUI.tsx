import React from "react";
import { CATEGORIES, COLORS, FONT, IG_GRADIENT_CSS, IG_GRADIENT_TEXT_CSS } from "../../theme";
import { CHART, CONTENT_BOTTOM, SCREEN } from "../../layout";
import { ArrowIcon, CalendarIcon, CheckIcon, InfoIcon, MoreIcon, SlidersIcon } from "./Icons";

export const AlgoHeader: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: SCREEN.statusH,
      left: 0,
      width: SCREEN.w,
      height: SCREEN.headerH,
      display: "flex",
      alignItems: "center",
      padding: "0 18px",
      boxSizing: "border-box",
      fontFamily: FONT,
      gap: 10,
    }}
  >
    <span style={{ fontWeight: 700, fontSize: 23, letterSpacing: -0.5, color: "#000" }}>
      Your algorithm
    </span>
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
        color: COLORS.igSecondary,
        border: `1px solid ${COLORS.igDivider}`,
        borderRadius: 999,
        padding: "2px 8px",
        marginTop: 2,
      }}
    >
      Concept
    </span>
    <div style={{ flex: 1 }} />
    <InfoIcon size={25} strokeWidth={1.9} />
    <div style={{ width: 14 }} />
    <MoreIcon size={24} />
  </div>
);

export const PageTitle: React.FC<{
  title: string;
  kind: "watched" | "wanted";
}> = ({ title, kind }) => (
  <div style={{ position: "absolute", top: SCREEN.statusH + SCREEN.headerH + 14, left: 20, right: 20, fontFamily: FONT }}>
    <div style={{ fontWeight: 700, fontSize: 27, letterSpacing: -0.6, color: "#000", lineHeight: 1.15 }}>
      {title}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
      {kind === "watched" ? (
        <>
          <Chip icon={<CalendarIcon size={15} strokeWidth={2.1} />} label="Last 30 days" />
          <span style={{ fontSize: 15, color: COLORS.igSecondary }}>Share of viewing time</span>
        </>
      ) : (
        <Chip icon={<SlidersIcon size={15} strokeWidth={2.1} />} label="Adjust your mix" accent />
      )}
    </div>
  </div>
);

const Chip: React.FC<{ icon: React.ReactNode; label: string; accent?: boolean }> = ({ icon, label, accent }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      borderRadius: 10,
      background: COLORS.igSurface,
      fontSize: 15,
      fontWeight: 600,
      color: "#000",
      position: "relative",
    }}
  >
    {icon}
    <span
      style={
        accent
          ? {
              backgroundImage: IG_GRADIENT_TEXT_CSS,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }
          : undefined
      }
    >
      {label}
    </span>
  </div>
);

export type LegendState = {
  values: number[];
  /** Per-category 0–1 opacity for staggered reveal. */
  reveal?: number[];
  /** Per-category 0–1 emphasis. */
  emphasis?: number[];
  /** Per-category change direction to show next to the value. */
  trend?: ("up" | "down" | null)[];
};

export const Legend: React.FC<LegendState> = ({ values, reveal, emphasis, trend }) => {
  const colW = (SCREEN.w - 40 - 12) / 2;
  return (
    <div
      style={{
        position: "absolute",
        top: CHART.legendTop,
        left: 20,
        width: SCREEN.w - 40,
        display: "flex",
        flexWrap: "wrap",
        columnGap: 12,
        rowGap: 6,
        fontFamily: FONT,
      }}
    >
      {CATEGORIES.map((cat, i) => {
        const r = reveal?.[i] ?? 1;
        const e = emphasis?.[i] ?? 0;
        const t = trend?.[i] ?? null;
        return (
          <div
            key={cat.id}
            style={{
              width: colW,
              height: 38,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "0 12px",
              borderRadius: 10,
              background: e > 0 ? `color-mix(in srgb, ${cat.tint} ${Math.round(e * 100)}%, transparent)` : "transparent",
              opacity: r,
              transform: `translateY(${(1 - r) * 8}px)`,
            }}
          >
            <div style={{ width: 13, height: 13, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
            <span style={{ fontSize: 18, fontWeight: 600, color: "#000", flex: 1 }}>{cat.label}</span>
            {t ? (
              <ArrowIcon direction={t} size={16} strokeWidth={2.6} color={cat.color} style={{ opacity: Math.max(e, 0.75) }} />
            ) : null}
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#000",
                fontVariantNumeric: "tabular-nums",
                minWidth: 40,
                textAlign: "right",
              }}
            >
              {values[i]}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

/** Instagram-style carousel dots. `position` is 0 for page one, 1 for page two. */
export const PageDots: React.FC<{ position: number; opacity?: number }> = ({ position, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      top: CHART.dotsY,
      left: 0,
      width: SCREEN.w,
      display: "flex",
      justifyContent: "center",
      gap: 6,
      opacity,
    }}
  >
    {[0, 1].map((i) => {
      const active = 1 - Math.min(1, Math.abs(position - i));
      return (
        <div
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: `rgba(0,149,246,${0.25 + 0.75 * active})`,
            transform: `scale(${0.85 + 0.15 * active})`,
          }}
        />
      );
    })}
  </div>
);

export const ApplyButton: React.FC<{ reveal: number; press: number; done: number }> = ({ reveal, press, done }) => (
  <div
    style={{
      position: "absolute",
      top: CHART.buttonTop,
      left: 20,
      width: SCREEN.w - 40,
      height: CHART.buttonH,
      borderRadius: 12,
      background: press > 0.01 || done > 0 ? COLORS.igBluePressed : COLORS.igBlue,
      color: "#fff",
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      opacity: reveal,
      transform: `translateY(${(1 - reveal) * 14}px) scale(${1 - press * 0.03})`,
    }}
  >
    {done > 0.5 ? <CheckIcon size={20} color="#fff" strokeWidth={2.8} /> : null}
    {done > 0.5 ? "Applied" : "Apply to my feed"}
  </div>
);

export const ConfirmSheet: React.FC<{ progress: number }> = ({ progress }) => {
  const h = 248;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SCREEN.w,
          height: CONTENT_BOTTOM,
          background: `rgba(0,0,0,${0.12 * progress})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: SCREEN.w,
          height: h,
          top: CONTENT_BOTTOM - h * progress,
          background: "#fff",
          borderRadius: "22px 22px 0 0",
          boxShadow: "0 -10px 30px rgba(0,0,0,0.10)",
          fontFamily: FONT,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 12,
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: 40, height: 4.5, borderRadius: 3, background: "#D0D0D0" }} />
        <div
          style={{
            marginTop: 20,
            width: 58,
            height: 58,
            borderRadius: "50%",
            padding: 3,
            boxSizing: "border-box",
            background: IG_GRADIENT_CSS,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckIcon size={28} strokeWidth={2.8} />
          </div>
        </div>
        <div style={{ marginTop: 14, fontWeight: 700, fontSize: 22, letterSpacing: -0.4 }}>Preferences updated</div>
        <div style={{ marginTop: 6, fontSize: 17, fontWeight: 500 }}>
          <span style={{ color: CATEGORIES[1].color, fontWeight: 700 }}>More travel.</span>{" "}
          <span style={{ color: CATEGORIES[0].color, fontWeight: 700 }}>Less beauty.</span>
        </div>
        <div style={{ marginTop: 14, width: SCREEN.w - 40, borderTop: `0.5px solid ${COLORS.igDivider}` }} />
        <div style={{ marginTop: 12, fontSize: 15, color: COLORS.igSecondary }}>
          A direction, not a fixed formula.
        </div>
      </div>
    </>
  );
};

export const NewTabTooltip: React.FC<{ x: number; opacity: number }> = ({ x, opacity }) => {
  const w = 214;
  const left = Math.min(SCREEN.w - w - 10, Math.max(10, x - w / 2));
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: CONTENT_BOTTOM - 62,
        width: w,
        opacity,
        transform: `translateY(${(1 - opacity) * 8}px)`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          height: 44,
          borderRadius: 12,
          background: "#262626",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontSize: 15,
          fontWeight: 600,
          boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 0.6,
            padding: "3px 7px",
            borderRadius: 6,
            background: IG_GRADIENT_CSS,
          }}
        >
          NEW
        </span>
        Your algorithm
      </div>
      <div
        style={{
          position: "absolute",
          left: x - left - 8,
          top: 42,
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: "9px solid #262626",
        }}
      />
    </div>
  );
};
