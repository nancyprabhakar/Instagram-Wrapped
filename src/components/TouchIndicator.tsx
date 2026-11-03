import React from "react";

type Props = {
  x: number;
  y: number;
  opacity: number;
  /** 0 = hovering, 1 = finger down. */
  press: number;
  /** 0–1 progress of a tap ripple; omit for none. */
  ripple?: number;
};

/** Translucent touch point, rendered in screen-local coordinates. */
export const TouchIndicator: React.FC<Props> = ({ x, y, opacity, press, ripple }) => {
  if (opacity <= 0.001) return null;
  const size = 50 * (1 - 0.14 * press);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity }}>
      {ripple !== undefined && ripple > 0 && ripple < 1 ? (
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: 50 + 60 * ripple,
            height: 50 + 60 * ripple,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: "2px solid rgba(20,18,16,0.35)",
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `rgba(20,18,16,${0.2 + 0.14 * press})`,
          border: "2.5px solid rgba(255,255,255,0.95)",
          boxShadow: `0 ${6 - 4 * press}px ${16 - 8 * press}px rgba(0,0,0,0.22)`,
        }}
      />
    </div>
  );
};
