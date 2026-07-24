import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel14/${name}`);
const ACCENT = '#5FAFA3'; // clean soft teal, complements the neutral white backdrop and "tidy home" theme
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const HomeHangerOverlay = () => {
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
            src={staticFile('video_overlay18.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        シャツが一気に9枚も干せちゃうんだよ！
      </PopText>

      {/* PRODUCT: 3.0-36.36s, ~4.17s per segment (8 templates — AreaChart/ComparisonChart discontinued) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={7.17}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="9穴多機能ハンガー" items={['シャツ9枚を一気に干せる', '折りたたみ式で回転', '省スペース設計']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={7.17} endSec={11.34}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="折りたたむ前" rightLabel="コンパクトに収納" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={11.34} endSec={15.51}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="クローゼットでも大活躍" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={15.51} endSec={19.68}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['広げる', '服をかける', '回転式で調整', '省スペースに収納']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={19.68} endSec={23.85}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '✅', title: '軽量設計', body: '持ち運びもラクラク' }, { icon: '📦', title: '5個セット・送料無料', body: 'ホワイトカラー' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={23.85} endSec={28.02}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.jpeg'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={28.02} endSec={32.19}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp', 'img6.jpeg'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={28.02} endSec={32.19}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        5個セット
      </PopText>

      <Phase frame={frame} fps={fps} startSec={32.19} endSec={36.36}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.jpeg'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 36.36-45.36s */}
      <Phase frame={frame} fps={fps} startSec={36.36} endSec={41.36}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="590" original="738" discount="-20%" fomo="リピート買い多数・送料無料" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={41.36} endSec={45.36}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
