import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { DEFAULT_ACCENT } from './OverlayKit';

const ACCENT = DEFAULT_ACCENT;

// Individual floating review card — white background, slight rotation
function FloatingReview({ localFrame, fps, username, stars = 5, text, x, y, rotation = 0, delay = 0 }) {
  const f = Math.max(0, localFrame - delay);
  const s = spring({ frame: f, fps, config: { damping: 12, stiffness: 160 } });
  const starsStr = '★'.repeat(stars) + '☆'.repeat(5 - stars);

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `rotate(${rotation}deg) scale(${s})`,
      opacity: s,
      transformOrigin: 'center center',
      width: 470,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        padding: '18px 22px',
        boxShadow: '7px 10px 0 rgba(0,0,0,0.35), 10px 18px 40px rgba(0,0,0,0.7)',
      }}>
        <div style={{ color: '#FFA500', fontSize: 26, marginBottom: 6 }}>{starsStr}</div>
        <div style={{ color: '#111', fontSize: 26, fontWeight: 700, marginBottom: 6 }}>{username}</div>
        <div style={{ color: '#333', fontSize: 24, lineHeight: 1.45 }}>{text}</div>
      </div>
    </div>
  );
}

export const ReviewCardOverlay = () => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  if (!videoConfig) return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  const fps = videoConfig.fps;

  const reviews = [
    // orden de aparición: abajo izq → arriba izq → medio → arriba der → abajo der
    { username: 'き**こ 🇯🇵', stars: 5, text: '曲面がいい感じ。没入感が全然違う！買ってよかった',         x: 10,  y: 1360, rotation: -9,  delay: 0  },
    { username: '絃**葉 🇯🇵', stars: 5, text: '120fps対応でゲームもめっちゃやりやすい！設定もしやすい',   x: 10,  y: 160,  rotation: -7,  delay: 7  },
    { username: 'た**ろ 🇯🇵', stars: 5, text: 'コスパ最高すぎる。3年保証も安心ポイント👍',                 x: 300, y: 850,  rotation:  4,  delay: 14 },
    { username: 'ニ**マ 🇯🇵', stars: 5, text: '画質がきれいで大満足！設置も簡単でした。',                 x: 610, y: 140,  rotation:  8,  delay: 21 },
    { username: 'さ**き 🇯🇵', stars: 5, text: '発色もよくて目が疲れにくい。毎日使ってます！',             x: 610, y: 1390, rotation: -6,  delay: 28 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', fontFamily: "'Noto Sans CJK JP', 'Noto Sans JP', sans-serif" }}>
      <AbsoluteFill>
        <OffthreadVideo src={staticFile('video_ktcmonitor.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {reviews.map((r, i) => (
        <FloatingReview key={i} localFrame={frame} fps={fps} {...r} />
      ))}
    </AbsoluteFill>
  );
};
