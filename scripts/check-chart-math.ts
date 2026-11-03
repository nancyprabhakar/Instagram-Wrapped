// Verifies the choreographed Beauty/Travel edit frame by frame.
// Run: npx tsx scripts/check-chart-math.ts
import { DRAG_AMOUNT, WANTED, WATCHED } from "../src/theme";
import { T } from "../src/timing";
import { rebalance, rebalanceLabels, toSectors, polar } from "../src/lib/pie";
import { CHART } from "../src/layout";
import { boundaryPoint, dragAmountAt } from "../src/scenes/PhoneStage";
import { CAPTIONS, CLOSING_LINE } from "../src/script";

const failures: string[] = [];
const check = (ok: boolean, msg: string) => {
  if (!ok) failures.push(msg);
};
const close = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

const base = toSectors(WATCHED);
check(close(WATCHED.reduce((a, b) => a + b, 0), 100), "WATCHED must total 100");
check(close(WANTED.reduce((a, b) => a + b, 0), 100), "WANTED must total 100");
check(WANTED.join() === "20,35,25,15,5", `WANTED should be 20/35/25/15/5, got ${WANTED.join("/")}`);

let prevAmount = -1;
for (let f = T.dragStart - 5; f <= T.dragEnd + 5; f++) {
  const amount = dragAmountAt(f);
  check(amount >= prevAmount - 1e-9, `drag must be monotonic at frame ${f}`);
  prevAmount = amount;

  const values = rebalance(WATCHED, amount);
  const labels = rebalanceLabels(WATCHED, amount);
  check(close(values.reduce((a, b) => a + b, 0), 100), `geometry total != 100 at frame ${f}`);
  check(labels.reduce((a, b) => a + b, 0) === 100, `label total != 100 at frame ${f}: ${labels.join("/")}`);
  check(close(values[0] + values[1], WATCHED[0] + WATCHED[1]), `Beauty + Travel changed at frame ${f}`);

  const secs = toSectors(values);
  check(close(secs[0].start, base[0].start), `Beauty start moved at frame ${f}`);
  for (let i = 1; i < secs.length; i++) {
    check(close(secs[i].end, base[i].end, 1e-6), `boundary after sector ${i} moved at frame ${f}`);
  }

  // Touch indicator must sit exactly on the shared Beauty/Travel boundary.
  const touch = boundaryPoint(amount);
  const onBoundary = polar(CHART.cx, CHART.cy, CHART.r * 0.72, secs[0].end);
  check(close(touch.x, onBoundary.x, 1e-6) && close(touch.y, onBoundary.y, 1e-6), `touch off boundary at frame ${f}`);
}
check(close(dragAmountAt(T.dragStart), 0), "drag must start at 0");
check(close(dragAmountAt(T.dragEnd), DRAG_AMOUNT), "drag must end at the full amount");

// Script integrity: every line present, in order.
const SCRIPT = [
  "What if your Instagram had a Wrapped?",
  "Your algorithm knows what you watch.",
  "But does it know what you want to watch?",
  "Imagine seeing exactly where your scrolling time goes.",
  "Then getting a say in what comes next.",
  "More of this.",
  "Less of that.",
  "Adjust the mix.",
  "Apply it to your feed.",
  "See what you view.",
  "And what you value.",
  "Because somewhere between one video and your entire personality…",
  "watching isn't always wanting.",
  "Give your algorithm some direction.",
];
const delivered = [...CAPTIONS.map((c) => c.text), CLOSING_LINE];
check(delivered.join("\n") === SCRIPT.join("\n"), `caption text does not match the script:\n${delivered.join("\n")}`);
for (let i = 1; i < CAPTIONS.length; i++) {
  check(CAPTIONS[i].start >= CAPTIONS[i - 1].end, `captions "${CAPTIONS[i - 1].id}" and "${CAPTIONS[i].id}" overlap`);
}

if (failures.length) {
  console.error(`✗ ${failures.length} check(s) failed:\n- ${failures.slice(0, 20).join("\n- ")}`);
  process.exit(1);
}
console.log(`✓ chart math, touch path, and script checks passed (${T.dragEnd - T.dragStart + 11} frames inspected)`);
