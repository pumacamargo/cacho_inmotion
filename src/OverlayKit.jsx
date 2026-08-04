import React from 'react';
import { Img, spring, interpolate } from 'remotion';

export const SHADOW = '0 0 12px rgba(0,0,0,0.9), 2px 2px 0 rgba(0,0,0,0.9), -2px -2px 0 rgba(0,0,0,0.9), 2px -2px 0 rgba(0,0,0,0.9), -2px 2px 0 rgba(0,0,0,0.9)';
export const DEFAULT_ACCENT = '#FFD700';
export const EXIT_FRAMES = 8;
export const DEFAULT_FONT = "'KeinannMaruPOPjp', 'けいなん丸ポップ体JP', 'Noto Color Emoji', 'Noto Sans CJK JP', sans-serif";

// Estilo base para letras individuales — borde negro en 8 direcciones, sin glow (el glow va en el contenedor)
export const OUTLINE_TEXT_STYLE = {
  color: '#fff',
  textShadow: '-7px -7px 0 #000, 7px -7px 0 #000, -7px 7px 0 #000, 7px 7px 0 #000, -10px 0 0 #000, 10px 0 0 #000, 0 -10px 0 #000, 0 10px 0 #000',
  fontWeight: 400,
  fontFamily: DEFAULT_FONT,
  letterSpacing: 0,
};

// Genera el filter CSS de glow nivel B para un color y progreso dados
// glowColor: '#fff' (textos normales) o '#FFD700' (hook)
const makeGlowFilter = (color, progress) => {
  const c = color.startsWith('#') ? hexToRgba(color) : color;
  return [
    `drop-shadow(0 0 6px ${c.replace('1)', `${progress})`).replace('rgb(', 'rgba(')})`,
    `drop-shadow(0 0 20px ${c.replace('1)', `${(progress * 0.9).toFixed(2)})`).replace('rgb(', 'rgba(')})`,
    `drop-shadow(0 0 40px ${c.replace('1)', `${(progress * 0.7).toFixed(2)})`).replace('rgb(', 'rgba(')})`,
  ].join(' ');
};
const hexToRgba = (hex) => {
  const h = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  return `rgba(${r},${g},${b},1)`;
};

// WaveUpText — componente principal para texto nuevo
// Letras aparecen una por una subiendo desde abajo (stagger=1 frame)
// Glow de color en el contenedor (no entre letras), texto centrado en X
// glowColor: '#FFD700' para hook, '#fff' para textos normales (default)
export const WaveUpText = ({ frame, fps, startSec, endSec, children, style = {}, glowColor = '#fff' }) => {
  const startF = startSec * fps;
  const endF = endSec * fps;
  if (frame < startF || frame >= endF) return null;
  const local = frame - startF;
  const durationF = endF - startF;
  const text = typeof children === 'string' ? children : '';
  const stagger = 1;

  const appeared = [...text].filter((_, i) => {
    const f = Math.max(0, local - i * stagger);
    return spring({ frame: f, fps, config: { damping: 12, stiffness: 200 } }) > 0.05;
  }).length;
  const glowProgress = text.length > 0 ? appeared / text.length : 1;

  // Salida rápida al final
  const exitStart = durationF - EXIT_FRAMES;
  const exitScale = local >= exitStart ? 1 - (local - exitStart) / EXIT_FRAMES : 1;

  return (
    <div style={{
      position: 'absolute', left: 0, width: '100%', textAlign: 'center',
      display: 'flex', justifyContent: 'center', flexWrap: 'nowrap', overflow: 'hidden',
      filter: makeGlowFilter(glowColor, glowProgress * exitScale),
      opacity: exitScale,
      ...style,
    }}>
      {[...text].map((ch, i) => {
        const f = Math.max(0, local - i * stagger);
        const s = spring({ frame: f, fps, config: { damping: 12, stiffness: 200 } });
        const y = interpolate(s, [0, 1], [30, 0]);
        // Use non-breaking space so inline-block doesn't collapse whitespace
        const display = ch === ' ' ? ' ' : ch;
        return (
          <span key={i} style={{ ...OUTLINE_TEXT_STYLE, display: 'inline-block', transform: `translateY(${y}px)`, opacity: s * exitScale }}>{display}</span>
        );
      })}
    </div>
  );
};

