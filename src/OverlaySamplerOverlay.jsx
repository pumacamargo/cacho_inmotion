import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { makeBaseTextStyle, centerCard, DEFAULT_ACCENT } from './OverlayKit';

const ACCENT = DEFAULT_ACCENT;
const baseText = makeBaseTextStyle(ACCENT);

// ─── helpers ────────────────────────────────────────────────────────────────
function envelope(frame, fps, durationFrames, exitFrames = 8) {
  const enterProgress = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  const exitStart = durationFrames - exitFrames;
  const exitScale = frame >= exitStart
    ? interpolate(frame, [exitStart, durationFrames], [1, 0], { extrapolateRight: 'clamp' })
    : 1;
  return { scale: enterProgress * exitScale, opacity: enterProgress * exitScale };
}

// ─── 1. CounterStat ─────────────────────────────────────────────────────────
// Número grande que cuenta desde 0 hasta `target`
function CounterStat({ localFrame, durationFrames, fps, target, label, unit = '', accent = ACCENT }) {
  const { scale, opacity } = envelope(localFrame, fps, durationFrames);
  const progress = Math.min(localFrame / (durationFrames * 0.75), 1);
  const eased = 1 - Math.pow(1 - progress, 3);
  const current = Math.round(eased * target);

  return (
    <div style={{ transform: `scale(${scale})`, opacity, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ background: 'rgba(0,0,0,0.82)', border: `3px solid ${accent}`, borderRadius: 24, padding: '28px 48px', textAlign: 'center' }}>
        <div style={{ color: '#aaa', fontSize: 28, fontWeight: 600, marginBottom: 8, textShadow: '0 1px 4px #000' }}>{label}</div>
        <div style={{ color: accent, fontSize: 110, fontWeight: 900, lineHeight: 1, textShadow: '0 2px 12px #000' }}>
          {current.toLocaleString()}<span style={{ fontSize: 52 }}>{unit}</span>
        </div>
      </div>
    </div>
  );
}

// ─── 2. QuotePop ────────────────────────────────────────────────────────────
// Burbuja de review con estrellas
function QuotePop({ localFrame, durationFrames, fps, quote, stars = 5, author = '購入者レビュー', accent = ACCENT }) {
  const { scale, opacity } = envelope(localFrame, fps, durationFrames);
  const starsStr = '★'.repeat(stars) + '☆'.repeat(5 - stars);
  return (
    <div style={{ transform: `scale(${scale})`, opacity, maxWidth: 860 }}>
      <div style={{ background: 'rgba(0,0,0,0.85)', border: `3px solid ${accent}`, borderRadius: 20, padding: '24px 32px' }}>
        <div style={{ color: accent, fontSize: 32, marginBottom: 10 }}>{starsStr}</div>
        <div style={{ color: '#fff', fontSize: 36, fontWeight: 700, lineHeight: 1.4, textShadow: '0 1px 4px #000', marginBottom: 12 }}>
          ❝ {quote} ❞
        </div>
        <div style={{ color: '#aaa', fontSize: 26 }}>— {author}</div>
      </div>
    </div>
  );
}

