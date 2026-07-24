import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel5/${name}`);
const ACCENT = '#A89984'; // matches the neutral warm-gray wall background
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const SeamlessInnerV3Overlay = () => {
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
            src={staticFile('video_overlay24.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 40, textAlign: 'center', width: 960 }}>
        まさかの20000枚突破！ブラ内蔵のシームレスインナー
      </PopText>

      {/* PRODUCT: 3.0-49.12s, ~5.77s per segment (8 templates — AreaChart/ComparisonChart discontinued) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={8.77}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="シームレスブラ内蔵インナー" items={['20,000枚突破の人気', 'ストレッチ素材でズレない', '着脱も簡単']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={8.77} endSec={14.53}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img3.webp')} leftLabel="普通のブラは痛い" rightLabel="ストラップの締め付けゼロ" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={14.53} endSec={20.30}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img2.webp')} caption="フィット感抜群で着心地重視" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={20.30} endSec={26.06}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['さっと着る', '一日中快適', '通気性で蒸れない', 'ササッと着替え']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={26.06} endSec={31.83}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '💛', title: 'リピート買い多数', body: '友達にもおすすめ' }, { icon: '🎨', title: 'カラー展開豊富', body: '好きな色を選べる' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={31.83} endSec={37.59}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.jpeg'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={37.59} endSec={43.36}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img6.jpeg'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={37.59} endSec={43.36}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        カラー展開
      </PopText>

      <Phase frame={frame} fps={fps} startSec={43.36} endSec={49.12}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.jpeg'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 49.12-58.12s */}
      <Phase frame={frame} fps={fps} startSec={49.12} endSec={54.12}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="1,790" original={null} discount={null} fomo="友達にもおすすめ・リピート買い多数" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={54.12} endSec={58.12}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
