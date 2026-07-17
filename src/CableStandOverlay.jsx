import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, AreaChart, ComparisonChart, NotificationPop,
  ProgressSteps, SplitScreen, GalleryGrid, CardFlip, RotatingCarousel, PriceShake,
  makeBaseTextStyle, centerCard,
} from './OverlayKit';

const img = (name) => staticFile(`carousel6/${name}`);
const ACCENT = '#3B5BFF'; // matches the vivid blue hood/mask that dominates the video background
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const CableStandOverlay = () => {
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
            src={staticFile('video_overlay6b.mp4')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </CameraShake>

      <PopText frame={frame} fps={fps} startSec={0} endSec={3}
        style={{ ...baseTextStyle, left: 60, top: 140, fontSize: 42, textAlign: 'center', width: 960 }}>
        これ、ケーブルとスマホスタンドが一体化してるんだよ！？
      </PopText>

      {/* PRODUCT: 3.0-40.2s, ~4.13s per segment */}
      <Phase frame={frame} fps={fps} startSec={3.00} endSec={7.13}>
        {(p) => <div style={centerCard}><AnimatedList {...p} accent={ACCENT} title="ケーブル×スタンド一体型" items={['充電しながら視聴OK', '荷物が減って身軽に', '240W超急速充電']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={7.13} endSec={11.27}>
        {(p) => <div style={centerCard}><SplitScreen {...p} accent={ACCENT} leftSrc={img('img1.webp')} rightSrc={img('img2.webp')} leftLabel="縦置き" rightLabel="横置き" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={11.27} endSec={15.40}>
        {(p) => <div style={centerCard}><ComparisonChart {...p} accent={ACCENT} leftLabel="普通の充電器" leftValue={20} rightLabel="240W急速充電" rightValue={95} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={15.40} endSec={19.53}>
        {(p) => <div style={centerCard}><CardFlip {...p} accent={ACCENT} frontSrc={img('img3.webp')} backSrc={img('img4.webp')} caption="丸みのあるコネクタでゲーム中も快適" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={19.53} endSec={23.67}>
        {(p) => <div style={centerCard}><AreaChart {...p} accent={ACCENT} title="充電スピード" points={[0.15, 0.3, 0.4, 0.65, 0.82, 0.95]} valueLabel="スマホもPCも一気に充電完了" /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={23.67} endSec={27.80}>
        {(p) => <div style={centerCard}><ProgressSteps {...p} accent={ACCENT} steps={['ケーブルを伸ばす', 'スタンドを立てる', '充電開始', '動画も作業も快適']} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={27.80} endSec={31.93}>
        {(p) => <div style={centerCard}><NotificationPop {...p} accent={ACCENT} toasts={[{ icon: '⭐', title: '4.1評価', body: '199件のレビュー' }, { icon: '📦', title: '大阪発送・30日保証', body: '初めてでも安心' }]} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={31.93} endSec={36.07}>
        {(p) => <div style={centerCard}><GalleryGrid {...p} accent={ACCENT} images={['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp'].map(img)} /></div>}
      </Phase>

      <Phase frame={frame} fps={fps} startSec={36.07} endSec={40.20}>
        {(p) => <div style={centerCard}><RotatingCarousel {...p} accent={ACCENT} images={['img1.webp', 'img3.webp', 'img5.webp'].map(img)} /></div>}
      </Phase>
      <PopText frame={frame} fps={fps} startSec={36.07} endSec={40.20}
        style={{ ...baseTextStyle, left: 0, top: 220, fontSize: 40, textAlign: 'center', width: 1080 }}>
        耐久ナイロン編み
      </PopText>

      {/* CTA: 40.20-49.20s */}
      <Phase frame={frame} fps={fps} startSec={40.20} endSec={45.20}>
        {(p) => <div style={centerCard}><PriceShake {...p} accent={ACCENT} current="999" original="3,000" discount="-67%" fomo="4,000個以上販売・大阪発送" /></div>}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={45.20} endSec={49.20}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 46, textAlign: 'center', width: 1080 }}>
        見逃さないで！<br /><span style={{ fontSize: 36 }}>→ リンクからチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
