import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Video } from '@remotion/media';
import { colorKey } from '@remotion/effects/color-key';
import {
  WaveUpText, CameraShake, Phase, FloatingReviews, DEFAULT_ACCENT,
} from './OverlayKit';

const GS_KEY = colorKey({ keyColor: '#00b140', similarity: 0.35, smoothness: 0.1 });

const REVIEWS = [
  { username: 'y***k',       stars: 5, text: 'モニターが浮いてデスクが広くなった！買って正解😊',          x: 20,  y: 100,  rotation: -5, delay: 0  },
  { username: 'デスク整理好き', stars: 5, text: '片手でスーッと動く。ストレスゼロ✨',                    x: 610, y: 80,   rotation: 4,  delay: 7  },
  { username: 'たか',         stars: 4, text: '32インチが安定して持てる。組み立ても簡単👍',              x: 110, y: 680,  rotation: -2, delay: 14 },
  { username: 'WFH民',        stars: 5, text: '在宅ワークが快適に。3000円以下でこれはすごい',            x: 30,  y: 1330, rotation: 6,  delay: 21 },
  { username: 'k***i',       stars: 5, text: '重たいスタンドが消えて机が広くなりました🎉',              x: 590, y: 1360, rotation: -7, delay: 28 },
];

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

export const MonitorArmA5Overlay = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>

      {/* BASE VIDEO */}
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('monitor_arm_a5_raw.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* ═══════ FASE 1 — HOOK (0–3.5s) ═══════ */}

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
              style={{ top: 500, fontSize: 90 }}
            >
              デスク革命！🔥
            </WaveUpText>
          </CameraShake>
        )}
      </Phase>

      {/* ═══════ FASE 2 — FEATURES (4–26s) ═══════ */}

      <WaveUpText frame={frame} fps={fps} startSec={4} endSec={7}
        style={{ top: 470, fontSize: 72 }}>
        🖥️ 27〜32インチ対応
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={4.3} endSec={7}
        style={{ top: 590, fontSize: 72 }}>
        自由に動かせる
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={7} endSec={10}
        style={{ top: 470, fontSize: 72 }}>
        💪 耐荷重9kg
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={7.3} endSec={10}
        style={{ top: 590, fontSize: 72 }}>
        しっかり支える
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={10} endSec={13}
        style={{ top: 470, fontSize: 72 }}>
        📐 高さ・角度・位置
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={10.3} endSec={13}
        style={{ top: 590, fontSize: 72 }}>
        自由自在
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={13} endSec={16}
        style={{ top: 470, fontSize: 72 }}>
        🪑 デスクスペース
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={13.3} endSec={16}
        style={{ top: 590, fontSize: 72 }}>
        有効活用
      </WaveUpText>

      {/* Speed lines transition */}
      <ScaledFX
        src="greenscreen/anime/videos/gs_anime_21.mp4"
        startSec={16} endSec={18.37} fps={fps}
      />

      {/* FloatingReviews */}
      <Phase frame={frame} fps={fps} startSec={18} endSec={26}>
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

      {/* ═══════ FOMO (26–30s) ═══════ */}

      <WaveUpText frame={frame} fps={fps} startSec={26} endSec={30}
        style={{ top: 470, fontSize: 76 }}>
        ⭐ 4.7評価 119件
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={26.3} endSec={30}
        style={{ top: 590, fontSize: 76 }}>
        大人気アイテム！
      </WaveUpText>

      {/* ═══════ FASE 3 — CTA (30–36.48s) ═══════ */}

      <RotatedFX
        src="greenscreen/anime/videos/gs_anime_18.mp4"
        startSec={30} endSec={31.83} fps={fps}
      />

      <WaveUpText frame={frame} fps={fps} startSec={31} endSec={36.48}
        glowColor={DEFAULT_ACCENT}
        style={{ top: 430, fontSize: 120 }}>
        ¥2,958
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={31.5} endSec={36.48}
        style={{ top: 600, fontSize: 52 }}>
        ¥3,480 → 15% OFF
      </WaveUpText>

    </AbsoluteFill>
  );
};