// Gates children to [startSec, endSec] and hands back a local frame clock.
export const Phase = ({ frame, fps, startSec, endSec, children }) => {
  const startFrame = startSec * fps;
  const endFrame = endSec * fps;
  if (frame < startFrame || frame > endFrame) return null;
  return children({ localFrame: frame - startFrame, durationFrames: endFrame - startFrame, fps });
};

// Shared pop-in/pop-out envelope used by every card/panel below.
export const envelope = (localFrame, durationFrames, fps, config = { damping: 12, stiffness: 200, mass: 0.5 }) => {
  const entrance = spring({ frame: localFrame, fps, config });
  const exitStart = durationFrames - EXIT_FRAMES;
  const exitProgress = localFrame > exitStart
    ? interpolate(localFrame, [exitStart, durationFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;
  const scale = Math.min(entrance, 1.1) * exitProgress + (1 - exitProgress) * 0.85;
  const opacity = Math.min(entrance * 2, 1) * exitProgress;
  return { entrance, exitProgress, scale, opacity };
};

// --- Text primitives ---------------------------------

export const PopText = ({ frame, fps, startSec, endSec, style, children }) => (
  <Phase frame={frame} fps={fps} startSec={startSec} endSec={endSec}>
    {({ localFrame, durationFrames, fps: f }) => {
      const { scale, opacity } = envelope(localFrame, durationFrames, f);
      return <div style={{ ...style, opacity, transform: `scale(${scale})`, textShadow: SHADOW }}>{children}</div>;
    }}
  </Phase>
);

export const SlideText = ({ frame, fps, startSec, endSec, style, children, from = 'left' }) => (
  <Phase frame={frame} fps={fps} startSec={startSec} endSec={endSec}>
    {({ localFrame, durationFrames, fps: f }) => {
      const entrance = spring({ frame: localFrame, fps: f, config: { damping: 10, stiffness: 150, mass: 0.6 } });
      const exitStart = durationFrames - EXIT_FRAMES;
      const exitProgress = localFrame > exitStart
        ? interpolate(localFrame, [exitStart, durationFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        : 1;
      const offset = interpolate(entrance, [0, 1], [from === 'left' ? -120 : 120, 0], { extrapolateRight: 'clamp' });
      const opacity = Math.min(entrance * 2, 1) * exitProgress;
      return (
        <div style={{ ...style, opacity, transform: `translateX(${offset * exitProgress + (from === 'left' ? -40 : 40) * (1 - exitProgress)}px)`, textShadow: SHADOW }}>
          {children}
        </div>
      );
    }}
  </Phase>
);

// Sinusoidal multi-frequency shake with exponential decay. Wrap around any content.
export const CameraShake = ({ frame, amplitude = 16, decayFrames = 10, children }) => {
  const decay = Math.exp(-frame / decayFrames);
  const x = (Math.sin(frame * 1.7) + Math.sin(frame * 3.1) * 0.5) * amplitude * decay;
  const y = (Math.cos(frame * 2.3) + Math.sin(frame * 4.0) * 0.5) * amplitude * decay;
  const rot = Math.sin(frame * 2.6) * decay * 1.4;
  return <div style={{ width: '100%', height: '100%', transform: `scale(1.1) translate(${x}px, ${y}px) rotate(${rot}deg)` }}>{children}</div>;
};

// --- "content animation" template approximations (reactvideoeditor.com/remotion-templates/*) ---
// Image-bearing components take already-resolved staticFile() src strings (not bare filenames) —
// callers own the folder/naming for their product's images.

export const AnimatedList = ({ localFrame, durationFrames, fps, title, items, accent = DEFAULT_ACCENT }) => {
  const { scale, opacity: cardOpacity } = envelope(localFrame, durationFrames, fps);
  return (
    <div style={{ opacity: cardOpacity, transform: `scale(${scale})`, width: 640, background: 'rgba(20,20,20,0.72)', borderRadius: 24, border: `3px solid ${accent}`, padding: '28px 36px', boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}>
      <div style={{ color: accent, fontSize: 34, fontWeight: 'bold', marginBottom: 14 }}>{title}</div>
      {items.map((item, i) => {
        const delay = i * 6;
        const e = spring({ frame: Math.max(0, localFrame - delay), fps, config: { damping: 14, stiffness: 180 } });
        const x = interpolate(e, [0, 1], [-60, 0], { extrapolateRight: 'clamp' });
        const o = Math.min(e * 2, 1);
        return (
          <div key={i} style={{ opacity: o, transform: `translateX(${x}px)`, color: 'white', fontSize: 30, fontWeight: 'bold', padding: '8px 0', display: 'flex', gap: 12 }}>
            <span style={{ color: accent }}>✓</span>{item}
          </div>
        );
      })}
    </div>
  );
};

export const AreaChart = ({ localFrame, durationFrames, fps, title, points, valueLabel, accent = DEFAULT_ACCENT }) => {
  const { scale, opacity } = envelope(localFrame, durationFrames, fps);
  const reveal = interpolate(localFrame, [6, durationFrames - EXIT_FRAMES], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const w = 600, h = 280;
  const path = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - p * h}`).join(' ');
  const areaPath = `M0,${h} L${path} L${w},${h} Z`;
  return (
    <div style={{ opacity, transform: `scale(${scale})`, width: w, background: 'rgba(20,20,20,0.72)', borderRadius: 24, border: `3px solid ${accent}`, padding: 24, boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}>
      <div style={{ color: accent, fontSize: 30, fontWeight: 'bold', marginBottom: 8 }}>{title}</div>
      <svg width={w - 48} height={h * 0.55} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.8" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
          <clipPath id="reveal"><rect x="0" y="0" width={(reveal / 100) * w} height={h} /></clipPath>
        </defs>
        <g clipPath="url(#reveal)">
          <path d={areaPath} fill="url(#areaGrad)" />
          <polyline points={path} fill="none" stroke={accent} strokeWidth="5" />
        </g>
      </svg>
      <div style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginTop: 8 }}>{valueLabel}</div>
    </div>
  );
};

export const ComparisonChart = ({ localFrame, durationFrames, fps, leftLabel, leftValue, rightLabel, rightValue, accent = DEFAULT_ACCENT }) => {
  const { scale, opacity } = envelope(localFrame, durationFrames, fps);
  const count = interpolate(localFrame, [6, durationFrames - EXIT_FRAMES], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const leftNow = Math.round(leftValue * count);
  const rightNow = Math.round(rightValue * count);
  const barStyle = (v, color) => ({ width: 90, height: Math.max(6, v * 1.6), background: color, borderRadius: 12, alignSelf: 'flex-end' });
  return (
    <div style={{ opacity, transform: `scale(${scale})`, width: 640, background: 'rgba(20,20,20,0.72)', borderRadius: 24, border: `3px solid ${accent}`, padding: 28, boxShadow: '0 12px 32px rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: 260, position: 'relative' }}>
      <div style={{ position: 'absolute', left: '50%', top: 20, bottom: 20, width: 2, background: 'rgba(255,255,255,0.3)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ color: 'white', fontSize: 36, fontWeight: 'bold' }}>{leftNow}%</div>
        <div style={barStyle(leftNow, '#FF5C5C')} />
        <div style={{ color: 'white', fontSize: 22 }}>{leftLabel}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ color: accent, fontSize: 36, fontWeight: 'bold' }}>{rightNow}%</div>
        <div style={barStyle(rightNow, accent)} />
        <div style={{ color: 'white', fontSize: 22 }}>{rightLabel}</div>
      </div>
    </div>
  );
};

export const NotificationPop = ({ localFrame, durationFrames, fps, toasts, accent = DEFAULT_ACCENT }) => (
  <div style={{ width: 620, display: 'flex', flexDirection: 'column', gap: 14 }}>
    {toasts.map((t, i) => {
      const delay = i * 10;
      const e = spring({ frame: Math.max(0, localFrame - delay), fps, config: { damping: 13, stiffness: 190 } });
      const exitStart = durationFrames - EXIT_FRAMES;
      const exitProgress = localFrame > exitStart
        ? interpolate(localFrame, [exitStart, durationFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        : 1;
      const x = interpolate(e, [0, 1], [140, 0], { extrapolateRight: 'clamp' });
      const o = Math.min(e * 2, 1) * exitProgress;
      return (
        <div key={i} style={{ opacity: o, transform: `translateX(${x}px)`, background: 'rgba(20,20,20,0.85)', border: `2px solid ${accent}`, borderRadius: 18, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: 32 }}>{t.icon}</div>
          <div>
            <div style={{ color: accent, fontSize: 24, fontWeight: 'bold' }}>{t.title}</div>
            <div style={{ color: 'white', fontSize: 20 }}>{t.body}</div>
          </div>
        </div>
      );
    })}
  </div>
);

export const ProgressSteps = ({ localFrame, durationFrames, fps, steps, accent = DEFAULT_ACCENT }) => {
  const { scale, opacity } = envelope(localFrame, durationFrames, fps);
  const progress = interpolate(localFrame, [6, durationFrames - EXIT_FRAMES], [0, steps.length - 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pulse = 1 + Math.sin(localFrame * 0.5) * 0.08;
  return (
    <div style={{ opacity, transform: `scale(${scale})`, width: 680, background: 'rgba(20,20,20,0.72)', borderRadius: 24, border: `3px solid ${accent}`, padding: '32px 36px', boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 24, right: 24, top: 24, height: 4, background: 'rgba(255,255,255,0.25)' }} />
        <div style={{ position: 'absolute', left: 24, top: 24, height: 4, width: `${(Math.min(progress, steps.length - 1) / (steps.length - 1)) * (100 - 6)}%`, background: accent }} />
        {steps.map((s, i) => {
          const active = progress >= i - 0.15;
          const isTip = i === Math.min(steps.length - 1, Math.floor(progress + 0.5));
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: active ? accent : '#333', color: active ? '#111' : '#888', fontWeight: 'bold', fontSize: 22,
                transform: isTip && active ? `scale(${pulse})` : 'scale(1)', border: '2px solid rgba(0,0,0,0.3)',
              }}>{i + 1}</div>
              <div style={{ color: active ? 'white' : '#999', fontSize: 18, marginTop: 8, textAlign: 'center' }}>{s}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SplitScreen = ({ localFrame, durationFrames, fps, leftSrc, rightSrc, leftLabel, rightLabel, accent = DEFAULT_ACCENT }) => {
  const { opacity } = envelope(localFrame, durationFrames, fps);
  const e = spring({ frame: localFrame, fps, config: { damping: 16, stiffness: 120 } });
  const gap = interpolate(e, [0, 1], [260, 0], { extrapolateRight: 'clamp' });
  return (
    <div style={{ opacity, width: 700, height: 420, display: 'flex', position: 'relative' }}>
      <div style={{ flex: 1, transform: `translateX(${-gap}px)`, borderRadius: '20px 0 0 20px', overflow: 'hidden', border: `3px solid ${accent}`, borderRight: 'none' }}>
        <Img src={leftSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: 12, left: 20, color: 'white', fontSize: 22, fontWeight: 'bold', textShadow: SHADOW }}>{leftLabel}</div>
      </div>
      <div style={{ width: 4, background: accent, opacity: Math.min(e * 2, 1) }} />
      <div style={{ flex: 1, transform: `translateX(${gap}px)`, borderRadius: '0 20px 20px 0', overflow: 'hidden', border: `3px solid ${accent}`, borderLeft: 'none' }}>
        <Img src={rightSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: 12, right: 20, color: 'white', fontSize: 22, fontWeight: 'bold', textShadow: SHADOW }}>{rightLabel}</div>
      </div>
    </div>
  );
};

export const GalleryGrid = ({ localFrame, durationFrames, fps, images, accent = DEFAULT_ACCENT }) => {
  const { opacity } = envelope(localFrame, durationFrames, fps);
  return (
    <div style={{ opacity, width: 660, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {images.map((src, i) => {
        const delay = i * 4;
        const e = spring({ frame: Math.max(0, localFrame - delay), fps, config: { damping: 14, stiffness: 200 } });
        const s = interpolate(e, [0, 1], [0.8, 1], { extrapolateRight: 'clamp' });
        return (
          <div key={i} style={{ opacity: Math.min(e * 2, 1), transform: `scale(${s})`, borderRadius: 14, overflow: 'hidden', border: `2px solid ${accent}`, aspectRatio: '1/1' }}>
            <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        );
      })}
    </div>
  );
};

export const CardFlip = ({ localFrame, durationFrames, fps, frontSrc, backSrc, caption, accent = DEFAULT_ACCENT }) => {
  const { opacity, scale } = envelope(localFrame, durationFrames, fps);
  const flip = interpolate(localFrame, [8, 28], [0, 180], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const face = (src, extraRotate) => (
    <div style={{
      position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
      transform: `rotateY(${extraRotate}deg)`, borderRadius: 24, overflow: 'hidden',
      border: `4px solid ${accent}`, background: '#111',
    }}>
      <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
  return (
    <div style={{ opacity, transform: `scale(${scale})`, width: 380, height: 380, perspective: 1200 }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transform: `rotateY(${flip}deg)`, boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}>
        {face(frontSrc, 0)}
        {face(backSrc, 180)}
      </div>
      <div style={{ textAlign: 'center', color: accent, fontSize: 24, fontWeight: 'bold', marginTop: 12, textShadow: SHADOW }}>{caption}</div>
    </div>
  );
};

export const MasonryGallery = ({ localFrame, durationFrames, fps, columns, accent = DEFAULT_ACCENT }) => {
  const { opacity } = envelope(localFrame, durationFrames, fps);
  let i = 0;
  return (
    <div style={{ opacity, width: 660, display: 'flex', gap: 12 }}>
      {columns.map((col, ci) => (
        <div key={ci} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {col.map(({ src, h }) => {
            const delay = (i++) * 4;
            const e = spring({ frame: Math.max(0, localFrame - delay), fps, config: { damping: 14, stiffness: 200 } });
            const s = interpolate(e, [0, 1], [0.8, 1], { extrapolateRight: 'clamp' });
            return (
              <div key={src} style={{ opacity: Math.min(e * 2, 1), transform: `scale(${s})`, height: h, borderRadius: 14, overflow: 'hidden', border: `2px solid ${accent}` }}>
                <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const RotatingCarousel = ({ localFrame, durationFrames, fps, images, secondsPerRotation = 6, accent = DEFAULT_ACCENT }) => {
  const { scale: containerScale, opacity: containerOpacity } = envelope(localFrame, durationFrames, fps);
  const n = images.length;
  const baseAngle = (localFrame / fps / secondsPerRotation) * Math.PI * 2;
  const cards = images.map((src, i) => {
    const angle = baseAngle + (i / n) * Math.PI * 2;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    return {
      src, key: i,
      x: sinA * 300,
      scale: interpolate(cosA, [-1, 1], [0.5, 0.85]),
      opacity: interpolate(cosA, [-1, 1], [0.3, 1]),
      z: Math.round(cosA * 100),
    };
  }).sort((a, b) => a.z - b.z);

  return (
    <div style={{ opacity: containerOpacity, transform: `scale(${containerScale})`, width: 700, height: 400, position: 'relative' }}>
      {cards.map((c) => (
        <div key={c.key} style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 340, height: 340,
          transform: `translate(-50%, -50%) translateX(${c.x}px) scale(${c.scale})`,
          opacity: c.opacity, zIndex: c.z,
          borderRadius: 32, overflow: 'hidden',
          border: `6px solid ${accent}`, boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          background: '#111',
        }}>
          <Img src={c.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ))}
    </div>
  );
};

export const PriceShake = ({ localFrame, durationFrames, fps, current, original, discount, fomo, accent = DEFAULT_ACCENT, currency = '¥' }) => {
  const { opacity } = envelope(localFrame, durationFrames, fps);
  const disclaimer = currency === '¥' ? '※価格は予告なく変更される場合があります' : '※El precio puede cambiar sin previo aviso';
  return (
    <div style={{ opacity }}>
      <CameraShake frame={localFrame} amplitude={10} decayFrames={8}>
        <div style={{ background: 'rgba(20,20,20,0.85)', border: `4px solid ${accent}`, borderRadius: 28, padding: '28px 40px', textAlign: 'center', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
          <div style={{ color: '#FF5C5C', fontSize: 22, fontWeight: 'bold', marginBottom: 4 }}>{fomo}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, justifyContent: 'center' }}>
            <span style={{ color: accent, fontSize: 56, fontWeight: 'bold' }}>{currency}{current}</span>
            {original && <span style={{ color: '#aaa', fontSize: 28, textDecoration: 'line-through' }}>{currency}{original}</span>}
            {discount && <span style={{ color: '#FF5C5C', fontSize: 30, fontWeight: 'bold' }}>{discount}</span>}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginTop: 8 }}>{disclaimer}</div>
        </div>
      </CameraShake>
    </div>
  );
};

export const makeBaseTextStyle = (accent = DEFAULT_ACCENT) => ({ position: 'absolute', fontWeight: 'bold', color: accent, fontFamily: DEFAULT_FONT });
export const centerCard = { position: 'absolute', left: '50%', top: '28%', transform: 'translate(-50%, -50%) scale(1.5)' };

// Texto outlined pop-in/out reutilizable — estilo TikTok nativo, sin caja de fondo
export const OutlinePopText = ({ frame, fps, startSec, endSec, children, style = {} }) => {
  const startF = startSec * fps;
  const endF = endSec * fps;
  const localF = frame - startF;
  const durationF = endF - startF;
  if (frame < startF || frame >= endF) return null;
  const enter = spring({ frame: localF, fps, config: { damping: 10, stiffness: 220 } });
  const exitStart = durationF - EXIT_FRAMES;
  const exit = localF >= exitStart ? 1 - (localF - exitStart) / EXIT_FRAMES : 1;
  return (
    <div style={{ transform: `scale(${enter * exit})`, opacity: enter * exit, ...style }}>
      <span style={OUTLINE_TEXT_STYLE}>{children}</span>
    </div>
  );
};

// FloatingReviews — tarjetas de review TikTok Shop estilo sticker dispersas por el frame
// Props: reviews = [{ username, stars, text, x, y, rotation, delay }]
// Cada review aparece de forma escalonada según su `delay` (en frames)
// Recomendado: 5 reviews con layout 2-1-2 (2 arriba, 1 medio, 2 abajo)
// Sombra tipo sticker con rotaciones imperfectas para look orgánico
export const FloatingReviews = ({ frame, fps, reviews = [], cardWidth = 470 }) => (
  <>
    {reviews.map((r, i) => {
      const f = Math.max(0, frame - (r.delay || 0));
      const s = spring({ frame: f, fps, config: { damping: 12, stiffness: 160 } });
      const starsStr = '★'.repeat(r.stars || 5) + '☆'.repeat(5 - (r.stars || 5));
      return (
        <div key={i} style={{
          position: 'absolute', left: r.x, top: r.y,
          transform: `rotate(${r.rotation || 0}deg) scale(${s})`,
          opacity: s, transformOrigin: 'center center', width: cardWidth,
        }}>
          <div style={{
            background: '#fff', borderRadius: 18, padding: '18px 22px',
            boxShadow: '7px 10px 0 rgba(0,0,0,0.35), 10px 18px 40px rgba(0,0,0,0.7)',
          }}>
            <div style={{ color: '#FFA500', fontSize: 26, marginBottom: 6 }}>{starsStr}</div>
            <div style={{ color: '#111', fontSize: 26, fontWeight: 700, marginBottom: 6 }}>{r.username}</div>
            <div style={{ color: '#333', fontSize: 24, lineHeight: 1.45 }}>{r.text}</div>
          </div>
        </div>
      );
    })}
  </>
);
