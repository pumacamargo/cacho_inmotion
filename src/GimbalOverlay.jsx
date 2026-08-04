import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Video } from '@remotion/media';
import { colorKey } from '@remotion/effects/color-key';
import {
  WaveUpText, CameraShake, Phase, FloatingReviews, DEFAULT_ACCENT,
} from './OverlayKit';

const GS_KEY = colorKey({ keyColor: '#00b140', similarity: 0.35, smoothness: 0.1 });

const REVIEWS = [
  { username: 'T***K',         stars: 5, text: '手ブレが完全になくなって動画クオリティ爆上がり😊',    x: 20,  y: 100,  rotation: -5, delay: 0  },
  { username: 'あ***い',        stars: 5, text: '伸縮ロッドが便利すぎ！自撮りが楽になった✨',          x: 610, y: 80,   rotation: 4,  delay: 7  },
  { username: 'みき',           stars: 5, text: 'OLED画面が見やすくて操作しやすい！コスパ最高🎬',      x: 110, y: 680,  rotation: -2, delay: 14 },
  { username: 'YouTuber見習い', stars: 5, text: '2ヶ月使っても壊れない。買って良かった🎉',            x: 30,  y: 1330, rotation: 6,  delay: 21 },
  { username: 'sora_m',        stars: 5, text: 'TikTok用に買ったけど期待以上でした👍',               x: 590, y: 1360, rotation: -7, delay: 28 },
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

export const GimbalOverlay = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>

      {/* BASE VIDEO */}
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('gimbal_raw.mp4')}
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
              これ神ガジェット！🔥
            </WaveUpText>
          </CameraShake>
        )}
      </Phase>

      {/* ═══════ FASE 2 — FEATURES (4–30s) ═══════ */}

      <WaveUpText frame={frame} fps={fps} startSec={4} endSec={7}
        style={{ top: 470, fontSize: 72 }}>
        🎥 3軸スタビライザー
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={4.3} endSec={7}
        style={{ top: 590, fontSize: 72 }}>
        ブレなし撮影
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={7} endSec={10}
        style={{ top: 470, fontSize: 68 }}>
        📡 7.8フィート伸縮ロッド
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={7.3} endSec={10}
        style={{ top: 590, fontSize: 68 }}>
        コンパクト収納
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={10} endSec={13}
        style={{ top: 470, fontSize: 72 }}>
        💡 OLEDディスプレイ
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={10.3} endSec={13}
        style={{ top: 590, fontSize: 72 }}>
        直感的な操作
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={13} endSec={16}
        style={{ top: 470, fontSize: 72 }}>
        📱 TikTok・YouTube
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={13.3} endSec={16}
        style={{ top: 590, fontSize: 72 }}>
        ブロガーに最適！
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

      {/* ═══════ FOMO (30–36s) ═══════ */}

      <WaveUpText frame={frame} fps={fps} startSec={30} endSec={36}
        style={{ top: 470, fontSize: 80 }}>
        ⭐ 2,100台突破！
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={30.3} endSec={36}
        style={{ top: 590, fontSize: 80 }}>
        大人気商品
      </WaveUpText>

      {/* ═══════ FASE 3 — CTA (36–44.8s) ═══════ */}

      <RotatedFX
        src="greenscreen/anime/videos/gs_anime_18.mp4"
        startSec={36} endSec={37.83} fps={fps}
      />

      <WaveUpText frame={frame} fps={fps} startSec={37} endSec={42}
        glowColor={DEFAULT_ACCENT}
        style={{ top: 430, fontSize: 120 }}>
        ¥6,096
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={37.5} endSec={42}
        style={{ top: 600, fontSize: 52 }}>
        ¥13,855 → 56% OFF
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={42} endSec={44.8}
        glowColor={DEFAULT_ACCENT}
        style={{ top: 490, fontSize: 58 }}>
        今すぐTikTokショップでチェック🔥
      </WaveUpText>

    </AbsoluteFill>
  );
};
