import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, AreaChart, ComparisonChart, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel/${name}`);
const ACCENT = '#FFD700'; // matches this product's yellow packaging
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const TtchopOverlay = () => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  if (!videoConfig) {
    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  }

  const fps = videoConfig.fps;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', fontFamily: "'Noto Sans CJK JP', 'Noto Sans JP', sans-serif" }}>
      {/* HOOK: 0-3s, whole frame shakes to grab attention */}
      <CameraShake frame={frame} amplitude={45} decayFrames={22}>
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile('video_overlay.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 46, textAlign: 'center', width: 960 }}>
        ちょっと待って…これ、マジで触ってみて！
      </PopText>

      {/* PRODUCT: 3s-35s, stat/text templates alternating with image templates, ~3.2s each */}
      <Phase frame={frame} fps={fps} startSec={3.0} endSec={6.2}>
        {(p) => <div style={centerCard}><AnimatedList {...p} title="もっちもち感触" items={['クリーミーで柔らかい', 'ずっと触っていたい', '押すたびに癒される']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={6.2} endSec={9.4}>
        {(p) => <div style={centerCard}><SplitScreen {...p} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="押す前" rightLabel="押した後" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={9.4} endSec={12.6}>
        {(p) => <div style={centerCard}><AreaChart {...p} title="癒し効果" points={[0.15, 0.3, 0.35, 0.55, 0.7, 0.9]} valueLabel="毎日のストレスがすーっと軽くなる" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={12.6} endSec={15.8}>
        {(p) => <div style={centerCard}><CardFlip {...p} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="揉むだけでリラックス" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={15.8} endSec={19.0}>
        {(p) => <div style={centerCard}><ComparisonChart {...p} leftLabel="ストレスMAX" leftValue={89} rightLabel="スーッと楽に" rightValue={12} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={19.0} endSec={22.2}>
        {(p) => <div style={centerCard}><NotificationPop {...p} toasts={[{ icon: '📦', title: '発送完了', body: '国内発送だから早い' }, { icon: '🚚', title: '翌日お届け', body: '注文の次の日に到着' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={22.2} endSec={25.4}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.jpeg'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={25.4} endSec={28.6}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} steps={['注文', '発送', 'お届け', 'リピート']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={28.6} endSec={31.8}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={28.6} endSec={31.8}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        全4タイプ
      </PopText>

      <Phase frame={frame} fps={fps} startSec={31.8} endSec={35.0}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.jpeg'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 35s-44.64s, price + shake + FOMO closing line */}
      <Phase frame={frame} fps={fps} startSec={35.0} endSec={40.0}>
        {(p) => <div style={centerCard}><PriceShake {...p} current="1,424" original="1,780" discount="-20%" fomo="数量限定・今だけ20%OFF" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={40.0} endSec={44.64}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
