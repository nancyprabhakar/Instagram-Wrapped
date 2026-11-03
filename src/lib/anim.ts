import { Easing, interpolate } from "remotion";

export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);
// Gentle overshoot for UI elements entering — used sparingly.
export const easeOutBack = Easing.bezier(0.34, 1.32, 0.64, 1);

/** 0 → 1 progress between two frames, clamped, with optional easing. */
export const progress = (
  frame: number,
  start: number,
  end: number,
  easing: (t: number) => number = easeInOut,
) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Fades in over `fadeIn` frames from `start`, out over `fadeOut` frames before `end`. */
export const fadeWindow = (
  frame: number,
  start: number,
  end: number,
  fadeIn = 8,
  fadeOut = 8,
) =>
  Math.min(
    progress(frame, start, start + fadeIn, easeOut),
    1 - progress(frame, end - fadeOut, end, easeIn),
  );
