import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, AreaChart, ComparisonChart, NotificationPop,
  SplitScreen, GalleryGrid, CardFlip, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel8/${name}`);
const ACCENT = '#FFD700'; // matches the yellow backdrop in the video
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const WaterColoringOverlay = () => {
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
            src={staticFile('video_overlay9.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        ねえ、これ知ってる？水だけで何度も遊べる塗り絵があるんだよ！
      </PopText>

      {/* PRODUCT: 3.0-31.68s, ~3.585s per segment */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={6.59}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="ふしぎな水塗り絵" items={['水だけで色が浮かび上がる', '手も服も汚れない', '繰り返し使える']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={6.59} endSec={10.17}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img2.webp')} rightSrc={img('img3.webp')} leftLabel="水でなぞる前" rightLabel="色がパッと浮かぶ" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={10.17} endSec={13.76}>
        {(p) => <div style={centerCard}><ComparisonChart {...p} accent={ACCENT} leftLabel="普通のぬりえ" leftValue={20} rightLabel="水塗り絵" rightValue={100} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={13.76} endSec={17.34}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img4.webp')} backSrc={img('img5.webp')} caption="乾くとまた真っ白に" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={17.34} endSec={20.93}>
        {(p) => <div style={centerCard}><AreaChart {...p} accent={ACCENT} title="知育効果" points={[0.2, 0.35, 0.4, 0.6, 0.78, 0.92]} valueLabel="夢中で遊びながら学べる" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={20.93} endSec={24.51}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.6評価', body: '290件のレビュー' }, { icon: '🖊️', title: '専用ペンホルダー付き', body: '持ち運びに便利' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={24.51} endSec={28.10}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={28.10} endSec={31.68}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img4.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={28.10} endSec={31.68}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        ピンク＆グリーンセット
      </PopText>

      {/* CTA: 31.68-38.68s */}
      <Phase frame={frame} fps={fps} startSec={31.68} endSec={35.68}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="1,078" original={null} discount={null} fomo="4.8K以上販売・知育にも人気" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={35.68} endSec={38.68}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
