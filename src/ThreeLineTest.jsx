import React, { useRef, useEffect, useState } from 'react';
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender, Audio, Video, Loop } from 'remotion';
import { Rive } from '@rive-app/canvas';

const PHONEME_MAP = { X: 0, A: 1, B: 2, C: 3, D: 3, G: 3, E: 4, H: 5, F: 6 };

// Rhubarb output from three_lines.wav — curious, surprised, excited
const MOUTH_CUES = [
  { start: 0.00, end: 0.04, value: "B" },
  { start: 0.04, end: 0.15, value: "E" },
  { start: 0.15, end: 0.22, value: "B" },
  { start: 0.22, end: 0.50, value: "C" },
  { start: 0.50, end: 0.71, value: "B" },
  { start: 0.71, end: 1.06, value: "F" },
  { start: 1.06, end: 1.13, value: "C" },
  { start: 1.13, end: 1.20, value: "B" },
  { start: 1.20, end: 1.41, value: "E" },
  { start: 1.41, end: 1.69, value: "C" },
  { start: 1.69, end: 1.76, value: "E" },
  { start: 1.76, end: 2.04, value: "B" },
  { start: 2.04, end: 2.14, value: "A" },
  { start: 2.14, end: 2.34, value: "B" },
  { start: 2.34, end: 2.42, value: "A" },
  { start: 2.42, end: 2.48, value: "D" },
  { start: 2.48, end: 2.54, value: "H" },
  { start: 2.54, end: 2.68, value: "B" },
  { start: 2.68, end: 2.90, value: "X" },
  { start: 2.90, end: 3.27, value: "B" },
  { start: 3.27, end: 3.35, value: "A" },
  { start: 3.35, end: 3.49, value: "C" },
  { start: 3.49, end: 3.70, value: "B" },
  { start: 3.70, end: 3.77, value: "C" },
  { start: 3.77, end: 3.98, value: "B" },
  { start: 3.98, end: 4.08, value: "A" },
  { start: 4.08, end: 4.24, value: "B" },
  { start: 4.24, end: 4.31, value: "C" },
  { start: 4.31, end: 4.38, value: "E" },
  { start: 4.38, end: 4.45, value: "F" },
  { start: 4.45, end: 4.52, value: "C" },
  { start: 4.52, end: 4.62, value: "A" },
  { start: 4.62, end: 4.76, value: "D" },
  { start: 4.76, end: 4.90, value: "B" },
  { start: 4.90, end: 5.04, value: "C" },
  { start: 5.04, end: 5.24, value: "F" },
  { start: 5.24, end: 5.32, value: "E" },
  { start: 5.32, end: 5.46, value: "H" },
  { start: 5.46, end: 5.67, value: "B" },
  { start: 5.67, end: 5.81, value: "D" },
  { start: 5.81, end: 5.95, value: "B" },
  { start: 5.95, end: 6.13, value: "X" },
  { start: 6.13, end: 6.36, value: "B" },
  { start: 6.36, end: 6.43, value: "G" },
  { start: 6.43, end: 6.50, value: "C" },
  { start: 6.50, end: 6.57, value: "H" },
  { start: 6.57, end: 6.64, value: "C" },
  { start: 6.64, end: 6.78, value: "B" },
  { start: 6.78, end: 6.88, value: "A" },
  { start: 6.88, end: 7.08, value: "C" },
  { start: 7.08, end: 7.22, value: "B" },
  { start: 7.22, end: 7.29, value: "E" },
  { start: 7.29, end: 7.36, value: "F" },
  { start: 7.36, end: 7.57, value: "H" },
  { start: 7.57, end: 7.78, value: "B" },
  { start: 7.78, end: 7.86, value: "A" },
  { start: 7.86, end: 8.22, value: "F" },
  { start: 8.22, end: 8.36, value: "E" },
  { start: 8.36, end: 8.43, value: "F" },
  { start: 8.43, end: 8.63, value: "A" },
  { start: 8.63, end: 8.64, value: "X" },
];

