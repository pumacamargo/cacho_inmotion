import React, { useRef, useEffect, useState } from 'react';
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender, Audio, Video, Loop } from 'remotion';
import { Rive } from '@rive-app/canvas';

const PHONEME_MAP = { X: 0, A: 1, B: 2, C: 3, D: 3, G: 3, E: 4, H: 5, F: 6 };

// Rhubarb output from jp_emotion.wav — curious, excited, happily, surprised (japones)
const MOUTH_CUES = [
  { start: 0.00, end: 0.05, value: "B" },
  { start: 0.05, end: 0.31, value: "C" },
  { start: 0.31, end: 0.94, value: "B" },
  { start: 0.94, end: 1.30, value: "F" },
  { start: 1.30, end: 1.38, value: "B" },
  { start: 1.38, end: 1.46, value: "A" },
  { start: 1.46, end: 1.51, value: "C" },
  { start: 1.51, end: 2.10, value: "B" },
  { start: 2.10, end: 2.24, value: "C" },
  { start: 2.24, end: 2.38, value: "B" },
  { start: 2.38, end: 2.52, value: "C" },
  { start: 2.52, end: 3.21, value: "B" },
  { start: 3.21, end: 3.28, value: "G" },
  { start: 3.28, end: 3.44, value: "B" },
  { start: 3.44, end: 3.53, value: "A" },
  { start: 3.53, end: 3.58, value: "C" },
  { start: 3.58, end: 3.91, value: "B" },
  { start: 3.91, end: 4.19, value: "F" },
  { start: 4.19, end: 4.33, value: "B" },
  { start: 4.33, end: 4.41, value: "A" },
  { start: 4.41, end: 4.48, value: "E" },
  { start: 4.48, end: 4.75, value: "B" },
  { start: 4.75, end: 4.82, value: "C" },
  { start: 4.82, end: 5.10, value: "B" },
  { start: 5.10, end: 5.20, value: "A" },
  { start: 5.20, end: 5.25, value: "C" },
  { start: 5.25, end: 5.36, value: "B" },
  { start: 5.36, end: 5.44, value: "A" },
  { start: 5.44, end: 5.78, value: "B" },
  { start: 5.78, end: 5.86, value: "A" },
  { start: 5.86, end: 6.03, value: "B" },
  { start: 6.03, end: 6.10, value: "C" },
  { start: 6.10, end: 7.21, value: "B" },
  { start: 7.21, end: 7.28, value: "C" },
  { start: 7.28, end: 7.35, value: "E" },
  { start: 7.35, end: 7.63, value: "C" },
  { start: 7.63, end: 7.77, value: "E" },
  { start: 7.77, end: 7.98, value: "B" },
  { start: 7.98, end: 8.05, value: "C" },
  { start: 8.05, end: 8.40, value: "B" },
  { start: 8.40, end: 8.75, value: "F" },
  { start: 8.75, end: 8.89, value: "C" },
  { start: 8.89, end: 9.03, value: "B" },
  { start: 9.03, end: 9.23, value: "X" },
  { start: 9.23, end: 9.61, value: "B" },
  { start: 9.61, end: 10.03, value: "F" },
  { start: 10.03, end: 10.31, value: "B" },
  { start: 10.31, end: 10.38, value: "E" },
  { start: 10.38, end: 10.80, value: "F" },
  { start: 10.80, end: 11.01, value: "B" },
  { start: 11.01, end: 11.36, value: "C" },
  { start: 11.36, end: 11.43, value: "B" },
  { start: 11.43, end: 11.44, value: "X" },
];

const BROW_CUES = [
  { start: 0.12, end: 3.44, value: 4 }, // curious
  { start: 3.58, end: 6.80, value: 1 }, // excited
  { start: 6.96, end: 9.52, value: 0 }, // happily
  { start: 9.59, end: 11.44, value: 1 }, // surprised
];

// body_pos mismo mapeo que AatoOnVideo.jsx: curious→7, excited→2, happily→0, surprised→5
const BODY_CUES = [
  { start: 0.12, end: 3.44, value: 7 }, // curious → thinking01
  { start: 3.58, end: 6.80, value: 2 }, // excited → fist02
  { start: 6.96, end: 9.52, value: 0 }, // happily → default
  { start: 9.59, end: 11.44, value: 5 }, // surprised → hand01
];

