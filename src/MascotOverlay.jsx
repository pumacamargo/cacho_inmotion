import React from 'react';
import { Img, OffthreadVideo, Sequence, useVideoConfig } from 'remotion';

// ── Tunable placement constants ──────────────────────────────────────────────
// Adjust these to reposition/resize the mascot without touching the JSX below.
// Uses the same px-margin / fraction-of-composition convention as
// AutoOverlay.jsx's REVIEW_POSITIONS (absolute px anchored to the 1080x1920 canvas).
export const MASCOT_WIDTH_FRACTION = 0.2; // mascot box width, as a fraction of composition width (~20%)
export const MASCOT_MARGIN_PX = 40; // margin from the screen edge, in px
export const MASCOT_CORNER = 'bottom-right'; // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'

const cornerStyle = (corner, margin) => {
  switch (corner) {
    case 'bottom-left':
      return { left: margin, bottom: margin };
    case 'top-right':
      return { top: margin, right: margin };
    case 'top-left':
      return { top: margin, left: margin };
    case 'bottom-right':
    default:
      return { right: margin, bottom: margin };
  }
};

// MascotOverlay — corner-mounted "reaction mascot" that switches between an
// image or a short video clip depending on which emotion segment is active at
// the current point in the voiceover timeline. The segment list itself
// (start/end times, which asset to show) is produced elsewhere; this
// component only handles mounting/positioning/rendering.
//
// Props:
//   mascotSegments: Array<{
//     startSec: number,  // seconds from composition start
//     endSec: number,    // seconds from composition start
//     url: string,       // resolved URL/src for the image or video asset
//     type: 'image' | 'video',
//   }>
//
// Renders nothing if `mascotSegments` is empty/undefined.
export const MascotOverlay = ({ mascotSegments = [] }) => {
  const { fps, width } = useVideoConfig();
  const size = Math.round(width * MASCOT_WIDTH_FRACTION);

  return (
    <>
      {mascotSegments.map((seg, i) => {
        const startFrame = Math.round(seg.startSec * fps);
        const durationFrames = Math.round((seg.endSec - seg.startSec) * fps);
        if (durationFrames <= 0) return null;
        return (
          <Sequence key={i} from={startFrame} durationInFrames={durationFrames}>
            <div
              style={{
                position: 'absolute',
                ...cornerStyle(MASCOT_CORNER, MASCOT_MARGIN_PX),
                width: size,
                height: size,
                pointerEvents: 'none',
              }}
            >
              {seg.type === 'video' ? (
                <OffthreadVideo
                  src={seg.url}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <Img
                  src={seg.url}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              )}
            </div>
          </Sequence>
        );
      })}
    </>
  );
};