const BROW_CUES = [
  { start: 0.15, end: 2.72, value: 4 }, // curious
  { start: 3.03, end: 5.92, value: 1 }, // surprised
  { start: 6.34, end: 8.64, value: 1 }, // excited
];

function getCue(timeSec) {
  return MOUTH_CUES.slice().reverse().find(c => timeSec >= c.start);
}
function getMouthPos(timeSec) {
  return PHONEME_MAP[getCue(timeSec)?.value ?? 'X'] ?? 0;
}
function getBrowPos(timeSec) {
  const cue = BROW_CUES.slice().reverse().find(c => timeSec >= c.start);
  return cue?.value ?? 0;
}

const RIVE_FPS = 60;

function disableInternalLoop(r) {
  r.scheduleRendering = () => {};
  r.drawFrame = () => {};
}
function paintRive(r) {
  const renderer = r.renderer;
  renderer.clear();
  renderer.save();
  r.alignRenderer();
  r.artboard.draw(renderer);
  renderer.restore();
  renderer.flush();
  r.runtime.resolveAnimationFrame();
}

function applyFrame(r, mouthInput, browInput, f, fps) {
  const timeSec = f / fps;
  if (mouthInput) mouthInput.value = getMouthPos(timeSec);
  if (browInput) browInput.value = getBrowPos(timeSec);
  const subSteps = Math.round(RIVE_FPS / fps);
  const dt = 1 / RIVE_FPS;
  for (let i = 0; i < subSteps; i++) r.advanceAndReportChanges(dt);
}

export function ThreeLineTest() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const mouthInputRef = useRef(null);
  const browInputRef = useRef(null);
  const lastFrameRef = useRef(-1);
  const [initHandle] = useState(() => delayRender('tl-init'));

  useEffect(() => {
    if (!canvasRef.current) return;
    const initFrame = frame;
    const r = new Rive({
      src: staticFile('aato01_jointtest01.riv'),
      canvas: canvasRef.current,
      autoplay: true,
      stateMachine: 'State Machine 1',
      onLoad: () => {
        r.resizeDrawingSurfaceToCanvas();
        const inputs = r.stateMachineInputs('State Machine 1');
        mouthInputRef.current = inputs?.find(i => i.name === 'mouth_pos') ?? null;
        browInputRef.current = inputs?.find(i => i.name === 'brow_pos') ?? null;
        riveRef.current = r;
        for (let f = 0; f <= initFrame; f++) applyFrame(r, mouthInputRef.current, browInputRef.current, f, fps);
        lastFrameRef.current = initFrame;
        paintRive(r);
        continueRender(initHandle);
      },
      onLoadError: () => continueRender(initHandle),
    });
    disableInternalLoop(r);
    return () => { try { r.cleanup(); } catch {} };
  }, []);

  useEffect(() => {
    const handle = delayRender(`tl-f${frame}`);
    const r = riveRef.current;
    if (!r) { continueRender(handle); return; }
    if (lastFrameRef.current === frame) { paintRive(r); continueRender(handle); return; }
    for (let f = lastFrameRef.current + 1; f <= frame; f++) applyFrame(r, mouthInputRef.current, browInputRef.current, f, fps);
    lastFrameRef.current = frame;
    paintRive(r);
    continueRender(handle);
  }, [frame]);

  const SIZE = 700;

  return (
    <div style={{ position: 'relative', width: 1080, height: 1920, overflow: 'hidden' }}>
      <Loop durationInFrames={Math.round(5.1 * fps)}>
        <Video src={staticFile('bg_5s_noaudio.mp4')} style={{ width: 1080, height: 1920, objectFit: 'cover' }} />
      </Loop>
      <Audio src={staticFile('three_lines.wav')} />
      <div style={{ position: 'absolute', bottom: 0, right: (1080 - SIZE) / 2, width: SIZE, height: SIZE, filter: 'drop-shadow(14px 18px 10px rgba(0,0,0,0.75))' }}>
        <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ width: SIZE, height: SIZE }} />
      </div>
    </div>
  );
}
