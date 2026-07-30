import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, PriceShake, makeBaseTextStyle, centerCard, DEFAULT_ACCENT,
} from './OverlayKit';

const ACCENT = DEFAULT_ACCENT;
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const BabyBusOverlay = () => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  if (!videoConfig) {
    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  }

  const fps = videoConfig.fps;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', fontFamily: "'Noto Sans CJK JP', 'Noto Sans JP', sans-serif" }}>
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('video_babybus.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* HOOK: 0-3s */}
      <CameraShake frame={frame} amplitude={45} decayFrames={22}>
        <PopText frame={frame} fps={fps} startSec={0} endSec={3}
          style={{ ...baseTextStyle, left: 60, top: 160, fontSize: 50, textAlign: 'center', width: 960, fontWeight: 'bold' }}>
          英語と日本語が学べる！
        </PopText>
      </CameraShake>

      {/* 3-10s — contenido educativo */}
      <Phase frame={frame} fps={fps} startSec={3.0} endSec={10.0}>
        {(p) => (
          <div style={centerCard}>
            <AnimatedList {...p} title="おしゃべりバスの中身" items={['170枚フラッシュカード', '25曲の人気ソング', '英語・日本語 2カ国語']} />
          </div>
        )}
      </Phase>

      {/* 10-18s — características del diseño */}
      <Phase frame={frame} fps={fps} startSec={10.0} endSec={18.0}>
        {(p) => (
          <div style={centerCard}>
            <NotificationPop {...p} toasts={[
              { icon: '👶', title: '目に優しい設計', body: 'LCD画面なし・安心安全' },
              { icon: '🔋', title: 'USB-C充電対応', body: '長時間バッテリー内蔵' },
              { icon: '🔊', title: '音量3段階調節', body: 'コンパクトで持ち運び便利' },
            ]} />
          </div>
        )}
      </Phase>

      {/* 18-26s — categorías de aprendizaje */}
      <Phase frame={frame} fps={fps} startSec={18.0} endSec={26.0}>
        {(p) => (
          <div style={centerCard}>
            <ProgressSteps {...p} steps={['ひらがな・数字', '色・形・動物', '食べ物・季節', 'ABC・英単語']} />
          </div>
        )}
      </Phase>

      {/* 26-33s — social proof */}
      <Phase frame={frame} fps={fps} startSec={26.0} endSec={33.0}>
        {(p) => (
          <div style={centerCard}>
            <NotificationPop {...p} toasts={[
              { icon: '⭐', title: '4.8評価', body: '335件のレビュー' },
              { icon: '🔥', title: '5,500台以上販売', body: '大人気知育トイ' },
              { icon: '🚚', title: '無料配送', body: 'クイック発送' },
            ]} />
          </div>
        )}
      </Phase>

      {/* CTA: 33-37.68s */}
      <Phase frame={frame} fps={fps} startSec={33.0} endSec={37.68}>
        {(p) => (
          <div style={centerCard}>
            <PriceShake {...p} current="4,578" original={null} discount={null} fomo="5,500台以上販売・送料無料" />
          </div>
        )}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={34.5} endSec={37.68}
        style={{ ...baseTextStyle, left: 0, top: 1550, fontSize: 44, textAlign: 'center', width: 1080, fontWeight: 'bold' }}>
        見逃さないで！<br /><span style={{ fontSize: 32 }}>→ リンクをチェック</span>
      </PopText>
    </AbsoluteFill>
  );
};
