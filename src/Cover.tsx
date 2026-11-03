import React from "react";
import { AbsoluteFill, Freeze } from "remotion";
import "./fonts";
import { COLORS, FONT } from "./theme";
import { s } from "./timing";
import { Captions } from "./components/Captions";
import { PhoneStage } from "./scenes/PhoneStage";

/** Cover image: the opening hook over the fully revealed "What you watched" chart. */
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.paper, fontFamily: FONT }}>
    <Freeze frame={s(12.4)}>
      <PhoneStage />
    </Freeze>
    <Freeze frame={s(2)}>
      <Captions />
    </Freeze>
  </AbsoluteFill>
);
