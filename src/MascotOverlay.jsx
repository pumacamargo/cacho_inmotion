import React from 'react';
import { Img, Sequence, staticFile, useVideoConfig } from 'remotion';
import { Video } from '@remotion/media';
import { colorKey } from '@remotion/effects/color-key';

// Verde real medido de los videos de mascota (no es el mismo tono que el GS_KEY
// de los FX de AutoOverlay.jsx — cada fuente de green screen puede variar). Con
// #00b140/0.35 quedaba halo azulado en los bordes; #2fb22c/0.30 lo redujo mucho
// sin lavar el azul de la gorra/short ni el naranja de la playera (probado sobre
// fondo blanco, 8 combinaciones). Si se sube un nuevo video de mascota con otro
// tono de verde, volver a medir el color real antes de asumir que este sirve.
const MASCOT_GS_KEY = colorKey({ keyColor: '#2fb22c', similarity: 0.30, smoothness: 0.1 });

// ── Tunable placement constants ──────────────────────────────────────────────
// Adjust these to reposition/resize the mascot without touching the JSX below.
// Uses the same px-margin / fraction-of-composition convention as
// AutoOverlay.jsx's REVIEW_POSITIONS (absolute px anchored to the 1080x1920 canvas).
export const MASCOT_WIDTH_FRACTION = 0.8; // mascot box width, as a fraction of composition width (~80%, 4x el tamaño original de 0.2)
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
//     url: string,       // LOCAL filename under public/ (see below -- not a remote URL)
//     type: 'image' | 'video',
//   }>
//
// Renders nothing if `mascotSegments` is empty/undefined.
//
// `url` must be a local filename already downloaded into public/ by the caller
// (overlay-server's downloadMascotAssets, mirroring how the main videoFile is
// handled) -- NOT a remote URL. Real-time effects (colorKey) only work reliably
// on same-origin/staticFile assets; a cross-origin fetch from the renderer's
// browser hits CORS and silently falls back to a mode with no effects support.
// This is exactly why AutoOverlay.jsx's own FX clips are bundled locally too.
//
// Chroma key: video segments get real-time green-screen removal via the same
// colorKey effect AutoOverlay.jsx uses for its own FX (@remotion/media's Video
// component supports an `effects` prop; there is no equivalent for `Img` in
// this Remotion version). Image segments must therefore already be pre-processed
// to a transparent background BEFORE upload — see uploadMascotAsset in ttchop2's
// databaseService.ts, which does this client-side at upload time.
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
                <Video
                  src={staticFile(seg.url)}
                  effects={[MASCOT_GS_KEY]}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <Img
                  src={staticFile(seg.url)}
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