const BLINK_TIMES = [1.5, 4.2, 7.5, 10.2];

function getCue(timeSec) {
  return MOUTH_CUES.slice().reverse().find(c => timeSec >= c.start);
}
function getMouthPos(timeSec) {
  return PHONEME_MAP[getCue(timeSec)?.value ?? 'X'] ?? 0;
}
function getIsTalking(timeSec) {
  return (getCue(timeSec)?.value ?? 'X') !== 'X';
}
function getBrowPos(timeSec) {
  const cue = BROW_CUES.slice().reverse().find(c => timeSec >= c.start);
  return cue?.value ?? 0;
}
function getBodyPos(timeSec) {
  const cue = BODY_CUES.slice().reverse().find(c => timeSec >= c.start);
  return cue?.value ?? 0;
}

const HEAD_DIR_INTERVAL = 2.0;
function pseudoRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
function getHeadDirection(timeSec) {
  const bucket = Math.floor(timeSec / HEAD_DIR_INTERVAL);
  return Math.floor(pseudoRandom(bucket) * 6);
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

function applyFrame(r, mouthInput, blinkInput, talkingInput, headDirInput, browInput, bodyInput, f, fps) {
  const timeSec = f / fps;
  const prevSec = (f - 1) / fps;
  if (mouthInput) mouthInput.value = getMouthPos(timeSec);
  if (talkingInput) talkingInput.value = getIsTalking(timeSec);
  if (headDirInput) headDirInput.value = getHeadDirection(timeSec);
  if (browInput) browInput.value = getBrowPos(timeSec);
  if (bodyInput) bodyInput.value = getBodyPos(timeSec);
  if (blinkInput) {
    for (const bt of BLINK_TIMES) {
      if (prevSec < bt && timeSec >= bt) blinkInput.fire();
    }
  }
  const subSteps = Math.round(RIVE_FPS / fps);
  const dt = 1 / RIVE_FPS;
  for (let i = 0; i < subSteps; i++) r.advanceAndReportChanges(dt);
}

export function JpEmotionTest() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const mouthInputRef = useRef(null);
  const blinkInputRef = useRef(null);
  const talkingInputRef = useRef(null);
  const headDirInputRef = useRef(null);
  const browInputRef = useRef(null);
  const bodyInputRef = useRef(null);
  const lastFrameRef = useRef(-1);
  const [initHandle] = useState(() => delayRender('jpe-init'));

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
        blinkInputRef.current = inputs?.find(i => i.name === 'do_blink') ?? null;
        talkingInputRef.current = inputs?.find(i => i.name === 'is_talking') ?? null;
        headDirInputRef.current = inputs?.find(i => i.name === 'head_direction') ?? null;
        browInputRef.current = inputs?.find(i => i.name === 'brow_pos') ?? null;
        bodyInputRef.current = inputs?.find(i => i.name === 'body_pos') ?? null;
        riveRef.current = r;
        for (let f = 0; f <= initFrame; f++) {
          applyFrame(r, mouthInputRef.current, blinkInputRef.current, talkingInputRef.current, headDirInputRef.current, browInputRef.current, bodyInputRef.current, f, fps);
        }
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
    const handle = delayRender(`jpe-f${frame}`);
    const r = riveRef.current;
    if (!r) { continueRender(handle); return; }
    if (lastFrameRef.current === frame) { paintRive(r); continueRender(handle); return; }
    for (let f = lastFrameRef.current + 1; f <= frame; f++) {
      applyFrame(r, mouthInputRef.current, blinkInputRef.current, talkingInputRef.current, headDirInputRef.current, browInputRef.current, bodyInputRef.current, f, fps);
    }
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
      <Audio src={staticFile('jp_emotion.wav')} />
      <div style={{ position: 'absolute', bottom: 0, right: (1080 - SIZE) / 2, width: SIZE, height: SIZE, filter: 'drop-shadow(14px 18px 10px rgba(0,0,0,0.75))' }}>
        <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ width: SIZE, height: SIZE }} />
      </div>
    </div>
  );
}
