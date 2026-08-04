import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  makeBaseTextStyle, centerCard, DEFAULT_ACCENT,
} from './OverlayKit';

const ACCENT = DEFAULT_ACCENT;
const baseTextStyle = makeBaseTextStyle(ACCENT);
const bottomCard = { ...centerCard, top: '72%' };

export const KtcMonitorOverlay = () => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  if (!videoConfig) {
    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  }

  const fps = videoConfig.fps;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', fontFamily: "'Noto Sans CJK JP', 'Noto Sans JP', sans-serif" }}>
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('video_ktcmonitor.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* HOOK: 0-3s — camera shake */}
      <CameraShake frame={frame} amplitude={45} decayFrames={22}>
        <PopText frame={frame} fps={fps} startSec={0} endSec={3}
          style={{ ...baseTextStyle, left: 60, top: 160, fontSize: 48, textAlign: 'center', width: 960, fontWeight: 'bold' }}>
          旦那が買った24インチ…<br /><span style={{ fontSize: 38 }}>スペックが最高すぎた😤</span>
        </PopText>
      </CameraShake>

      {/* 3-9s — specs */}
      <Phase frame={frame} fps={fps} startSec={3} endSec={9}>
        {(p) => (
          <div style={bottomCard}>
            <AnimatedList {...p}
              title="KEY TO COMBAT H24S17 スペック"
              items={[
                '⚡ 180Hz リフレッシュレート',
                '🎯 1ms 超高速応答（MPRT）',
                '🖥️ 1500R 曲面VA パネル',
                '🔗 HDMI 2.0×2 / DisplayPort 1.4',
              ]}
            />
          </div>
        )}
      </Phase>

      {/* 9-15s — social proof / CTA */}
      <Phase frame={frame} fps={fps} startSec={9} endSec={15.04}>
        {(p) => (
          <div style={bottomCard}>
            <NotificationPop {...p} toasts={[
              { icon: '⭐', title: '4.8評価 12件', body: '61台以上販売' },
              { icon: '🚚', title: '送料無料', body: '3年保証付き' },
            ]} />
          </div>
        )}
      </Phase>
    </AbsoluteFill>
  );
};
