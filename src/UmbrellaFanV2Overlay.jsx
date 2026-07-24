import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel7/${name}`);
const ACCENT = '#5DADE2'; // matches the neutral wall and the summer/cooling theme
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const UmbrellaFanV2Overlay = () => {
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
            src={staticFile('video_overlay25.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        本当に信じられないくらい安いんだよね！
      </PopText>

      {/* PRODUCT: 3.0-60.84s, ~7.2s per segment (8 templates — AreaChart/ComparisonChart discontinued) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={10.23}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="日傘+ハンディファンセット" items={['ワンタッチ自動開閉', 'UVカット100%', '体感マイナス10℃']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={10.23} endSec={17.46}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img2.webp')} rightSrc={img('img1.webp')} leftLabel="開く前" rightLabel="ワンタッチで開く" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={17.46} endSec={24.69}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="カーボン骨組みで強風にも安心" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={24.69} endSec={31.92}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['ワンタッチで開く', '日傘をさす', 'ファンを装着', '涼しく快適']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={31.92} endSec={39.15}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.5評価', body: '307件のレビュー' }, { icon: '☔', title: '晴雨兼用', body: '急な雨にも使える' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={39.15} endSec={46.38}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={46.38} endSec={53.61}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img4.webp', 'img5.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={46.38} endSec={53.61}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        カラー展開豊富
      </PopText>

      <Phase frame={frame} fps={fps} startSec={53.61} endSec={60.84}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 60.84-69.84s */}
      <Phase frame={frame} fps={fps} startSec={60.84} endSec={65.84}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="3,852" original="8,560" discount="-55%" fomo="6.0K以上販売・家族用にもおすすめ" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={65.84} endSec={69.84}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
