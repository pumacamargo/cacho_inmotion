import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, PriceShake, makeBaseTextStyle, centerCard,
} from './OverlayKit';

const ACCENT = '#1E90FF'; // azul que combina con el fondo blanco/gris y los acentos azules del producto
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const WaterproofHolderOverlay = () => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  if (!videoConfig) {
    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  }

  const fps = videoConfig.fps;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', fontFamily: "'Noto Sans CJK JP', 'Noto Sans JP', sans-serif" }}>
      {/* Base video */}
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('video_waterproof_holder.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* HOOK: 0-3s — camera shake + título */}
      <CameraShake frame={frame} amplitude={45} decayFrames={22}>
        <PopText frame={frame} fps={fps} startSec={0} endSec={3}
          style={{ ...baseTextStyle, left: 60, top: 160, fontSize: 50, textAlign: 'center', width: 960, fontWeight: 'bold' }}>
          防水ボックス発見！
        </PopText>
      </CameraShake>

      {/* PRODUCTO: 3-8s — características principales */}
      <Phase frame={frame} fps={fps} startSec={3.0} endSec={8.0}>
        {(p) => (
          <div style={centerCard}>
            <AnimatedList {...p} accent={ACCENT}
              title="防水スマホホルダー"
              items={['完全防水設計', '360°タッチ回転', 'スピーカー内蔵']}
            />
          </div>
        )}
      </Phase>

      {/* PRODUCTO: 8-14s — uso en diferentes lugares */}
      <Phase frame={frame} fps={fps} startSec={8.0} endSec={14.0}>
        {(p) => (
          <div style={centerCard}>
            <NotificationPop {...p} accent={ACCENT} toasts={[
              { icon: '🛁', title: 'バスルーム', body: 'お風呂でYouTube・音楽' },
              { icon: '🍳', title: 'キッチン', body: '料理しながら動画再生' },
              { icon: '🏊', title: 'プール・海', body: '水回り全対応' },
            ]} />
          </div>
        )}
      </Phase>

      {/* PRODUCTO: 14-22s — cómo usarlo */}
      <Phase frame={frame} fps={fps} startSec={14.0} endSec={22.0}>
        {(p) => (
          <div style={centerCard}>
            <ProgressSteps {...p} accent={ACCENT}
              steps={['スマホを入れる', 'ふたを閉める', '角度を調整', '楽しむ！']}
            />
          </div>
        )}
      </Phase>

      {/* PRODUCTO: 22-30s — social proof */}
      <Phase frame={frame} fps={fps} startSec={22.0} endSec={30.0}>
        {(p) => (
          <div style={centerCard}>
            <NotificationPop {...p} accent={ACCENT} toasts={[
              { icon: '⭐', title: '4.7評価', body: '14件のレビュー' },
              { icon: '🔥', title: '704台販売', body: '大人気商品' },
              { icon: '🚚', title: '無料配送', body: 'クイック発送' },
            ]} />
          </div>
        )}
      </Phase>

      {/* PRODUCTO: 30-35s — audio */}
      <Phase frame={frame} fps={fps} startSec={30.0} endSec={35.0}>
        {(p) => (
          <div style={centerCard}>
            <AnimatedList {...p} accent={ACCENT}
              title="高音質スピーカー内蔵"
              items={['Bluetooth対応', 'クリアな音質', 'ハンズフリー通話も可']}
            />
          </div>
        )}
      </Phase>

      {/* CTA: 35-40s — precio + call to action */}
      <Phase frame={frame} fps={fps} startSec={35.0} endSec={40.0}>
        {(p) => (
          <div style={centerCard}>
            <PriceShake {...p} accent={ACCENT}
              current="3,293"
              original="4,843"
              discount="-32%"
              fomo="704台販売・送料無料"
            />
          </div>
        )}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={36.0} endSec={40.0}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 44, textAlign: 'center', width: 1080, fontWeight: 'bold' }}>
        見逃さないで！<br /><span style={{ fontSize: 32 }}>→ リンクをチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
