import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, AreaChart, ComparisonChart, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel9/${name}`);
const ACCENT = '#B87C4C'; // matches the warm wood table / neutral wall in the video, and the chocolate/caramel theme
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const ChocolateOverlay = () => {
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
            src={staticFile('video_overlay10.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 40, textAlign: 'center', width: 960 }}>
        贅沢でクリーミーな割れチョコがたった200グラムで楽しめるんだよ！
      </PopText>

      {/* PRODUCT: 3.0-44.48s, ~4.15s per segment (long video, all 10 templates) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={7.15}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="贅沢な割れチョコ" items={['ナッツがぎっしり', '1袋200グラム', '冷蔵便で新鮮なまま']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={7.15} endSec={11.30}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="常温だと溶ける" rightLabel="冷蔵便で食感キープ" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={11.30} endSec={15.44}>
        {(p) => <div style={centerCard}><ComparisonChart {...p} accent={ACCENT} leftLabel="常温配送" leftValue={30} rightLabel="冷蔵便配送" rightValue={95} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={15.44} endSec={19.59}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="ナッツやフルーツの旨みたっぷり" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={19.59} endSec={23.74}>
        {(p) => <div style={centerCard}><AreaChart {...p} accent={ACCENT} title="美味しさの満足度" points={[0.3, 0.45, 0.5, 0.7, 0.85, 0.95]} valueLabel="毎回感動するクリーミーさ" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={23.74} endSec={27.89}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['冷蔵便で到着', '好きな味を選ぶ', '割って食べる', 'リピート確定']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={27.89} endSec={32.04}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.5評価', body: '10,902件のレビュー' }, { icon: '🔥', title: '130K以上販売', body: '圧倒的人気' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={32.04} endSec={36.18}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={36.18} endSec={40.33}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={36.18} endSec={40.33}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 34, textAlign: 'center', width: 1080 }}>
        スイート・ハイカカオ・オレンジ・マカダミア
      </PopText>

      <Phase frame={frame} fps={fps} startSec={40.33} endSec={44.48}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 44.48-53.48s */}
      <Phase frame={frame} fps={fps} startSec={44.48} endSec={48.48}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="2,660" original={null} discount={null} fomo="10,902件の高評価・130K以上販売" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={48.48} endSec={53.48}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
