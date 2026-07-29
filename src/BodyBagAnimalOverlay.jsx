import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const ACCENT = '#FFD700';
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const BodyBagAnimalOverlay = () => {
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
          src={staticFile('video_bodybag.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* HOOK: 0-2s with camera shake */}
      <CameraShake frame={frame} amplitude={45} decayFrames={22}>
        <PopText frame={frame} fps={fps} startSec={0} endSec={2}
          style={{ ...baseTextStyle, left: 60, top: 180, fontSize: 48, textAlign: 'center', width: 960, fontWeight: 'bold' }}>
          使いやすい
        </PopText>
      </CameraShake>

      {/* PRODUCT: 2-4s - Benefits */}
      <Phase frame={frame} fps={fps} startSec={2.0} endSec={4.0}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="動物パターンボディバッグ" items={['軽量・快適', '大容量収納', 'マルチポケット']} /></div>}
      </Phase>

      {/* PRODUCT: 4-6s - Social proof / Features */}
      <Phase frame={frame} fps={fps} startSec={4.0} endSec={6.0}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.7評価', body: '121件のレビュー' }, { icon: '📦', title: '無料配送', body: 'クイック発送' }]} /></div>}
      </Phase>

      {/* CTA: 6-8s - Price & Call-to-action */}
      <Phase frame={frame} fps={fps} startSec={6.0} endSec={8.0}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="3,300" original={null} discount={null} fomo="871件販売・多色展開" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={6.5} endSec={8.0}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 44, textAlign: 'center', width: 1080, fontWeight: 'bold' }}>
        見逃さないで！<br /><span style={{ fontSize: 32 }}>→ チェックしてください</span>
      </PopText>
    </AbsoluteFill>
  );
};
