import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel15/${name}`);
const ACCENT = '#D6408C'; // vivid pink-magenta, echoes the colorful marker/art theme
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const AcrylicMarkerOverlay = () => {
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
            src={staticFile('video_overlay20.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        72色も入ってるのにこの価格!?
      </PopText>

      {/* PRODUCT: 3.0-40.76s, ~4.72s per segment (8 templates — AreaChart/ComparisonChart discontinued) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={7.72}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="72色アクリルマーカー" items={['両端デュアルチップ', '木・ガラス・石にも対応', '発色キレイで長持ち']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={7.72} endSec={12.44}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="細いペン先" rightLabel="太いペン先で塗りつぶし" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={12.44} endSec={17.16}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="どんな素材でもしっかり色が乗る" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={17.16} endSec={21.88}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['キャップを外す', '素材を選ぶ', '自由に描く', '作品完成']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={21.88} endSec={26.60}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.7評価', body: '14,000件以上のレビュー' }, { icon: '🔥', title: '224.9K以上販売', body: '圧倒的人気' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={26.60} endSec={31.32}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={31.32} endSec={36.04}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={31.32} endSec={36.04}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        24・48・72色展開
      </PopText>

      <Phase frame={frame} fps={fps} startSec={36.04} endSec={40.76}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 40.76-49.76s */}
      <Phase frame={frame} fps={fps} startSec={40.76} endSec={45.76}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="821" original="1,711" discount="-52%" fomo="224.9K以上販売・4.7の高評価" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={45.76} endSec={49.76}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
