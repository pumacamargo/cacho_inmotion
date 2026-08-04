import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Video } from '@remotion/media';
import { colorKey } from '@remotion/effects/color-key';
import {
  WaveUpText, CameraShake, Phase, FloatingReviews, DEFAULT_ACCENT,
} from './OverlayKit';

const GS_KEY = colorKey({ keyColor: '#00b140', similarity: 0.35, smoothness: 0.1 });

const REVIEWS = [
  { username: 'k***n',        stars: 5, text: '電車でYouTube見てたら隣の人に話しかけられた笑 最高すぎる😂', x: 20,  y: 100,  rotation: -5, delay: 0  },
  { username: 'ゲーマー勉',   stars: 5, text: 'Steam Deckと接続したら没入感やばい。62gで全然重くない',      x: 610, y: 80,   rotation: 4,  delay: 7  },
  { username: 'たくみ',        stars: 5, text: '1600ニット本当に明るい。昼間でもくっきり見える👓',           x: 110, y: 680,  rotation: -2, delay: 14 },
  { username: 'movie_junkie', stars: 5, text: '映画館いらない。どこでも140インチ体験できる🎬',              x: 30,  y: 1330, rotation: 6,  delay: 21 },
  { username: 'H***o',        stars: 5, text: '目が疲れにくいのが最高。毎日3時間使っても平気',              x: 590, y: 1360, rotation: -7, delay: 28 },
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

export const XrealV3Overlay = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>

      {/* BASE VIDEO */}
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('xreal_v3_raw.mp4')}
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
              style={{ top: 500, fontSize: 88 }}
            >
              見たことない世界。🔥
            </WaveUpText>
          </CameraShake>
        )}
      </Phase>

      {/* ═══════ FASE 2 — FEATURES (4–30s) ═══════ */}

      <WaveUpText frame={frame} fps={fps} startSec={4} endSec={7}
        style={{ top: 470, fontSize: 72 }}>
        ⚡ わずか62g
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={4.3} endSec={7}
        style={{ top: 590, fontSize: 72 }}>
        超軽量デザイン
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={7} endSec={10}
        style={{ top: 470, fontSize: 68 }}>
        💡 1,600ニット輝度
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={7.3} endSec={10}
        style={{ top: 590, fontSize: 68 }}>
        直射日光でも鮮明
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={10} endSec={13}
        style={{ top: 470, fontSize: 72 }}>
        📺 140インチ相当
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={10.3} endSec={13}
        style={{ top: 590, fontSize: 72 }}>
        120Hz対応
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={13} endSec={16}
        style={{ top: 470, fontSize: 72 }}>
        🎮 ゲーム・映画
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={13.3} endSec={16}
        style={{ top: 590, fontSize: 72 }}>
        まるで本物の体験
      </WaveUpText>

      {/* Speed lines transition */}
      <ScaledFX
        src="greenscreen/anime/videos/gs_anime_21.mp4"
        startSec={16} endSec={18.37} fps={fps}
      />

      {/* FloatingReviews */}
      <Phase frame={frame} fps={fps} startSec={18} endSec={30}>
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

      {/* ═══════ FOMO (30–34s) ═══════ */}

      <WaveUpText frame={frame} fps={fps} startSec={30} endSec={34}
        style={{ top: 470, fontSize: 76 }}>
        👁️ 4つのアイケア技術
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={30.3} endSec={34}
        style={{ top: 590, fontSize: 76 }}>
        目にも優しい
      </WaveUpText>

      {/* ═══════ FASE 3 — CTA (34–42.4s) ═══════ */}

      <RotatedFX
        src="greenscreen/anime/videos/gs_anime_18.mp4"
        startSec={34} endSec={35.83} fps={fps}
      />

      <WaveUpText frame={frame} fps={fps} startSec={35} endSec={40}
        glowColor={DEFAULT_ACCENT}
        style={{ top: 440, fontSize: 110 }}>
        ¥43,980
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={35.5} endSec={40}
        style={{ top: 600, fontSize: 58 }}>
        今すぐ手に入れて
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={40} endSec={42.4}
        glowColor={DEFAULT_ACCENT}
        style={{ top: 490, fontSize: 60 }}>
        素晴らしい体験を始めましょう🔥
      </WaveUpText>

    </AbsoluteFill>
  );
};
