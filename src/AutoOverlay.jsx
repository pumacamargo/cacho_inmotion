import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Video } from '@remotion/media';
import { colorKey } from '@remotion/effects/color-key';
import { WaveUpText, CameraShake, Phase, FloatingReviews, DEFAULT_ACCENT } from './OverlayKit';
import { MascotOverlay } from './MascotOverlay';

const GS_KEY = colorKey({ keyColor: '#00b140', similarity: 0.35, smoothness: 0.1 });

// Fixed 5-card layout — LLM only provides username/stars/text
const REVIEW_POSITIONS = [
  { x: 20,  y: 100,  rotation: -5, delay: 0  },
  { x: 610, y: 80,   rotation: 4,  delay: 7  },
  { x: 110, y: 680,  rotation: -2, delay: 14 },
  { x: 30,  y: 1330, rotation: 6,  delay: 21 },
  { x: 590, y: 1360, rotation: -7, delay: 28 },
];

const RotatedFX = ({ src, startSec, endSec, fps, scale = 1 }) => {
  const startFrame = Math.round(startSec * fps);
  const durationFrames = Math.round((endSec - startSec) * fps);
  if (durationFrames <= 0) return null;
  return (
    <Sequence from={startFrame} durationInFrames={durationFrames}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <Video src={staticFile(src)} effects={[GS_KEY]} volume={0.25}
          style={{ position: 'absolute', left: '50%', top: '50%', width: 1920, height: 1080,
            transform: `translate(-50%, -50%) rotate(90deg) scale(${scale})`, transformOrigin: 'center center' }} />
      </div>
    </Sequence>
  );
};

const ScaledFX = ({ src, startSec, endSec, fps }) => {
  const startFrame = Math.round(startSec * fps);
  const durationFrames = Math.round((endSec - startSec) * fps);
  if (durationFrames <= 0) return null;
  return (
    <Sequence from={startFrame} durationInFrames={durationFrames}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <Video src={staticFile(src)} effects={[GS_KEY]} volume={0.25} style={{ width: 3413, height: 1920 }} />
      </div>
    </Sequence>
  );
};

