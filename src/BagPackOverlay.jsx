import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, AreaChart, ComparisonChart, NotificationPop,
  SplitScreen, GalleryGrid, CardFlip, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard, envelope,
} from './OverlayKit';

// One-off promo banner for the トクトクSALE (7/16-7/19) — NOT part of the reusable kit,
// only used in this composition while the sale is live. Pinned to the bottom so it never
// covers the stat/image cards (those sit around the upper-third via `centerCard`).
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

const img = (name) => staticFile(`carousel12/${name}`);
const ACCENT = '#A8967D'; // warm taupe/leather tone, complements the black bag against the neutral wall
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const BagPackOverlay = () => {
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
            src={staticFile('video_overlay13.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        大容量なのに全然かさばらないって知ってた？
      </PopText>

      {/* PRODUCT: 3.0-32.56s, ~3.7s per segment */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={6.70}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="大容量ソフトPUレザーバッグ" items={['防水・傷に強い', '3WAYで使える', 'ポケット多数']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={6.70} endSec={10.39}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="肩掛け" rightLabel="バックパックスタイル" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={10.39} endSec={14.09}>
        {(p) => <div style={centerCard}><ComparisonChart {...p} accent={ACCENT} leftLabel="普通のバッグ" leftValue={40} rightLabel="このバッグ" rightValue={95} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={14.09} endSec={17.78}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="教科書もiPadもスッキリ収納" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={17.78} endSec={21.48}>
        {(p) => <div style={centerCard}><AreaChart {...p} accent={ACCENT} title="耐久性" points={[0.3, 0.45, 0.5, 0.7, 0.85, 0.95]} valueLabel="雨の日も傷にも強い" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={21.48} endSec={25.17}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.3評価', body: '110件のレビュー' }, { icon: '👜', title: '3WAYデザイン', body: '持ち手・肩掛け・バックパック' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={25.17} endSec={28.87}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={28.87} endSec={32.56}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={28.87} endSec={32.56}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        カラー展開
      </PopText>

      {/* ONE-OFF: トクトクSALE banner, visible through the whole product phase, pinned low so it never covers the cards */}
      <SaleBanner frame={frame} fps={fps} startSec={3.0} endSec={32.56} />

      {/* CTA: 32.56-41.56s */}
      <Phase frame={frame} fps={fps} startSec={32.56} endSec={36.56}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="1,400" original="8,200" discount="-83%" fomo="1.6K以上販売・110件の高評価" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={36.56} endSec={41.56}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
