import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, MasonryGallery, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel17/${name}`);
const ACCENT = '#B08454'; // matches the natural kraft-paper tan color, echoes the eco theme
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const AirFryerPadsOverlay = () => {
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
            src={staticFile('video_overlay22.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 40, textAlign: 'center', width: 960 }}>
        200枚も入ってるノンスティックのエアフライヤーペーパーなんだ
      </PopText>

      {/* PRODUCT: 3.0-37.48s, ~4.31s per segment (8 templates — AreaChart/ComparisonChart discontinued) */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={7.31}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="ノンスティックペーパー" items={['200枚セット', 'フライヤーが汚れない', '天然素材で環境に優しい']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={7.31} endSec={11.62}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="使う前" rightLabel="使った後も汚れ知らず" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={11.62} endSec={15.93}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="焼き物にも揚げ物にもぴったり" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={15.93} endSec={20.24}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['ペーパーを敷く', '食材をのせる', '調理する', 'そのまま捨てるだけ']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={20.24} endSec={24.55}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.1評価', body: '295件のレビュー' }, { icon: '🏠', title: '家庭でもホテルでも', body: '業務用にも使える' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={24.55} endSec={28.86}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={28.86} endSec={33.17}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={28.86} endSec={33.17}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        正方形サイズ
      </PopText>

      <Phase frame={frame} fps={fps} startSec={33.17} endSec={37.48}>
        {(p) => <div style={centerCard}><MasonryGallery {...p} accent={ACCENT} columns={[
          [{ src: img('img1.webp'), h: 180 }, { src: img('img4.webp'), h: 130 }],
          [{ src: img('img2.webp'), h: 130 }, { src: img('img5.webp'), h: 180 }],
          [{ src: img('img3.webp'), h: 200 }, { src: img('img6.webp'), h: 110 }],
        ]} /></div>}
      </Phase>

      {/* CTA: 37.48-46.48s */}
      <Phase frame={frame} fps={fps} startSec={37.48} endSec={42.48}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="425" original="1,288" discount="-67%" fomo="7.2K以上販売・掃除の手間激減" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={42.48} endSec={46.48}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
