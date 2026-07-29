import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  PriceShake, makeBaseTextStyle, centerCard,
} from './OverlayKit';

const ACCENT = '#CCFF00'; // neon yellow-green del logo xbx, combina con el fondo negro del video
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const XbxArGlassesOverlay = () => {
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
          src={staticFile('video_ar_xbx.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* HOOK: 0-3s — camera shake + título */}
      <CameraShake frame={frame} amplitude={45} decayFrames={22}>
        <PopText frame={frame} fps={fps} startSec={0} endSec={3}
          style={{ ...baseTextStyle, left: 60, top: 160, fontSize: 52, textAlign: 'center', width: 960, fontWeight: 'bold' }}>
          最新ARグラス登場！
        </PopText>
      </CameraShake>

      {/* PRODUCTO: 3-6s — spec 62g */}
      <Phase frame={frame} fps={fps} startSec={3.0} endSec={6.0}>
        {(p) => (
          <div style={centerCard}>
            <AnimatedList {...p} accent={ACCENT}
              title="たった62gの超軽量"
              items={['鼻への圧力30%軽減', '長時間快適着用', '通勤・旅行・ゲームに最適']}
            />
          </div>
        )}
      </Phase>

      {/* PRODUCTO: 6-9s — features gaming/display */}
      <Phase frame={frame} fps={fps} startSec={6.0} endSec={9.0}>
        {(p) => (
          <div style={centerCard}>
            <NotificationPop {...p} accent={ACCENT} toasts={[
              { icon: '🎮', title: 'ゲーム＆映画', body: '120Hz・50°広視野角' },
              { icon: '✨', title: '1600ニト輝度', body: 'Micro OLED 10億色表示' },
              { icon: '📱', title: '多機器対応', body: 'iPhone・Switch・Steam Deck' },
            ]} />
          </div>
        )}
      </Phase>

      {/* CTA: 9-12.16s — precio + call to action */}
      <Phase frame={frame} fps={fps} startSec={9.0} endSec={12.16}>
        {(p) => (
          <div style={centerCard}>
            <PriceShake {...p} accent={ACCENT} current="43,980" original={null} discount={null} fomo="送料無料・XREAL公式" />
          </div>
        )}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={9.5} endSec={12.16}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 44, textAlign: 'center', width: 1080, fontWeight: 'bold' }}>
        見逃さないで！<br /><span style={{ fontSize: 32 }}>→ 下のリンクでチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
