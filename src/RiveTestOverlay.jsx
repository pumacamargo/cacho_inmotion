import React, { useRef, useEffect, useState } from 'react';
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender } from 'remotion';
import { Rive } from '@rive-app/canvas';

const MOUTH_SCHEDULE = [
  [0,   0],
  [30,  1], [45, 2], [60, 0],
  [75,  1], [90, 2], [105, 0],
  [120, 1], [135,2], [150, 0],
  [165, 1], [180,2], [195, 0],
  [210, 1], [225,2], [240, 0],
  [255, 1], [270,2], [285, 0],
];

const BLINK_FRAMES = [45, 120, 195, 255];

function applyFrame(r, mouthInput, blinkInput, f, fps) {
  const mouthVal = MOUTH_SCHEDULE.reduce((acc, [fi, v]) => f >= fi ? v : acc, 0);
  if (mouthInput) mouthInput.value = mouthVal;
  if (BLINK_FRAMES.includes(f) && blinkInput) blinkInput.fire();
  r.advanceAndReportChanges(1 / fps);
}

export function RiveTestOverlay() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const mouthInputRef = useRef(null);
  const blinkInputRef = useRef(null);
  const lastFrameRef = useRef(-1);

  // Blocks rendering until Rive is loaded
  const [initHandle] = useState(() => delayRender('rive-init'));

  // ONE-TIME: load Rive instance. In onLoad, advance to current frame (handles `still` mode).
  useEffect(() => {
    if (!canvasRef.current) return;
    const initFrame = frame; // frame at mount time

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

        // Advance frame by frame to initFrame (needed for `still` renders and frame 0)
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

  // PER-FRAME: runs every time frame changes (video render mode - same page, incremental frames)
  useEffect(() => {
    const handle = delayRender(`rive-f${frame}`);
    const r = riveRef.current;

    if (!r) {
      // Rive not loaded yet — initHandle keeps Remotion blocked; just release this handle
      continueRender(handle);
      return;
    }

    if (lastFrameRef.current === frame) {
      // Already at this frame (init effect handled it), just draw and release
      r.drawFrame();
      continueRender(handle);
      return;
    }

    // Advance incrementally from last position to current frame
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
    <div style={{ position: 'absolute', bottom: margin, right: margin, width: SIZE, height: SIZE }}>
      <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ width: SIZE, height: SIZE }} />
    </div>
  );
}
