import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Sequence, Img, staticFile,
  useCurrentFrame, useVideoConfig, spring, interpolate,
} from 'remotion';
import {
  WaveUpText, CameraShake, Phase, FloatingReviews,
  DEFAULT_ACCENT, SHADOW,
} from './OverlayKit';

const REVIEWS = [
  { username: 'k***n',        stars: 5, text: '電車でYouTube見てたら隣の人に話しかけられた笑 最高すぎる😂', x: 20,  y: 100,  rotation: -5, delay: 0  },
  { username: 'ゲーマー勉',   stars: 5, text: 'Steam Deckと接続したら没入感やばい。62gで全然重くない',      x: 610, y: 80,   rotation: 4,  delay: 7  },
  { username: 'たくみ',        stars: 5, text: '1600ニット本当に明るい。昼間でもくっきり見える👓',           x: 110, y: 680,  rotation: -2, delay: 14 },
  { username: 'movie_junkie', stars: 5, text: '映画館いらない。どこでも147インチ体験できる🎬',              x: 30,  y: 1330, rotation: 6,  delay: 21 },
  { username: 'H***o',        stars: 5, text: '目が疲れにくいのが最高。毎日3時間使っても平気',              x: 590, y: 1360, rotation: -7, delay: 28 },
];

// ── Amazon comparison card + big red X ──────────────────────────────────────
const HookVisual = ({ frame, fps }) => {
  // Image slides in from right (0→1.5s)
  const imgEntrance = spring({ frame, fps, config: { damping: 14, stiffness: 120, mass: 0.8 } });
  const imgX = interpolate(imgEntrance, [0, 1], [400, 0], { extrapolateRight: 'clamp' });
  const imgOpacity = interpolate(imgEntrance, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

  // Red X slams in at frame 38 (~1.5s)
  const xEntrance = spring({ frame: Math.max(0, frame - 38), fps, config: { damping: 8, stiffness: 280, mass: 0.5 } });
  const xScale = interpolate(xEntrance, [0, 1], [2.5, 1], { extrapolateRight: 'clamp' });
  const xOpacity = interpolate(xEntrance, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

  // Price fades in at frame 60 (~2.4s)
  const priceOpacity = interpolate(frame, [60, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const priceY = interpolate(frame, [60, 75], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* Amazon comparison image */}
      <div style={{
        position: 'absolute',
        top: 260,
        left: '50%',
        transform: `translateX(calc(-50% + ${imgX}px))`,
        opacity: imgOpacity,
        width: 760,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.8)',
        border: '4px solid rgba(255,255,255,0.25)',
      }}>
        <Img
          src={staticFile('xreal_amazon_ref.jpg')}
          style={{ width: '100%', display: 'block' }}
        />
        {/* Dark overlay to make X and price more readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.35)',
        }} />
      </div>

      {/* Big red X — subida 230px (mitad de fontSize 460) desde el centro de la imagen */}
      <div style={{
        position: 'absolute',
        top: 410,
        left: '50%',
        transform: `translate(-50%, -50%) scale(${xScale})`,
        opacity: xOpacity,
        fontSize: 460,
        lineHeight: 1,
        color: '#FF1A1A',
        textShadow: '0 0 60px rgba(255,0,0,0.9), 4px 4px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000',
        fontWeight: 900,
        fontFamily: 'Arial Black, sans-serif',
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        ✕
      </div>

      {/* Current price below */}
      <div style={{
        position: 'absolute',
        bottom: 680,
        left: 0, right: 0,
        textAlign: 'center',
        opacity: priceOpacity,
        transform: `translateY(${priceY}px)`,
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(0,0,0,0.75)',
          borderRadius: 16,
          padding: '14px 48px',
          border: `3px solid ${DEFAULT_ACCENT}`,
        }}>
          <div style={{
            fontSize: 44,
            color: '#ccc',
            fontFamily: "'KeinannMaruPOPjp', sans-serif",
            textShadow: SHADOW,
          }}>
            TikTokなら
          </div>
          <div style={{
            fontSize: 110,
            fontWeight: 900,
            color: DEFAULT_ACCENT,
            fontFamily: "'KeinannMaruPOPjp', sans-serif",
            textShadow: `0 0 30px ${DEFAULT_ACCENT}, ${SHADOW}`,
            lineHeight: 1,
          }}>
            ¥43,980
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Main composition ─────────────────────────────────────────────────────────
export const XrealV4Overlay = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>

      {/* BASE VIDEO */}
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('xreal_v4_raw.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* ═══ HOOK (0–5s) — Amazon image + red X + price ═══ */}
      <Phase frame={frame} fps={fps} startSec={0} endSec={5}>
        {({ localFrame, fps: f }) => (
          <>
            <CameraShake frame={localFrame} amplitude={30} decayFrames={18}>
              <WaveUpText
                frame={localFrame} fps={f} startSec={0} endSec={5}
                glowColor="#FF4444"
                style={{ top: 120, fontSize: 80 }}
              >
                やばすぎる！😱
              </WaveUpText>
            </CameraShake>
            <HookVisual frame={localFrame} fps={f} />
          </>
        )}
      </Phase>

      {/* ═══ FEATURES (5–14s) ═══ */}
      <WaveUpText frame={frame} fps={fps} startSec={5} endSec={8}
        style={{ top: 470, fontSize: 74 }}>
        ⚡ わずか62g
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={5.3} endSec={8}
        style={{ top: 590, fontSize: 74 }}>
        超軽量デザイン
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={8} endSec={11}
        style={{ top: 470, fontSize: 70 }}>
        📺 147インチ相当
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={8.3} endSec={11}
        style={{ top: 590, fontSize: 70 }}>
        120Hz・没入体験
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={11} endSec={14}
        style={{ top: 470, fontSize: 70 }}>
        🎮 ゲーム・映画も
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={11.3} endSec={14}
        style={{ top: 590, fontSize: 70 }}>
        どこでもシネマ体験
      </WaveUpText>

      {/* ═══ REVIEWS (14–21s) ═══ */}
      <Phase frame={frame} fps={fps} startSec={14} endSec={21}>
        {({ localFrame, durationFrames, fps: f }) => {
          const exitStart = durationFrames - 8;
          const exitOpacity = localFrame >= exitStart
            ? 1 - (localFrame - exitStart) / 8
            : 1;
          return (
            <div style={{ position: 'absolute', inset: 0, opacity: exitOpacity }}>
              <FloatingReviews frame={localFrame} fps={f} cardWidth={440} reviews={REVIEWS} />
            </div>
          );
        }}
      </Phase>

      {/* ═══ PRICE REVEAL (21–24s) ═══ */}
      <WaveUpText frame={frame} fps={fps} startSec={21} endSec={24}
        glowColor={DEFAULT_ACCENT}
        style={{ top: 440, fontSize: 120 }}>
        ¥43,980
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={21.3} endSec={24}
        style={{ top: 610, fontSize: 58 }}>
        他では倍の価格
      </WaveUpText>

      {/* ═══ CTA (24–25s) ═══ */}
      <WaveUpText frame={frame} fps={fps} startSec={24} endSec={25}
        glowColor={DEFAULT_ACCENT}
        style={{ top: 490, fontSize: 62 }}>
        今すぐチェック🔥
      </WaveUpText>

    </AbsoluteFill>
  );
};
