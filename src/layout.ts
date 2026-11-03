import { CANVAS } from "./theme";

/** Phone geometry on the 1080 × 1350 canvas. */
export const PHONE = {
  w: 452,
  h: 920,
  x: (CANVAS.width - 452) / 2,
  y: 372,
  bezel: 9,
  radius: 66,
} as const;

/** Instagram screen geometry, in screen-local pixels. */
export const SCREEN = {
  w: PHONE.w - PHONE.bezel * 2,
  h: PHONE.h - PHONE.bezel * 2,
  statusH: 46,
  headerH: 54,
  navH: 72,
} as const;

export const CONTENT_TOP = SCREEN.statusH + SCREEN.headerH;
export const CONTENT_BOTTOM = SCREEN.h - SCREEN.navH;

/** "Your algorithm" chart page, screen-local. */
export const CHART = {
  cx: SCREEN.w / 2,
  cy: CONTENT_TOP + 248,
  r: 132,
  legendTop: CONTENT_TOP + 404,
  dotsY: CONTENT_TOP + 550,
  buttonTop: CONTENT_TOP + 578,
  buttonH: 54,
} as const;

export const NAV_TABS = ["home", "search", "create", "reels", "algo", "profile"] as const;
export type NavTab = (typeof NAV_TABS)[number];

export const navTabCenter = (tab: NavTab) => {
  const i = NAV_TABS.indexOf(tab);
  const slot = SCREEN.w / NAV_TABS.length;
  return { x: slot * (i + 0.5), y: CONTENT_BOTTOM + 27 };
};

/** Converts a screen-local point to canvas coordinates (with the camera at rest). */
export const screenToCanvas = (x: number, y: number) => ({
  x: PHONE.x + PHONE.bezel + x,
  y: PHONE.y + PHONE.bezel + y,
});
