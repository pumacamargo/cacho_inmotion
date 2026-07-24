import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel18/${name}`);
const ACCENT = '#2E6FBA'; // matches the blue accent stripe on the box and the waterproof/bathroom theme
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const WaterproofSpeakerOverlay = () => {
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
            src={staticFile('video_overlay23.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 40, textAlign: 'center', width: 960 }}>
        お風呂で動画も音楽も楽しめる360度回転スピーカー
      </PopText>

      {/* PRODUCT: 3.0-33.44s, ~3.8s per segment (8 templates — AreaChart/ComparisonChart discontinued) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={6.80}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="防水回転スピーカー" items={['360度回転', '完全防水', 'タッチスクリーン操作']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={6.80} endSec={10.61}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="お風呂で使える" rightLabel="キッチンやプールでも" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={10.61} endSec={14.41}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="スマホ置き場としても使える" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={14.41} endSec={18.22}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['設置する', 'タッチで操作', '動画や音楽を楽しむ', '水に濡れても安心']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={18.22} endSec={22.02}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.7評価', body: '14件のレビュー' }, { icon: '🎨', title: '白と黒の2色展開', body: '好きな色を選べる' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={22.02} endSec={25.83}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={25.83} endSec={29.63}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={25.83} endSec={29.63}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        スマホホルダー付き
      </PopText>

      <Phase frame={frame} fps={fps} startSec={29.63} endSec={33.44}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 33.44-42.44s */}
      <Phase frame={frame} fps={fps} startSec={33.44} endSec={38.44}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="2,809" original="4,843" discount="-42%" fomo="701人以上が購入・4.7の高評価" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={38.44} endSec={42.44}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
