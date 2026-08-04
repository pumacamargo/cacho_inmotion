import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Video } from '@remotion/media';
import { colorKey } from '@remotion/effects/color-key';
import {
  WaveUpText, CameraShake, Phase, FloatingReviews, DEFAULT_ACCENT,
} from './OverlayKit';

const GS_KEY = colorKey({ keyColor: '#00b140', similarity: 0.35, smoothness: 0.1 });

const REVIEWS = [
  { username: 'María G.',    stars: 5, text: '¡El pelo de mi perro desapareció del sillón en segundos! 🐶', x: 20,  y: 100,  rotation: -5, delay: 0  },
  { username: 'claudia_mx', stars: 5, text: 'Con 5m de cable llego a toda la sala sin moverme 😍',          x: 610, y: 80,   rotation: 4,  delay: 7  },
  { username: 'Fernanda R.', stars: 5, text: 'La usé en el carro y quedó como nuevo ✨',                    x: 110, y: 680,  rotation: -2, delay: 14 },
  { username: 'mamá feliz',  stars: 5, text: 'Super ligera, mis manos no se cansan nada',                   x: 30,  y: 1330, rotation: 6,  delay: 21 },
  { username: 'val_casa',    stars: 4, text: 'Aspira hasta el rincón más difícil. La recomiendo 🙌',        x: 590, y: 1360, rotation: -7, delay: 28 },
];

const RotatedFX = ({ src, startSec, endSec, fps, scale = 1 }) => {
  const startFrame = Math.round(startSec * fps);
  const durationFrames = Math.round((endSec - startSec) * fps);
  return (
    <Sequence from={startFrame} durationInFrames={durationFrames}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <Video
          src={staticFile(src)}
          effects={[GS_KEY]}
          volume={0.25}
          style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: 1920, height: 1080,
            transform: `translate(-50%, -50%) rotate(90deg) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        />
      </div>
    </Sequence>
  );
};

const ScaledFX = ({ src, startSec, endSec, fps }) => {
  const startFrame = Math.round(startSec * fps);
  const durationFrames = Math.round((endSec - startSec) * fps);
  return (
    <Sequence from={startFrame} durationInFrames={durationFrames}>
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <Video
          src={staticFile(src)}
          effects={[GS_KEY]}
          volume={0.25}
          style={{ width: 3413, height: 1920 }}
        />
      </div>
    </Sequence>
  );
};

export const AspiradoraOverlay = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>

      {/* BASE VIDEO */}
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('aspiradora_raw.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* ═══════ FASE 1 — HOOK (0–3.5s) ═══════ */}

      <RotatedFX
        src="greenscreen/anime/videos/gs_anime_20.mp4"
        startSec={0} endSec={3.17} fps={fps} scale={1.3}
      />

      <Phase frame={frame} fps={fps} startSec={0} endSec={3.5}>
        {({ localFrame }) => (
          <CameraShake frame={localFrame} amplitude={45} decayFrames={22}>
            <WaveUpText
              frame={localFrame} fps={fps} startSec={0} endSec={3.5}
              glowColor={DEFAULT_ACCENT}
              style={{ top: 430, fontSize: 88 }}
            >
              ¡No vas a creer
            </WaveUpText>
            <WaveUpText
              frame={localFrame} fps={fps} startSec={0.3} endSec={3.5}
              glowColor={DEFAULT_ACCENT}
              style={{ top: 560, fontSize: 88 }}
            >
              lo que encontré! 😱
            </WaveUpText>
          </CameraShake>
        )}
      </Phase>

      {/* ═══════ FASE 2 — FEATURES (4–24s) ═══════ */}

      <WaveUpText frame={frame} fps={fps} startSec={4} endSec={7}
        style={{ top: 470, fontSize: 80 }}>
        💪 15,000 Pa
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={4.3} endSec={7}
        style={{ top: 590, fontSize: 80 }}>
        de succión
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={7} endSec={10}
        style={{ top: 470, fontSize: 76 }}>
        🐾 Perfecto para
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={7.3} endSec={10}
        style={{ top: 590, fontSize: 76 }}>
        pelo de mascotas
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={10} endSec={13}
        style={{ top: 470, fontSize: 76 }}>
        📏 Cable de 5m
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={10.3} endSec={13}
        style={{ top: 590, fontSize: 76 }}>
        cabezal giratorio 270°
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={13} endSec={16}
        style={{ top: 470, fontSize: 76 }}>
        🏠 Hogar, coche
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={13.3} endSec={16}
        style={{ top: 590, fontSize: 76 }}>
        y oficina
      </WaveUpText>

      {/* Speed lines transition */}
      <ScaledFX
        src="greenscreen/anime/videos/gs_anime_21.mp4"
        startSec={16} endSec={18.37} fps={fps}
      />

      {/* FloatingReviews */}
      <Phase frame={frame} fps={fps} startSec={18} endSec={24}>
        {({ localFrame, durationFrames, fps: f }) => {
          const exitStart = durationFrames - 8;
          const exitOpacity = localFrame >= exitStart
            ? 1 - (localFrame - exitStart) / 8
            : 1;
          return (
            <div style={{ position: 'absolute', inset: 0, opacity: exitOpacity }}>
              <FloatingReviews frame={localFrame} fps={f} cardWidth={440} reviews={REVIEWS} />
            </div>
          );
        }}
      </Phase>

      {/* ═══════ FOMO (24–27s) ═══════ */}

      <WaveUpText frame={frame} fps={fps} startSec={24} endSec={27}
        style={{ top: 470, fontSize: 76 }}>
        🔥 272 familias
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={24.3} endSec={27}
        style={{ top: 590, fontSize: 76 }}>
        ya la tienen
      </WaveUpText>

      {/* ═══════ FASE 3 — CTA (27–31.44s) sin precio ═══════ */}

      <RotatedFX
        src="greenscreen/anime/videos/gs_anime_18.mp4"
        startSec={27} endSec={28.83} fps={fps}
      />

      <WaveUpText frame={frame} fps={fps} startSec={28.5} endSec={31.44}
        glowColor={DEFAULT_ACCENT}
        style={{ top: 460, fontSize: 80 }}>
        ¡Corre antes
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={28.8} endSec={31.44}
        glowColor={DEFAULT_ACCENT}
        style={{ top: 580, fontSize: 80 }}>
        de que se agote! 🔥
      </WaveUpText>

    </AbsoluteFill>
  );
};
