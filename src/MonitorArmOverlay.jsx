import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel13/${name}`);
const ACCENT = '#4A90D9'; // clean tech blue, matches the neutral white/gray backdrop and office/tech theme
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const MonitorArmOverlay = () => {
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
            src={staticFile('video_overlay17.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        これ、ほんとに信じられない価格なんだけど…
      </PopText>

      {/* PRODUCT: 3.0-37.64s, ~4.33s per segment (8 templates — AreaChart/ComparisonChart discontinued) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={7.33}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="モニターアーム A5" items={['VESA規格対応75-100mm', '耐荷重2〜9kg', '角度自由自在']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={7.33} endSec={11.66}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="回転90°" rightLabel="傾き調整も自由" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={11.66} endSec={15.98}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="頑丈な素材で長く使える" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={15.98} endSec={20.31}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['デスクに固定', 'モニターを取り付け', '角度を調整', '快適な作業環境']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={20.31} endSec={24.64}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.7評価', body: '100件のレビュー' }, { icon: '📦', title: '付属品完備', body: '初心者もすぐ設置できる' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={24.64} endSec={28.97}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={28.97} endSec={33.30}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={28.97} endSec={33.30}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        17〜32インチ対応
      </PopText>

      <Phase frame={frame} fps={fps} startSec={33.30} endSec={37.64}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 37.64-46.64s */}
      <Phase frame={frame} fps={fps} startSec={37.64} endSec={42.64}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="2,784" original="3,480" discount="-20%" fomo="1.5K以上販売・4.7の高評価" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={42.64} endSec={46.64}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
