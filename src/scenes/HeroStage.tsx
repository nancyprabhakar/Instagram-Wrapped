import React from "react";
import { useCurrentFrame } from "remotion";
import { PieChart } from "../components/PieChart";
import { ReelCard } from "../components/ReelCard";
import { gradientText } from "../components/Typography";
import { CANVAS, CATEGORIES, COLORS, FONT, WANTED, WATCHED } from "../theme";
import { CHART, screenToCanvas } from "../layout";
import { T } from "../timing";
import { CLOSING_LINES } from "../script";
import { easeIn, easeInOut, easeOut, easeOutBack, mix, progress } from "../lib/anim";
import { polar, toSectors } from "../lib/pie";

type Pose = { x: number; y: number; r: number; o: number };
type Key = { at: number; view: Pose; value: Pose };

const fromPhone = screenToCanvas(CHART.cx, CHART.cy);
const COMPARE = { y: 770, r: 196, left: 300, right: 780 };
const ECHO = { x: 540, y: 760, r: 190 };
const CONTRAST = { y: 780, r: 158, left: 330, right: 750 };
const QUIET = { y: 1060, r: 112, left: 360, right: 720 };
const END = { y: 655, r: 150, left: 300, right: 780 };

/** Chart poses over time; consecutive keys are eased between. */
const KEYS: Key[] = [
  // VIEW starts hidden directly behind VALUE and slides out from underneath it.
  { at: T.heroStart, view: { x: fromPhone.x, y: fromPhone.y, r: CHART.r, o: 1 }, value: { x: fromPhone.x, y: fromPhone.y, r: CHART.r, o: 1 } },
  { at: T.heroSplitEnd, view: { x: COMPARE.left, y: COMPARE.y, r: COMPARE.r, o: 1 }, value: { x: COMPARE.right, y: COMPARE.y, r: COMPARE.r, o: 1 } },
  { at: T.echoStart, view: { x: COMPARE.left, y: COMPARE.y, r: COMPARE.r, o: 1 }, value: { x: COMPARE.right, y: COMPARE.y, r: COMPARE.r, o: 1 } },
  { at: T.echoCardIn, view: { x: COMPARE.left, y: COMPARE.y + 20, r: COMPARE.r * 0.9, o: 0 }, value: { x: COMPARE.right, y: COMPARE.y + 20, r: COMPARE.r * 0.9, o: 0 } },
  { at: T.echoCardToPie, view: { x: ECHO.x, y: ECHO.y, r: ECHO.r, o: 1 }, value: { x: ECHO.x + 120, y: ECHO.y, r: CONTRAST.r, o: 0 } },
  { at: T.echoContrastIn, view: { x: ECHO.x, y: ECHO.y, r: ECHO.r, o: 1 }, value: { x: ECHO.x + 120, y: CONTRAST.y, r: CONTRAST.r, o: 0 } },
  { at: T.echoContrastIn + 18, view: { x: CONTRAST.left, y: CONTRAST.y, r: CONTRAST.r, o: 1 }, value: { x: CONTRAST.right, y: CONTRAST.y, r: CONTRAST.r, o: 1 } },
  { at: T.wantingStart - 4, view: { x: CONTRAST.left, y: CONTRAST.y, r: CONTRAST.r, o: 1 }, value: { x: CONTRAST.right, y: CONTRAST.y, r: CONTRAST.r, o: 1 } },
  { at: T.wantingStart + 16, view: { x: QUIET.left, y: QUIET.y, r: QUIET.r, o: 1 }, value: { x: QUIET.right, y: QUIET.y, r: QUIET.r, o: 1 } },
  { at: T.endStart, view: { x: QUIET.left, y: QUIET.y, r: QUIET.r, o: 1 }, value: { x: QUIET.right, y: QUIET.y, r: QUIET.r, o: 1 } },
  { at: T.holdStart - 12, view: { x: END.left, y: END.y, r: END.r, o: 1 }, value: { x: END.right, y: END.y, r: END.r, o: 1 } },
];

const poseAt = (frame: number, which: "view" | "value"): Pose => {
  if (frame <= KEYS[0].at) return KEYS[0][which];
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i];
    const b = KEYS[i + 1];
    if (frame <= b.at) {
      const t = progress(frame, a.at, b.at, easeInOut);
      const pa = a[which];
      const pb = b[which];
      return { x: mix(pa.x, pb.x, t), y: mix(pa.y, pb.y, t), r: mix(pa.r, pb.r, t), o: mix(pa.o, pb.o, t) };
    }
  }
  return KEYS[KEYS.length - 1][which];
};

