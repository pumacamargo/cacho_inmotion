import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  ProgressSteps, PriceShake, makeBaseTextStyle, centerCard, DEFAULT_ACCENT,
} from './OverlayKit';

const bottomCard = { ...centerCard, top: '72%' };

const ACCENT = DEFAULT_ACCENT;
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const ThermalPenOverlay = () => {
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
          src={staticFile('video_thermalpen.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* HOOK: 0-3s — camera shake + privacidad */}
      <CameraShake frame={frame} amplitude={45} decayFrames={22}>
        <PopText frame={frame} fps={fps} startSec={0} endSec={3}
          style={{ ...baseTextStyle, left: 60, top: 160, fontSize: 52, textAlign: 'center', width: 960, fontWeight: 'bold' }}>
          🔒 プライバシーを守れ！
        </PopText>
      </CameraShake>

      {/* 4.8-12.8s — funciones principales */}
      <Phase frame={frame} fps={fps} startSec={4.8} endSec={12.8}>
        {(p) => (
          <div style={bottomCard}>
            <AnimatedList {...p}
              title="宅配情報消しペンの特徴"
              items={[
                '📦 住所・名前・電話番号を完全消去',
                '✂️ 内蔵カッターで開封もラクラク',
                '🔁 自動収納式で安全に持ち運び',
              ]}
            />
          </div>
        )}
      </Phase>

      {/* 12.8-20.8s — 2-in-1 功能 */}
      <Phase frame={frame} fps={fps} startSec={12.8} endSec={20.8}>
        {(p) => (
          <div style={bottomCard}>
            <NotificationPop {...p} toasts={[
              { icon: '🖊️', title: '消去ペン機能', body: 'サーマルペーパーのインクを即消去' },
              { icon: '✂️', title: 'カッター機能', body: '自動収納式で指を守る安全設計' },
            ]} />
          </div>
        )}
      </Phase>

      {/* 20.8-28.8s — 使い方ステップ */}
      <Phase frame={frame} fps={fps} startSec={20.8} endSec={28.8}>
        {(p) => (
          <div style={bottomCard}>
            <ProgressSteps {...p} steps={['ラベルをはがす', '個人情報を消去', 'カッターで開封', '安心廃棄']} />
          </div>
        )}
      </Phase>

      {/* 28.8-34.8s — promo 2-for-1 */}
      <Phase frame={frame} fps={fps} startSec={28.8} endSec={34.8}>
        {(p) => (
          <div style={bottomCard}>
            <NotificationPop {...p} toasts={[
              { icon: '🎁', title: '今だけ特別オファー', body: '2つ買うと1つプレゼント！' },
              { icon: '🌈', title: 'ピンク・グリーン', body: '2色から選べる' },
            ]} />
          </div>
        )}
      </Phase>

      {/* CTA: 34.8-42.72s */}
      <Phase frame={frame} fps={fps} startSec={34.8} endSec={42.72}>
        {(p) => (
          <div style={bottomCard}>
            <PriceShake {...p} current="699" original="1,165" discount="40%OFF" fomo="今すぐチェック！" currency="¥" />
          </div>
        )}
      </Phase>

      <PopText frame={frame} fps={fps} startSec={39.8} endSec={42.72}
        style={{ ...baseTextStyle, left: 0, top: 1560, fontSize: 42, textAlign: 'center', width: 1080, fontWeight: 'bold' }}>
        プロフィールのリンクから<br /><span style={{ fontSize: 34 }}>→ チェックしてみて！</span>
      </PopText>
    </AbsoluteFill>
  );
};
