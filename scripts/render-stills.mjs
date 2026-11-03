// Renders QA stills for every scene (and the drag start/mid/end) into out/stills.
// Usage: node scripts/render-stills.mjs [seconds...]
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const FPS = 30;
const DEFAULT_SECONDS = [
  0, 0.9, 1.15, 2.0, 2.9, 3.6, // hook: home, tap, cards, gather
  4.6, 5.6, 7.1, 8.3, // reels scroll, pause on "want", summary
  9.6, 10.3, 11.4, 13.6, // first chart draw + labels + swipe cue
  15.3, 16.2, 17.0, 17.75, 18.6, 19.25, // swipe, grab, drag start/mid/end
  20.6, 21.85, 22.7, 23.6, // apply + confirmation
  24.4, 25.3, 26.8, // VIEW / VALUE hero
  28.8, 29.9, 30.8, 32.4, // echo + contrast + wanting
  34.6, 35.6, 37.9, // end card + hold
];

const seconds = process.argv.length > 2 ? process.argv.slice(2).map(Number) : DEFAULT_SECONDS;
const outDir = path.resolve("out/stills");
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "ViewValue", inputProps: {} });

for (const sec of seconds) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(sec * FPS));
  const output = path.join(outDir, `f${String(frame).padStart(4, "0")}_${sec.toFixed(2)}s.png`);
  await renderStill({ composition, serveUrl, output, frame, inputProps: {} });
  console.log("rendered", output);
}
