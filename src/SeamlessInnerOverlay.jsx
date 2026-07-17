import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, AreaChart, ComparisonChart, NotificationPop,
  SplitScreen, GalleryGrid, CardFlip, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel5/${name}`);
const ACCENT = '#C99B7A'; // matches the brown/skin-tone fabric shown in the product photos
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const SeamlessInnerOverlay = () => {
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
            src={staticFile('video_overlay5.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        これ、マジで20000枚も売れてるんだって！
      </PopText>

      {/* PRODUCT: 3.0-32.16s, ~3.65s per segment */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={6.65}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="シームレスブラ内蔵インナー" items={['20,000枚突破の人気', '伸びるのにズレない', 'ノンストレス設計']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={6.65} endSec={10.29}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img3.webp')} leftLabel="ブラの締め付けゼロ" rightLabel="幅広ショルダーで楽ちん" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={10.29} endSec={13.94}>
        {(p) => <div style={centerCard}><ComparisonChart {...p} accent={ACCENT} leftLabel="普通のブラ" leftValue={65} rightLabel="内蔵ブラインナー" rightValue={10} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={13.94} endSec={17.58}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img2.webp')} caption="形をキープするカップ" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={17.58} endSec={21.23}>
        {(p) => <div style={centerCard}><AreaChart {...p} accent={ACCENT} title="着心地の満足度" points={[0.2, 0.4, 0.45, 0.65, 0.8, 0.93]} valueLabel="汗をかいても動きやすい" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={21.23} endSec={24.87}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.3評価', body: '1,038件のレビュー' }, { icon: '✅', title: '公式アカウントのみ', body: '類似品にご注意ください' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={24.87} endSec={28.52}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.jpeg'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={28.52} endSec={32.16}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img6.jpeg'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={28.52} endSec={32.16}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        黒・肌色 全2色
      </PopText>

      {/* CTA: 32.16-41.16s */}
      <Phase frame={frame} fps={fps} startSec={32.16} endSec={37.16}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="1,589" original="1,590" discount="-12%" fomo="21,000枚以上販売・大人気" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={37.16} endSec={41.16}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
