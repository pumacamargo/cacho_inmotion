import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, ComparisonChart, NotificationPop,
  SplitScreen, GalleryGrid, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel4/${name}`);
const ACCENT = '#5DC3E8'; // matches the featured ice-blue (アイスブルー) colorway
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const BottlePouchOverlay = () => {
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
            src={staticFile('video_overlay4.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        ねえ、みんなこれ知ってる？めっちゃ便利なアイテム見つけちゃった！
      </PopText>

      {/* PRODUCT: 3.0-26.69s, ~3.95s per segment (shorter video, 6 segments) */}
      <Phase frame={frame} fps={fps} startSec={3.0} endSec={6.95}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="3wayスマホポーチ" items={['保冷・保温対応', '大きめ水筒もすっぽり', 'スマホ・小物も収納']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={6.95} endSec={10.90}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img2.webp')} rightSrc={img('img3.webp')} leftLabel="撥水素材" rightLabel="サッと拭くだけ" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={10.90} endSec={14.85}>
        {(p) => <div style={centerCard}><ComparisonChart {...p} accent={ACCENT} leftLabel="普通のポーチ" leftValue={30} rightLabel="3wayポーチ" rightValue={95} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={14.85} endSec={18.80}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.5評価', body: '588件のレビュー' }, { icon: '🔥', title: '6.4K以上販売', body: 'リピーター続出' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={18.80} endSec={22.75}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={18.80} endSec={22.75}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        全5色展開
      </PopText>

      <Phase frame={frame} fps={fps} startSec={22.75} endSec={26.69}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      {/* CTA: 26.69-32.69s */}
      <Phase frame={frame} fps={fps} startSec={26.69} endSec={30.69}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="2,064" original="2,580" discount="-20%" fomo="今なら20%OFF・588件の高評価" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={30.69} endSec={32.69}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
