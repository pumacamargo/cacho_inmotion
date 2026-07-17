import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, AreaChart, ComparisonChart, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel10/${name}`);
const ACCENT = '#4FA3B5'; // matches the teal-blue backdrop in the video
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const PerfumeAtomizerOverlay = () => {
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
            src={staticFile('video_overlay11.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 40, textAlign: 'center', width: 960 }}>
        5mlの詰め替え用香水ボトル、アルミニウム製で超丈夫なんだよね
      </PopText>

      {/* PRODUCT: 3.0-52.24s, ~4.92s per segment (long video, all 10 templates) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={7.92}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="詰め替え香水アトマイザー" items={['アルミニウム製で丈夫', '漏れ防止設計', 'コンパクトで持ち運び便利']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={7.92} endSec={12.85}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="普通のボトルは漏れる" rightLabel="これは漏れ知らず" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={12.85} endSec={17.77}>
        {(p) => <div style={centerCard}><ComparisonChart {...p} accent={ACCENT} leftLabel="普通のボトル" leftValue={60} rightLabel="このボトル" rightValue={5} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={17.77} endSec={22.70}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="透明な窓で残量が一目でわかる" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={22.70} endSec={27.62}>
        {(p) => <div style={centerCard}><AreaChart {...p} accent={ACCENT} title="スプレーの均一さ" points={[0.3, 0.45, 0.55, 0.7, 0.85, 0.95]} valueLabel="押すだけで細かいミスト" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={27.62} endSec={32.54}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['底から詰め替え', 'ノズルを押す', '均一にスプレー', '持ち運びOK']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={32.54} endSec={37.47}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '💧', title: '漏れ防止', body: 'アルミニウムボディで安心' }, { icon: '👜', title: 'コンパクト設計', body: 'バッグに入れても邪魔にならない' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={37.47} endSec={42.39}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={42.39} endSec={47.32}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={42.39} endSec={47.32}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        カラー展開
      </PopText>

      <Phase frame={frame} fps={fps} startSec={47.32} endSec={52.24}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 52.24-61.24s */}
      <Phase frame={frame} fps={fps} startSec={52.24} endSec={56.24}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="699" original="1,369" discount="-49%" fomo="詰め替え簡単・旅行にも便利" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={56.24} endSec={61.24}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
