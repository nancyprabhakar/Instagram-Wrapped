# VIEW / VALUE

An animated product concept film, built with Remotion:
**what if Instagram had a Wrapped that showed where your scrolling time went, and let you say what you want to see next?**

The film runs inside a recreated Instagram session. The user taps a proposed **Your algorithm** tab (a pie-chart icon in the bottom navigation) and sees *What you watched*. They then swipe to *What you want more of*, drag the Beauty/Travel slice boundary, and apply the new mix to their feed.

> Independent Instagram concept by Nancy Prabhakar · Sample data · Proposed feature.
> Not affiliated with Instagram or Meta. All accounts, content and numbers are fictional.

| Deliverable | Path |
| --- | --- |
| Final film (1080 × 1350, 30 fps, 38 s, H.264 + AAC) | `out/view-value.mp4` |
| Cover image (1080 × 1350 PNG) | `out/view-value-cover.png` |

## Commands

```bash
npm install

npm run dev       # Remotion Studio preview (scrub the timeline in the browser)
npm run check     # TypeScript + chart-geometry / script-integrity checks
npm run render    # → out/view-value.mp4
npm run cover     # → out/view-value-cover.png
npm run stills    # QA stills for every scene → out/stills/
npm run build     # check + render + cover
```

Exact rerender commands:

```bash
npx remotion render src/index.ts ViewValue out/view-value.mp4
npx remotion still src/index.ts Cover out/view-value-cover.png --frame=0
```

On first render, Remotion downloads Chrome Headless Shell automatically. Rendering settings (H.264, CRF 16, yuv420p) are in `remotion.config.ts`.

## How it's built

```
src/
  timing.ts          every beat of the film, in frames (single place to retime)
  script.tsx         the full script as caption cues, with on-screen line breaks
  theme.ts           palette, category colours/order, sample data
  layout.ts          phone, screen and chart geometry
  lib/pie.ts         SVG sector maths + the Beauty/Travel rebalance
  lib/anim.ts        easing + frame-progress helpers
  components/
    PieChart.tsx     SVG pie generated from numeric values
    Captions.tsx     editorial caption track (outside the phone)
    Typography.tsx   WATCH / WANT accents, "Wrapped" gradient wipe
    instagram/*      status bar, header, Stories, feed post, bottom nav,
                     "Your algorithm" header, legend, page dots, button, sheet
    ReelCard.tsx     original abstract Reel artwork per category
    TouchIndicator.tsx, Phone.tsx, SoundEffects.tsx
  scenes/
    PhoneStage.tsx   the continuous Instagram session (0–24 s)
    HeroStage.tsx    VIEW / VALUE comparison, echo, end card (24–38 s)
  ViewValue.tsx      main composition
  Cover.tsx          cover image (frozen hook + "What you watched" chart)
scripts/
  check-chart-math.ts  frame-by-frame verification of the drag
  render-stills.mjs    bundles once, renders QA stills
  make-sfx.sh          synthesizes the UI sounds with ffmpeg
public/
  fonts/             Inter (from @fontsource/inter, SIL OFL)
  sfx/               original synthesized tap / swipe / tick / chime
```

### Chart interaction

- Each slice is an SVG path computed from its value (`sectorPath`, `toSectors`). The order is fixed: Beauty, Travel, Food, Comedy, Design, clockwise from 12 o'clock.
- The edit is one continuous value, `amount`, eased from 0 to 25. Beauty is `45 − amount` and Travel is `10 + amount`, so the total is always exactly 100. Only the shared Beauty/Travel boundary moves.
- Labels round the transferred amount rather than each value, so the displayed percentages also always add up to 100.
- The touch indicator is placed with `polar()` at the boundary's current angle, so it rides the real edge.
- `npm run check` verifies all of this on every frame of the drag. It also checks that the caption text matches the script word for word, in order.

### Audio

No voiceover. No text-to-speech service was configured, so the film is designed to work muted, with the complete script as captions. A few original synthesized UI sounds (tap, swipe, tick, chime) mark the interactions. There is no music.
