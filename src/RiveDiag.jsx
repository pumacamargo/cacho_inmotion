import React, { useRef, useEffect, useState } from 'react';
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender, AbsoluteFill } from 'remotion';
import { Rive } from '@rive-app/canvas';

// Diagnostic: mode = 'linear' (pupil_darts only), 'sm-static' (SM, no input changes), 'sm-lipsync'
const MOUTH_SWITCH = [0, 1, 2, 3, 4, 5, 6];

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

// Autoplay calls startRendering() after onLoad, re-arming the rAF loop that advances by
// wall-clock time. No-op the loop on the instance so only our explicit advances move time.
function disableInternalLoop(r) {
  r.scheduleRendering = () => {};
  r.drawFrame = () => {};
}

export function RiveDiag({ mode }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const mouthRef = useRef(null);
  const lastFrameRef = useRef(-1);
  const [initHandle] = useState(() => delayRender('diag-init'));

  const step = (r, f) => {
    if (mode === 'sm-lipsync' && mouthRef.current) {
      mouthRef.current.value = MOUTH_SWITCH[Math.floor(f / 5) % MOUTH_SWITCH.length];
    }
    r.advanceAndReportChanges(1 / fps);
  };

  useEffect(() => {
    const initFrame = frame;
    const opts = mode === 'linear'
      ? { animations: 'pupil_darts' }
      : { stateMachines: undefined, stateMachine: 'State Machine 1' };
    const r = new Rive({
      src: staticFile('aato01.riv'),
      canvas: canvasRef.current,
      autoplay: true,
      ...opts,
      onLoad: () => {
        r.resizeDrawingSurfaceToCanvas();
        if (mode !== 'linear') {
          mouthRef.current = r.stateMachineInputs('State Machine 1')?.find(i => i.name === 'mouth_pos') ?? null;
        }
        riveRef.current = r;
        for (let f = 0; f <= initFrame; f++) step(r, f);
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
    const handle = delayRender(`diag-f${frame}`);
    const r = riveRef.current;
    if (!r) { continueRender(handle); return; }
    for (let f = lastFrameRef.current + 1; f <= frame; f++) step(r, f);
    lastFrameRef.current = Math.max(lastFrameRef.current, frame);
    paintRive(r);
    continueRender(handle);
  }, [frame]);

  return (
    <AbsoluteFill style={{ background: '#808080' }}>
      <canvas ref={canvasRef} width={700} height={700} style={{ width: 700, height: 700 }} />
    </AbsoluteFill>
  );
}
