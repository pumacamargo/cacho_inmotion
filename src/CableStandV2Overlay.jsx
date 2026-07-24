import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard, envelope,
} from './OverlayKit';

const img = (name) => staticFile(`carousel6/${name}`);
const ACCENT = '#3B5BFF'; // matches the vivid blue hood/mask that dominates the video background
const baseTextStyle = makeBaseTextStyle(ACCENT);

// One-off promo banner for the トクトクSALE (7/16-7/19) — NOT part of the reusable kit.
const SaleBanner = ({ frame, fps, startSec, endSec }) => (
  <Phase frame={frame} fps={fps} startSec={startSec} endSec={endSec}>
    {({ localFrame, durationFrames, fps: f }) => {
      const { scale, opacity } = envelope(localFrame, durationFrames, f);
      return (
        <div style={{
          position: 'absolute', bottom: 50, left: '50%',
          transform: `translateX(-50%) scale(${scale})`, opacity,
          width: 1000, borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)', border: '3px solid rgba(255,255,255,0.6)',
        }}>
          <Img src={staticFile('carousel12/sale_banner.jpg')} style={{ width: '100%', display: 'block' }} />
        </div>
      );
    }}
  </Phase>
);

export const CableStandV2Overlay = () => {
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
            src={staticFile('video_overlay16.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 40, textAlign: 'center', width: 960 }}>
        充電ケーブルにスマホスタンドが合体してるんだよ！
      </PopText>

      {/* PRODUCT: 3.0-47.2s, ~5.5s per segment (8 templates — AreaChart/ComparisonChart discontinued) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={8.53}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="ケーブル×スタンド一体型" items={['360度回転', '1.5m PD3.1対応', '240W超急速充電']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={8.53} endSec={14.05}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="縦置き" rightLabel="横置き" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={14.05} endSec={19.58}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="丸みのあるコネクタでゲーム中も快適" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={19.58} endSec={25.10}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['ケーブルを伸ばす', 'スタンドを立てる', '充電開始', '動画も作業も快適']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={25.10} endSec={30.63}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.1評価', body: '199件のレビュー' }, { icon: '📦', title: '大阪発送・30日保証', body: '初めてでも安心' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={30.63} endSec={36.15}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={36.15} endSec={41.68}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={36.15} endSec={41.68}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        耐久ナイロン編み
      </PopText>

      <Phase frame={frame} fps={fps} startSec={41.68} endSec={47.20}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* ONE-OFF: トクトクSALE banner */}
      <SaleBanner frame={frame} fps={fps} startSec={3.0} endSec={47.20} />

      {/* CTA: 47.20-56.20s */}
      <Phase frame={frame} fps={fps} startSec={47.20} endSec={52.20}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="998" original="3,000" discount="-67%" fomo="4,000個以上販売・大阪発送" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={52.20} endSec={56.20}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
