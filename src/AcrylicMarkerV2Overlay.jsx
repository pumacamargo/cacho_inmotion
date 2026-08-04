import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { WaveUpText, CameraShake, DEFAULT_ACCENT, Phase, FloatingReviews } from './OverlayKit';

const REVIEWS = [
  { username: 'アーティストさん', stars: 5, text: '72色あれば表現力が無限！発色が最高🎨', x: 20, y: 120, rotation: -5, delay: 0 },
  { username: '先生さん', stars: 5, text: '子供向けの工作にピッタリ！石やガラスにも書けてびっくり✨', x: 610, y: 100, rotation: 4, delay: 7 },
  { username: 'DIY好き', stars: 5, text: '¥1,094でこのクオリティは反則笑 ダブルチップが便利すぎ', x: 110, y: 700, rotation: -2, delay: 14 },
  { username: 'クラフター', stars: 5, text: '22万人以上が買ってるのも納得！色が長持ちする', x: 30, y: 1350, rotation: 6, delay: 21 },
  { username: 'ままさん', stars: 4, text: '学校の準備にも最適✨ 子供も大喜び！', x: 600, y: 1380, rotation: -7, delay: 28 },
];

export const AcrylicMarkerV2Overlay = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('video_acrylic_marker_v2.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* 1. HOOK 0-3s — shake + amarillo */}
      <CameraShake frame={frame} amplitude={40} decayFrames={20}>
        <WaveUpText frame={frame} fps={fps} startSec={0} endSec={3.5}
          glowColor={DEFAULT_ACCENT}
          style={{ top: 130, fontSize: 92 }}>
          すごい！😱
        </WaveUpText>
      </CameraShake>

      {/* 2. PRECIO 5-8s — amarillo */}
      <WaveUpText frame={frame} fps={fps} startSec={5} endSec={8}
        glowColor={DEFAULT_ACCENT}
        style={{ bottom: 360, fontSize: 112 }}>
        ¥1,094
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={5.5} endSec={8}
        style={{ bottom: 240, fontSize: 54 }}>
        （¥1,854から41%OFF）
      </WaveUpText>

      {/* 3. DUAL TIP 8-13s */}
      <WaveUpText frame={frame} fps={fps} startSec={8} endSec={13}
        style={{ bottom: 320, fontSize: 76 }}>
        ✏️ ダブルチップデザイン
      </WaveUpText>

      {/* 4. SURFACES 14-19s */}
      <WaveUpText frame={frame} fps={fps} startSec={14} endSec={19}
        style={{ bottom: 320, fontSize: 72 }}>
        🎨 72色 / 石・ガラスにも
      </WaveUpText>

      {/* 5. FLOATING REVIEWS 19-26s */}
      <Phase frame={frame} fps={fps} startSec={19} endSec={26}>
        {({ localFrame, durationFrames, fps: f }) => {
          const exitStart = durationFrames - 8;
          const exitOpacity = localFrame >= exitStart ? 1 - (localFrame - exitStart) / 8 : 1;
          return (
            <div style={{ position: 'absolute', inset: 0, opacity: exitOpacity }}>
              <FloatingReviews frame={localFrame} fps={f} cardWidth={440} reviews={REVIEWS} />
            </div>
          );
        }}
      </Phase>

      {/* 6. PRICE + CTA 28-33s */}
      <WaveUpText frame={frame} fps={fps} startSec={28} endSec={33.12}
        glowColor={DEFAULT_ACCENT}
        style={{ bottom: 360, fontSize: 108 }}>
        ¥1,094
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={29} endSec={33.12}
        style={{ bottom: 220, fontSize: 58 }}>
        → プロフィールのリンクから
      </WaveUpText>
    </AbsoluteFill>
  );
};
