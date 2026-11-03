import { staticFile } from "remotion";
import { CATEGORIES, CategoryId } from "./theme";

export type ReelImage = {
  file: string;
  /** CSS object-position used when cropping to the card's aspect ratio. */
  position: string;
  handle: string;
};

/** Reel thumbnails per category; variant 0 is the category's "hero" image. */
export const REEL_IMAGES: Record<CategoryId, ReelImage[]> = {
  beauty: [
    { file: "beauty-lipgloss.jpg", position: "50% 40%", handle: "glow.lab" },
    { file: "beauty-mirror.jpg", position: "50% 30%", handle: "nina.fits" },
    { file: "beauty-haul.jpg", position: "45% 40%", handle: "haul.with.liv" },
    { file: "beauty-books.jpg", position: "18% 50%", handle: "rosie.reads" },
  ],
  travel: [{ file: "travel-lagoon.jpg", position: "50% 55%", handle: "kai.travels" }],
  food: [
    { file: "food-cookies.jpg", position: "50% 50%", handle: "maya.eats" },
    { file: "food-cafe.jpg", position: "50% 70%", handle: "maya.eats" },
  ],
  comedy: [
    { file: "comedy-dog.jpg", position: "45% 45%", handle: "lola.lols" },
    { file: "comedy-podcast.jpg", position: "45% 50%", handle: "unscripted.pod" },
  ],
  design: [{ file: "design-books.jpg", position: "50% 50%", handle: "studio.oro" }],
};

export const reelImage = (index: number, variant = 0): ReelImage => {
  const list = REEL_IMAGES[CATEGORIES[index].id];
  return list[variant % list.length];
};

export const reelSrc = (img: ReelImage) => staticFile(`reels/${img.file}`);

export const FEED_POST = {
  src: staticFile("reels/food-cafe.jpg"),
  position: "50% 72%",
  handle: "kai.travels",
  location: "Paris, France",
  caption: "croissants first, sightseeing later",
};
