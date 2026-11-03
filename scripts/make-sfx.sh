#!/usr/bin/env bash
# Synthesizes the original UI sounds in public/sfx with ffmpeg (no samples, no music).
set -euo pipefail
cd "$(dirname "$0")/../public/sfx"
FMT="aformat=sample_rates=48000:channel_layouts=stereo"

# Tap: two short sine partials with a fast exponential decay.
ffmpeg -y -loglevel error -f lavfi -i "sine=f=1650:d=0.07" -f lavfi -i "sine=f=820:d=0.07" \
  -filter_complex "[0][1]amix=inputs=2:normalize=0,afade=t=out:st=0.005:d=0.065:curve=exp,volume=2.6,$FMT" tap.wav

# Swipe: band-limited pink noise with a soft swell.
ffmpeg -y -loglevel error -f lavfi -i "anoisesrc=d=0.42:c=pink:a=1" \
  -af "highpass=f=700,lowpass=f=5200,afade=t=in:d=0.16:curve=qsin,afade=t=out:st=0.16:d=0.26:curve=qsin,volume=1.6,$FMT" swipe.wav

# Confirm chime: a rising fifth (A5 → E6).
ffmpeg -y -loglevel error -f lavfi -i "sine=f=880:d=0.9" -f lavfi -i "sine=f=1318.5:d=0.9" \
  -filter_complex "[1]adelay=90|90[b];[0][b]amix=inputs=2:normalize=0,afade=t=out:st=0.02:d=0.85:curve=exp,volume=2.6,$FMT" chime.wav

# Tick: a very short high click for grab / release.
ffmpeg -y -loglevel error -f lavfi -i "sine=f=2400:d=0.03" \
  -af "afade=t=out:d=0.03,volume=2.2,$FMT" tick.wav
