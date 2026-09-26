import React, { useRef, useEffect, useState } from 'react';
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender, Audio, Video, Loop } from 'remotion';
import { Rive } from '@rive-app/canvas';

const PHONEME_MAP = { X: 0, A: 1, B: 2, C: 3, D: 3, G: 3, E: 4, H: 5, F: 6 };

// Rhubarb output from jp_first_line.wav — "[curious] ねえねえ、これ知ってる?めっちゃ気になるんだけど。"
const MOUTH_CUES = [
  { start: 0.00, end: 0.34, value: "C" },
  { start: 0.34, end: 0.48, value: "B" },
  { start: 0.48, end: 0.55, value: "F" },
  { start: 0.55, end: 0.83, value: "B" },
  { start: 0.83, end: 0.95, value: "X" },
  { start: 0.95, end: 1.28, value: "B" },
  { start: 1.28, end: 1.42, value: "E" },
  { start: 1.42, end: 1.51, value: "A" },
  { start: 1.51, end: 1.60, value: "C" },
  { start: 1.60, end: 2.02, value: "B" },
  { start: 2.02, end: 2.16, value: "H" },
  { start: 2.16, end: 2.23, value: "B" },
  { start: 2.23, end: 2.58, value: "C" },
  { start: 2.58, end: 2.72, value: "B" },
  { start: 2.72, end: 2.86, value: "E" },
  { start: 2.86, end: 3.07, value: "F" },
  { start: 3.07, end: 3.14, value: "B" },
  { start: 3.14, end: 3.60, value: "X" },
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

export function JpFirstLineTest() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const mouthInputRef = useRef(null);
  const browInputRef = useRef(null);
  const lastFrameRef = useRef(-1);
  const [initHandle] = useState(() => delayRender('jpfl-init'));

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
    const handle = delayRender(`jpfl-f${frame}`);
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
      <Audio src={staticFile('jp_first_line.wav')} />
      <div style={{ position: 'absolute', bottom: 0, right: (1080 - SIZE) / 2, width: SIZE, height: SIZE, filter: 'drop-shadow(14px 18px 10px rgba(0,0,0,0.75))' }}>
        <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ width: SIZE, height: SIZE }} />
      </div>
    </div>
  );
}
