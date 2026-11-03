import React from "react";
import { COLORS, FONT, IG_GRADIENT_CSS } from "../../theme";
import { SCREEN } from "../../layout";
import {
  BookmarkIcon,
  ChevronDownIcon,
  CommentIcon,
  HeartIcon,
  MoreIcon,
  PlusIcon,
  SendIcon,
} from "./Icons";

const STORIES = [
  { name: "Your story", colors: ["#F2C9A8", "#D98A6C"], own: true },
  { name: "kai.travels", colors: ["#9CC3FF", "#1F74F2"] },
  { name: "maya.eats", colors: ["#FFC2B8", "#FF6A55"] },
  { name: "studio.oro", colors: ["#9BE6DC", "#0FAE9E"] },
  { name: "lola.lols", colors: ["#FFE39A", "#F7B500"] },
];

const Story: React.FC<(typeof STORIES)[number]> = ({ name, colors, own }) => (
  <div style={{ width: 74, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
    <div
      style={{
        width: 70,
        height: 70,
        borderRadius: "50%",
        padding: 2.5,
        boxSizing: "border-box",
        background: own ? "transparent" : IG_GRADIENT_CSS,
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: own ? "none" : "2.5px solid #fff",
          boxSizing: "border-box",
          background: `linear-gradient(140deg, ${colors[0]}, ${colors[1]})`,
        }}
      />
      {own ? (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#000",
            border: "2.5px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PlusIcon size={13} color="#fff" strokeWidth={3} />
        </div>
      ) : null}
    </div>
    <span
      style={{
        fontFamily: FONT,
        fontSize: 11.5,
        color: own ? COLORS.igSecondary : "#000",
        whiteSpace: "nowrap",
      }}
    >
      {name}
    </span>
  </div>
);

export const HomeHeader: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: SCREEN.statusH,
      left: 0,
      width: SCREEN.w,
      height: SCREEN.headerH,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 16px",
      boxSizing: "border-box",
    }}
  >
    <PlusIcon size={27} strokeWidth={2} />
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 34 }}>
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 25,
          letterSpacing: -0.8,
          color: "#000",
        }}
      >
        Instagram
      </span>
      <ChevronDownIcon size={16} strokeWidth={2.4} />
    </div>
    <div style={{ display: "flex", gap: 20 }}>
      <HeartIcon size={26} strokeWidth={2} />
      <SendIcon size={25} strokeWidth={2} />
    </div>
  </div>
);

/** Original placeholder photograph: an abstract coastal sunset. */
const PostArt: React.FC = () => (
  <svg viewBox="0 0 412 412" width={SCREEN.w} height={SCREEN.w} style={{ display: "block" }}>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8DB8FF" />
        <stop offset="0.55" stopColor="#FFC7A6" />
        <stop offset="1" stopColor="#FF9C7A" />
      </linearGradient>
    </defs>
    <rect width="412" height="412" fill="url(#sky)" />
    <circle cx="270" cy="210" r="56" fill="#FFE2A8" />
    <path d="M0 250 Q 90 200 170 236 T 412 222 V412 H0Z" fill="#3F7BE0" />
    <path d="M0 292 Q 120 262 230 290 T 412 282 V412 H0Z" fill="#1F5FCC" />
    <path d="M0 336 Q 140 316 260 336 T 412 332 V412 H0Z" fill="#174AA6" />
    <rect x="60" y="150" width="10" height="110" rx="5" fill="#2E2A3D" opacity="0.7" />
    <path d="M65 150 q -34 4 -46 26 M65 150 q 34 4 46 26 M65 150 q -20 -14 -42 -10 M65 150 q 22 -14 42 -10" stroke="#2E2A3D" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.7" />
  </svg>
);

export const HomeFeed: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, fontFamily: FONT, color: "#000" }}>
    <HomeHeader />
    <div
      style={{
        position: "absolute",
        top: SCREEN.statusH + SCREEN.headerH + 4,
        left: 10,
        display: "flex",
        gap: 6,
      }}
    >
      {STORIES.map((s) => (
        <Story key={s.name} {...s} />
      ))}
    </div>
    <div
      style={{
        position: "absolute",
        top: SCREEN.statusH + SCREEN.headerH + 112,
        left: 0,
        width: SCREEN.w,
        borderTop: `0.5px solid ${COLORS.igDivider}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            padding: 2,
            boxSizing: "border-box",
            background: IG_GRADIENT_CSS,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "2px solid #fff",
              boxSizing: "border-box",
              background: "linear-gradient(140deg, #9CC3FF, #1F74F2)",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>kai.travels</span>
          <span style={{ fontSize: 12, color: "#000" }}>Lisbon, Portugal</span>
        </div>
        <MoreIcon size={22} />
      </div>
      <PostArt />
      <div style={{ display: "flex", alignItems: "center", padding: "11px 14px 6px", gap: 16 }}>
        <HeartIcon size={26} strokeWidth={2} />
        <CommentIcon size={25} strokeWidth={2} />
        <SendIcon size={24} strokeWidth={2} />
        <div style={{ flex: 1 }} />
        <BookmarkIcon size={25} strokeWidth={2} />
      </div>
      <div style={{ padding: "2px 14px", fontSize: 14, fontWeight: 600 }}>2,481 likes</div>
      <div style={{ padding: "3px 14px", fontSize: 14 }}>
        <span style={{ fontWeight: 600 }}>kai.travels</span> golden hour over the river
      </div>
    </div>
  </div>
);
