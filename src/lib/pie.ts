export type Point = { x: number; y: number };

export type Sector = {
  index: number;
  value: number;
  /** Degrees clockwise from 12 o'clock. */
  start: number;
  end: number;
  mid: number;
};

/** Point on a circle, where 0° is 12 o'clock and angles increase clockwise. */
export const polar = (cx: number, cy: number, r: number, deg: number): Point => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

/** Converts values (any positive scale) into contiguous sectors covering 360°. */
export const toSectors = (values: number[]): Sector[] => {
  const total = values.reduce((a, b) => a + b, 0);
  let cursor = 0;
  return values.map((value, index) => {
    const sweep = total === 0 ? 0 : (value / total) * 360;
    const start = cursor;
    const end = cursor + sweep;
    cursor = end;
    return { index, value, start, end, mid: (start + end) / 2 };
  });
};

/** SVG path for a pie sector (or donut sector when innerR > 0). */
export const sectorPath = (
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
  innerR = 0,
): string => {
  const sweep = endDeg - startDeg;
  if (sweep <= 0.0001) return "";
  if (sweep >= 359.999) {
    // A full circle cannot be drawn with a single arc command.
    const outer = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
    if (innerR <= 0) return outer;
    return `${outer} M ${cx} ${cy - innerR} A ${innerR} ${innerR} 0 1 0 ${cx} ${cy + innerR} A ${innerR} ${innerR} 0 1 0 ${cx} ${cy - innerR} Z`;
  }
  const large = sweep > 180 ? 1 : 0;
  const p1 = polar(cx, cy, r, startDeg);
  const p2 = polar(cx, cy, r, endDeg);
  if (innerR <= 0) {
    return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y} Z`;
  }
  const q1 = polar(cx, cy, innerR, endDeg);
  const q2 = polar(cx, cy, innerR, startDeg);
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y} L ${q1.x} ${q1.y} A ${innerR} ${innerR} 0 ${large} 0 ${q2.x} ${q2.y} Z`;
};

/**
 * The Beauty/Travel rebalance. `amount` moves continuously from 0 to the full
 * drag; Beauty loses exactly what Travel gains, so the total never changes and
 * only the shared Beauty/Travel boundary moves.
 */
export const rebalance = (base: number[], amount: number): number[] => {
  const next = [...base];
  next[0] = base[0] - amount;
  next[1] = base[1] + amount;
  return next;
};

/**
 * Integer labels that always sum to 100. Rounding the shared transfer (rather
 * than each value independently) avoids momentary 99% / 101% totals.
 */
export const rebalanceLabels = (base: number[], amount: number): number[] => {
  const moved = Math.round(amount);
  return rebalance(base, moved).map((v) => Math.round(v));
};
