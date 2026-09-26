import React, { useRef, useEffect, useState } from 'react';
import { staticFile, delayRender, continueRender } from 'remotion';
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

export function BodyPosTest({ value }) {
  const canvasRef = useRef(null);
  const [handle] = useState(() => delayRender('body'));

  useEffect(() => {
    const r = new Rive({
      src: staticFile('aato01_jointtest01.riv'),
      canvas: canvasRef.current,
      autoplay: true,
      stateMachine: 'State Machine 1',
      onLoad: () => {
        r.resizeDrawingSurfaceToCanvas();
        const inputs = r.stateMachineInputs('State Machine 1');
        const bodyInput = inputs?.find(i => i.name === 'body_pos');
        if (bodyInput) bodyInput.value = value;
        for (let i = 0; i < 120; i++) r.advanceAndReportChanges(1 / 60);
        paintRive(r);
        continueRender(handle);
      },
      onLoadError: () => continueRender(handle),
    });
    disableInternalLoop(r);
  }, []);

  return (
    <div style={{ width: 700, height: 900, background: '#808080' }}>
      <canvas ref={canvasRef} width={700} height={900} style={{ width: 700, height: 900 }} />
    </div>
  );
}
