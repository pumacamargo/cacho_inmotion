import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard, envelope,
} from './OverlayKit';

const img = (name) => staticFile(`carousel2/${name}`);
const ACCENT = '#FFD700'; // matches the vivid yellow ELLISS packaging / video background
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

export const VitaminCV2Overlay = () => {
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
            src={staticFile('video_overlay14.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        これ、本当に1000mgのリポソーマルビタミンC!?
      </PopText>

      {/* PRODUCT: 3.0-37.6s, ~4.33s per segment (8 templates — AreaChart/ComparisonChart discontinued) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={7.33}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="リポソーマルビタミンC" items={['1000mg高濃度配合', '熱を加えない製法', '吸収力アップ']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={7.33} endSec={11.65}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="そのまま飲む" rightLabel="はちみつでレモネード風" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={11.65} endSec={15.98}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="肌の艶とシミ対策に" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={15.98} endSec={20.30}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['水に溶かす', 'はちみつを足す', 'レモネード風に', '毎日2〜3包']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={20.30} endSec={24.63}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.6評価', body: '1,802件のレビュー' }, { icon: '🌿', title: '美容成分配合', body: 'アロエベラ・レスベラトロール' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={24.63} endSec={28.95}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={28.95} endSec={33.28}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={28.95} endSec={33.28}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        30包入り・レモン味
      </PopText>

      <Phase frame={frame} fps={fps} startSec={33.28} endSec={37.60}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* ONE-OFF: トクトクSALE banner, visible through the whole product phase */}
      <SaleBanner frame={frame} fps={fps} startSec={3.0} endSec={37.60} />

      {/* CTA: 37.60-46.60s */}
      <Phase frame={frame} fps={fps} startSec={37.60} endSec={41.60}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="2,958" original="3,480" discount="-15%" fomo="74.7K以上販売・1,802件の高評価" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={41.60} endSec={46.60}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
