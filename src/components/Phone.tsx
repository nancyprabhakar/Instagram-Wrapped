import React from "react";
import { PHONE, SCREEN } from "../layout";
import { COLORS } from "../theme";

type Props = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

/** A simplified, neutral phone body. The screen is SCREEN.w × SCREEN.h. */
export const Phone: React.FC<Props> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      left: PHONE.x,
      top: PHONE.y,
      width: PHONE.w,
      height: PHONE.h,
      borderRadius: PHONE.radius,
      background: COLORS.phoneBody,
      boxShadow:
        "0 50px 90px -30px rgba(40, 28, 14, 0.38), 0 18px 36px -18px rgba(40, 28, 14, 0.3), inset 0 0 0 1.5px #2C2C2C",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: PHONE.bezel,
        top: PHONE.bezel,
        width: SCREEN.w,
        height: SCREEN.h,
        borderRadius: PHONE.radius - PHONE.bezel,
        overflow: "hidden",
        background: "#FFFFFF",
      }}
    >
      {children}
      {/* Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: 11,
          left: (SCREEN.w - 112) / 2,
          width: 112,
          height: 32,
          borderRadius: 16,
          background: "#000",
        }}
      />
    </div>
  </div>
);
