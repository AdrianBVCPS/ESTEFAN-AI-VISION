# Progreso Fase 4 — Integración IA (Gemini) + Resultados

**Fecha:** 2026-04-09  
**Commits:** `da3aacd` (Fase 4) → `a1210ec` (code review) → `c64323a` (modelo)
**Estado:** Completada + Code Review aplicado ✅

---

## Qué se construyó

### API Routes (`src/app/api/gemini/`)

- **`/api/gemini/analyze`** — POST. Recibe 3 fotos (base64) + preferencias. Llama a `gemini-3-flash-preview` con análisis facial multimodal. Devuelve `{ faceShape, recommendations[2], confidence }`. Rate limiting via RPC atómica Supabase. Validación Zod completa de respuesta.
- **`/api/gemini/generate`** — POST. Recibe 3 fotos + prompt + title + promptMode. Llama a `gemini-3.1-flash-image-preview` (Nano Banana 2) con `responseModalities: ['TEXT', 'IMAGE']`. Devuelve imagen generada en base64. Rate limiting también aquí.

### Capa Gemini (`src/lib/gemini/`)

- **`types.ts`** — `GeminiAnalysisResponse`, `Recommendation`, `AnalyzeRequest`, `GenerateRequest`, `GeminiGenerateResponse`.
- **`prompts.ts`** — `buildAnalyzePrompt()`, `buildGeneratePromptModeA(visualPrompt)`, `buildGeneratePromptModeB()`. `ANALYZE_SYSTEM_INSTRUCTION` con restricciones de identidad primero.
- **`client.ts`** — `analyzeFace()` y `generateImage()`. Comprime fotos antes de enviar (1024px JPEG 85% vía `compressImage()`). Timeout 60s via AbortController con mensaje amigable al expirar.
- **`rate-limit.ts`** — `checkAndIncrementUsage()`: usa RPC `increment_gemini_usage` atómica (sin race condition). Límite 50/día. Wrapper tipado acotado (evita `as any`).

### Páginas (`src/app/(protected)/`)

- **`/loading-ai`** — Fondo navy. Monograma EA shimmer dorado. Textos rotativos cada 3s. Barra progreso indeterminada dorada. Orquesta: Modo A (`analyzeFace` → `Promise.all([generateImage x2])`) / Modo B (`generateImage`). Pantalla error con Reintentar + Volver. `hasStarted` ref evita doble ejecución.
- **`/results`** — Modo A: header navy + carrusel snap móvil / columna tablet+ + CTA fijo. Modo B: imagen fullscreen + gradiente navy + badge "AI RENDER ACTIVE" teal + 3 acciones.

### Componentes (`src/components/results/`)

- **`ResultCard`** — Tarjeta Modo A. Imagen IA (3:2), badge "✦ IA RENDER", watermark EA, Playfair, sección "Por qué te queda" dorado, botones Descargar + Regenerar opcional.

### Tipos y validación

- **`src/types/database.ts`** — `app_config` con `id` (campo faltaba). `increment_gemini_usage` tipada en Functions. `__InternalSupabase.PostgrestVersion: '12'`.
- **`src/lib/validations/schemas.ts`** — `analyzeRequestSchema`, `generateRequestSchema`, `geminiAnalysisResponseSchema` (valida estructura completa de respuesta Gemini).

### Migraciones

- **`002_app_config.sql`** — Tabla `app_config` con RLS.
- **`003_gemini_rate_limit_fn.sql`** — Función `increment_gemini_usage` SECURITY DEFINER con `ON CONFLICT DO UPDATE WHERE` atómico. Elimina race condition TOCTOU.

---

## Modelos en uso

| Endpoint | Modelo | Razón |
|----------|--------|-------|
| `/api/gemini/analyze` | `gemini-3-flash-preview` | Inteligencia Pro-level en velocidad Flash. Mejor análisis facial y JSON estructurado. |
| `/api/gemini/generate` | `gemini-3.1-flash-image-preview` | Nano Banana 2 — mejor consistencia de personaje en generación de imagen. |

---

## Decisiones técnicas

- **Rate limit atómico** — `ON CONFLICT DO UPDATE WHERE count < limit` en un solo statement PostgreSQL. Múltiples requests concurrentes serializados por el motor, imposible superar el límite.
- **Compresión antes de enviar** — 3 fotos de cámara sin comprimir pueden ser 24 MB. Con `compressImage()` bajan a 1-2 MB. Crítico para el rendimiento del free tier.
- **Timeout 60s AbortController** — La generación de imagen puede tardar 20-40s. Sin timeout, el fetch cuelga indefinidamente en la pantalla de loading.
- **Zod en respuesta Gemini** — `JSON.parse` + cast no valida estructura interna. Si Gemini devuelve un objeto parcial, el flujo explota en la UI. `geminiAnalysisResponseSchema` valida cada campo de cada recomendación.
- **Wrapper tipado en lugar de `as any`** — `@supabase/ssr@0.10` no pasa correctamente el genérico `Functions` para `rpc()`. Solución: wrapper de función con firma explícita, documentado.
- **`promptMode: 'preformed' | 'description'`** — El visualPrompt del análisis ya viene formateado como triptych. Modo B necesita construcción completa. Un flag evita duplicar el wrapper.
- **`hasStarted` ref en loading-ai** — Evita doble llamada a la API si React re-renderiza en StrictMode.

---

## Code Review aplicado (2026-04-09)

Issues críticos corregidos:
1. ✅ Race condition rate limit → RPC atómica PostgreSQL (migración 003)
2. ✅ Sin rate limit en `/generate` → `checkAndIncrementUsage()` añadido
3. ✅ `console.error` en producción → eliminados de ambas routes
4. ✅ `JSON.parse` sin validación → `geminiAnalysisResponseSchema` (Zod)
5. ✅ Sin timeout en fetch → AbortController 60s con mensaje amigable
6. ✅ Sin compresión de fotos → `compressImage()` antes de serializar
7. ✅ `as any` global → wrapper tipado acotado
8. ✅ `_title` sin usar en `buildGeneratePromptModeA`
9. ✅ Sanitización filename descarga → `/[^a-z0-9]+/g`
10. ✅ Modelo análisis actualizado → `gemini-3-flash-preview` (de `gemini-2.0-flash`)

---

## Criterios de aceptación verificados

- [x] Build limpio: 0 errores TypeScript (`npx tsc --noEmit`)
- [x] API key Gemini nunca expuesta al navegador
- [x] Rate limit atómico sin race condition
- [x] Timeout en fetch — sin loading infinito
- [x] Fotos comprimidas antes de enviar
- [x] Validación Zod en request y en response de Gemini
- [x] Loading screen con animación premium
- [x] Flujo Modo A: 3 fotos + preferencias → 2 resultados en paralelo
- [x] Flujo Modo B: 3 fotos + texto → 1 resultado
- [x] Error API → mensaje amigable + Reintentar
- [x] Límite diario → 429 con mensaje claro
- [x] Diseño Aureum Precision (navy, dorado, teal Modo B)
- [x] Carrusel snap móvil, columna tablet+

---

## Siguiente paso: Fase 5 — Composición, descarga y pulido final

- Canvas compositor con banner "Estefan Acosta Barber Shop · Lugo"
- Pantalla `/share` con descarga de imagen branded
- Tests unitarios: compresión, validación Zod, canvas compositor
- PWA completa (service worker, cache strategy, offline)
- `/code-review` score ≥80
- Deploy en Vercel
