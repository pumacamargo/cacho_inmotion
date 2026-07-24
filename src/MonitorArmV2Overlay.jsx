import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel13/${name}`);
const ACCENT = '#4A90D9'; // clean tech blue, matches the neutral white/gray backdrop
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const MonitorArmV2Overlay = () => {
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
            src={staticFile('video_overlay19.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 44, textAlign: 'center', width: 960 }}>
        え、これがこんなに安いの!?
      </PopText>

      {/* PRODUCT: 3.0-34.6s, ~3.95s per segment (8 templates — AreaChart/ComparisonChart discontinued) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={6.95}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="モニターアーム A5" items={['自由自在に可動', 'デスクスペースが広々', '目線調整で姿勢改善']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={6.95} endSec={10.90}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="普通のスタンド" rightLabel="アームなら省スペース" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={10.90} endSec={14.85}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="首・肩の負担を軽減" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={14.85} endSec={18.80}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['デスクにクランプ固定', 'モニターを取り付け', '目線に合わせ調整', '快適な作業姿勢']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={18.80} endSec={22.75}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '📐', title: '17〜32インチ対応', body: '耐荷重9kgまで安心' }, { icon: '🔄', title: '取り外し自由', body: '他の部屋でも使い回せる' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={22.75} endSec={26.70}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={26.70} endSec={30.65}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={26.70} endSec={30.65}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        ブラックカラー
      </PopText>

      <Phase frame={frame} fps={fps} startSec={30.65} endSec={34.60}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 34.60-43.60s */}
      <Phase frame={frame} fps={fps} startSec={34.60} endSec={39.60}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="2,784" original="3,480" discount="-20%" fomo="1.5K以上販売・4.7の高評価" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={39.60} endSec={43.60}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