export const AutoOverlay = ({
  videoFile = 'auto_base.mp4',
  duration = 30,
  hook = ['🔥'],
  features = [],
  reviews = [],
  fomo = { line1: '', line2: '' },
  cta = { showPrice: false, priceLine: '', discountLine: '', fomoLine: '' },
  mascotSegments = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Timing algorithm ──────────────────────────────────────────────────────
  const hookEnd   = 3.5;
  const featStart = 4;
  const numFeats  = Math.min(features.length, 4);
  const featEnd   = featStart + numFeats * 3;          // e.g. 16s for 4 features
  const speedEnd  = featEnd + 2.37;                    // speed lines FX
  const reviewStart = speedEnd;
  const fomoDur   = 4;
  const ctaDur    = 6;
  const reviewDur = Math.max(duration - reviewStart - fomoDur - ctaDur, 4);
  const reviewEnd = reviewStart + reviewDur;
  const fomoStart = reviewEnd;
  const fomoEnd   = fomoStart + fomoDur;
  const ctaFxEnd  = Math.min(fomoEnd + 1.83, duration - 2);
  const ctaTextStart = ctaFxEnd - 0.3;

  // Merge review text with fixed positions
  const mergedReviews = (reviews || []).slice(0, 5).map((r, i) => ({
    ...REVIEW_POSITIONS[i],
    username: r.username,
    stars: r.stars,
    text: r.text,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>

      {/* BASE VIDEO */}
      <AbsoluteFill>
        <OffthreadVideo src={staticFile(videoFile)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* ═══════ FASE 1 — HOOK ═══════ */}
      <RotatedFX src="greenscreen/anime/videos/gs_anime_20.mp4"
        startSec={0} endSec={3.17} fps={fps} scale={1.3} />

      <Phase frame={frame} fps={fps} startSec={0} endSec={hookEnd}>
        {({ localFrame }) => (
          <CameraShake frame={localFrame} amplitude={45} decayFrames={22}>
            {hook.map((line, i) => (
              <WaveUpText key={i}
                frame={localFrame} fps={fps} startSec={i * 0.3} endSec={hookEnd}
                glowColor={DEFAULT_ACCENT}
                style={{ top: hook.length === 1 ? 500 : 430 + i * 130, fontSize: 88 }}>
                {line}
              </WaveUpText>
            ))}
          </CameraShake>
        )}
      </Phase>

      {/* ═══════ FASE 2 — FEATURES ═══════ */}
      {features.slice(0, 4).map((feat, i) => {
        const s = featStart + i * 3;
        const e = s + 3;
        return (
          <React.Fragment key={i}>
            <WaveUpText frame={frame} fps={fps} startSec={s} endSec={e}
              style={{ top: 470, fontSize: 72 }}>
              {feat.line1}
            </WaveUpText>
            {feat.line2 ? (
              <WaveUpText frame={frame} fps={fps} startSec={s + 0.3} endSec={e}
                style={{ top: 590, fontSize: 72 }}>
                {feat.line2}
              </WaveUpText>
            ) : null}
          </React.Fragment>
        );
      })}

      {/* Speed lines transition */}
      <ScaledFX src="greenscreen/anime/videos/gs_anime_21.mp4"
        startSec={featEnd} endSec={speedEnd} fps={fps} />

      {/* FloatingReviews */}
      <Phase frame={frame} fps={fps} startSec={reviewStart} endSec={reviewEnd}>
        {({ localFrame, durationFrames, fps: f }) => {
          const exitStart = durationFrames - 8;
          const exitOpacity = localFrame >= exitStart ? 1 - (localFrame - exitStart) / 8 : 1;
          return (
            <div style={{ position: 'absolute', inset: 0, opacity: exitOpacity }}>
              <FloatingReviews frame={localFrame} fps={f} cardWidth={440} reviews={mergedReviews} />
            </div>
          );
        }}
      </Phase>

      {/* ═══════ FOMO ═══════ */}
      {fomo.line1 && (
        <WaveUpText frame={frame} fps={fps} startSec={fomoStart} endSec={fomoEnd}
          style={{ top: 470, fontSize: 76 }}>
          {fomo.line1}
        </WaveUpText>
      )}
      {fomo.line2 && (
        <WaveUpText frame={frame} fps={fps} startSec={fomoStart + 0.3} endSec={fomoEnd}
          style={{ top: 590, fontSize: 76 }}>
          {fomo.line2}
        </WaveUpText>
      )}

      {/* ═══════ FASE 3 — CTA ═══════ */}
      <RotatedFX src="greenscreen/anime/videos/gs_anime_18.mp4"
        startSec={fomoEnd} endSec={ctaFxEnd} fps={fps} />

      {cta.showPrice && cta.priceLine && (
        <WaveUpText frame={frame} fps={fps} startSec={ctaTextStart} endSec={duration}
          glowColor={DEFAULT_ACCENT}
          style={{ top: 430, fontSize: 120 }}>
          {cta.priceLine}
        </WaveUpText>
      )}

      {cta.showPrice && cta.discountLine && (
        <WaveUpText frame={frame} fps={fps} startSec={ctaTextStart + 0.5} endSec={duration}
          style={{ top: 600, fontSize: 52 }}>
          {cta.discountLine}
        </WaveUpText>
      )}

      {!cta.showPrice && cta.fomoLine && (
        <WaveUpText frame={frame} fps={fps} startSec={ctaTextStart} endSec={duration}
          glowColor={DEFAULT_ACCENT}
          style={{ top: 490, fontSize: 76 }}>
          {cta.fomoLine}
        </WaveUpText>
      )}

      {cta.showPrice && cta.fomoLine && (
        <WaveUpText frame={frame} fps={fps}
          startSec={Math.min(ctaTextStart + (cta.discountLine ? 3.5 : 2), duration - 2)}
          endSec={duration}
          glowColor={DEFAULT_ACCENT}
          style={{ top: cta.discountLine ? 730 : 600, fontSize: 56 }}>
          {cta.fomoLine}
        </WaveUpText>
      )}

      {/* ═══════ MASCOT (optional, purely additive) ═══════ */}
      {mascotSegments && mascotSegments.length > 0 && (
        <MascotOverlay mascotSegments={mascotSegments} />
      )}

    </AbsoluteFill>
  );
};
