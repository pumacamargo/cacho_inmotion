import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Video } from '@remotion/media';
import { colorKey } from '@remotion/effects/color-key';
import {
  WaveUpText, CameraShake, Phase, FloatingReviews,
  GalleryGrid, DEFAULT_ACCENT,
} from './OverlayKit';

const GS_KEY = colorKey({ keyColor: '#00b140', similarity: 0.35, smoothness: 0.1 });

const REVIEWS = [
  { username: 'Mariana R.',  stars: 5, text: '¡Son increíblemente cómodos! Los uso todos los días 😍', x: 20,  y: 100,  rotation: -5, delay: 0  },
  { username: 'GabrielaF',   stars: 5, text: 'Super ligeros, perfectos para el verano ☀️',             x: 610, y: 80,   rotation: 4,  delay: 7  },
  { username: 'Vanessa M.',  stars: 5, text: 'Me los pongo en segundos, sin doblarme 🙌',              x: 110, y: 680,  rotation: -2, delay: 14 },
  { username: 'soniaal',     stars: 5, text: 'La plantilla se puede lavar — un must have',             x: 30,  y: 1330, rotation: 6,  delay: 21 },
  { username: 'Fernanda K.', stars: 5, text: 'Tan frescos que los uso hasta en casa 😊',               x: 590, y: 1360, rotation: -7, delay: 28 },
];

const GALLERY = [
  staticFile('carousel_sneakers/sneaker_01.webp'),
  staticFile('carousel_sneakers/sneaker_02.webp'),
  staticFile('carousel_sneakers/sneaker_03.webp'),
  staticFile('carousel_sneakers/sneaker_04.webp'),
  staticFile('carousel_sneakers/sneaker_05.webp'),
  staticFile('carousel_sneakers/sneaker_06.webp'),
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

export const SneakersOverlay = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>

      {/* BASE VIDEO */}
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('sneakers_raw.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* ═══════ FASE 1 — HOOK (0–3s) ═══════ */}

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
              ¡No puedo creer
            </WaveUpText>
            <WaveUpText
              frame={localFrame} fps={fps} startSec={0.3} endSec={3.5}
              glowColor={DEFAULT_ACCENT}
              style={{ top: 560, fontSize: 88 }}
            >
              lo cómodos! 😱
            </WaveUpText>
          </CameraShake>
        )}
      </Phase>

      {/* ═══════ FASE 2 — PRODUCTO (4–24s) ═══════ */}

      <WaveUpText frame={frame} fps={fps} startSec={4} endSec={7}
        style={{ top: 480, fontSize: 80, lineHeight: 1.3 }}>
        👟 Transpirables
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={4.3} endSec={7}
        style={{ top: 600, fontSize: 80 }}>
        y super ligeros
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={7} endSec={10}
        style={{ top: 530, fontSize: 80 }}>
        ✨ Slip-on
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={7.3} endSec={10}
        style={{ top: 650, fontSize: 80 }}>
        sin amarrar
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={10} endSec={13}
        style={{ top: 480, fontSize: 76 }}>
        🌟 Plantilla removible
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={10.3} endSec={13}
        style={{ top: 600, fontSize: 76 }}>
        y lavable
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={13} endSec={16}
        style={{ top: 480, fontSize: 76 }}>
        ⭐ 5.0 — 238 personas
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={13.3} endSec={16}
        style={{ top: 600, fontSize: 76 }}>
        ya los aman
      </WaveUpText>

      {/* Transición speed lines */}
      <ScaledFX
        src="greenscreen/anime/videos/gs_anime_21.mp4"
        startSec={16} endSec={18.37} fps={fps}
      />

      {/* FloatingReviews */}
      <Phase frame={frame} fps={fps} startSec={18} endSec={22}>
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

      {/* GalleryGrid */}
      <Phase frame={frame} fps={fps} startSec={22} endSec={26}>
        {(p) => (
          <div style={{ position: 'absolute', left: '50%', top: '72%', transform: 'translate(-50%, -50%) scale(1.5)' }}>
            <GalleryGrid {...p} images={GALLERY} />
          </div>
        )}
      </Phase>

      {/* ═══════ FASE 3 — CTA (24–26.56s) sin precio ═══════ */}

      <RotatedFX
        src="greenscreen/anime/videos/gs_anime_18.mp4"
        startSec={24} endSec={25.83} fps={fps}
      />

      <WaveUpText frame={frame} fps={fps} startSec={24.5} endSec={26.56}
        glowColor={DEFAULT_ACCENT}
        style={{ top: 460, fontSize: 76 }}>
        ¡Llévatelos antes
      </WaveUpText>
      <WaveUpText frame={frame} fps={fps} startSec={24.8} endSec={26.56}
        glowColor={DEFAULT_ACCENT}
        style={{ top: 580, fontSize: 76 }}>
        que se agoten! 🔥
      </WaveUpText>

    </AbsoluteFill>
  );
};
