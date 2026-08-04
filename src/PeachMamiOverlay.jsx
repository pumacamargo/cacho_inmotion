import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Phase, PopText, CameraShake, AnimatedList, NotificationPop,
  PriceShake, makeBaseTextStyle, centerCard,
} from './OverlayKit';

const ACCENT = '#FF7F50'; // coral/durazno — combina con el branding de Peach Mami sobre fondo beige
const baseTextStyle = makeBaseTextStyle(ACCENT);

export const PeachMamiOverlay = () => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  if (!videoConfig) {
    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  }

  const fps = videoConfig.fps;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', fontFamily: 'Arial, sans-serif' }}>
      {/* Base video */}
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile('video_peachmami.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* HOOK: 0-3s — camera shake + frase impacto */}
      <CameraShake frame={frame} amplitude={45} decayFrames={22}>
        <PopText frame={frame} fps={fps} startSec={0} endSec={3}
          style={{ ...baseTextStyle, left: 60, top: 160, fontSize: 48, textAlign: 'center', width: 960, fontWeight: 'bold' }}>
          ¡Gel Reafirmante Increíble!
        </PopText>
      </CameraShake>

      {/* PRODUCTO: 3-10s — ingredientes clave */}
      <Phase frame={frame} fps={fps} startSec={3.0} endSec={10.0}>
        {(p) => (
          <div style={centerCard}>
            <AnimatedList {...p} accent={ACCENT}
              title="Ingredientes activos"
              items={['Cafeína — activa circulación', 'Ácido Hialurónico — hidratación', 'Manteca Murumuru — nutrición']}
            />
          </div>
        )}
      </Phase>

      {/* PRODUCTO: 10-18s — beneficios principales */}
      <Phase frame={frame} fps={fps} startSec={10.0} endSec={18.0}>
        {(p) => (
          <div style={centerCard}>
            <NotificationPop {...p} accent={ACCENT} toasts={[
              { icon: '✨', title: 'Piel firme', body: 'Reduce celulitis visible' },
              { icon: '💧', title: 'Hidratación profunda', body: 'Textura sedosa sin residuo' },
              { icon: '🍑', title: 'Aroma a durazno', body: '¡Irresistible!' },
            ]} />
          </div>
        )}
      </Phase>

      {/* PRODUCTO: 18-26s — fórmula y uso */}
      <Phase frame={frame} fps={fps} startSec={18.0} endSec={26.0}>
        {(p) => (
          <div style={centerCard}>
            <AnimatedList {...p} accent={ACCENT}
              title="Fórmula premium"
              items={['Se absorbe rápido', 'Sin sensación pegajosa', 'Ideal después de la ducha']}
            />
          </div>
        )}
      </Phase>

      {/* PRODUCTO: 26-35.52s — valores de marca */}
      <Phase frame={frame} fps={fps} startSec={26.0} endSec={35.52}>
        {(p) => (
          <div style={centerCard}>
            <NotificationPop {...p} accent={ACCENT} toasts={[
              { icon: '🌿', title: '100% Vegano', body: 'Cruelty-free' },
              { icon: '🇺🇸', title: 'Made in USA', body: 'Fórmula ética y limpia' },
              { icon: '🚚', title: 'Envío gratis', body: 'Disponible ahora' },
            ]} />
          </div>
        )}
      </Phase>
    </AbsoluteFill>
  );
};
