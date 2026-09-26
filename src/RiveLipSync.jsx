import React, { useRef, useEffect, useState } from 'react';
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender, Audio } from 'remotion';
import { Rive } from '@rive-app/canvas';

// Rhubarb phoneme → mouth_pos value (0=idle, 1=mouth_A open, 2=mouth_O rounded)
const PHONEME_MAP = {
  X: 0, // silence
  A: 0, // m, b, p — lips together
  B: 1, // rest/slight open
  C: 1, // d, s, t, k — open
  D: 1, // th — open
  E: 2, // oo, u — rounded
  F: 2, // f, v — rounded
  G: 1, // l — open
  H: 1, // a, i — wide open
};

// Rhubarb output converted to frame-based schedule at 30fps
const MOUTH_CUES = [
  { start: 0.00, end: 0.21, value: "E" },
  { start: 0.21, end: 0.70, value: "B" },
  { start: 0.70, end: 0.78, value: "A" },
  { start: 0.78, end: 1.07, value: "D" },
  { start: 1.07, end: 1.21, value: "C" },
  { start: 1.21, end: 1.42, value: "E" },
  { start: 1.42, end: 1.56, value: "A" },
  { start: 1.56, end: 1.70, value: "B" },
  { start: 1.70, end: 1.77, value: "C" },
  { start: 1.77, end: 2.19, value: "B" },
  { start: 2.19, end: 2.33, value: "C" },
  { start: 2.33, end: 2.49, value: "A" },
  { start: 2.49, end: 2.63, value: "D" },
  { start: 2.63, end: 2.77, value: "B" },
  { start: 2.77, end: 2.84, value: "C" },
  { start: 2.84, end: 3.05, value: "D" },
  { start: 3.05, end: 3.50, value: "E" },
  { start: 3.50, end: 3.76, value: "B" },
  { start: 3.76, end: 3.83, value: "C" },
  { start: 3.83, end: 4.46, value: "B" },
  { start: 4.46, end: 4.54, value: "A" },
  { start: 4.54, end: 4.65, value: "C" },
  { start: 4.65, end: 4.93, value: "B" },
  { start: 4.93, end: 5.00, value: "X" },
];

// Random blink times (seconds): roughly every 2-4s
const BLINK_TIMES = [1.2, 3.6];

function getMouthPos(timeSec) {
  const cue = MOUTH_CUES.slice().reverse().find(c => timeSec >= c.start);
  return PHONEME_MAP[cue?.value ?? 'X'] ?? 0;
}

function applyFrame(r, mouthInput, blinkInput, f, fps) {
  const timeSec = f / fps;
  if (mouthInput) mouthInput.value = getMouthPos(timeSec);
  if (blinkInput) {
    const prevSec = (f - 1) / fps;
    for (const bt of BLINK_TIMES) {
      if (prevSec < bt && timeSec >= bt) blinkInput.fire();
    }
  }
  r.advanceAndReportChanges(1 / fps);
}

export function RiveLipSync() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const mouthInputRef = useRef(null);
  const blinkInputRef = useRef(null);
  const lastFrameRef = useRef(-1);
  const [initHandle] = useState(() => delayRender('rive-init'));

  useEffect(() => {
    if (!canvasRef.current) return;
    const initFrame = frame;

    const r = new Rive({
      src: staticFile('faceprototype.riv'),
      canvas: canvasRef.current,
      autoplay: true,
      stateMachine: 'State Machine 1',
      onLoad: () => {
        r.resizeDrawingSurfaceToCanvas();
        const inputs = r.stateMachineInputs('State Machine 1');
        mouthInputRef.current = inputs?.find(i => i.name === 'mouth_pos') ?? null;
        blinkInputRef.current = inputs?.find(i => i.name === 'do_blink') ?? null;
        riveRef.current = r;

        for (let f = 0; f <= initFrame; f++) {
          applyFrame(r, mouthInputRef.current, blinkInputRef.current, f, fps);
        }
        lastFrameRef.current = initFrame;
        r.drawFrame();
        continueRender(initHandle);
      },
      onLoadError: () => continueRender(initHandle),
    });

    return () => { try { r.cleanup(); } catch {} };
  }, []);

  useEffect(() => {
    const handle = delayRender(`rive-f${frame}`);
    const r = riveRef.current;

    if (!r) { continueRender(handle); return; }

    if (lastFrameRef.current === frame) {
      r.drawFrame();
      continueRender(handle);
      return;
    }

    const from = Math.max(0, lastFrameRef.current + 1);
    for (let f = from; f <= frame; f++) {
      applyFrame(r, mouthInputRef.current, blinkInputRef.current, f, fps);
    }
    lastFrameRef.current = frame;
    r.drawFrame();
    continueRender(handle);
  }, [frame]);

  const SIZE = 648;
  const margin = 40;

  return (
    <div style={{ position: 'relative', width: 1080, height: 1920, background: '#1a1a2e' }}>
      <Audio src={staticFile('test_audio.wav')} />
      <div style={{ position: 'absolute', bottom: margin, right: margin, width: SIZE, height: SIZE }}>
        <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ width: SIZE, height: SIZE }} />
      </div>
    </div>
  );
}
