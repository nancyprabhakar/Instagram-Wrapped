export const FONT_FAMILY = "Inter";
export const FONT = `${FONT_FAMILY}, "Helvetica Neue", Arial, sans-serif`;

export const COLORS = {
  paper: "#F5F0E8",
  paperDeep: "#ECE5DA",
  ink: "#141210",
  inkSoft: "#5E5852",
  inkMuted: "#8E8780",
  white: "#FFFFFF",
  igText: "#000000",
  igSecondary: "#737373",
  igDivider: "#DBDBDB",
  igSurface: "#EFEFEF",
  igBlue: "#0095F6",
  igBluePressed: "#1877F2",
  phoneBody: "#121212",
} as const;

export const IG_GRADIENT_STOPS = [
  "#FEDA75",
  "#FA7E1E",
  "#D62976",
  "#962FBF",
  "#4F5BD5",
] as const;

export const IG_GRADIENT_CSS = `linear-gradient(45deg, ${IG_GRADIENT_STOPS.join(", ")})`;
export const IG_GRADIENT_TEXT_CSS = `linear-gradient(90deg, #FA7E1E 0%, #D62976 45%, #962FBF 75%, #4F5BD5 100%)`;

export type CategoryId = "beauty" | "travel" | "food" | "comedy" | "design";

export type Category = {
  id: CategoryId;
  label: string;
  color: string;
  tint: string;
  // Text colour that keeps contrast when placed on top of `color`.
  onColor: string;
};

// Order matters: it is the slice order around the pie, clockwise from 12 o'clock.
export const CATEGORIES: Category[] = [
  { id: "beauty", label: "Beauty", color: "#8E3BF5", tint: "#EFE3FF", onColor: "#FFFFFF" },
  { id: "travel", label: "Travel", color: "#1F74F2", tint: "#E1EDFF", onColor: "#FFFFFF" },
  { id: "food", label: "Food", color: "#FF6A55", tint: "#FFE7E2", onColor: "#FFFFFF" },
  { id: "comedy", label: "Comedy", color: "#F7B500", tint: "#FFF3CC", onColor: "#2A1F00" },
  { id: "design", label: "Design", color: "#0FAE9E", tint: "#D9F5F1", onColor: "#FFFFFF" },
];

export const categoryColor = (id: CategoryId) =>
  CATEGORIES.find((c) => c.id === id)!.color;

// Sample data (fictional). Values are percentages in CATEGORIES order.
export const WATCHED: number[] = [45, 10, 25, 15, 5];
export const DRAG_AMOUNT = 25;
export const WANTED: number[] = [
  WATCHED[0] - DRAG_AMOUNT,
  WATCHED[1] + DRAG_AMOUNT,
  WATCHED[2],
  WATCHED[3],
  WATCHED[4],
];

export const CANVAS = { width: 1080, height: 1350, safe: 80 } as const;
