import React, { useRef, useEffect, useState } from 'react';
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender, Audio, Video, Loop } from 'remotion';
import { Rive } from '@rive-app/canvas';

// Rhubarb → mouth_pos (0-6 matching what Cacho set in Rive)
const PHONEME_MAP = {
  X: 0, // mouth_idle (neutral smile / silence)
  A: 1, // mouth_close (m, b, p)
  B: 2, // mouth_nr (n, r — rest)
  C: 3, D: 3, G: 3, // mouth_dst (d, s, t, k, g)
  E: 4, // mouth_ouw (o, u, w)
  H: 5, // mouth_aie (a, i, e)
  F: 6, // mouth_fv (f, v)
};

// Rhubarb output from emotion_test.wav — 8 líneas, una por emoción de MASCOT_EMOTIONS,
// generadas con /collage/dialogue/structured (tags [emotion] + ElevenLabs with-timestamps)
const MOUTH_CUES = [
  { start: 0.00, end: 0.07, value: "X" },
  { start: 0.07, end: 0.12, value: "B" },
  { start: 0.12, end: 0.17, value: "E" },
  { start: 0.17, end: 0.87, value: "B" },
  { start: 0.87, end: 1.08, value: "F" },
  { start: 1.08, end: 1.15, value: "B" },
  { start: 1.15, end: 1.22, value: "C" },
  { start: 1.22, end: 1.43, value: "B" },
  { start: 1.43, end: 1.57, value: "E" },
  { start: 1.57, end: 1.64, value: "F" },
  { start: 1.64, end: 1.71, value: "D" },
  { start: 1.71, end: 1.78, value: "C" },
  { start: 1.78, end: 1.85, value: "E" },
  { start: 1.85, end: 1.99, value: "B" },
  { start: 1.99, end: 2.20, value: "C" },
  { start: 2.20, end: 2.31, value: "A" },
  { start: 2.31, end: 2.59, value: "B" },
  { start: 2.59, end: 2.69, value: "A" },
  { start: 2.69, end: 2.84, value: "B" },
  { start: 2.84, end: 3.05, value: "X" },
  { start: 3.05, end: 3.36, value: "B" },
  { start: 3.36, end: 3.44, value: "A" },
  { start: 3.44, end: 3.62, value: "C" },
  { start: 3.62, end: 4.04, value: "B" },
  { start: 4.04, end: 4.13, value: "A" },
  { start: 4.13, end: 4.22, value: "B" },
  { start: 4.22, end: 4.29, value: "E" },
  { start: 4.29, end: 4.43, value: "C" },
  { start: 4.43, end: 4.50, value: "F" },
  { start: 4.50, end: 4.57, value: "C" },
  { start: 4.57, end: 4.67, value: "A" },
  { start: 4.67, end: 4.73, value: "D" },
  { start: 4.73, end: 5.07, value: "B" },
  { start: 5.07, end: 5.35, value: "F" },
  { start: 5.35, end: 5.49, value: "C" },
  { start: 5.49, end: 5.56, value: "E" },
  { start: 5.56, end: 6.26, value: "B" },
  { start: 6.26, end: 6.34, value: "A" },
  { start: 6.34, end: 6.65, value: "C" },
  { start: 6.65, end: 6.75, value: "A" },
  { start: 6.75, end: 6.87, value: "C" },
  { start: 6.87, end: 7.08, value: "B" },
  { start: 7.08, end: 7.15, value: "E" },
  { start: 7.15, end: 7.22, value: "F" },
  { start: 7.22, end: 7.43, value: "H" },
  { start: 7.43, end: 7.50, value: "B" },
  { start: 7.50, end: 7.57, value: "C" },
  { start: 7.57, end: 7.64, value: "B" },
  { start: 7.64, end: 7.78, value: "F" },
  { start: 7.78, end: 7.85, value: "B" },
  { start: 7.85, end: 7.99, value: "F" },
  { start: 7.99, end: 8.07, value: "A" },
  { start: 8.07, end: 8.18, value: "E" },
  { start: 8.18, end: 8.33, value: "F" },
  { start: 8.33, end: 8.39, value: "B" },
  { start: 8.39, end: 8.45, value: "C" },
  { start: 8.45, end: 8.59, value: "B" },
  { start: 8.59, end: 8.87, value: "C" },
  { start: 8.87, end: 8.99, value: "A" },
  { start: 8.99, end: 9.21, value: "E" },
  { start: 9.21, end: 9.30, value: "A" },
  { start: 9.30, end: 9.57, value: "B" },
  { start: 9.57, end: 9.64, value: "E" },
  { start: 9.64, end: 9.71, value: "F" },
  { start: 9.71, end: 9.85, value: "H" },
  { start: 9.85, end: 9.92, value: "D" },
  { start: 9.92, end: 10.06, value: "C" },
  { start: 10.06, end: 10.82, value: "B" },
  { start: 10.82, end: 11.10, value: "C" },
  { start: 11.10, end: 11.24, value: "B" },
  { start: 11.24, end: 11.73, value: "F" },
  { start: 11.73, end: 11.80, value: "B" },
  { start: 11.80, end: 11.94, value: "C" },
  { start: 11.94, end: 12.08, value: "B" },
  { start: 12.08, end: 12.15, value: "C" },
  { start: 12.15, end: 12.29, value: "B" },
  { start: 12.29, end: 12.43, value: "F" },
  { start: 12.43, end: 12.50, value: "B" },
  { start: 12.50, end: 12.71, value: "E" },
  { start: 12.71, end: 12.85, value: "F" },
  { start: 12.85, end: 12.99, value: "B" },
  { start: 12.99, end: 13.06, value: "C" },
  { start: 13.06, end: 13.13, value: "B" },
  { start: 13.13, end: 13.21, value: "A" },
  { start: 13.21, end: 13.32, value: "C" },
  { start: 13.32, end: 13.39, value: "B" },
  { start: 13.39, end: 13.53, value: "C" },
  { start: 13.53, end: 14.09, value: "B" },
  { start: 14.09, end: 14.16, value: "E" },
  { start: 14.16, end: 14.37, value: "C" },
  { start: 14.37, end: 14.51, value: "B" },
  { start: 14.51, end: 14.62, value: "A" },
  { start: 14.62, end: 14.97, value: "B" },
  { start: 14.97, end: 15.25, value: "F" },
  { start: 15.25, end: 15.72, value: "B" },
  { start: 15.72, end: 15.84, value: "F" },
  { start: 15.84, end: 16.26, value: "B" },
  { start: 16.26, end: 16.47, value: "C" },
  { start: 16.47, end: 16.82, value: "E" },
  { start: 16.82, end: 17.03, value: "C" },
  { start: 17.03, end: 17.14, value: "A" },
  { start: 17.14, end: 17.25, value: "F" },
  { start: 17.25, end: 17.67, value: "B" },
  { start: 17.67, end: 17.95, value: "F" },
  { start: 17.95, end: 18.09, value: "B" },
  { start: 18.09, end: 18.58, value: "C" },
  { start: 18.58, end: 18.65, value: "B" },
  { start: 18.65, end: 18.72, value: "F" },
  { start: 18.72, end: 18.86, value: "A" },
  { start: 18.86, end: 18.94, value: "C" },
  { start: 18.94, end: 19.50, value: "B" },
  { start: 19.50, end: 19.57, value: "E" },
  { start: 19.57, end: 19.71, value: "F" },
  { start: 19.71, end: 20.27, value: "B" },
  { start: 20.27, end: 20.41, value: "E" },
  { start: 20.41, end: 20.48, value: "C" },
  { start: 20.48, end: 20.55, value: "B" },
  { start: 20.55, end: 20.56, value: "X" },
];

