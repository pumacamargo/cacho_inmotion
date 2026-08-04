import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { WaveUpText, DEFAULT_FONT, DEFAULT_ACCENT } from './OverlayKit';

export const FontStyleDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'black', fontFamily: DEFAULT_FONT }}>
      <AbsoluteFill>
        <OffthreadVideo src={staticFile('video_ktcmonitor.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* Hook — glow amarillo */}
      <WaveUpText frame={frame} fps={fps} startSec={0} endSec={4} glowColor={DEFAULT_ACCENT}
        style={{ top: 180, fontSize: 96 }}>
        旦那が買ったモニター
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={1} endSec={6} glowColor={DEFAULT_ACCENT}
        style={{ top: 310, fontSize: 72 }}>
        スペック見たら最高すぎた😤
      </WaveUpText>

      {/* Stats — glow blanco */}
      <WaveUpText frame={frame} fps={fps} startSec={4} endSec={9}
        style={{ top: 520, fontSize: 108 }}>
        ⚡ 180Hz
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={5} endSec={9}
        style={{ top: 670, fontSize: 108 }}>
        🎯 1ms応答
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={6} endSec={9}
        style={{ top: 820, fontSize: 108 }}>
        🖥️ 1500R曲面
      </WaveUpText>

      {/* Price — glow blanco */}
      <WaveUpText frame={frame} fps={fps} startSec={9} endSec={15.04}
        style={{ bottom: 300, fontSize: 148 }}>
        ¥12,743
      </WaveUpText>

      <WaveUpText frame={frame} fps={fps} startSec={10} endSec={15.04}
        style={{ bottom: 180, fontSize: 64 }}>
        → プロフィールのリンクから
      </WaveUpText>
    </AbsoluteFill>
  );
};
