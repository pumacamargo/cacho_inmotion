import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { OUTLINE_TEXT_STYLE, DEFAULT_FONT } from './OverlayKit';

const TEXT = '旦那が買ったモニター';
const STAGGER = 3; // frames entre cada letra

// 1. TypeWriter — letras aparecen de golpe una tras otra (máquina de escribir)
function TypeWriter({ frame, fps, startSec, text = TEXT, style = {} }) {
  const startF = startSec * fps;
  if (frame < startF) return null;
  const local = frame - startF;
  const visible = Math.floor(local / STAGGER) + 1;
  return (
    <div style={{ display: 'flex', ...style }}>
      {[...text].map((ch, i) => (
        <span key={i} style={{ ...OUTLINE_TEXT_STYLE, opacity: i < visible ? 1 : 0 }}>{ch}</span>
      ))}
    </div>
  );
}

// 2. SpringPop — cada letra hace pop-in con spring escalonado
function SpringPop({ frame, fps, startSec, text = TEXT, style = {} }) {
  const startF = startSec * fps;
  if (frame < startF) return null;
  const local = frame - startF;
  return (
    <div style={{ display: 'flex', ...style }}>
      {[...text].map((ch, i) => {
        const f = Math.max(0, local - i * STAGGER);
        const s = spring({ frame: f, fps, config: { damping: 8, stiffness: 280 } });
        return (
          <span key={i} style={{ ...OUTLINE_TEXT_STYLE, display: 'inline-block', transform: `scale(${s})`, opacity: s }}>{ch}</span>
        );
      })}
    </div>
  );
}

// 3. WaveUp — cada letra sube; glow blanco en contenedor (drop-shadow grupal, no entre letras)
function WaveUp({ frame, fps, startSec, text = TEXT, style = {}, stagger = 1 }) {
  const startF = startSec * fps;
  if (frame < startF) return null;
  const local = frame - startF;

  // Glow global basado en cuántas letras han aparecido
  const totalChars = text.length;
  const appeared = [...text].filter((_, i) => {
    const f = Math.max(0, local - i * stagger);
    return spring({ frame: f, fps, config: { damping: 12, stiffness: 200 } }) > 0.05;
  }).length;
  const glowProgress = appeared / totalChars;

  return (
    <div style={{
      display: 'flex', ...style,
      filter: `drop-shadow(0 0 6px rgba(255,255,255,${glowProgress})) drop-shadow(0 0 20px rgba(255,255,255,${glowProgress * 0.9})) drop-shadow(0 0 40px rgba(255,255,255,${glowProgress * 0.7}))`,
    }}>
      {[...text].map((ch, i) => {
        const f = Math.max(0, local - i * stagger);
        const s = spring({ frame: f, fps, config: { damping: 12, stiffness: 200 } });
        const y = interpolate(s, [0, 1], [40, 0]);
        // Solo borde negro en el span — el glow blanco lo maneja el contenedor
        const borderOnly = '-7px -7px 0 #000, 7px -7px 0 #000, -7px 7px 0 #000, 7px 7px 0 #000, -10px 0 0 #000, 10px 0 0 #000, 0 -10px 0 #000, 0 10px 0 #000';
        return (
          <span key={i} style={{ ...OUTLINE_TEXT_STYLE, textShadow: borderOnly, display: 'inline-block', transform: `translateY(${y}px)`, opacity: s }}>{ch}</span>
        );
      })}
    </div>
  );
}

// 4. DropIn — cada letra cae desde arriba rebotando
function DropIn({ frame, fps, startSec, text = TEXT, style = {} }) {
  const startF = startSec * fps;
  if (frame < startF) return null;
  const local = frame - startF;
  return (
    <div style={{ display: 'flex', ...style }}>
      {[...text].map((ch, i) => {
        const f = Math.max(0, local - i * STAGGER);
        const s = spring({ frame: f, fps, config: { damping: 6, stiffness: 300, mass: 0.6 } });
        const y = interpolate(s, [0, 1], [-60, 0]);
        return (
          <span key={i} style={{ ...OUTLINE_TEXT_STYLE, display: 'inline-block', transform: `translateY(${y}px)`, opacity: Math.min(1, s * 3) }}>{ch}</span>
        );
      })}
    </div>
  );
}

