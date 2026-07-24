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

export const MonitorArmV3Overlay = () => {
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
            src={staticFile('video_overlay26.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        マジで値段が安すぎてびっくりしたんだけど！
      </PopText>

      {/* PRODUCT: 3.0-42.36s, ~4.92s per segment (8 templates — AreaChart/ComparisonChart discontinued) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={7.92}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="モニターアーム A5" items={['組み立て簡単', '角度自在に調整', 'デスクスペースが広々']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={7.92} endSec={12.84}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="台なしでも使える" rightLabel="省スペースで快適" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={12.84} endSec={17.76}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="首・肩の負担を軽減" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={17.76} endSec={22.68}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['デスクにクランプ固定', 'モニターを取り付け', '角度を調整', '快適な作業姿勢']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={22.68} endSec={27.60}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '📐', title: '17〜32インチ対応', body: '耐荷重9kgまで安心' }, { icon: '🔄', title: '取り外し自由', body: 'アームから外して持ち運べる' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={27.60} endSec={32.52}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={32.52} endSec={37.44}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={32.52} endSec={37.44}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        ブラックカラー
      </PopText>

      <Phase frame={frame} fps={fps} startSec={37.44} endSec={42.36}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 42.36-51.36s */}
      <Phase frame={frame} fps={fps} startSec={42.36} endSec={47.36}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="3,480" original={null} discount={null} fomo="もう1台買う人多数・高コスパ" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={47.36} endSec={51.36}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
