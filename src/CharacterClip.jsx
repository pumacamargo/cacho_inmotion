import React, { useRef, useEffect, useState } from 'react';
import { useCurrentFrame, useVideoConfig, staticFile, delayRender, continueRender, Audio } from 'remotion';
import { Rive } from '@rive-app/canvas';

// Mismo verde que ya usa AutoOverlay.jsx (colorKey #00b140) — para que el mismo
// chromakey de producción funcione sin ajustar nada al pegar este clip.
export const CHARACTER_GREEN = '#00b140';

function findCue(cues, timeSec) {
  if (!cues || cues.length === 0) return undefined;
  for (let i = cues.length - 1; i >= 0; i--) {
    if (timeSec >= cues[i].start) return cues[i];
  }
  return undefined;
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

// head_direction: aleatorio determinista por bloques de tiempo (no depende de frame order).
const HEAD_DIR_INTERVAL = 2.0;
function pseudoRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
function getHeadDirection(timeSec) {
  const bucket = Math.floor(timeSec / HEAD_DIR_INTERVAL);
  return Math.floor(pseudoRandom(bucket) * 6); // 0-5
}

function applyFrame(r, inputs, cues, f, fps) {
  const timeSec = f / fps;
  const prevSec = (f - 1) / fps;
  const mouthCue = findCue(cues.mouthCues, timeSec);
  if (inputs.mouth) inputs.mouth.value = mouthCue?.value ?? 0;
  if (inputs.talking) inputs.talking.value = (mouthCue?.value ?? 0) !== 0;
  if (inputs.headDir) inputs.headDir.value = getHeadDirection(timeSec);
  if (inputs.brow) inputs.brow.value = findCue(cues.browCues, timeSec)?.value ?? 0;
  if (inputs.body) inputs.body.value = findCue(cues.bodyCues, timeSec)?.value ?? 0;
  if (inputs.blink && cues.blinkTimes) {
    for (const bt of cues.blinkTimes) {
      if (prevSec < bt && timeSec >= bt) inputs.blink.fire();
    }
  }
  const subSteps = Math.round(RIVE_FPS / fps);
  const dt = 1 / RIVE_FPS;
  for (let i = 0; i < subSteps; i++) r.advanceAndReportChanges(dt);
}

// Composición 100% por props — nada hardcodeado. Ver CHARACTER_GREEN para el
// color de fondo (debe coincidir con el colorKey usado al componer con ffmpeg).
//
// Props:
//   rivFile: string       — nombre del .riv en public/ (ej. "aato01_jointtest01.riv")
//   audioFile: string     — nombre del audio en public/ (wav/mp3)
//   duration: number      — segundos, usado por calculateMetadata para durationInFrames
//   mouthCues: [{start,end,value}]  — value = mouth_pos (0-6)
//   browCues: [{start,end,value}]   — value = brow_pos (0-4)
//   bodyCues: [{start,end,value}]   — value = body_pos (0-8)
//   blinkTimes: [number]  — segundos donde disparar do_blink
export const CharacterClip = ({
  rivFile,
  audioFile,
  mouthCues = [],
  browCues = [],
  bodyCues = [],
  blinkTimes = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const inputsRef = useRef({});
  const lastFrameRef = useRef(-1);
  const [initHandle] = useState(() => delayRender('char-init'));

  const cues = { mouthCues, browCues, bodyCues, blinkTimes };

  useEffect(() => {
    if (!canvasRef.current) return;
    const initFrame = frame;
    const r = new Rive({
      src: staticFile(rivFile),
      canvas: canvasRef.current,
      autoplay: true,
      stateMachine: 'State Machine 1',
      onLoad: () => {
        r.resizeDrawingSurfaceToCanvas();
        const inputs = r.stateMachineInputs('State Machine 1');
        inputsRef.current = {
          mouth: inputs?.find(i => i.name === 'mouth_pos') ?? null,
          blink: inputs?.find(i => i.name === 'do_blink') ?? null,
          talking: inputs?.find(i => i.name === 'is_talking') ?? null,
          headDir: inputs?.find(i => i.name === 'head_direction') ?? null,
          brow: inputs?.find(i => i.name === 'brow_pos') ?? null,
          body: inputs?.find(i => i.name === 'body_pos') ?? null,
        };
        riveRef.current = r;
        for (let f = 0; f <= initFrame; f++) applyFrame(r, inputsRef.current, cues, f, fps);
        lastFrameRef.current = initFrame;
        paintRive(r);
        continueRender(initHandle);
      },
      onLoadError: () => continueRender(initHandle),
    });
    disableInternalLoop(r);
    return () => { try { r.cleanup(); } catch {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handle = delayRender(`char-f${frame}`);
    const r = riveRef.current;
    if (!r) { continueRender(handle); return; }
    if (lastFrameRef.current === frame) { paintRive(r); continueRender(handle); return; }
    for (let f = lastFrameRef.current + 1; f <= frame; f++) applyFrame(r, inputsRef.current, cues, f, fps);
    lastFrameRef.current = frame;
    paintRive(r);
    continueRender(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame]);

  return (
    <div style={{ width: '100%', height: '100%', background: CHARACTER_GREEN }}>
      <Audio src={staticFile(audioFile)} />
      <canvas ref={canvasRef} width={1080} height={1080} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
