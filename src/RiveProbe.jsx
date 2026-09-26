import React, { useRef, useEffect, useState } from 'react';
import { staticFile, delayRender, continueRender } from 'remotion';
import { Rive, RuntimeLoader } from '@rive-app/canvas';

const RIV_FILE = 'aato01_jointtest01.riv';

export function RiveProbe() {
  const canvasRef = useRef(null);
  const [probeText, setProbeText] = useState('loading...');
  const [handle] = useState(() => delayRender('probe'));

  useEffect(() => {
    if (!canvasRef.current) return;

    (async () => {
      const lines = [`file: ${RIV_FILE}`];
      let smNames = [];
      try {
        const runtime = await RuntimeLoader.awaitInstance();
        const resp = await fetch(staticFile(RIV_FILE));
        const buf = await resp.arrayBuffer();
        const file = await runtime.load(new Uint8Array(buf));
        const ab = file.defaultArtboard();
        lines.push(`artboard: ${ab.name}`);

        const smCount = ab.stateMachineCount();
        lines.push(`--- state machines (${smCount}) ---`);
        for (let i = 0; i < smCount; i++) {
          const sm = ab.stateMachineByIndex(i);
          smNames.push(sm.name);
          lines.push(`SM[${i}] name="${sm.name}"`);
        }

        const animCount = ab.animationCount();
        lines.push(`--- animations (${animCount}) ---`);
        for (let i = 0; i < animCount; i++) {
          const anim = ab.animationByIndex(i);
          const frames = anim.duration;
          const fps = anim.fps;
          lines.push(`"${anim.name}" — ${fps}fps, ${frames}f = ${(frames / fps).toFixed(2)}s`);
        }
      } catch (e) {
        lines.push(`LOW-LEVEL PROBE ERROR: ${e.message}`);
      }

      setProbeText(lines.join('\n'));

      // Now use the high-level API with the discovered SM name(s) to list inputs
      if (smNames.length === 0) {
        continueRender(handle);
        return;
      }
      const r = new Rive({
        src: staticFile(RIV_FILE),
        canvas: canvasRef.current,
        autoplay: true,
        stateMachine: smNames[0],
        onLoad: () => {
          const more = [`--- inputs for SM "${smNames[0]}" ---`];
          for (const smName of smNames) {
            try {
              const inputs = r.stateMachineInputs(smName);
              more.push(`SM "${smName}": ${inputs?.map(i => `${i.name}(type=${i.type}, default=${i.value})`).join(', ') ?? 'none'}`);
            } catch (e) {
              more.push(`SM "${smName}": ERROR ${e.message}`);
            }
          }
          setProbeText(prev => prev + '\n' + more.join('\n'));
          continueRender(handle);
        },
        onLoadError: (e) => {
          setProbeText(prev => prev + `\nHIGH-LEVEL LOAD ERROR: ${String(e)}`);
          continueRender(handle);
        },
      });
    })();
  }, []);

  return (
    <div style={{ width: 900, height: 900, background: '#000', color: '#0f0', fontFamily: 'monospace', fontSize: 13, padding: 20 }}>
      <canvas ref={canvasRef} width={200} height={200} style={{ position: 'absolute', opacity: 0 }} />
      <pre style={{ whiteSpace: 'pre-wrap' }}>{probeText}</pre>
    </div>
  );
}