const PlacedPie: React.FC<{
  id: string;
  pose: Pose;
  values: number[];
  dim?: number;
  labels?: boolean;
  sectorScale?: number[];
}> = ({ id, pose, values, dim = 1, labels, sectorScale }) => {
  if (pose.o <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: pose.x - pose.r - 40,
        top: pose.y - pose.r - 40,
        opacity: pose.o * dim,
      }}
    >
      <PieChart
        id={id}
        values={values}
        radius={pose.r}
        gap={Math.max(2, pose.r / 40)}
        gapColor={COLORS.paper}
        labels={labels ? values : undefined}
        labelSize={Math.round(pose.r * 0.135)}
        sectorScale={sectorScale}
      />
    </div>
  );
};

const SharedLegend: React.FC<{ y: number; opacity: number; size?: number }> = ({ y, opacity, size = 24 }) => (
  <div
    style={{
      position: "absolute",
      top: y,
      left: CANVAS.safe,
      width: CANVAS.width - CANVAS.safe * 2,
      display: "flex",
      justifyContent: "center",
      gap: 30,
      fontFamily: FONT,
      fontSize: size,
      fontWeight: 600,
      color: COLORS.ink,
      opacity,
    }}
  >
    {CATEGORIES.map((c) => (
      <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: size * 0.6, height: size * 0.6, borderRadius: "50%", background: c.color }} />
        {c.label}
      </div>
    ))}
  </div>
);

const Word: React.FC<{
  x: number;
  y: number;
  opacity: number;
  size: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, y, opacity, size, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: size,
      letterSpacing: "-0.04em",
      lineHeight: 1,
      color: COLORS.ink,
      whiteSpace: "nowrap",
      opacity,
      ...style,
    }}
  >
    {children}
  </div>
);

const SmallLabel: React.FC<{ x: number; y: number; opacity: number; children: React.ReactNode; size?: number }> = ({
  x,
  y,
  opacity,
  children,
  size = 25,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: "translateX(-50%)",
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: size,
      color: COLORS.inkSoft,
      whiteSpace: "nowrap",
      opacity,
    }}
  >
    {children}
  </div>
);