// Comparación de 3 niveles de glow en el mismo frame
export const GlowCompareDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glowOptions = [
    { label: 'A — sutil',   glow: `drop-shadow(0 0 4px rgba(255,255,255,1)) drop-shadow(0 0 12px rgba(255,255,255,0.7))` },
    { label: 'B — medio',   glow: `drop-shadow(0 0 6px rgba(255,255,255,1)) drop-shadow(0 0 20px rgba(255,255,255,0.9)) drop-shadow(0 0 40px rgba(255,255,255,0.7))` },
    { label: 'C — fuerte',  glow: `drop-shadow(0 0 8px rgba(255,255,255,1)) drop-shadow(0 0 30px rgba(255,255,255,0.9)) drop-shadow(0 0 60px rgba(255,255,255,0.8)) drop-shadow(0 0 90px rgba(255,255,255,0.5))` },
  ];

  const yPositions = [230, 840, 1450];
  const fontSize = 68;
  const stagger = 1;
  const text = TEXT;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', fontFamily: DEFAULT_FONT }}>
      <AbsoluteFill>
        <OffthreadVideo src={staticFile('video_ktcmonitor.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {glowOptions.map(({ label, glow }, gi) => {
        const local = frame;
        const appeared = [...text].filter((_, i) => {
          const f = Math.max(0, local - i * stagger);
          return spring({ frame: f, fps, config: { damping: 12, stiffness: 200 } }) > 0.05;
        }).length;
        const glowProgress = appeared / text.length;

        const dynamicGlow = glow.replace(/rgba\(255,255,255,([^)]+)\)/g, (_, alpha) =>
          `rgba(255,255,255,${(parseFloat(alpha) * glowProgress).toFixed(2)})`
        );

        return (
          <div key={gi} style={{ position: 'absolute', left: 30, top: yPositions[gi], filter: dynamicGlow }}>
            <div style={{ ...OUTLINE_TEXT_STYLE, fontSize: 36, marginBottom: 4 }}>{label}</div>
            <div style={{ display: 'flex' }}>
              {[...text].map((ch, i) => {
                const f = Math.max(0, frame - i * stagger);
                const s = spring({ frame: f, fps, config: { damping: 12, stiffness: 200 } });
                const y = interpolate(s, [0, 1], [30, 0]);
                const borderOnly = '-5px -5px 0 #000, 5px -5px 0 #000, -5px 5px 0 #000, 5px 5px 0 #000, -7px 0 0 #000, 7px 0 0 #000, 0 -7px 0 #000, 0 7px 0 #000';
                return (
                  <span key={i} style={{ ...OUTLINE_TEXT_STYLE, textShadow: borderOnly, fontSize, display: 'inline-block', transform: `translateY(${y}px)`, opacity: s }}>{ch}</span>
                );
              })}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Layout: cada variante ocupa ~4 segundos, con label
export const TextAnimDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const variants = [
    { label: '① TypeWriter', sec: 1,  Component: TypeWriter },
    { label: '② SpringPop',  sec: 7,  Component: SpringPop  },
    { label: '③ WaveUp',     sec: 13, Component: WaveUp     },
    { label: '④ DropIn',     sec: 19, Component: DropIn     },
  ];

  const commonStyle = { position: 'absolute', left: 40, top: 200, fontSize: 80 };

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', fontFamily: DEFAULT_FONT }}>
      <AbsoluteFill>
        <OffthreadVideo src={staticFile('video_ktcmonitor.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {variants.map(({ label, sec, Component }) => {
        const startF = sec * fps;
        const endF = (sec + 5) * fps;
        if (frame < startF || frame > endF) return null;
        return (
          <React.Fragment key={label}>
            <div style={{ position: 'absolute', top: 120, left: 40, fontSize: 42, ...OUTLINE_TEXT_STYLE }}>{label}</div>
            <Component frame={frame} fps={fps} startSec={sec} style={commonStyle} />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
