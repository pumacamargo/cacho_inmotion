import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel12/${name}`);
const ACCENT = '#A8967D'; // warm taupe/leather tone, complements the black bag against the neutral wall
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const BagPackV2Overlay = () => {
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
            src={staticFile('video_overlay27.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 40, textAlign: 'center', width: 960 }}>
        大容量でソフトPUレザーなのに超軽いんだよ！
      </PopText>

      {/* PRODUCT: 3.0-42.6s, ~4.95s per segment (8 templates — AreaChart/ComparisonChart discontinued) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={7.95}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="大容量ソフトPUレザーバッグ" items={['A4サイズが余裕で入る', '防水・傷に強い', '超軽量設計']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={7.95} endSec={12.90}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="肩掛け" rightLabel="バックパックスタイル" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={12.90} endSec={17.85}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="3WAY仕様で使い方自由自在" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={17.85} endSec={22.80}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['荷物を入れる', 'ポケットで整理', '肩掛けor手持ち', '通学・通勤に']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={22.80} endSec={27.75}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.3評価', body: '181件のレビュー' }, { icon: '🔥', title: '2.3K以上販売', body: '人気急上昇中' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={27.75} endSec={32.70}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={32.70} endSec={37.65}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={32.70} endSec={37.65}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        落ち着いたブラウン
      </PopText>

      <Phase frame={frame} fps={fps} startSec={37.65} endSec={42.60}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 42.60-51.60s */}
      <Phase frame={frame} fps={fps} startSec={42.60} endSec={47.60}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="1,400" original="8,200" discount="-83%" fomo="2.3K以上販売・縫製が丁寧で長持ち" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={47.60} endSec={51.60}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