// ─── 3. FlashTag ────────────────────────────────────────────────────────────
// Badge con rebote que llama atención
function FlashTag({ localFrame, durationFrames, fps, tags = [], accent = ACCENT }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', maxWidth: 900 }}>
      {tags.map((tag, i) => {
        const delayed = Math.max(0, localFrame - i * 6);
        const s = spring({ frame: delayed, fps, config: { damping: 8, stiffness: 220 } });
        const exitStart = durationFrames - 8;
        const exitFade = localFrame >= exitStart
          ? interpolate(localFrame, [exitStart, durationFrames], [1, 0], { extrapolateRight: 'clamp' })
          : 1;
        return (
          <div key={i} style={{ transform: `scale(${s * exitFade})`, opacity: s * exitFade }}>
            <div style={{
              background: accent, color: '#000', fontWeight: 900, fontSize: 42,
              padding: '14px 32px', borderRadius: 50, boxShadow: `0 4px 20px ${accent}88`,
              textShadow: 'none', whiteSpace: 'nowrap',
            }}>
              {tag}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── 4. SpecCard ─────────────────────────────────────────────────────────────
// Fila de specs tipo infografía de gadget
function SpecCard({ localFrame, durationFrames, fps, specs = [], accent = ACCENT }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 900 }}>
      {specs.map((spec, i) => {
        const delayed = Math.max(0, localFrame - i * 7);
        const s = spring({ frame: delayed, fps, config: { damping: 12, stiffness: 180 } });
        const exitStart = durationFrames - 8;
        const exitFade = localFrame >= exitStart
          ? interpolate(localFrame, [exitStart, durationFrames], [1, 0], { extrapolateRight: 'clamp' })
          : 1;
        return (
          <div key={i} style={{
            transform: `translateX(${(1 - s) * -120}px) scale(${exitFade})`,
            opacity: s * exitFade,
            background: 'rgba(0,0,0,0.82)',
            border: `2px solid ${accent}`,
            borderRadius: 16,
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}>
            <span style={{ fontSize: 44 }}>{spec.icon}</span>
            <span style={{ color: accent, fontSize: 42, fontWeight: 900, minWidth: 120 }}>{spec.value}</span>
            <span style={{ color: '#ddd', fontSize: 30, fontWeight: 600 }}>{spec.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── 5. BeforeAfter ──────────────────────────────────────────────────────────
// Dos paneles que se abren desde el centro
function BeforeAfter({ localFrame, durationFrames, fps, beforeLabel, afterLabel, beforeIcon, afterIcon, accent = ACCENT }) {
  const s = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 160 } });
  const exitStart = durationFrames - 8;
  const exitFade = localFrame >= exitStart
    ? interpolate(localFrame, [exitStart, durationFrames], [1, 0], { extrapolateRight: 'clamp' })
    : 1;
  const spread = s * 100;

  return (
    <div style={{ display: 'flex', gap: 16, opacity: exitFade }}>
      <div style={{
        transform: `translateX(${-spread * 0.4}px)`,
        background: 'rgba(60,0,0,0.88)', border: '2px solid #ff4444',
        borderRadius: 18, padding: '24px 32px', textAlign: 'center', minWidth: 360,
      }}>
        <div style={{ fontSize: 52 }}>{beforeIcon}</div>
        <div style={{ color: '#ff6666', fontSize: 26, fontWeight: 700, marginTop: 8 }}>BEFORE</div>
        <div style={{ color: '#fff', fontSize: 30, marginTop: 6 }}>{beforeLabel}</div>
      </div>
      <div style={{
        transform: `translateX(${spread * 0.4}px)`,
        background: 'rgba(0,50,0,0.88)', border: `2px solid ${accent}`,
        borderRadius: 18, padding: '24px 32px', textAlign: 'center', minWidth: 360,
      }}>
        <div style={{ fontSize: 52 }}>{afterIcon}</div>
        <div style={{ color: accent, fontSize: 26, fontWeight: 700, marginTop: 8 }}>AFTER</div>
        <div style={{ color: '#fff', fontSize: 30, marginTop: 6 }}>{afterLabel}</div>
      </div>
    </div>
  );
}

// ─── SAMPLER COMPOSITION ─────────────────────────────────────────────────────
// 42s video — 5 overlays × ~8s cada uno
export const OverlaySamplerOverlay = () => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  if (!videoConfig) return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  const fps = videoConfig.fps;

  const seg = (startSec, endSec) => {
    const s = startSec * fps, e = endSec * fps;
    return frame >= s && frame < e ? frame - s : null;
  };

  const label = (text, top = 80) => (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', textAlign: 'center',
      color: '#fff', fontSize: 28, fontWeight: 700, background: 'rgba(0,0,0,0.55)',
      padding: '6px 0', letterSpacing: 1 }}>
      {text}
    </div>
  );

  const dur = (startSec, endSec) => (endSec - startSec) * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', fontFamily: "'Noto Sans CJK JP', 'Noto Sans JP', sans-serif" }}>
      <AbsoluteFill>
        <OffthreadVideo src={staticFile('video_thermalpen.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* 1. CounterStat  0-8s */}
      {seg(0, 8) !== null && (
        <>
          {label('① CounterStat')}
          <div style={{ ...centerCard, top: '28%' }}>
            <CounterStat localFrame={seg(0, 8)} durationFrames={dur(0, 8)} fps={fps}
              target={699} label="特別価格" unit="円" />
          </div>
        </>
      )}

      {/* 2. QuotePop  8-17s */}
      {seg(8, 17) !== null && (
        <>
          {label('② QuotePop')}
          <div style={{ ...centerCard, top: '28%' }}>
            <QuotePop localFrame={seg(8, 17)} durationFrames={dur(8, 17)} fps={fps}
              quote="住所が完全に消えた！プライバシーが守れて安心" stars={5} author="購入者レビュー ⭐4.1" />
          </div>
        </>
      )}

      {/* 3. FlashTag  17-26s */}
      {seg(17, 26) !== null && (
        <>
          {label('③ FlashTag')}
          <div style={{ ...centerCard, top: '28%' }}>
            <FlashTag localFrame={seg(17, 26)} durationFrames={dur(17, 26)} fps={fps}
              tags={['2-in-1 機能', '自動収納式', '送料無料', '2つで1つ無料']} />
          </div>
        </>
      )}

      {/* 4. SpecCard  26-35s */}
      {seg(26, 35) !== null && (
        <>
          {label('④ SpecCard')}
          <div style={{ ...centerCard, top: '28%' }}>
            <SpecCard localFrame={seg(26, 35)} durationFrames={dur(26, 35)} fps={fps}
              specs={[
                { icon: '🖊️', value: '即消去', label: 'サーマルペーパー対応' },
                { icon: '✂️', value: '内蔵', label: '自動収納カッター' },
                { icon: '🌈', value: '2色', label: 'ピンク・グリーン' },
              ]} />
          </div>
        </>
      )}

      {/* 5. BeforeAfter  35-42s */}
      {seg(35, 42.72) !== null && (
        <>
          {label('⑤ BeforeAfter')}
          <div style={{ ...centerCard, top: '28%' }}>
            <BeforeAfter localFrame={seg(35, 42.72)} durationFrames={dur(35, 42.72)} fps={fps}
              beforeIcon="😰" beforeLabel="個人情報 丸見え"
              afterIcon="🔒" afterLabel="完全消去 安心" />
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
