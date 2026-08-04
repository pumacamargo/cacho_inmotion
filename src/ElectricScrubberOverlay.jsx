import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Video } from '@remotion/media';
import { colorKey } from '@remotion/effects/color-key';
import {
  WaveUpText, CameraShake, Phase, FloatingReviews,
  GalleryGrid, DEFAULT_ACCENT,
} from './OverlayKit';

const GS_KEY = colorKey({ keyColor: '#00b140', similarity: 0.35, smoothness: 0.1 });

const REVIEWS = [
  { username: 'R***R',       stars: 5, text: '力を入れなくても掃除が楽になりました😊',          x: 20,  y: 100,  rotation: -5, delay: 0  },
  { username: 'ᗰ***I',       stars: 5, text: '2000円でこのクオリティ！使うのが楽しみ✨',         x: 610, y: 80,   rotation: 4,  delay: 7  },
  { username: 'きれい好き',  stars: 5, text: 'お風呂タイルがピカピカに！7種のブラシが便利すぎ🧽', x: 110, y: 680,  rotation: -2, delay: 14 },
  { username: '主婦歴10年',  stars: 4, text: '充電式で場所を選ばない！コスパ最高',               x: 30,  y: 1330, rotation: 6,  delay: 21 },
  { username: 'kalpa',       stars: 5, text: 'Very useful product i love it 👍',               x: 590, y: 1360, rotation: -7, delay: 28 },
];

const GALLERY = [
  staticFile('carousel/scrubber_01.webp'),
  staticFile('carousel/scrubber_02.webp'),
  staticFile('carousel/scrubber_03.webp'),
  staticFile('carousel/scrubber_04.webp'),
  staticFile('carousel/scrubber_05.webp'),
  staticFile('carousel/scrubber_06.webp'),
];

// Landscape green-screen MP4 rotated 90° to fill portrait canvas
const RotatedFX = ({ src, startSec, endSec, fps, scale = 1 }) => {
  const startFrame = Math.round(startSec * fps);
  const durationFrames = Math.round((endSec - startSec) * fps);
  return (
    <Sequence from={startFrame} durationInFrames={durationFrames}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <Video
          src={staticFile(src)}
          effects={[GS_KEY]}
          volume={0.25}
          style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: 1920, height: 1080,
            transform: `translate(-50%, -50%) rotate(90deg) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        />
      </div>
    </Sequence>
  );
};

// Landscape green-screen MP4 scaled to canvas width, centered (no rotation)
const ScaledFX = ({ src, startSec, endSec, fps }) => {
  const startFrame = Math.round(startSec * fps);
  const durationFrames = Math.round((endSec - startSec) * fps);
  return (
    <Sequence from={startFrame} durationInFrames={durationFrames}>
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <Video
          src={staticFile(src)}
          effects={[GS_KEY]}
          volume={0.25}
          style={{ width: 3413, height: 1920 }}
        />
      </div>
    </Sequence>
  );
};

export const ElectricScrubberOverlay = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>

      {/* BASE VIDEO */}
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('scrubber_1.3x.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* ═══════════════════════════════════════
          FASE 1 — HOOK (0–3s)
          ═══════════════════════════════════════ */}

      {/* ═══════ FASE 1 — HOOK (0–3s) ═══════ */}

      {/* FX speed burst radial naranja — scale 1.3 centrado */}
      <RotatedFX
        src="greenscreen/anime/videos/gs_anime_20.mp4"
        startSec={0} endSec={3.17} fps={fps} scale={1.3}
      />

      <Phase frame={frame} fps={fps} startSec={0} endSec={3.5}>
        {({ localFrame }) => (
          <CameraShake frame={localFrame} amplitude={45} decayFrames={22}>
            <WaveUpText
              frame={localFrame} fps={fps} startSec={0} endSec={3.5}
              glowColor={DEFAULT_ACCENT}
              style={{ top: 480, fontSize: 90 }}
            >
              これ、マジで最高。🔥
            </WaveUpText>
          </CameraShake>
        )}
      </Phase>

      {/* ═══════ FASE 2 — PRODUCTO (4–26s) ═══════ */}

      <WaveUpText frame={frame} fps={fps} startSec={4} endSec={7}
        style={{ top: 500, fontSize: 72 }}>
        🧽 7種類のブラシヘッド
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={7} endSec={10}
        style={{ top: 500, fontSize: 72 }}>
        🔋 USB充電・コードレス
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={10} endSec={13}
        style={{ top: 500, fontSize: 72 }}>
        💡 LEDディスプレイ搭載
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={13} endSec={16}
        style={{ top: 500, fontSize: 64 }}>
        ⭐ 4.1評価 538件
      </WaveUpText>

      {/* FX speed lines border — sin rotar, transición */}
      <ScaledFX
        src="greenscreen/anime/videos/gs_anime_21.mp4"
        startSec={16} endSec={18.37} fps={fps}
      />

      {/* FloatingReviews */}
      <Phase frame={frame} fps={fps} startSec={18} endSec={23}>
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

      {/* GalleryGrid — 6 fotos del producto */}
      <Phase frame={frame} fps={fps} startSec={23} endSec={27}>
        {(p) => (
          <div style={{ position: 'absolute', left: '50%', top: '72%', transform: 'translate(-50%, -50%) scale(1.5)' }}>
            <GalleryGrid {...p} images={GALLERY} />
          </div>
        )}
      </Phase>

      {/* ═══════ FASE 3 — CTA (26–31.56s) ═══════ */}

      {/* FX gold energy ring — rotado 90° */}
      <RotatedFX
        src="greenscreen/anime/videos/gs_anime_18.mp4"
        startSec={26} endSec={27.83} fps={fps}
      />

      <WaveUpText frame={frame} fps={fps} startSec={27} endSec={29.5}
        glowColor={DEFAULT_ACCENT}
        style={{ top: 450, fontSize: 120 }}>
        ¥2,614
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={27.5} endSec={29.5}
        style={{ top: 620, fontSize: 52 }}>
        ¥4,840 → 46% OFF
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={29.5} endSec={31.56}
        style={{ top: 500, fontSize: 68 }}>
        数量限定！今すぐチェック🔥
      </WaveUpText>

    </AbsoluteFill>
  );
};
