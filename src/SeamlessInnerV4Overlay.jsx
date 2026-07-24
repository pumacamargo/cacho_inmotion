import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel5/${name}`);
const ACCENT = '#9C8868'; // matches the neutral warm-gray wall background
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const SeamlessInnerV4Overlay = () => {
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
            src={staticFile('video_overlay28.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        これが3枚セットでこの値段!?
      </PopText>

      {/* PRODUCT: 3.0-40.84s, ~4.73s per segment (8 templates — AreaChart/ComparisonChart discontinued) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={7.73}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="3枚セットのブラ内蔵インナー" items={['CHAOストレッチ素材', '幅広ショルダーで楽ちん', 'パッド縫い込み済み']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={7.73} endSec={12.46}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img3.webp')} leftLabel="普段使いにピッタリ" rightLabel="窮屈感ゼロ" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={12.46} endSec={17.19}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img2.webp')} caption="アンダーバストもしっかり支える" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={17.19} endSec={21.92}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['さっと着る', '一日中快適', 'アンダーバストサポート', '毎日リピート']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={21.92} endSec={26.65}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.3評価', body: '1,233件のレビュー' }, { icon: '✅', title: '公式アカウントのみ', body: '偽物にご注意ください' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={26.65} endSec={31.38}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.jpeg'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={31.38} endSec={36.11}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img6.jpeg'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={31.38} endSec={36.11}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        LLまでサイズ豊富
      </PopText>

      <Phase frame={frame} fps={fps} startSec={36.11} endSec={40.84}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.jpeg'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 40.84-49.84s */}
      <Phase frame={frame} fps={fps} startSec={40.84} endSec={45.84}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="1,790" original={null} discount={null} fomo="23.6K以上販売・1,233件の高評価" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={45.84} endSec={49.84}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
