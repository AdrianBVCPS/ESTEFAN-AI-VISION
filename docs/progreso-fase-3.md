# Progreso Fase 3 — Captura fotográfica + Selector de modo

**Fecha:** 2026-04-09  
**Commit:** `9957390`  
**Estado:** Completada ✅

---

## Qué se construyó

### Componentes cámara (`src/components/camera/`)

- **CaptureGuide** — Overlay SVG con siluetas indicativas de cabeza (frontal/lateral/trasera). Dorado 40% opacidad, texto instrucción con sombra para legibilidad sobre cualquier fondo de cámara.
- **CameraCapture** — Gestiona `getUserMedia` con fallback `environment → user`. Cleanup de todos los tracks en unmount. Captura via canvas offscreen JPEG 0.92. Estados: loading / ready / error con mensaje claro y botón reintentar.
- **PhotoPreview** — Pantalla completa con preview. Fade-in con `requestAnimationFrame` doble. Panel inferior `backdrop-blur` navy 82% opacidad. Botones Repetir/Confirmar.
- **PhotoStrip** — 3 slots 56×56px. Slot con foto: miniatura + etiqueta F/L/T. Slot activo vacío: punteado con `animate-pulse`. Slot futuro: gris 20%. Slot activo (con o sin foto): outline dorado 2px.
- `index.ts` — Barrel export.

### Páginas (`src/app/(protected)/`)

- **`/capture`** — Orquesta flujo de 3 fotos (frontal→lateral→trasera). Key en `<CameraCapture key={currentAngle}>` fuerza re-mount al cambiar ángulo. URL del preview revocada al confirmar o desmontar. Barra de progreso + PhotoStrip visible en overlay negro 75%.
- **`/mode-select`** — 2 tarjetas (columna móvil / fila tablet). Modo A dorado + Modo B teal. Guardia que redirige a `/capture` si hay menos de 3 fotos.
- **`/preferences`** — 4 grupos de chips (longitud / estilo / barba / tipo pelo). Estado local inicializado desde `consultation.preferences`. CTA fijo "Analizar con IA ✨" → `/loading-ai` (Fase 4).
- **`/describe`** — Textarea + contador 500 chars. Focus con box-shadow dorado (Regla No-Line). Chips sugerencia en teal. CTA teal "Generar preview" → `/loading-ai` (Fase 4).

### Utilidades y validaciones

- **`compress-image.ts`** — `compressImage(blob, maxDimension=1024): Promise<Blob>`. Rutas: OffscreenCanvas+createImageBitmap → HTMLCanvas+createImageBitmap → img load fallback. Si la imagen ya es menor que maxDimension, la devuelve sin re-encodificar. `ImageBitmap.close()` garantizado en todos los paths.
- **`schemas.ts`** — Añadidos `preferencesSchema` + `PreferencesInput` y `descriptionSchema` + `DescriptionInput`.

### CSS (`src/app/globals.css`)

- `@keyframes fade-in` — para PhotoPreview
- `@keyframes slide-in-right` — para transiciones entre pantallas del flujo

---

## Decisiones técnicas

- **`key={currentAngle}` en CameraCapture** — Forzar re-mount completo al cambiar ángulo es más robusto que reutilizar el componente: garantiza cleanup del stream anterior y re-solicitud de getUserMedia limpia.
- **Preview URL vs. Photo URL separadas** — El pendingUrl (alta res) se revoca al confirmar; la Photo en el contexto tiene su propio objectURL del blob comprimido. Evita acumulación de URLs sin revocar.
- **OffscreenCanvas en compress-image** — Disponible en todos los browsers modernos (Chrome 69+, Firefox 105+, Safari 16.4+). Funciona en workers. Fallback seguro para browsers antiguos.
- **CTA a `/loading-ai` en preferences y describe** — La ruta aún no existe (se crea en Fase 4). En producción el router navegará y Next.js mostrará not-found hasta que esté creada.

---

## Criterios de aceptación verificados

- [x] Cámara se activa (preferencia trasera, fallback frontal)
- [x] Overlay guía correcto para cada ángulo
- [x] Preview post-captura con Repetir/Confirmar
- [x] Barra de progreso refleja estado (1/3, 2/3, 3/3)
- [x] Miniaturas de fotos confirmadas visibles en PhotoStrip
- [x] Al completar 3 fotos → navega a `/mode-select`
- [x] Selector de modo A/B funcional
- [x] Preferencias Modo A: chips seleccionables, CTA activo
- [x] Descripción Modo B: textarea con validación min 5 chars
- [x] Compresión funcional: máx 1024px, JPEG 85%
- [x] Zero data retention: fotos solo en memoria cliente
- [x] Permisos cámara denegados → mensaje claro
- [x] Build limpio: `✓ Compiled successfully`, 0 errores TypeScript, 9 páginas generadas

---

## Siguiente paso: Fase 4 — Integración IA (Gemini) + Resultados

- API Route `/api/gemini/analyze` — análisis facial multimodal
- API Route `/api/gemini/generate` — generación de imagen
- Prompts Gemini en `src/lib/gemini/prompts.ts`
- Página `/loading-ai` — animación premium 15-25s con textos rotativos
- Flujo Modo A: analyzeFace → 2×generateImage en paralelo → resultados
- Flujo Modo B: generateImage → resultado
- Páginas de resultados `/results` (Modo A: 2 tarjetas / Modo B: 1 imagen pantalla completa)
