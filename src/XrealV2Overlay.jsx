import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { WaveUpText, CameraShake, DEFAULT_ACCENT, Phase, FloatingReviews } from './OverlayKit';

const REVIEWS = [
  { username: 'ゲーマーさん', stars: 5, text: 'ゲームの没入感が全然違う！120Hzでめちゃ滑らか🎮', x: 20, y: 120, rotation: -5, delay: 0 },
  { username: '電車通勤さん', stars: 5, text: '毎日の通勤が映画館に変わった！62gで全然疲れない', x: 610, y: 100, rotation: 4, delay: 7 },
  { username: 'ガジェット好き', stars: 5, text: '友達に見せたら全員欲しがってた😂 買って大正解！', x: 110, y: 700, rotation: -2, delay: 14 },
  { username: 'りんご先生', stars: 4, text: '1600ニットで屋外でもバッチリ見える。買って正解✨', x: 30, y: 1350, rotation: 6, delay: 21 },
  { username: 'テックユーザー', stars: 5, text: '長時間使っても目が疲れない。TÜV認定は伊達じゃない👁️', x: 600, y: 1380, rotation: -7, delay: 28 },
];

export const XrealV2Overlay = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('video_xreal_v2.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* 1. HOOK 0-3s — shake + amarillo */}
      <CameraShake frame={frame} amplitude={40} decayFrames={20}>
        <WaveUpText frame={frame} fps={fps} startSec={0} endSec={3.5}
          glowColor={DEFAULT_ACCENT}
          style={{ top: 130, fontSize: 88 }}>
          マジで凄い！😱
        </WaveUpText>
      </CameraShake>

      {/* 2. WEIGHT 5-9s — amarillo */}
      <WaveUpText frame={frame} fps={fps} startSec={5} endSec={9}
        glowColor={DEFAULT_ACCENT}
        style={{ bottom: 360, fontSize: 100 }}>
        ⚖️ たった62g
      </WaveUpText>

      {/* 3. DISPLAY 9-13s */}
      <WaveUpText frame={frame} fps={fps} startSec={9} endSec={13}
        style={{ bottom: 360, fontSize: 80 }}>
        🎬 最大147インチ相当
      </WaveUpText>

      {/* 4. BRIGHTNESS 13-17s */}
      <WaveUpText frame={frame} fps={fps} startSec={13} endSec={17}
        style={{ bottom: 360, fontSize: 80 }}>
        ☀️ 1600ニット高輝度
      </WaveUpText>

      {/* 5. FLOATING REVIEWS 20-30s */}
      <Phase frame={frame} fps={fps} startSec={20} endSec={30}>
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

      {/* 6. REFRESH RATE 36-44s */}
      <WaveUpText frame={frame} fps={fps} startSec={36} endSec={44}
        style={{ bottom: 360, fontSize: 80 }}>
        ⚡ 120Hz リフレッシュ
      </WaveUpText>

      {/* 7. SOCIAL PROOF 44-51s */}
      <WaveUpText frame={frame} fps={fps} startSec={44} endSec={51}
        style={{ bottom: 360, fontSize: 72 }}>
        👥 友達も続々購入！
      </WaveUpText>

      {/* 8. PRICE + CTA 53-60s */}
      <WaveUpText frame={frame} fps={fps} startSec={53} endSec={60.16}
        glowColor={DEFAULT_ACCENT}
        style={{ bottom: 380, fontSize: 108 }}>
        ¥43,980
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={54} endSec={60.16}
        style={{ bottom: 240, fontSize: 58 }}>
        → プロフィールのリンクから
      </WaveUpText>
    </AbsoluteFill>
  );
};
