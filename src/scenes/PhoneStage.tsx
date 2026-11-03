import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { Phone } from "../components/Phone";
import { PieChart } from "../components/PieChart";
import { ReelCard } from "../components/ReelCard";
import { TouchIndicator } from "../components/TouchIndicator";
import { BottomNav, StatusBar } from "../components/instagram/Chrome";
import { HomeFeed } from "../components/instagram/HomeFeed";
import {
  AlgoHeader,
  ApplyButton,
  ConfirmSheet,
  Legend,
  NewTabTooltip,
  PageDots,
  PageTitle,
} from "../components/instagram/AlgorithmUI";
import { gradientText } from "../components/Typography";
import { CATEGORIES, COLORS, DRAG_AMOUNT, FONT, WATCHED } from "../theme";
import { CHART, CONTENT_BOTTOM, CONTENT_TOP, PHONE, SCREEN, navTabCenter, screenToCanvas } from "../layout";
import { T } from "../timing";
import { easeIn, easeInOut, easeOut, easeOutBack, mix, progress } from "../lib/anim";
import { polar, rebalance, rebalanceLabels, toSectors } from "../lib/pie";

/** Continuous drag amount (0 → DRAG_AMOUNT) for the Beauty/Travel boundary. */
export const dragAmountAt = (frame: number) =>
  DRAG_AMOUNT * progress(frame, T.dragStart, T.dragEnd, Easing.bezier(0.45, 0, 0.3, 1));

/** Screen-local position on the Beauty/Travel boundary for a given drag. */
export const boundaryPoint = (amount: number) =>
  polar(CHART.cx, CHART.cy, CHART.r * 0.72, (WATCHED[0] - amount) * 3.6);

// ——— Scene 1: reel cards fan in, then gather into a pie ————————————————

const FAN_ORDER = [2, 1, 4, 3, 0]; // back to front; Beauty lands on top
const FAN_SLOT: Record<number, { x: number; rot: number }> = {
  2: { x: -104, rot: -13 },
  1: { x: -54, rot: -6 },
  0: { x: 0, rot: 0 },
  3: { x: 54, rot: 6 },
  4: { x: 104, rot: 13 },
};
const WRAP_PIE = { cx: SCREEN.w / 2, cy: CONTENT_TOP + 300, r: 132 };

