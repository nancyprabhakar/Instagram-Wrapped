import React from "react";
import { COLORS, FONT, IG_GRADIENT_CSS } from "../../theme";
import { NAV_TABS, NavTab, SCREEN } from "../../layout";
import {
  CreateIcon,
  HomeIcon,
  PieTabIcon,
  ReelsIcon,
  SearchIcon,
} from "./Icons";

export const StatusBar: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: SCREEN.w,
      height: SCREEN.statusH,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "6px 30px 0 36px",
      boxSizing: "border-box",
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: 16,
      color: COLORS.igText,
    }}
  >
    <span style={{ letterSpacing: -0.2 }}>9:41</span>
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <svg width="18" height="12" viewBox="0 0 18 12">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 4.8} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="1" fill="#000" />
        ))}
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12">
        <path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0z" fill="#000" />
        <path d="M3.4 6.8a6.6 6.6 0 0 1 9.2 0" stroke="#000" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M1 4.2a10 10 0 0 1 14 0" stroke="#000" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>
      <svg width="27" height="13" viewBox="0 0 27 13">
        <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#000" strokeOpacity="0.4" fill="none" />
        <rect x="2.5" y="2.5" width="19" height="8" rx="2" fill="#000" />
        <rect x="24.5" y="4.5" width="1.8" height="4" rx="0.9" fill="#000" fillOpacity="0.4" />
      </svg>
    </div>
  </div>
);

export const ProfileAvatar: React.FC<{ size: number; active?: boolean }> = ({ size, active }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      boxSizing: "border-box",
      border: active ? "2px solid #000" : "1px solid rgba(0,0,0,0.12)",
      padding: active ? 1.5 : 0,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: "linear-gradient(140deg, #F2C9A8 0%, #D98A6C 100%)",
      }}
    />
  </div>
);

type NavProps = {
  active: NavTab;
  /** 0–1: emphasis on the proposed tab (gradient "new" dot + ring). */
  newHighlight?: number;
  /** 0–1 press feedback on the proposed tab. */
  algoPress?: number;
};

export const BottomNav: React.FC<NavProps> = ({ active, newHighlight = 0, algoPress = 0 }) => {
  const slot = SCREEN.w / NAV_TABS.length;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: SCREEN.w,
        height: SCREEN.navH,
        background: "#FFFFFF",
        borderTop: `1px solid ${COLORS.igDivider}`,
        boxSizing: "border-box",
      }}
    >
      {NAV_TABS.map((tab, i) => {
        const isActive = tab === active;
        const icon = (() => {
          const common = { size: 26, color: "#000", strokeWidth: isActive ? 2.4 : 1.9 };
          switch (tab) {
            case "home":
              return <HomeIcon {...common} filled={isActive} />;
            case "search":
              return <SearchIcon {...common} />;
            case "create":
              return <CreateIcon {...common} />;
            case "reels":
              return <ReelsIcon {...common} />;
            case "algo":
              return <PieTabIcon {...common} filled={isActive} />;
            case "profile":
              return <ProfileAvatar size={27} active={isActive} />;
          }
        })();
        const scale = tab === "algo" ? 1 - 0.12 * algoPress : 1;
        return (
          <div
            key={tab}
            style={{
              position: "absolute",
              left: slot * i,
              top: 0,
              width: slot,
              height: 54,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ transform: `scale(${scale})`, position: "relative" }}>
              {icon}
              {tab === "algo" ? (
                <div
                  style={{
                    position: "absolute",
                    right: -5,
                    top: -4,
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: IG_GRADIENT_CSS,
                    border: "2px solid #fff",
                    opacity: newHighlight,
                  }}
                />
              ) : null}
            </div>
          </div>
        );
      })}
      {/* iOS home indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 7,
          left: (SCREEN.w - 134) / 2,
          width: 134,
          height: 5,
          borderRadius: 3,
          background: "#000",
        }}
      />
    </div>
  );
};
