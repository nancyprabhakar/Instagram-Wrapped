import React from "react";

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
  style?: React.CSSProperties;
};

const Svg: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 24,
  color = "#000",
  strokeWidth = 2,
  style,
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", ...style }}
  >
    {children}
  </svg>
);

export const HomeIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path
      d="M3 10.6 12 3l9 7.6V21h-6.2v-5.6a2.8 2.8 0 0 0-5.6 0V21H3z"
      fill={p.filled ? p.color ?? "#000" : "none"}
    />
  </Svg>
);

export const SearchIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="7" />
    <path d="M16 16l5 5" />
  </Svg>
);

export const CreateIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <path d="M12 8v8M8 12h8" />
  </Svg>
);

export const ReelsIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5" />
    <path d="M2.75 8h18.5M8.5 2.9 11.4 8M14 2.9 16.9 8" />
    <path d="M10 11.3v6l5-3z" fill={p.color ?? "#000"} strokeWidth={1.2} />
  </Svg>
);

/** The proposed "Your algorithm" tab: an outline pie chart. */
export const PieTabIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v9h9" />
    {p.filled ? <path d="M12 3a9 9 0 0 1 9 9h-9z" fill={p.color ?? "#000"} /> : null}
  </Svg>
);

export const HeartIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path
      d="M12 20.2s-7.6-4.7-9.3-9.4C1.6 7.6 3.8 4.4 7.1 4.4c2 0 3.6 1.1 4.9 3 1.3-1.9 2.9-3 4.9-3 3.3 0 5.5 3.2 4.4 6.4-1.7 4.7-9.3 9.4-9.3 9.4z"
      fill={p.filled ? p.color ?? "#000" : "none"}
    />
  </Svg>
);

export const CommentIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M20.6 16.7A9 9 0 1 0 17.3 20l4.2 1.5z" />
  </Svg>
);

export const SendIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M21.5 2.5 2.6 9.4l7.7 3.4 3.3 8.7z" />
    <path d="M10.3 12.8 21.5 2.5" />
  </Svg>
);

export const BookmarkIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M19 21l-7-6-7 6V3.5h14z" />
  </Svg>
);

export const MoreIcon: React.FC<IconProps> = (p) => (
  <Svg {...p} strokeWidth={0}>
    <circle cx="5" cy="12" r="1.6" fill={p.color ?? "#000"} />
    <circle cx="12" cy="12" r="1.6" fill={p.color ?? "#000"} />
    <circle cx="19" cy="12" r="1.6" fill={p.color ?? "#000"} />
  </Svg>
);

export const ChevronDownIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);

export const BackIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M15 4l-8 8 8 8" />
  </Svg>
);

export const InfoIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5" />
    <circle cx="12" cy="7.6" r="0.6" fill={p.color ?? "#000"} />
  </Svg>
);

export const SlidersIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
    <circle cx="15" cy="7" r="2.2" />
    <circle cx="9" cy="17" r="2.2" />
  </Svg>
);

export const CalendarIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Svg>
);

export const CheckIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

export const ArrowIcon: React.FC<IconProps & { direction: "up" | "down" }> = ({
  direction,
  ...p
}) => (
  <Svg {...p}>
    {direction === "up" ? <path d="M12 19V5M6 11l6-6 6 6" /> : <path d="M12 5v14M6 13l6 6 6-6" />}
  </Svg>
);

export const PlusIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
