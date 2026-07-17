import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, AreaChart, ComparisonChart, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel7/${name}`);
const ACCENT = '#5DADE2'; // matches the neutral-cool wall/sky tones in the video and the product's summer/cooling theme
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const UmbrellaFanOverlay = () => {
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
            src={staticFile('video_overlay8.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        え、これが完全遮光100％の日傘だって知ってた？
      </PopText>

      {/* PRODUCT: 3.0-50.76s, ~4.78s per segment (long video, all 10 templates) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={7.78}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="完全遮光100%日傘セット" items={['ワンタッチ自動開閉', 'UVカット100%', 'カーボン骨組みで丈夫']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={7.78} endSec={12.55}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img2.webp')} rightSrc={img('img1.webp')} leftLabel="開く前" rightLabel="ワンタッチで開く" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={12.55} endSec={17.33}>
        {(p) => <div style={centerCard}><ComparisonChart {...p} accent={ACCENT} leftLabel="普通の日傘" leftValue={40} rightLabel="完全遮光100%" rightValue={100} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={17.33} endSec={22.10}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="コンパクトに折りたためる" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={22.10} endSec={26.88}>
        {(p) => <div style={centerCard}><AreaChart {...p} accent={ACCENT} title="体感温度" points={[0.9, 0.7, 0.75, 0.5, 0.3, 0.15]} valueLabel="ハンディファンで体感マイナス10℃" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={26.88} endSec={31.66}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['ワンタッチで開く', '日傘をさす', 'ファンを装着', '涼しく快適']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={31.66} endSec={36.43}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.5評価', body: '216件のレビュー' }, { icon: '☀️', title: 'UVカット100%', body: '紫外線から肌を守る' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={36.43} endSec={41.21}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={41.21} endSec={45.99}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img4.webp', 'img5.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={41.21} endSec={45.99}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        カラー展開豊富
      </PopText>

      <Phase frame={frame} fps={fps} startSec={45.99} endSec={50.76}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 50.76-59.76s */}
      <Phase frame={frame} fps={fps} startSec={50.76} endSec={55.76}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="3,222" original="7,160" discount="-55%" fomo="5,000個以上販売・夏先取りセール" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={55.76} endSec={59.76}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
