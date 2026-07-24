import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel16/${name}`);
const ACCENT = '#3D5AC0'; // matches the royal blue "KOLLIDE" box
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const MagneticGameOverlay = () => {
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
            src={staticFile('video_overlay21.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        マグネットゲーム、まさかの戦略的すぎて笑っちゃう！
      </PopText>

      {/* PRODUCT: 3.0-41.16s, ~4.77s per segment (8 templates — AreaChart/ComparisonChart discontinued) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={7.77}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="マグネット戦略ゲーム" items={['磁石の引き合いを駆使', '木製ピースで持ちやすい', '2人で対戦できる']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={7.77} endSec={12.54}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="ピースを配置" rightLabel="磁石で引き寄せ合う" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={12.54} endSec={17.31}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="頭も手も使う頭脳戦" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={17.31} endSec={22.08}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['ピースを並べる', '交互に取る', '磁石を避ける', '最後まで残ったら勝ち']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={22.08} endSec={26.85}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '🎒', title: '収納ケース付き', body: '持ち運びもラクラク' }, { icon: '👨‍👩‍👧', title: '対象年齢8歳以上', body: '家族みんなで楽しめる' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={26.85} endSec={31.62}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={31.62} endSec={36.39}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={31.62} endSec={36.39}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        専用バッグ付き
      </PopText>

      <Phase frame={frame} fps={fps} startSec={36.39} endSec={41.16}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 41.16-50.16s */}
      <Phase frame={frame} fps={fps} startSec={41.16} endSec={46.16}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="1,437" original="3,194" discount="-55%" fomo="家族で盛り上がる・友達の家でも大活躍" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={46.16} endSec={50.16}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
