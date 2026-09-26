import React, { useRef, useEffect, useState } from 'react';
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender, Audio, Video, Loop } from 'remotion';
import { Rive } from '@rive-app/canvas';

const PHONEME_MAP = { X: 0, A: 1, B: 2, C: 3, D: 3, G: 3, E: 4, H: 5, F: 6 };

// Rhubarb output from jp_second_line.wav — "[excited] マジで超やばいって、今すぐ見て見て!"
const MOUTH_CUES = [
  { start: 0.00, end: 0.01, value: "X" },
  { start: 0.01, end: 0.04, value: "B" },
  { start: 0.04, end: 0.06, value: "X" },
  { start: 0.06, end: 0.11, value: "A" },
  { start: 0.11, end: 0.25, value: "D" },
  { start: 0.25, end: 0.29, value: "C" },
  { start: 0.29, end: 0.48, value: "B" },
  { start: 0.48, end: 0.69, value: "F" },
  { start: 0.69, end: 0.76, value: "E" },
  { start: 0.76, end: 0.83, value: "B" },
  { start: 0.83, end: 0.90, value: "G" },
  { start: 0.90, end: 1.04, value: "E" },
  { start: 1.04, end: 1.11, value: "C" },
  { start: 1.11, end: 1.32, value: "B" },
  { start: 1.32, end: 1.43, value: "A" },
  { start: 1.43, end: 1.48, value: "C" },
  { start: 1.48, end: 2.02, value: "B" },
  { start: 2.02, end: 2.10, value: "A" },
  { start: 2.10, end: 2.25, value: "B" },
  { start: 2.25, end: 2.46, value: "C" },
  { start: 2.46, end: 2.67, value: "B" },
  { start: 2.67, end: 2.88, value: "X" },
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
  if (browInput) browInput.value = 1; // excited
  const subSteps = Math.round(RIVE_FPS / fps);
  const dt = 1 / RIVE_FPS;
  for (let i = 0; i < subSteps; i++) r.advanceAndReportChanges(dt);
}

export function JpSecondLineTest() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const mouthInputRef = useRef(null);
  const browInputRef = useRef(null);
  const lastFrameRef = useRef(-1);
  const [initHandle] = useState(() => delayRender('jpsl-init'));

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
    const handle = delayRender(`jpsl-f${frame}`);
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
      <Audio src={staticFile('jp_second_line.wav')} />
      <div style={{ position: 'absolute', bottom: 0, right: (1080 - SIZE) / 2, width: SIZE, height: SIZE, filter: 'drop-shadow(14px 18px 10px rgba(0,0,0,0.75))' }}>
        <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ width: SIZE, height: SIZE }} />
      </div>
    </div>
  );
}
