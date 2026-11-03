import React from "react";
import { s } from "./timing";
import { CATEGORIES } from "./theme";
import { Accent, Wipe } from "./components/Typography";

export type CaptionCue = {
  id: string;
  start: number;
  end: number;
  /** Plain text of the line — must match the script word for word. */
  text: string;
  lines: React.ReactNode[];
  size?: number;
  placement?: "top" | "center";
};

const travel = CATEGORIES[1].color;
const beauty = CATEGORIES[0].color;

/**
 * The full script, in order, as editorial captions. `text` is the canonical
 * wording; `lines` is how it is set on screen.
 */
export const CAPTIONS: CaptionCue[] = [
  {
    id: "hook",
    start: 0,
    end: s(3.9),
    text: "What if your Instagram had a Wrapped?",
    size: 84,
    lines: [
      "What if your Instagram",
      <>
        had a <Wipe start={s(0.45)} end={s(1.25)}>Wrapped?</Wipe>
      </>,
    ],
  },
  {
    id: "knows",
    start: s(4.0),
    end: s(6.3),
    text: "Your algorithm knows what you watch.",
    size: 78,
    lines: [
      "Your algorithm knows",
      <>
        what you <Accent kind="watch">watch.</Accent>
      </>,
    ],
  },
  {
    id: "want",
    start: s(6.4),
    end: s(8.85),
    text: "But does it know what you want to watch?",
    size: 78,
    lines: [
      "But does it know what",
      <>
        you <Accent kind="want" revealAt={s(6.95)}>want</Accent> to watch?
      </>,
    ],
  },
  {
    id: "imagine",
    start: s(8.95),
    end: s(12.1),
    text: "Imagine seeing exactly where your scrolling time goes.",
    size: 70,
    lines: ["Imagine seeing exactly", "where your scrolling", "time goes."],
  },
  {
    id: "say",
    start: s(12.2),
    end: s(15.7),
    text: "Then getting a say in what comes next.",
    size: 78,
    lines: ["Then getting a say", "in what comes next."],
  },
  {
    id: "more",
    start: s(15.8),
    end: s(17.8),
    text: "More of this.",
    size: 104,
    lines: [
      <>
        More of <span style={{ color: travel }}>this.</span>
      </>,
    ],
  },
  {
    id: "less",
    start: s(17.85),
    end: s(20.0),
    text: "Less of that.",
    size: 104,
    lines: [
      <>
        Less of <span style={{ color: beauty }}>that.</span>
      </>,
    ],
  },
  {
    id: "adjust",
    start: s(20.1),
    end: s(21.85),
    text: "Adjust the mix.",
    size: 96,
    lines: ["Adjust the mix."],
  },
  {
    id: "apply",
    start: s(21.9),
    end: s(23.95),
    text: "Apply it to your feed.",
    size: 96,
    lines: ["Apply it to", "your feed."],
  },
  {
    id: "view",
    start: s(24.05),
    end: s(25.95),
    text: "See what you view.",
    size: 92,
    lines: ["See what you view."],
  },
  {
    id: "value",
    start: s(26.0),
    end: s(27.95),
    text: "And what you value.",
    size: 92,
    lines: ["And what you value."],
  },
  {
    id: "personality",
    start: s(28.05),
    end: s(31.1),
    text: "Because somewhere between one video and your entire personality…",
    size: 62,
    lines: ["Because somewhere between", "one video and your", "entire personality…"],
  },
  {
    id: "wanting",
    start: s(31.2),
    end: s(33.85),
    text: "watching isn't always wanting.",
    size: 118,
    placement: "center",
    lines: [
      <Accent kind="watch">watching</Accent>,
      "isn’t always",
      <Accent kind="want">wanting.</Accent>,
    ],
  },
];

/** The closing line is set by the end card, not the caption track. */
export const CLOSING_LINES = ["Give your algorithm", "some direction."];
export const CLOSING_LINE = CLOSING_LINES.join(" ");