export const HeroStage: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.heroStart) return null;

  const view = poseAt(frame, "view");
  const value = poseAt(frame, "value");

  // Scene 6 — VIEW / VALUE comparison
  const compareIn = progress(frame, T.heroSplitEnd - 10, T.heroSplitEnd + 6, easeOut);
  const compareOut = progress(frame, T.echoStart, T.echoStart + 10, easeIn);
  const compare = compareIn * (1 - compareOut);
  const valueFocus = progress(frame, T.viewFocusEnd, T.viewFocusEnd + 12, easeInOut);
  const viewDim = mix(1, 0.55, valueFocus);
  // VALUE leaves the phone at full strength, steps back while VIEW is named, then takes focus.
  const valueDimEffective =
    frame < T.heroSplitEnd
      ? mix(1, 0.55, progress(frame, T.heroSplitEnd - 6, T.heroSplitEnd))
      : mix(0.55, 1, valueFocus);

  // Scene 7 — echo of the opening Beauty reel, then the contrast
  const echoIn = progress(frame, T.echoCardIn - 6, T.echoCardIn + 10, easeOut);
  const toPie = progress(frame, T.echoCardToPie - 6, T.echoCardToPie + 10, easeIn);
  const beautyTarget = polar(ECHO.x, ECHO.y, ECHO.r * 0.52, toSectors(WATCHED)[0].mid);
  const echoVisible = frame >= T.echoCardIn - 6 && frame < T.echoCardToPie + 12;
  const gatherScale = WATCHED.map((_, i) =>
    i === 0
      ? progress(frame, T.echoCardToPie + 2, T.echoCardToPie + 16, easeOutBack)
      : progress(frame, T.echoCardToPie + 8 + i * 2, T.echoCardToPie + 22 + i * 2, easeOutBack),
  );
  const contrastLabels = progress(frame, T.echoContrastIn + 10, T.echoContrastIn + 22, easeOut) * (1 - progress(frame, T.wantingStart - 6, T.wantingStart + 4));

  // Scene 8 — end card
  const endIn = progress(frame, T.endStart + 4, T.endStart + 22, easeOut);
  // The closing line waits until the charts have risen past it.
  const endLine = progress(frame, T.endStart + 26, T.endStart + 40, easeOut);
  const footer = progress(frame, T.endStart + 32, T.holdStart, easeOut);
  const endLabels = progress(frame, T.endStart + 20, T.holdStart - 6, easeOut);

  const cardW = 230;
  const cardH = 390;
  const cx = mix(ECHO.x, beautyTarget.x, toPie);
  const cy = mix(ECHO.y + (1 - echoIn) * 40, beautyTarget.y, toPie);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Scene 6 words */}
      {compare > 0 ? (
        <>
          <Word x={COMPARE.left} y={COMPARE.y - COMPARE.r - 92} size={104} opacity={compare * viewDim}>
            VIEW
          </Word>
          <Word x={540} y={COMPARE.y - COMPARE.r - 92} size={104} opacity={compare * 0.28} style={{ fontWeight: 300 }}>
            /
          </Word>
          <Word x={COMPARE.right} y={COMPARE.y - COMPARE.r - 92} size={104} opacity={compare * valueDimEffective} style={{ ...gradientText }}>
            VALUE
          </Word>
          <SmallLabel x={COMPARE.left} y={COMPARE.y + COMPARE.r + 30} opacity={compare * viewDim}>
            What you watched
          </SmallLabel>
          <SmallLabel x={COMPARE.right} y={COMPARE.y + COMPARE.r + 30} opacity={compare * valueDimEffective}>
            What you want more of
          </SmallLabel>
          <SharedLegend y={COMPARE.y + COMPARE.r + 104} opacity={compare} />
        </>
      ) : null}

      <PlacedPie
        id="hero-view"
        pose={view}
        values={WATCHED}
        dim={frame < T.echoStart ? viewDim : 1}
        labels={frame < T.echoStart || (frame >= T.echoPieSettle && frame < T.wantingStart)}
        sectorScale={frame >= T.echoCardIn && frame < T.echoContrastIn ? gatherScale : undefined}
      />
      <PlacedPie
        id="hero-value"
        pose={value}
        values={WANTED}
        dim={frame < T.echoStart ? valueDimEffective : 1}
        labels={frame < T.echoStart || (frame >= T.echoPieSettle && frame < T.wantingStart)}
      />

      {/* Scene 7 echo card */}
      {echoVisible ? (
        <div
          style={{
            position: "absolute",
            left: cx - cardW / 2,
            top: cy - cardH / 2,
            width: cardW,
            height: cardH,
            opacity: echoIn * (1 - progress(frame, T.echoCardToPie + 4, T.echoCardToPie + 12)),
            transform: `scale(${mix(1, 0.14, toPie)})`,
            borderRadius: 22,
            boxShadow: "0 30px 60px -24px rgba(40,28,14,0.45)",
          }}
        >
          <ReelCard index={0} width={cardW} height={cardH} radius={22} variant={0} tint={progress(frame, T.echoCardToPie - 6, T.echoCardToPie + 6)} />
        </div>
      ) : null}
      {contrastLabels > 0 ? (
        <>
          <SmallLabel x={CONTRAST.left} y={CONTRAST.y + CONTRAST.r + 28} opacity={contrastLabels}>
            What you watched
          </SmallLabel>
          <SmallLabel x={CONTRAST.right} y={CONTRAST.y + CONTRAST.r + 28} opacity={contrastLabels}>
            What you want more of
          </SmallLabel>
        </>
      ) : null}

      {/* Scene 8 end card */}
      {endIn > 0 ? (
        <>
          <Word
            x={540}
            y={300 + (1 - endIn) * 18}
            size={136}
            opacity={endIn}
            style={{ letterSpacing: "-0.035em" }}
          >
            VIEW <span style={{ fontWeight: 300, color: COLORS.inkMuted }}>/</span>{" "}
            <span style={gradientText}>VALUE</span>
          </Word>
          <SmallLabel x={END.left} y={END.y + END.r + 26} opacity={endLabels} size={23}>
            What you watched
          </SmallLabel>
          <SmallLabel x={END.right} y={END.y + END.r + 26} opacity={endLabels} size={23}>
            What you want more of
          </SmallLabel>
          <div
            style={{
              position: "absolute",
              left: CANVAS.safe,
              width: CANVAS.width - CANVAS.safe * 2,
              top: 948,
              textAlign: "center",
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 58,
              letterSpacing: "-0.035em",
              lineHeight: 1.08,
              color: COLORS.ink,
              opacity: endLine,
              transform: `translateY(${(1 - endLine) * 12}px)`,
            }}
          >
            {CLOSING_LINES.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: CANVAS.safe,
              width: CANVAS.width - CANVAS.safe * 2,
              top: 1166,
              textAlign: "center",
              fontFamily: FONT,
              opacity: footer,
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 600, color: COLORS.ink }}>
              Independent Instagram concept by Nancy Prabhakar
            </div>
            <div style={{ fontSize: 22, fontWeight: 500, color: COLORS.inkMuted, marginTop: 10 }}>
              Sample data · Proposed feature
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