const BLINK_TIMES = [1.5, 4.2, 7.0, 9.8, 12.5, 15.3, 18.0, 20.0];

function getCue(timeSec) {
  return MOUTH_CUES.slice().reverse().find(c => timeSec >= c.start);
}

function getMouthPos(timeSec) {
  return PHONEME_MAP[getCue(timeSec)?.value ?? 'X'] ?? 0;
}

// Drives is_talking → head_idle / head_talking joints. "X" cue = silence.
function getIsTalking(timeSec) {
  return (getCue(timeSec)?.value ?? 'X') !== 'X';
}

// brow_pos: 0=idle, 1=surprised, 2=annoyed, 3=sarcasm, 4=curious — confirmed via BrowTest.jsx.
// Mapeo de MASCOT_EMOTIONS (collage.js) → brow_pos, por línea con su timing real del alignment.
const BROW_CUES = [
  { start: 0.14, end: 2.88, value: 4 }, // curious: "Oye, tienes que ver esto ahorita mismo."
  { start: 3.11, end: 5.80, value: 1 }, // surprised: "No inventes, mira nada más qué chulada."
  { start: 6.18, end: 8.16, value: 1 }, // excited: "Esto va a cambiar todo, te lo juro!"
  { start: 8.38, end: 10.40, value: 0 }, // happily: "Me encanta cómo quedó, la neta."
  { start: 10.55, end: 12.88, value: 3 }, // sarcastically: "Ah sí, seguro tú ya lo sabías todo."
  { start: 13.03, end: 15.56, value: 2 }, // annoyed: "Ya párale, en serio, nada más escúchame."
  { start: 15.83, end: 18.01, value: 0 }, // sighs: "Bueno... ya, con calma te explico."
  { start: 18.23, end: 20.57, value: 0 }, // laughs: "jaja no manches, está buenísimo."
];