const WrappedIntro: React.FC<{ frame: number }> = ({ frame }) => {
  const sectors = toSectors(WATCHED);
  const titleIn = progress(frame, T.algoOpenStart + 2, T.algoOpenEnd + 4, easeOut);
  const cardW = 150;
  const cardH = 250;
  const landed = (idx: number) => T.gatherStart + FAN_ORDER.indexOf(idx) * 2 + 13;
  const statsIn = progress(frame, T.gatherEnd - 4, T.gatherEnd + 8, easeOut);
  return (
    <>
      <div style={{ position: "absolute", left: WRAP_PIE.cx - WRAP_PIE.r - 40, top: WRAP_PIE.cy - WRAP_PIE.r - 40 }}>
        <PieChart
          id="wrapped"
          values={WATCHED}
          radius={WRAP_PIE.r}
          sectorScale={WATCHED.map((_, idx) => progress(frame, landed(idx) - 6, landed(idx) + 8, easeOutBack))}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: WRAP_PIE.cy + WRAP_PIE.r + 34,
          left: 0,
          width: SCREEN.w,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 17,
          color: COLORS.igSecondary,
          opacity: statsIn,
        }}
      >
        <b style={{ color: "#000" }}>1,284</b> Reels · <b style={{ color: "#000" }}>5</b> topics
      </div>
      <div
        style={{
          position: "absolute",
          top: CONTENT_TOP + 18,
          left: 20,
          fontFamily: FONT,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 10}px)`,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 27, letterSpacing: -0.6 }}>
          Your Reels, <span style={gradientText}>Wrapped</span>
        </div>
        <div style={{ fontSize: 15, color: COLORS.igSecondary, marginTop: 6 }}>Last 30 days</div>
      </div>
      {FAN_ORDER.map((idx, order) => {
        const appear = progress(frame, T.cardsInStart + order * 3, T.cardsInStart + order * 3 + 12, easeOutBack);
        const g = progress(frame, T.gatherStart + order * 2, T.gatherStart + order * 2 + 13, easeInOut);
        const slot = FAN_SLOT[idx];
        const target = polar(WRAP_PIE.cx, WRAP_PIE.cy, WRAP_PIE.r * 0.55, sectors[idx].mid);
        const x = mix(WRAP_PIE.cx + slot.x, target.x, g);
        const y = mix(WRAP_PIE.cy + (1 - appear) * 70, target.y, g);
        const scale = mix(1, 0.16, g);
        const opacity = Math.min(appear, 1 - progress(frame, T.gatherStart + order * 2 + 9, T.gatherStart + order * 2 + 14));
        if (opacity <= 0) return null;
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: x - cardW / 2,
              top: y - cardH / 2,
              opacity,
              transform: `rotate(${slot.rot * (1 - g)}deg) scale(${scale})`,
              boxShadow: "0 12px 28px rgba(0,0,0,0.16)",
              borderRadius: mix(16, cardW / 2, g),
            }}
          >
            <ReelCard
              index={idx}
              width={cardW}
              height={mix(cardH, cardW, g)}
              chrome={g < 0.2}
              radius={mix(16, cardW / 2, g)}
              handle={["glow.lab", "kai.travels", "maya.eats", "lola.lols", "studio.oro"][idx]}
              variant={idx}
            />
          </div>
        );
      })}
    </>
  );
};

// ——— Scene 2: fluid reel scroll, pause, pull back to an attention summary ———

const REEL_SEQUENCE = [2, 0, 3, 1, 0, 2, 4, 0, 2, 3];
const STOP_INDEX = 7;
const REEL = { w: SCREEN.w - 40, h: 500, gap: 14, top: CONTENT_TOP + 44 };
const HANDLES: Record<number, string> = {
  0: "glow.lab",
  1: "kai.travels",
  2: "maya.eats",
  3: "lola.lols",
  4: "studio.oro",
};

const ReelsReplay: React.FC<{ frame: number }> = ({ frame }) => {
  const scrollP = progress(frame, T.scrollStart, T.scrollStop, Easing.bezier(0.33, 0.0, 0.12, 1));
  const offset = scrollP * STOP_INDEX * (REEL.h + REEL.gap);
  const pull = progress(frame, T.pullBackStart, T.pullBackEnd, easeInOut);
  const summary = progress(frame, T.summaryIn, T.summaryIn + 16, easeOut);
  const listScale = mix(1, 0.5, pull);
  const minutes = Math.round(mix(0, 41 * 60 + 12, progress(frame, T.summaryIn, T.summaryIn + 22, easeOut)));

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: CONTENT_TOP + 8,
          left: 20,
          right: 20,
          height: 30,
          display: "flex",
          alignItems: "center",
          fontFamily: FONT,
          fontSize: 16,
        }}
      >
        <span style={{ fontWeight: 700 }}>Replay</span>
        <span style={{ color: COLORS.igSecondary, marginLeft: 8 }}>Last 30 days</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: COLORS.igSecondary, fontVariantNumeric: "tabular-nums" }}>
          {Math.round(mix(1, 1284, Math.min(1, scrollP * 1.05))).toLocaleString("en-US")} Reels
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: REEL.top,
          left: 20,
          width: REEL.w,
          height: CONTENT_BOTTOM - REEL.top,
          overflow: pull > 0 ? "visible" : "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: REEL.w,
            transformOrigin: `${REEL.w / 2}px ${offset}px`,
            transform: `translateY(${-offset}px) scale(${listScale})`,
          }}
        >
          {REEL_SEQUENCE.map((cat, i) => {
            const y = i * (REEL.h + REEL.gap);
            if (y - offset > CONTENT_BOTTOM || y - offset + REEL.h < -REEL.top) return null;
            const isStop = i === STOP_INDEX;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: y,
                  left: 0,
                  opacity: isStop ? 1 : 1 - pull,
                }}
              >
                <ReelCard
                  index={cat}
                  width={REEL.w}
                  height={REEL.h}
                  variant={i}
                  handle={HANDLES[cat]}
                  radius={20}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: REEL.top + REEL.h * 0.5 + 26,
          left: 20,
          width: SCREEN.w - 40,
          fontFamily: FONT,
          opacity: summary,
          transform: `translateY(${(1 - summary) * 24}px)`,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.1, color: COLORS.igSecondary }}>
          ATTENTION SUMMARY
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
          <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: -1.4, fontVariantNumeric: "tabular-nums" }}>
            {Math.floor(minutes / 60)}h {minutes % 60}m
          </span>
          <span style={{ fontSize: 16, color: COLORS.igSecondary }}>watched in Reels</span>
        </div>
        <div style={{ display: "flex", gap: 3, marginTop: 14, height: 16 }}>
          {WATCHED.map((v, i) => (
            <div
              key={i}
              style={{
                width: `${v * progress(frame, T.summaryIn + 6 + i * 2, T.summaryIn + 20 + i * 2, easeOut)}%`,
                background: CATEGORIES[i].color,
                borderRadius: 5,
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 16 }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: CATEGORIES[0].color }} />
          <span>
            Most watched: <b>Beauty</b>
          </span>
        </div>
      </div>
    </>
  );
};

// ——— Scenes 3–5: "What you watched" ⇄ "What you want more of" ———————————

const ChartPage: React.FC<{
  kind: "watched" | "wanted";
  values: number[];
  labels: number[];
  reveal: number;
  labelOpacity: number;
  legendReveal: number[];
  emphasis?: number[];
  trend?: ("up" | "down" | null)[];
  sectorOpacity?: number[];
  boundary?: { index: number; strength: number };
  children?: React.ReactNode;
}> = ({ kind, values, labels, reveal, labelOpacity, legendReveal, emphasis, trend, sectorOpacity, boundary, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN.w, height: SCREEN.h }}>
    <PageTitle kind={kind} title={kind === "watched" ? "What you watched" : "What you want more of"} />
    <div style={{ position: "absolute", left: CHART.cx - CHART.r - 40, top: CHART.cy - CHART.r - 40 }}>
      <PieChart
        id={kind}
        values={values}
        radius={CHART.r}
        reveal={reveal}
        labels={labelOpacity > 0 ? labels : undefined}
        labelSize={18}
        sectorOpacity={sectorOpacity}
        boundary={boundary}
        labelOpacity={labelOpacity}
      />
    </div>
    <Legend values={labels} reveal={legendReveal} emphasis={emphasis} trend={trend} />
    {children}
  </div>
);

type Touch = { x: number; y: number; opacity: number; press: number; ripple?: number };

const touchAt = (frame: number): Touch => {
  const tab = navTabCenter("algo");
  if (frame < T.algoOpenEnd + 8) {
    return {
      x: tab.x,
      y: tab.y,
      opacity: progress(frame, T.homeTouchIn, T.homeTouchIn + 6) * (1 - progress(frame, T.tabTap + 8, T.tabTap + 14)),
      press: progress(frame, T.tabTap - 4, T.tabTap) - progress(frame, T.tabTap + 3, T.tabTap + 7),
      ripple: progress(frame, T.tabTap, T.tabTap + 13, easeOut),
    };
  }
  if (frame < T.swipeCueEnd + 10) {
    const out = progress(frame, T.swipeCueStart + 2, T.swipeCueStart + 14);
    return {
      x: 300 - 70 * out,
      y: CHART.cy + 20,
      opacity:
        progress(frame, T.swipeCueStart - 6, T.swipeCueStart) * (1 - progress(frame, T.swipeCueStart + 18, T.swipeCueStart + 26)),
      press: progress(frame, T.swipeCueStart - 2, T.swipeCueStart + 2) * (1 - progress(frame, T.swipeCueStart + 14, T.swipeCueStart + 18)),
    };
  }
  if (frame < T.release + 12) {
    const swipe = progress(frame, T.swipeStart, T.swipeEnd, easeInOut);
    const toB = progress(frame, T.touchToBoundaryStart, T.touchToBoundaryEnd, easeInOut);
    const b = boundaryPoint(dragAmountAt(frame));
    const swipeX = mix(330, 90, swipe);
    const swipeY = CHART.cy + 20;
    return {
      x: frame < T.touchToBoundaryStart ? swipeX : mix(swipeX, b.x, toB),
      y: frame < T.touchToBoundaryStart ? swipeY : mix(swipeY, b.y, toB),
      opacity: progress(frame, T.swipeStart - 8, T.swipeStart - 2) * (1 - progress(frame, T.release + 4, T.release + 12)),
      press:
        progress(frame, T.swipeStart - 3, T.swipeStart) * (1 - progress(frame, T.swipeEnd - 2, T.swipeEnd + 2)) +
        progress(frame, T.grab - 3, T.grab + 1) * (1 - progress(frame, T.release - 2, T.release + 2)),
    };
  }
  const btn = { x: SCREEN.w / 2 + 40, y: CHART.buttonTop + CHART.buttonH / 2 };
  const move = progress(frame, T.touchToButtonStart, T.touchToButtonEnd, easeInOut);
  return {
    x: mix(btn.x + 40, btn.x, move),
    y: mix(btn.y + 110, btn.y, move),
    opacity: progress(frame, T.touchToButtonStart - 4, T.touchToButtonStart + 4) * (1 - progress(frame, T.applyTap + 8, T.applyTap + 14)),
    press: progress(frame, T.applyTap - 4, T.applyTap) - progress(frame, T.applyTap + 3, T.applyTap + 7),
    ripple: progress(frame, T.applyTap, T.applyTap + 13, easeOut),
  };
};

export const PhoneStage: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= T.phoneOutEnd) return null;

  // Camera: a restrained push during the reel scroll, pulled back for the
  // summary; a slight lean-in on the chart while it is being edited.
  const reelZoom = progress(frame, T.reelsStart, T.reelsIn + 6, easeInOut) * (1 - progress(frame, T.pullBackStart, T.pullBackEnd, easeInOut));
  const editZoom = progress(frame, T.touchToBoundaryStart, T.dragStart + 10, easeInOut) * (1 - progress(frame, T.release, T.buttonIn + 12, easeInOut));
  const out = progress(frame, T.heroStart, T.heroStart + 10, easeInOut);
  const chartCanvas = screenToCanvas(CHART.cx, CHART.cy);
  const zoom = (1 + 0.07 * reelZoom) * (1 + 0.035 * editZoom) * (1 - 0.08 * out);
  const origin =
    frame < T.chartPageIn
      ? { x: PHONE.x + PHONE.w / 2, y: PHONE.y + PHONE.h * 0.52 }
      : chartCanvas;

  // Screen phases
  const open = progress(frame, T.algoOpenStart, T.algoOpenEnd, easeOut);
  const introOut = progress(frame, T.reelsStart, T.reelsIn, easeInOut);
  const reelsIn = progress(frame, T.reelsStart + 2, T.reelsIn, easeOut);
  const reelsOut = progress(frame, T.chartPageIn, T.chartPageIn + 10, easeInOut);
  const pageIn = progress(frame, T.chartPageIn + 2, T.chartPageIn + 12, easeOut);

  // Chart pager
  const cue = progress(frame, T.swipeCueStart + 2, T.swipeCueStart + 14, easeInOut) - progress(frame, T.swipeCueStart + 20, T.swipeCueEnd, easeInOut);
  const swipe = progress(frame, T.swipeStart, T.swipeEnd, easeInOut);
  const pagerX = -SCREEN.w * swipe - 46 * cue;

  const reveal = progress(frame, T.chartDrawStart, T.chartDrawEnd, Easing.bezier(0.4, 0, 0.2, 1));
  const legendReveal = CATEGORIES.map((_, i) =>
    progress(frame, T.legendStart + i * T.legendStagger, T.legendStart + i * T.legendStagger + 10, easeOut),
  );
  const labelOpacity = progress(frame, T.legendStart, T.legendStart + 12);

  const amount = dragAmountAt(frame);
  const wanted = rebalance(WATCHED, amount);
  const wantedLabels = rebalanceLabels(WATCHED, amount);
  const grab = progress(frame, T.grab - 3, T.grab + 3) * (1 - progress(frame, T.release, T.release + 8));
  const travelE =
    progress(frame, T.travelEmphasisStart - 4, T.travelEmphasisStart + 6) * (1 - progress(frame, T.travelEmphasisEnd - 3, T.travelEmphasisEnd + 5));
  const beautyE =
    progress(frame, T.beautyEmphasisStart - 3, T.beautyEmphasisStart + 6) * (1 - progress(frame, T.beautyEmphasisEnd - 2, T.beautyEmphasisEnd + 8));
  const dimOthers = 1 - 0.22 * grab;
  const edited = frame >= T.dragStart;

  const touch = touchAt(frame);
  const algoActive = frame >= T.tabTap;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 1 - out,
        transformOrigin: `${origin.x}px ${origin.y}px`,
        transform: `scale(${zoom})`,
      }}
    >
      <Phone>
        <StatusBar />
        {open < 1 ? (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - open }}>
            <HomeFeed />
          </div>
        ) : null}
        {open > 0 ? (
          <div style={{ position: "absolute", inset: 0, opacity: open, fontFamily: FONT }}>
            <AlgoHeader />
            {introOut < 1 ? (
              <div style={{ position: "absolute", inset: 0, opacity: 1 - introOut }}>
                <WrappedIntro frame={frame} />
              </div>
            ) : null}
            {reelsIn > 0 && reelsOut < 1 ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: SCREEN.w,
                  height: CONTENT_BOTTOM,
                  overflow: "hidden",
                  opacity: reelsIn * (1 - reelsOut),
                }}
              >
                <ReelsReplay frame={frame} />
              </div>
            ) : null}
            {pageIn > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: SCREEN.w,
                  height: CONTENT_BOTTOM,
                  overflow: "hidden",
                  opacity: pageIn,
                  transform: `translateY(${(1 - pageIn) * 14}px)`,
                }}
              >
                <div style={{ position: "absolute", left: pagerX, top: 0, width: SCREEN.w * 2, height: SCREEN.h }}>
                  <ChartPage
                    kind="watched"
                    values={WATCHED}
                    labels={WATCHED}
                    reveal={reveal}
                    labelOpacity={labelOpacity}
                    legendReveal={legendReveal}
                  />
                  <div style={{ position: "absolute", left: SCREEN.w, top: 0 }}>
                    <ChartPage
                      kind="wanted"
                      values={wanted}
                      labels={wantedLabels}
                      reveal={1}
                      labelOpacity={1}
                      legendReveal={[1, 1, 1, 1, 1]}
                      emphasis={[beautyE, travelE, 0, 0, 0]}
                      trend={edited ? ["down", "up", null, null, null] : undefined}
                      sectorOpacity={[1, 1, dimOthers, dimOthers, dimOthers]}
                      boundary={{ index: 0, strength: grab }}
                    >
                      <ApplyButton
                        reveal={progress(frame, T.buttonIn, T.buttonIn + 12, easeOut)}
                        press={progress(frame, T.applyTap - 4, T.applyTap) - progress(frame, T.applyTap + 3, T.applyTap + 7)}
                        done={progress(frame, T.applyTap + 4, T.applyTap + 6)}
                      />
                    </ChartPage>
                  </div>
                </div>
                <PageDots position={swipe + cue * 0.12} />
              </div>
            ) : null}
            {frame >= T.sheetIn ? <ConfirmSheet progress={progress(frame, T.sheetIn, T.sheetIn + 13, easeOut)} /> : null}
          </div>
        ) : null}
        <NewTabTooltip
          x={navTabCenter("algo").x}
          opacity={progress(frame, T.tooltipIn, T.tooltipIn + 8, easeOut) * (1 - progress(frame, T.tabTap, T.tabTap + 6, easeIn))}
        />
        <BottomNav
          active={algoActive ? "algo" : "home"}
          newHighlight={1 - progress(frame, T.tabTap, T.tabTap + 8)}
          algoPress={progress(frame, T.tabTap - 4, T.tabTap) - progress(frame, T.tabTap + 3, T.tabTap + 7)}
        />
        <TouchIndicator {...touch} />
      </Phone>
    </div>
  );
};
