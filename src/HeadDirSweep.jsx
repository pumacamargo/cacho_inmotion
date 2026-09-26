import React, { useRef, useEffect, useState } from 'react';
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender } from 'remotion';
import { Rive } from '@rive-app/canvas';

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

const HOLD_SEC = 2; // seconds per value

function getValueAt(timeSec) {
  return Math.floor(timeSec / HOLD_SEC) % 6;
}

function applyFrame(r, dirInput, f, fps) {
  if (dirInput) dirInput.value = getValueAt(f / fps);
  r.advanceAndReportChanges(1 / fps);
}

export function HeadDirSweep() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const dirInputRef = useRef(null);
  const lastFrameRef = useRef(-1);
  const [initHandle] = useState(() => delayRender('sweep-init'));

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
        dirInputRef.current = r.stateMachineInputs('State Machine 1')?.find(i => i.name === 'head_direction') ?? null;
        riveRef.current = r;
        for (let f = 0; f <= initFrame; f++) applyFrame(r, dirInputRef.current, f, fps);
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
    const handle = delayRender(`sweep-f${frame}`);
    const r = riveRef.current;
    if (!r) { continueRender(handle); return; }
    if (lastFrameRef.current === frame) { paintRive(r); continueRender(handle); return; }
    for (let f = lastFrameRef.current + 1; f <= frame; f++) applyFrame(r, dirInputRef.current, f, fps);
    lastFrameRef.current = frame;
    paintRive(r);
    continueRender(handle);
  }, [frame]);

  const currentValue = getValueAt(frame / fps);

  return (
    <div style={{ width: 700, height: 800, background: '#808080', position: 'relative' }}>
      <canvas ref={canvasRef} width={700} height={700} style={{ width: 700, height: 700 }} />
      <div style={{ position: 'absolute', bottom: 10, width: '100%', textAlign: 'center', fontSize: 48, fontFamily: 'monospace', fontWeight: 'bold', color: '#fff' }}>
        head_direction = {currentValue}
      </div>
    </div>
  );
}
