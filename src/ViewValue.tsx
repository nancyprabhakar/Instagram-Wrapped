import React from "react";
import { AbsoluteFill } from "remotion";
import "./fonts";
import { COLORS, FONT } from "./theme";
import { Captions } from "./components/Captions";
import { SoundEffects } from "./components/SoundEffects";
import { PhoneStage } from "./scenes/PhoneStage";
import { HeroStage } from "./scenes/HeroStage";

export const ViewValue: React.FC<{ sound?: boolean }> = ({ sound = true }) => (
  <AbsoluteFill style={{ backgroundColor: COLORS.paper, fontFamily: FONT }}>
    <PhoneStage />
    <HeroStage />
    <Captions />
    {sound ? <SoundEffects /> : null}
  </AbsoluteFill>
);
