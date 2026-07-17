import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, AreaChart, ComparisonChart, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel11/${name}`);
const ACCENT = '#D3273E'; // matches the bold red packaging that dominates the video frame
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const CreatineOverlay = () => {
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
            src={staticFile('video_overlay12.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 40, textAlign: 'center', width: 960 }}>
        クレアチンでここまで純度99.9％ってほぼピュアってレベルなんだよ！
      </PopText>

      {/* PRODUCT: 3.0-39.44s, ~4.05s per segment */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={7.05}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="純度99.9%クレアチン" items={['超微粒子パウダー', '溶けるのが早い', '雑味ゼロ']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={7.05} endSec={11.10}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="普通のクレアチン" rightLabel="Woutは溶けやすい" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={11.10} endSec={15.15}>
        {(p) => <div style={centerCard}><ComparisonChart {...p} accent={ACCENT} leftLabel="一般的な純度" leftValue={85} rightLabel="Wout 99.9%" rightValue={99} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={15.15} endSec={19.19}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="GMP認証工場で製造" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={19.19} endSec={23.24}>
        {(p) => <div style={centerCard}><AreaChart {...p} accent={ACCENT} title="溶けやすさ" points={[0.3, 0.45, 0.55, 0.75, 0.88, 0.97]} valueLabel="どんなドリンクにも味変なし" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={23.24} endSec={27.29}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['スプーンで計量5g', 'ドリンクに溶かす', 'トレーニング前後に摂取', '毎日継続']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={27.29} endSec={31.34}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.7評価', body: '75件のレビュー' }, { icon: '✅', title: 'GMP認証工場', body: '品質・安全性を徹底管理' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={31.34} endSec={35.39}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={35.39} endSec={39.44}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={35.39} endSec={39.44}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        1000g・200食分
      </PopText>

      {/* CTA: 39.44-48.44s */}
      <Phase frame={frame} fps={fps} startSec={39.44} endSec={43.44}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="2,690" original={null} discount={null} fomo="GMP認証・純度99.9%の安心品質" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={43.44} endSec={48.44}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
