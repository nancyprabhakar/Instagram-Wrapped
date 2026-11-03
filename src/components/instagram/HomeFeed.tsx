import React from "react";
import { Img, staticFile } from "remotion";
import { FEED_POST } from "../../media";
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

type StoryProps = { name: string; colors: string[]; own?: boolean; img?: string };

const STORIES: StoryProps[] = [
  { name: "Your story", colors: ["#F2C9A8", "#D98A6C"], own: true },
  { name: "kai.travels", colors: ["#9CC3FF", "#1F74F2"], img: "travel-lagoon.jpg" },
  { name: "maya.eats", colors: ["#FFC2B8", "#FF6A55"], img: "food-cookies.jpg" },
  { name: "glow.lab", colors: ["#D9B8FF", "#8E3BF5"], img: "beauty-lipgloss.jpg" },
  { name: "lola.lols", colors: ["#FFE39A", "#F7B500"], img: "comedy-dog.jpg" },
];

const Story: React.FC<StoryProps> = ({ name, colors, own, img }) => (
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
          overflow: "hidden",
        }}
      >
        {img ? (
          <Img
            src={staticFile(`reels/${img}`)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : null}
      </div>
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

const PostImage: React.FC = () => (
  <Img
    src={FEED_POST.src}
    style={{
      display: "block",
      width: SCREEN.w,
      height: SCREEN.w,
      objectFit: "cover",
      objectPosition: FEED_POST.position,
    }}
  />
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
          <span style={{ fontWeight: 600, fontSize: 14 }}>{FEED_POST.handle}</span>
          <span style={{ fontSize: 12, color: "#000" }}>{FEED_POST.location}</span>
        </div>
        <MoreIcon size={22} />
      </div>
      <PostImage />
      <div style={{ display: "flex", alignItems: "center", padding: "11px 14px 6px", gap: 16 }}>
        <HeartIcon size={26} strokeWidth={2} />
        <CommentIcon size={25} strokeWidth={2} />
        <SendIcon size={24} strokeWidth={2} />
        <div style={{ flex: 1 }} />
        <BookmarkIcon size={25} strokeWidth={2} />
      </div>
      <div style={{ padding: "2px 14px", fontSize: 14, fontWeight: 600 }}>2,481 likes</div>
      <div style={{ padding: "3px 14px", fontSize: 14 }}>
        <span style={{ fontWeight: 600 }}>{FEED_POST.handle}</span> {FEED_POST.caption}
      </div>
    </div>
  </div>
);
