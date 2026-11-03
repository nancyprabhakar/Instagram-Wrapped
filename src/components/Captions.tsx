import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, CANVAS } from "../theme";
import { easeIn, easeOut, progress } from "../lib/anim";
import { CAPTIONS, CaptionCue } from "../script";

const Cue: React.FC<{ cue: CaptionCue }> = ({ cue }) => {
  const frame = useCurrentFrame();
  // The hook is fully legible on the very first frame.
  const inP = cue.start === 0 ? 1 : progress(frame, cue.start, cue.start + 9, easeOut);
  const outP = progress(frame, cue.end - 6, cue.end, easeIn);
  const opacity = inP * (1 - outP);
  const y = (1 - inP) * 16 - outP * 6;
  const size = cue.size ?? 78;
  const center = cue.placement === "center";
  return (
    <div
      style={{
        position: "absolute",
        left: CANVAS.safe,
        width: CANVAS.width - CANVAS.safe * 2,
        top: center ? 0 : 92,
        height: center ? CANVAS.height * 0.78 : undefined,
        display: "flex",
        flexDirection: "column",
        justifyContent: center ? "center" : "flex-start",
        alignItems: center ? "center" : "flex-start",
        textAlign: center ? "center" : "left",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: "-0.035em",
        color: COLORS.ink,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      {cue.lines.map((line, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>
          {line}
        </div>
      ))}
    </div>
  );
};

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {CAPTIONS.filter((c) => frame >= c.start && frame < c.end).map((c) => (
        <Cue key={c.id} cue={c} />
      ))}
    </>
  );
};
