export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);

export const DURATION_IN_FRAMES = s(38);

/**
 * Every beat in the film, in frames. Scenes and captions read from here so the
 * whole edit can be retimed in one place.
 */
export const T = {
  // 0–4 s · Hook: Instagram home → new tab → reel cards gather into a pie
  wrappedWipeStart: s(0.45),
  wrappedWipeEnd: s(1.25),
  tooltipIn: s(0.2),
  homeTouchIn: s(0.55),
  tabTap: s(1.1),
  algoOpenStart: s(1.2),
  algoOpenEnd: s(1.6),
  cardsInStart: s(1.45),
  gatherStart: s(2.45),
  gatherEnd: s(3.45),

  // 4–9 s · Watch vs want: fluid reel scroll, pause, pull back to a summary
  reelsStart: s(3.95),
  reelsIn: s(4.35),
  scrollStart: s(4.1),
  scrollStop: s(7.0),
  pullBackStart: s(7.35),
  pullBackEnd: s(8.25),
  summaryIn: s(7.6),

  // 9–15 s · First chart
  chartPageIn: s(8.85),
  chartDrawStart: s(9.25),
  chartDrawEnd: s(10.35),
  legendStart: s(10.3),
  legendStagger: 5,
  swipeCueStart: s(13.3),
  swipeCueEnd: s(14.5),

  // 15–20 s · Swipe, grab the Beauty/Travel boundary, rebalance
  swipeStart: s(15.0),
  swipeEnd: s(15.65),
  touchToBoundaryStart: s(15.65),
  touchToBoundaryEnd: s(16.05),
  grab: s(16.15),
  dragStart: s(16.25),
  dragEnd: s(19.25),
  travelEmphasisStart: s(16.25),
  travelEmphasisEnd: s(17.85),
  beautyEmphasisStart: s(17.85),
  beautyEmphasisEnd: s(19.6),
  release: s(19.45),

  // 20–24 s · Apply
  buttonIn: s(20.15),
  touchToButtonStart: s(21.0),
  touchToButtonEnd: s(21.7),
  applyTap: s(21.85),
  sheetIn: s(22.15),

  // 24–28 s · VIEW vs VALUE hero comparison
  heroStart: s(24.0),
  phoneOutEnd: s(24.4),
  heroSplitEnd: s(25.1),
  viewFocusEnd: s(26.0),

  // 28–34 s · Echo + "watching isn't always wanting"
  echoStart: s(28.0),
  echoCardIn: s(28.45),
  echoCardToPie: s(29.6),
  echoPieSettle: s(30.35),
  echoContrastIn: s(30.4),
  wantingStart: s(31.2),

  // 34–38 s · End card (fully settled by holdStart)
  endStart: s(34.0),
  holdStart: s(35.6),
} as const;
