import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, AreaChart, ComparisonChart, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel3/${name}`);
const ACCENT = '#FFD700'; // matches BabyBus's bright yellow bus body
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const PandaCardOverlay = () => {
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
            src={staticFile('video_overlay3.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        こんな楽しい知育玩具、見たことない！
      </PopText>

      {/* PRODUCT: 3.0-34.48s, ~3.15s per segment */}
      <Phase frame={frame} fps={fps} startSec={3.0} endSec={6.15}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="はじめてのおしゃべりバス" items={['日英フラッシュカード170枚', '25曲の音楽再生', 'バイリンガル教育']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={6.15} endSec={9.30}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img2.webp')} rightSrc={img('img3.webp')} leftLabel="カードを差し込むだけ" rightLabel="バイリンガル学習" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={9.30} endSec={12.44}>
        {(p) => <div style={centerCard}><AreaChart {...p} accent={ACCENT} title="音楽で学ぶ" points={[0.2, 0.4, 0.35, 0.6, 0.7, 0.9]} valueLabel="25曲でカード無しでも楽しい" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={12.44} endSec={15.59}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img4.webp')} backSrc={img('img5.webp')} caption="液晶じゃないから目に優しい" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={15.59} endSec={18.74}>
        {(p) => <div style={centerCard}><ComparisonChart {...p} accent={ACCENT} leftLabel="液晶パネル式" leftValue={70} rightLabel="BabyBus" rightValue={15} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={18.74} endSec={21.89}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.8評価', body: '305件のレビュー' }, { icon: '🔊', title: '音量3段階', body: 'お子様の耳にも配慮' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={21.89} endSec={25.04}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={25.04} endSec={28.18}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['カードを選ぶ', '差し込む', '聞く', 'まねする']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={28.18} endSec={31.33}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={28.18} endSec={31.33}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        170枚のカード
      </PopText>

      <Phase frame={frame} fps={fps} startSec={31.33} endSec={34.48}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 34.48-43.48s */}
      <Phase frame={frame} fps={fps} startSec={34.48} endSec={39.48}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="4,578" original={null} discount={null} fomo="5,200人以上が購入・送料無料" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={39.48} endSec={43.48}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
