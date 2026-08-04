import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { WaveUpText, CameraShake, DEFAULT_ACCENT, Phase, FloatingReviews } from './OverlayKit';

export const SquishyLuckcatV2Overlay = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('video_squishy_luckcat_v2.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* HOOK 0-3.5s — shake + amarillo */}
      <CameraShake frame={frame} amplitude={40} decayFrames={20}>
        <WaveUpText frame={frame} fps={fps} startSec={0} endSec={3.5}
          glowColor={DEFAULT_ACCENT}
          style={{ top: 130, fontSize: 92 }}>
          思ったより安い！😱
        </WaveUpText>
      </CameraShake>

      {/* PRECIO 3-7s — amarillo */}
      <WaveUpText frame={frame} fps={fps} startSec={3} endSec={7}
        glowColor={DEFAULT_ACCENT}
        style={{ bottom: 380, fontSize: 124 }}>
        ¥1,499
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={3.5} endSec={7}
        style={{ bottom: 260, fontSize: 56 }}>
        （¥3,699から59%OFF）
      </WaveUpText>

      {/* FEATURES 7-18s — uno a la vez, blanco */}
      <WaveUpText frame={frame} fps={fps} startSec={7} endSec={11}
        style={{ bottom: 320, fontSize: 74 }}>
        💧 水分たっぷりの触感
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={11} endSec={15}
        style={{ bottom: 320, fontSize: 74 }}>
        🌀 ぷるんぷるん弾力性
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={15} endSec={18.5}
        style={{ bottom: 320, fontSize: 74 }}>
        ✅ 食品グレード素材
      </WaveUpText>

      {/* SOCIAL PROOF 24-34s — FloatingReviews sticker layout 2-1-2 */}
      <Phase frame={frame} fps={fps} startSec={24} endSec={34}>
        {({ localFrame, durationFrames, fps: f }) => {
          const exitStart = durationFrames - 8;
          const exitOpacity = localFrame >= exitStart ? 1 - (localFrame - exitStart) / 8 : 1;
          return (
            <div style={{ position: 'absolute', inset: 0, opacity: exitOpacity }}>
              <FloatingReviews frame={localFrame} fps={f} cardWidth={440} reviews={[
                { username: 'ままさん', stars: 5, text: 'めっちゃ分厚くてプルンプルン🍮 揉みまくれる！', x: 20, y: 120, rotation: -5, delay: 0 },
                { username: 'chan', stars: 5, text: '超水感！ぷるんぷるんっ！箱入り可愛い♡', x: 610, y: 100, rotation: 4, delay: 7 },
                { username: '🌿さん', stars: 5, text: '気持ちが良すぎてずっと触ってます！大満足！！', x: 110, y: 700, rotation: -2, delay: 14 },
                { username: 'まるまるさん', stars: 5, text: 'ストレス発散に最高！触り心地が癖になる🍮', x: 30, y: 1350, rotation: 6, delay: 21 },
                { username: 'ゆっくりさん', stars: 4, text: 'コスパ良くてデザインも可愛い！袋付き最高✨', x: 600, y: 1380, rotation: -7, delay: 28 },
              ]} />
            </div>
          );
        }}
      </Phase>

      {/* CTA 39-42.6s */}
      <WaveUpText frame={frame} fps={fps} startSec={39} endSec={42.64}
        style={{ bottom: 200, fontSize: 62 }}>
        → プロフィールのリンクから
      </WaveUpText>
    </AbsoluteFill>
  );
};
