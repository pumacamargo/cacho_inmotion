import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, AreaChart, ComparisonChart, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel2/${name}`);
const ACCENT = '#FFD700'; // matches this product's yellow ELLISS packaging
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const VitaminCOverlay = () => {
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
            src={staticFile('video_overlay2.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        ここまで美味しくて効くビタミンC、見たことない！
      </PopText>

      {/* PRODUCT: 3.0-34.36s, ~3.14s per segment */}
      <Phase frame={frame} fps={fps} startSec={3.0} endSec={6.14}>
        {(p) => <div style={centerCard}><AnimatedList {...p} title="リポソーム化ビタミンC" items={['スーッと体に浸透', '粉っぽくない', '吸収効率アップ']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={6.14} endSec={9.27}>
        {(p) => <div style={centerCard}><SplitScreen {...p} leftSrc={img('img2.webp')} rightSrc={img('img3.webp')} leftLabel="熱を加えない製法" rightLabel="パワーそのまま" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={9.27} endSec={12.41}>
        {(p) => <div style={centerCard}><AreaChart {...p} title="レモンの爽やかさ" points={[0.2, 0.35, 0.3, 0.6, 0.75, 0.92]} valueLabel="口に入れた瞬間さっぱり爽やか" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={12.41} endSec={15.54}>
        {(p) => <div style={centerCard}><CardFlip {...p} frontSrc={img('img4.webp')} backSrc={img('img5.webp')} caption="レモネードにしても◎" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={15.54} endSec={18.68}>
        {(p) => <div style={centerCard}><ComparisonChart {...p} leftLabel="普通のビタミンC" leftValue={25} rightLabel="リポソーム化" rightValue={90} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={18.68} endSec={21.82}>
        {(p) => <div style={centerCard}><NotificationPop {...p} toasts={[{ icon: '⭐', title: '4.6評価', body: '1,800件以上のレビュー' }, { icon: '💛', title: '肌の調子アップ', body: '使った人の実感の声' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={21.82} endSec={24.95}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={24.95} endSec={28.09}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} steps={['開封', 'お湯に溶かす', '飲む', '肌ツヤ実感']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={28.09} endSec={31.22}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={28.09} endSec={31.22}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        30包入り
      </PopText>

      <Phase frame={frame} fps={fps} startSec={31.22} endSec={34.36}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 34.36-43.36s */}
      <Phase frame={frame} fps={fps} startSec={34.36} endSec={39.36}>
        {(p) => <div style={centerCard}><PriceShake {...p} current="2,662" original="3,480" discount="-24%" fomo="毎日1包・続けやすい価格" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={39.36} endSec={43.36}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
