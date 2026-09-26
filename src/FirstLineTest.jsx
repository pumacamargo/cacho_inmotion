import React, { useRef, useEffect, useState } from 'react';
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender, Audio, Video, Loop } from 'remotion';
import { Rive } from '@rive-app/canvas';

const PHONEME_MAP = { X: 0, A: 1, B: 2, C: 3, D: 3, G: 3, E: 4, H: 5, F: 6 };

// Rhubarb output from first_line.wav — "[curious] Oye, tienes que ver esto ahorita mismo."
const MOUTH_CUES = [
  { start: 0.00, end: 0.07, value: "X" },
  { start: 0.07, end: 0.12, value: "B" },
  { start: 0.12, end: 0.16, value: "E" },
  { start: 0.16, end: 0.23, value: "B" },
  { start: 0.23, end: 0.37, value: "C" },
  { start: 0.37, end: 0.84, value: "B" },
  { start: 0.84, end: 1.05, value: "C" },
  { start: 1.05, end: 1.19, value: "B" },
  { start: 1.19, end: 1.26, value: "C" },
  { start: 1.26, end: 1.47, value: "B" },
  { start: 1.47, end: 1.54, value: "E" },
  { start: 1.54, end: 1.61, value: "F" },
  { start: 1.61, end: 1.68, value: "B" },
  { start: 1.68, end: 1.75, value: "D" },
  { start: 1.75, end: 1.82, value: "C" },
  { start: 1.82, end: 1.96, value: "B" },
  { start: 1.96, end: 2.17, value: "C" },
  { start: 2.17, end: 2.28, value: "A" },
  { start: 2.28, end: 2.50, value: "B" },
  { start: 2.50, end: 2.55, value: "A" },
  { start: 2.55, end: 2.63, value: "B" },
  { start: 2.63, end: 2.64, value: "X" },
];

function getCue(timeSec) {
  return MOUTH_CUES.slice().reverse().find(c => timeSec >= c.start);
}
function getMouthPos(timeSec) {
  return PHONEME_MAP[getCue(timeSec)?.value ?? 'X'] ?? 0;
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
  if (browInput) browInput.value = 4; // curious
  const subSteps = Math.round(RIVE_FPS / fps);
  const dt = 1 / RIVE_FPS;
  for (let i = 0; i < subSteps; i++) r.advanceAndReportChanges(dt);
}

export function FirstLineTest() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const mouthInputRef = useRef(null);
  const browInputRef = useRef(null);
  const lastFrameRef = useRef(-1);
  const [initHandle] = useState(() => delayRender('fl-init'));

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
    const handle = delayRender(`fl-f${frame}`);
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
      <Audio src={staticFile('first_line.wav')} />
      <div style={{ position: 'absolute', bottom: 0, right: (1080 - SIZE) / 2, width: SIZE, height: SIZE, filter: 'drop-shadow(14px 18px 10px rgba(0,0,0,0.75))' }}>
        <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ width: SIZE, height: SIZE }} />
      </div>
    </div>
  );
}
