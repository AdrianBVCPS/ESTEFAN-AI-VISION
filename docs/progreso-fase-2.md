# Progreso Fase 2 — UI Core

**Fecha:** 2026-04-09  
**Commit:** `cb3af20`  
**Estado:** Completada ✅

---

## Qué se construyó

### Componentes UI (`src/components/ui/`)
- **Button** — Variantes `primary/secondary/tertiary`, tamaños `sm/md/lg/xl`, prop `loading` con spinner SVG, `fullWidth`, `disabled`. ForwardRef.
- **Chip** — Selector píldora, toggle gold/surface en 150ms, touch 44px.
- **Input** — Label flotante con `peer-placeholder-shown` Tailwind, borde inferior dorado al foco, estado error con icono AlertCircle. `useId` para accesibilidad.
- **Card** — Sombra `0 4px 12px`, variante `ai` con watermark "EA" al 5% opacidad. Sin bordes duros (regla No-Line).
- `index.ts` — Barrel export.

### Componentes Shared (`src/components/shared/`)
- **EAMonogram** — Tres variantes: `watermark` (5% opacidad navy), `loading` (shimmer animado SVG nativo), `banner` (dorado).
- **Toast + ToastContainer + useToast** — Glassmorphism `bg-surface/80 backdrop-blur-lg`, auto-dismiss 4s, slide-in desde arriba, cierre manual.
- **ErrorMessage** — Mensaje inline AlertCircle 16px.
- `index.ts` — Barrel export.

### Componentes Layout (`src/components/layout/`)
- **Header** — Client Component. Logo `/logo-ea.png` + texto app, nombre barbero, logout 44×44px. Recibe `logoutAction` como prop (server action).
- **LoadingScreen** — Fixed full-screen navy, EAMonogram loading shimmer, puntos animados con delay escalonado CSS.
- **ProgressBar** — Segmentos totales/completados, gold/surface, role progressbar con aria.
- `index.ts` — Barrel export.

### Tipos TypeScript (`src/types/consultation.ts`)
- `PhotoAngle`, `Photo`, `Preferences`, `AnalysisResult`, `GeneratedImage`
- `ConsultationState`, `ConsultationActions`

### ConsultationContext (`src/lib/utils/consultation-context.tsx`)
- Reducer con 9 acciones tipadas
- `ADD_PHOTO` revoca URL anterior si reemplaza el mismo ángulo
- `RESET` revoca todas las object URLs antes de limpiar estado
- Acciones en `useCallback` con deps vacías (sin renders innecesarios)
- `useConsultation()` lanza error descriptivo si se usa fuera del Provider

### Actualizaciones
- `src/app/(protected)/layout.tsx` — usa `<Header>` component + `<ConsultationProvider>`
- `src/app/(protected)/page.tsx` — icono Scissors, hover/active scale, tokens Tailwind correctos
- `src/app/globals.css` — `@keyframes` para toast-in, shimmer, loading-dots

---

## Decisiones técnicas

- **Header como Client Component** que recibe `logoutAction` como prop — el layout protegido sigue siendo `async` Server Component sin fragmentar.
- **EAMonogram shimmer** implementado con `animateTransform` SVG nativo — sin dependencias JS, funciona sin hidratación.
- **Input label flotante** con `peer` de Tailwind v4 — CSS puro sin estado React.
- **ConsultationContext boundary** correcto — Server Component (layout) importa Client Component (Provider); Next.js gestiona el boundary automáticamente.

---

## Criterios de aceptación verificados

- [x] Todos los componentes siguen design system Aureum Precision
- [x] Regla No-Line: ningún componente usa `border: 1px solid` para seccionar
- [x] Touch targets ≥44×44px en todos los elementos interactivos
- [x] Texto mínimo 14px
- [x] Home muestra nombre del barbero logueado (en Header)
- [x] Botón "Nueva consulta" navega a `/capture`
- [x] ConsultationContext funcional con todas las acciones
- [x] Componentes exportados desde barrel index
- [x] Build limpio sin errores TypeScript

---

## Siguiente paso: Fase 3 — Captura fotográfica + Modos

Construir el flujo completo desde "Nueva consulta" hasta elegir modo:
- `CameraCapture` — `getUserMedia`, stream en `<video>`, captura via canvas
- `CaptureGuide` — overlay SVG silueta frontal/lateral/trasera
- `PhotoPreview` — confirmar o repetir foto
- `PhotoStrip` — tira de miniaturas
- `ModeSelector` — tarjetas Modo A / Modo B
- `PreferencesForm` — chips longitud, estilo, barba, tipo pelo (solo Modo A)
- `DescribeForm` — textarea + chips sugerencia (solo Modo B)
- Rutas: `/capture`, `/mode-select`, `/preferences`, `/describe`
