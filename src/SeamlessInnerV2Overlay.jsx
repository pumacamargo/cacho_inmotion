import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, AreaChart, ComparisonChart, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel5/${name}`);
const ACCENT = '#A89984'; // matches the neutral warm-gray wall background in this take
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const SeamlessInnerV2Overlay = () => {
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
            src={staticFile('video_overlay7.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        え、これが3枚でこの価格？マジで安すぎ！
      </PopText>

      {/* PRODUCT: 3.0-36.76s, ~3.75s per segment */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={6.75}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="3枚セットでこの価格" items={['パッド固定で型崩れなし', '伸びても胸ズレしない', '幅広ショルダーで楽ちん']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={6.75} endSec={10.50}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img3.webp')} leftLabel="締め付け感ゼロ" rightLabel="下着感なしのシームレス" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={10.50} endSec={14.25}>
        {(p) => <div style={centerCard}><ComparisonChart {...p} accent={ACCENT} leftLabel="普通のインナー" leftValue={60} rightLabel="このインナー" rightValue={8} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={14.25} endSec={18.00}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img2.webp')} caption="動いても胸ズレなし" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={18.00} endSec={21.75}>
        {(p) => <div style={centerCard}><AreaChart {...p} accent={ACCENT} title="着心地満足度" points={[0.25, 0.4, 0.5, 0.68, 0.8, 0.94]} valueLabel="ゆったりサイズも選べて快適" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={21.75} endSec={25.50}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['注文', '丁寧に梱包', '袋入りで到着', '毎日着用']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={25.50} endSec={29.25}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.3評価', body: '1,038件のレビュー' }, { icon: '✅', title: '公式アカウントのみ', body: '偽物にご注意ください' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={29.25} endSec={33.00}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.jpeg'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={33.00} endSec={36.76}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img6.jpeg'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={33.00} endSec={36.76}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        黒・肌色 全2色
      </PopText>

      {/* CTA: 36.76-45.76s */}
      <Phase frame={frame} fps={fps} startSec={36.76} endSec={41.76}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="1,589" original="1,590" discount="-12%" fomo="3枚セット・お得な価格" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={41.76} endSec={45.76}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