function getBrowPos(timeSec) {
  const cue = BROW_CUES.slice().reverse().find(c => timeSec >= c.start);
  return cue?.value ?? 0;
}

// body_pos: 0=default, 1=fist01, 2=fist02, 3=pointing01, 4=pointing02, 5=hand01(dedo arriba),
// 6=hand02, 7=thinking01, 8=thinking02 — confirmado por Cacho via BodyPosTest.jsx.
// Mismo timing por línea que BROW_CUES, mapeo distinto de MASCOT_EMOTIONS → body_pos.
const BODY_CUES = [
  { start: 0.14, end: 2.88, value: 7 }, // curious → thinking01
  { start: 3.11, end: 5.80, value: 5 }, // surprised → hand01 (dedo arriba, "espera qué")
  { start: 6.18, end: 8.16, value: 2 }, // excited → fist02
  { start: 8.38, end: 10.40, value: 0 }, // happily → default
  { start: 10.55, end: 12.88, value: 4 }, // sarcastically → pointing02 (brazos cruzados)
  { start: 13.03, end: 15.56, value: 8 }, // annoyed → thinking02 (brazos cruzados)
  { start: 15.83, end: 18.01, value: 0 }, // sighs → default
  { start: 18.23, end: 20.57, value: 1 }, // laughs → fist01
];

function getBodyPos(timeSec) {
  const cue = BODY_CUES.slice().reverse().find(c => timeSec >= c.start);
  return cue?.value ?? 0;
}

// head_direction: 0-5, all 6 confirmed working by Cacho via HeadDirSweep.jsx render.
// Deterministic pseudo-random per time bucket so it's reproducible regardless of render/frame order.
const HEAD_DIR_INTERVAL = 2.0; // seconds between direction changes
function pseudoRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
function getHeadDirection(timeSec) {
  const bucket = Math.floor(timeSec / HEAD_DIR_INTERVAL);
  return Math.floor(pseudoRandom(bucket) * 6); // 0-5
}

const RIVE_FPS = 60;
const RIVE_SPEED_SCALE = 1.0;

// Rive's rAF loop advances by wall-clock time, and autoplay re-arms it after onLoad, so
// stopRendering() is not enough. No-op it on the instance so only our advances move time.
function disableInternalLoop(r) {
  r.scheduleRendering = () => {};
  r.drawFrame = () => {};
}

// Paint the current state without advancing time.
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
  const dt = (1 / RIVE_FPS) * RIVE_SPEED_SCALE;
  for (let i = 0; i < subSteps; i++) {
    r.advanceAndReportChanges(dt);
  }
}

export function AatoOnVideo() {
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
  const [initHandle] = useState(() => delayRender('rive-init'));

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
    const handle = delayRender(`rive-f${frame}`);
    const r = riveRef.current;
    if (!r) { continueRender(handle); return; }
    if (lastFrameRef.current === frame) { paintRive(r); continueRender(handle); return; }
    const from = Math.max(0, lastFrameRef.current + 1);
    for (let f = from; f <= frame; f++) {
      applyFrame(r, mouthInputRef.current, blinkInputRef.current, talkingInputRef.current, headDirInputRef.current, browInputRef.current, bodyInputRef.current, f, fps);
    }
    lastFrameRef.current = frame;
    paintRive(r);
    continueRender(handle);
  }, [frame]);

  // Character size: fits nicely in TikTok frame
  const SIZE = 700;
  const MARGIN = 0;

  return (
    <div style={{ position: 'relative', width: 1080, height: 1920, overflow: 'hidden' }}>
      <Loop durationInFrames={Math.round(5.1 * fps)}>
        <Video src={staticFile('bg_5s_noaudio.mp4')} style={{ width: 1080, height: 1920, objectFit: 'cover' }} />
      </Loop>
      <Audio src={staticFile('emotion_test.wav')} />
      <div
        style={{
          position: 'absolute',
          bottom: MARGIN,
          right: (1080 - SIZE) / 2,
          width: SIZE,
          height: SIZE,
          filter: 'drop-shadow(14px 18px 10px rgba(0,0,0,0.75))',
        }}
      >
        <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ width: SIZE, height: SIZE }} />
      </div>
    </div>
  );
}
