# ttchop overlay kit (Remotion)

Proyecto Remotion para generar overlays de video (hook con camera-shake, gráficos/stats de producto, carrusel, precio con FOMO). Ver la memoria permanente del agente (`overlays_video_task.md`) para el proceso completo del pipeline (Telegram -> guion -> imágenes -> render -> FTP/Telegram).

## Setup en una sesión nueva

```bash
git clone https://github.com/pumacamargo/cacho_inmotion /tmp/cacho_inmotion
cd /tmp/cacho_inmotion
npm install
```

Los datos de producto (imágenes, `product.json`, `product_nicknames.json`) siguen viviendo en el repo separado `https://github.com/pumacamargo/ttchop_db` — clonarlo aparte para el paso de selección de imágenes/precio.

**Requisitos del sistema (una sola vez por entorno):**
```bash
apt-get install -y fonts-noto-cjk fonts-noto-color-emoji
```
Sin esto, el texto japonés y los emojis se renderizan invisibles/como cajas vacías en el render headless — no da error, solo sale en blanco. Verificar con `fc-list | grep -i noto`.

**No tocar la versión de React** (`react`/`react-dom` fijos en `18.3.1`) — React 19 causa un crash de stack overflow silencioso en el render headless de Remotion 4.0.488.

## Estructura

- `src/OverlayKit.jsx` — todos los componentes reutilizables: `Phase`, `envelope`, `PopText`, `SlideText`, `CameraShake`, `AnimatedList`, `AreaChart`, `ComparisonChart`, `NotificationPop`, `ProgressSteps`, `SplitScreen`, `GalleryGrid`, `CardFlip`, `MasonryGallery`, `RotatingCarousel`, `PriceShake`, `makeBaseTextStyle`, `centerCard`.
- `src/Root.jsx` — registra una `<Composition>` por video/producto (id = `ttchop-{productId}`, sufijo `-v2` etc. si se rehace el mismo producto).
- `src/<Nombre>Overlay.jsx` — una composición por producto ya entregado (sirven de referencia/plantilla para el siguiente).
- `public/` — NO se sube al repo (imágenes y video de cada producto se descargan/copian frescos en cada sesión, ver guía).

## Para un producto nuevo

1. Crear `public/carouselN/` con las imágenes elegidas del repo (`products/{productId}/images/`) y copiar el video descargado a `public/video_overlayN.mp4`.
2. Copiar un `src/<Nombre>Overlay.jsx` existente como plantilla, cambiar `ACCENT` (color del FONDO del video, no del empaque — extraer un frame y mirarlo), textos, timings, imágenes.
3. Agregar la `<Composition>` en `Root.jsx` con id único `ttchop-{productId}`.
4. Render de prueba corto (`--frames=0-200` o similar) antes del render completo.
5. Render completo: `npx remotion render index.ts <composition-id> <output.mp4> --codec=h264`.

## Reglas de estilo (resumen — la guía completa tiene el detalle)

- Estructura de 3 fases: Hook (0-3s, camera-shake fuerte `amplitude=45 decayFrames=22`) → Producto (~3-4s por template, alternar stats/imagen) → CTA (precio + FOMO + disclaimer).
- Tarjetas al 1.5x (`centerCard` con `scale(1.5)`), posicionadas en el tercio superior (`top: '28%'`), para dejar el video visible en el centro/abajo (formato TikTok).
- `PriceShake` ya incluye el disclaimer `※価格は予告なく変更される場合があります` automáticamente — no agregarlo a mano.
- CRF de exportación: 26 (`remotion.config.ts`) — buen balance calidad/tamaño para TikTok.
- Nunca inventar descuentos: si `product.json` no tiene `price.discount`, usar otra señal real (`social_proof.sales_volume`, `free_shipping`, rating) en el `fomo`.

## Pipeline con ttchop-server (collage + overlay)

El flujo completo cuando se usa ttchop-server para generar el collage base:

```
1. POST /collage/dialogue { product, collageTemplate, language }
   ← { dialogue: "script de voz..." }

2. POST /collage/create { voiceId, dialogue, sessions, renderId, ... }
   ← { videoUrl: "https://lemonsushi.com/.../collage.mp4" }

3. POST ttchop-post /render { videoUrl, productUrl, market? }
   ← MP4 con overlay animado
```

> ⚠️ **`sessions` en `/collage/create` DEBE incluir `downloadUrl` en cada video.** Si se pasan solo IDs, el LLM que genera el recipe de ffmpeg inventa URLs `gs://` incorrectas y el collage falla.

**Voice IDs de ElevenLabs:**
| Mercado | Voz | ID |
|---------|-----|----|
| 🇯🇵 JP | Announcer (masculino) | `gU0LNdkMOQCOrPrwtbee` |
| 🇲🇽 MX | Jessica (femenino) | `cgSgspJ2msm6clMCkdW9` |

### Overlays hardcodeados (timing personalizado)

Para productos con overlay a medida (ej. `XrealV4Overlay.jsx`), el proceso es:
1. Ajustar timings en el `.jsx` según la duración real del collage (ej. escalar de 39s → 25s si el collage quedó a 1.3x)
2. Actualizar `durationInFrames` en `Root.jsx` (duración en segundos × 25 fps)
3. Render directo sin pasar por ttchop-post: `npx remotion render index.ts <composition-id> /tmp/output.mp4`

## Entrega por Telegram

- Mandar el MP4 como archivo adjunto local (`files: [path]`) via reply tool — Telegram lo muestra **inline como video**, no como archivo descargable.
- Si antes llegaba como archivo: era porque se mandaba el URL de Firebase (texto). Adjunto local = video inline.
- Regla: adjunto local siempre. FTP/Firebase URL solo si el archivo supera ~50MB.
