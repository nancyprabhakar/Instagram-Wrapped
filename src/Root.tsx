import React from "react";
import { Composition } from "remotion";
import { ViewValue } from "./ViewValue";
import { Cover } from "./Cover";
import { CANVAS } from "./theme";
import { DURATION_IN_FRAMES, FPS } from "./timing";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ViewValue"
      component={ViewValue}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={CANVAS.width}
      height={CANVAS.height}
      defaultProps={{ sound: true }}
    />
    {/* Full length so <Freeze> can address frames from the film; render frame 0. */}
    <Composition
      id="Cover"
      component={Cover}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={CANVAS.width}
      height={CANVAS.height}
    />
  </>
);
