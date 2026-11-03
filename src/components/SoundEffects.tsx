import React from "react";
import { Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { T } from "../timing";

// Original synthesized UI sounds (see scripts/make-sfx.sh). No music.
const CUES: { at: number; file: string; volume: number }[] = [
  { at: T.tabTap, file: "tap.wav", volume: 0.7 },
  { at: T.swipeCueStart + 2, file: "swipe.wav", volume: 0.25 },
  { at: T.swipeStart, file: "swipe.wav", volume: 0.6 },
  { at: T.grab, file: "tick.wav", volume: 0.8 },
  { at: T.dragEnd, file: "tick.wav", volume: 0.6 },
  { at: T.applyTap, file: "tap.wav", volume: 0.8 },
  { at: T.sheetIn + 4, file: "chime.wav", volume: 0.5 },
  { at: T.heroStart, file: "swipe.wav", volume: 0.35 },
  { at: T.endStart + 4, file: "chime.wav", volume: 0.35 },
];

export const SoundEffects: React.FC = () => (
  <>
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.at} durationInFrames={30} layout="none">
        <Audio src={staticFile(`sfx/${c.file}`)} volume={c.volume} />
      </Sequence>
    ))}
  </>
);
