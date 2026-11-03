import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FONT_FAMILY } from "./theme";

const WEIGHTS = ["400", "500", "600", "700", "800", "900"] as const;

export const fontsReady = Promise.all(
  WEIGHTS.map((weight) =>
    loadFont({
      family: FONT_FAMILY,
      url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`),
      weight,
      style: "normal",
    }),
  ),
);
