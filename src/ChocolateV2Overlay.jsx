import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  SplitScreen, CardFlip, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard, envelope,
} from './OverlayKit';

const img = (name) => staticFile(`carousel9/${name}`);
const ACCENT = '#B87C4C'; // matches the warm wood table / neutral wall in the video
const baseTextStyle = makeBaseTextStyle(ACCENT);

// One-off promo banner for the トクトクSALE (7/16-7/19) — NOT part of the reusable kit.
const SaleBanner = ({ frame, fps, startSec, endSec }) => (
  <Phase frame={frame} fps={fps} startSec={startSec} endSec={endSec}>
    {({ localFrame, durationFrames, fps: f }) => {
      const { scale, opacity } = envelope(localFrame, durationFrames, f);
      return (
        <div style={{
          position: 'absolute', bottom: 50, left: '50%',
          transform: `translateX(-50%) scale(${scale})`, opacity,
          width: 1000, borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)', border: '3px solid rgba(255,255,255,0.6)',
        }}>
          <Img src={staticFile('carousel12/sale_banner.jpg')} style={{ width: '100%', display: 'block' }} />
        </div>
      );
    }}
  </Phase>
);

export const ChocolateV2Overlay = () => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  if (!videoConfig) {
    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  }

  const fps = videoConfig.fps;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', fontFamily: "'Noto Sans CJK JP', 'Noto Sans JP', sans-serif" }}>
      {/* HOOK: 0-3s */}
      <CameraShake frame={frame} amplitude={45} decayFrames={22}>
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile('video_overlay15.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        え、これが200グラム入りでこの価格!?
      </PopText>

      {/* PRODUCT: 3.0-24.48s, ~4.3s per segment (5 templates — AreaChart/ComparisonChart discontinued) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={7.30}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="贅沢な割れチョコ" items={['ゴロゴロナッツ入り', '1袋200グラム', '冷蔵便で溶けにくい']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={7.30} endSec={11.59}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="常温だと溶ける" rightLabel="冷蔵便で安心" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={11.59} endSec={15.89}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="甘さちょうど良くクリーミー" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={15.89} endSec={20.19}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.5評価', body: '10,902件のレビュー' }, { icon: '🔥', title: '130K以上販売', body: '圧倒的人気' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={20.19} endSec={24.48}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={20.19} endSec={24.48}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        種類が選べる
      </PopText>

      {/* ONE-OFF: トクトクSALE banner */}
      <SaleBanner frame={frame} fps={fps} startSec={3.0} endSec={24.48} />

      {/* CTA: 24.48-33.48s */}
      <Phase frame={frame} fps={fps} startSec={24.48} endSec={29.48}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="2,660" original={null} discount={null} fomo="10,902件の高評価・130K以上販売" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={29.48} endSec={33.48}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
