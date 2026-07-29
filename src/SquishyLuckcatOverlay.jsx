import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, PriceShake, makeBaseTextStyle, centerCard,
} from './OverlayKit';

const ACCENT = '#FF2D78'; // rosa/magenta — contraste sobre el fondo amarillo brillante del video
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const SquishyLuckcatOverlay = () => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  if (!videoConfig) {
    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  }

  const fps = videoConfig.fps;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', fontFamily: "'Noto Sans CJK JP', 'Noto Sans JP', sans-serif" }}>
      {/* Base video */}
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('video_squishy_luckcat.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* HOOK: 0-3s — camera shake + precio impactante */}
      <CameraShake frame={frame} amplitude={45} decayFrames={22}>
        <PopText frame={frame} fps={fps} startSec={0} endSec={3}
          style={{ ...baseTextStyle, left: 60, top: 160, fontSize: 52, textAlign: 'center', width: 960, fontWeight: 'bold' }}>
          たった1,499円！？
        </PopText>
      </CameraShake>

      {/* PRODUCTO: 3-10s — sensación y características */}
      <Phase frame={frame} fps={fps} startSec={3.0} endSec={10.0}>
        {(p) => (
          <div style={centerCard}>
            <AnimatedList {...p} accent={ACCENT}
              title="LUCKCATシュフレ"
              items={['ぷるんぷるんの感触', '弾力があって気持ちいい', '水分感たっぷり']}
            />
          </div>
        )}
      </Phase>

      {/* PRODUCTO: 10-20s — uso y beneficios emocionales */}
      <Phase frame={frame} fps={fps} startSec={10.0} endSec={20.0}>
        {(p) => (
          <div style={centerCard}>
            <NotificationPop {...p} accent={ACCENT} toasts={[
              { icon: '😌', title: 'ストレス解消', body: 'もむだけで心が落ち着く' },
              { icon: '🏠', title: 'インテリアにも', body: '専用袋付きで可愛い' },
              { icon: '👨‍👩‍👧', title: '家族みんなで', body: '毎日使ってみんな大好き' },
            ]} />
          </div>
        )}
      </Phase>

      {/* PRODUCTO: 20-32s — pasos */}
      <Phase frame={frame} fps={fps} startSec={20.0} endSec={32.0}>
        {(p) => (
          <div style={centerCard}>
            <ProgressSteps {...p} accent={ACCENT}
              steps={['取り出す', 'ぷるんと触る', 'ストレス消える', 'やみつき！']}
            />
          </div>
        )}
      </Phase>

      {/* PRODUCTO: 32-44s — social proof */}
      <Phase frame={frame} fps={fps} startSec={32.0} endSec={44.0}>
        {(p) => (
          <div style={centerCard}>
            <NotificationPop {...p} accent={ACCENT} toasts={[
              { icon: '⭐', title: '4.5評価', body: '1,027件のレビュー' },
              { icon: '🔥', title: '8,000台以上販売', body: '大人気ストレス解消グッズ' },
              { icon: '🚚', title: '無料配送', body: 'クイック発送' },
            ]} />
          </div>
        )}
      </Phase>

      {/* PRODUCTO: 44-54s — detalles extra */}
      <Phase frame={frame} fps={fps} startSec={44.0} endSec={54.0}>
        {(p) => (
          <div style={centerCard}>
            <AnimatedList {...p} accent={ACCENT}
              title="もう他には戻れない"
              items={['弾力抜群・形が戻る', '専用かわいい袋付き', 'ジップロック不要！']}
            />
          </div>
        )}
      </Phase>

      {/* CTA: 54-61s — precio + call to action */}
      <Phase frame={frame} fps={fps} startSec={54.0} endSec={61.04}>
        {(p) => (
          <div style={centerCard}>
            <PriceShake {...p} accent={ACCENT}
              current="1,499"
              original="3,699"
              discount="-59%"
              fomo="8,000台以上販売・送料無料"
            />
          </div>
        )}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={55.5} endSec={61.04}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 44, textAlign: 'center', width: 1080, fontWeight: 'bold' }}>
        見逃さないで！<br /><span style={{ fontSize: 32 }}>→ リンクをチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
