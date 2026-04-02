# Plan de Implementación — Estefan AI Vision

> **Tipo:** B (side project, diseño libre)  
> **Fecha:** 2026-04-02  
> **Estado:** Aprobado — Pendiente de iniciar Fase 0  
> **Lead:** Opus 4.6 [1m] · **Subagentes:** Sonnet 4.6 [1m]

---

## Índice

1. [Visión general](#1-visión-general)
2. [Diagrama de dependencias](#2-diagrama-de-dependencias)
3. [Fase 0 — Setup del proyecto](#3-fase-0--setup-del-proyecto)
4. [Fase 1 — Autenticación + Base de datos](#4-fase-1--autenticación--base-de-datos)
5. [Fase 2 — UI Core](#5-fase-2--ui-core-home--layout--componentes-base)
6. [Fase 3 — Captura fotográfica + Modos](#6-fase-3--captura-fotográfica--selector-de-modo)
7. [Fase 4 — Integración IA (Gemini) + Resultados](#7-fase-4--integración-ia-gemini--resultados)
8. [Fase 5 — Composición, descarga y pulido final](#8-fase-5--composición-imagen--descarga--pulido-final)
9. [Participación de subagentes por fase](#9-participación-de-subagentes-por-fase)
10. [Oportunidades de paralelismo (Agent Teams)](#10-oportunidades-de-paralelismo-agent-teams)
11. [Protocolo por fase (Document & Clear)](#11-protocolo-por-fase-document--clear)
12. [Criterios de aceptación globales](#12-criterios-de-aceptación-globales)
13. [Riesgos identificados](#13-riesgos-identificados)
14. [Decisiones de arquitectura (ADRs)](#14-decisiones-de-arquitectura-adrs)

---

## 1. Visión general

Estefan AI Vision es una PWA para Estefan Acosta Barber Shop (Lugo). El barbero toma 3 fotos del cliente y la IA analiza su rostro para sugerir peinados (Modo A) o genera una preview de un corte descrito por texto (Modo B). Las imágenes se descargan con branding de la barbería. Zero data retention: nada se almacena en servidor.

El desarrollo se divide en **6 fases secuenciales**, cada una con entregables concretos, subagentes asignados y criterios de aceptación. Tras cada fase se documenta el progreso, se guarda en memoria y se hace `/clear` para mantener el contexto limpio.

### Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 16 |
| UI | React | 19 |
| Lenguaje | TypeScript | Estricto |
| Estilos | Tailwind CSS | v4 (CSS-first) |
| Auth + BD | Supabase (Auth + PostgreSQL) | Última |
| IA Análisis | Gemini API (text+vision multimodal) | Última |
| IA Imagen | Nano Banana 2 / Gemini 3.1 Flash Image | Última |
| Composición | Canvas API (browser, client-side) | Nativa |
| Validación | Zod | Última |
| Iconos | Lucide React | Última |
| Hosting | Vercel | Free tier |
| PWA | Service Workers nativos | — |

### Design system

**Aureum Precision** — Paleta: navy `#1A1A2E`, dorado `#D4A854`, crema `#F5F0EB`, teal `#4ECDC4`.  
Fuentes: Playfair Display (títulos), DM Sans (UI), JetBrains Mono (datos técnicos).  
Documentación completa: `docs/DiseñoEstefanAIVision/aureum_precision/DESIGN.md`

---

## 2. Diagrama de dependencias

```
┌─────────────────┐
│   FASE 0        │
│   Setup         │
│   [Simple]      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   FASE 1        │
│   Auth + BD     │
│   [Media]       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   FASE 2        │
│   UI Core       │
│   [Media]       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   FASE 3        │  ← Fase más crítica (calidad fotos = calidad resultados)
│   Cámara+Modos  │
│   [Compleja]    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   FASE 4        │  ← Fase más compleja técnicamente (integración Gemini)
│   IA + Results  │
│   [Compleja]    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   FASE 5        │
│   Pulido+Deploy │
│   [Media]       │
└────────┬────────┘
         │
         ▼
    ✅ PRODUCCIÓN
```

**Cada fase depende de la anterior.** No se puede saltar ni reordenar. Dentro de cada fase, algunas tareas sí pueden ejecutarse en paralelo (ver sección 10).

---

## 3. Fase 0 — Setup del proyecto

**Complejidad:** Simple  
**Subagentes:** NEXO (configuración) + Frontend (fuentes/PWA base)  
**Objetivo:** Proyecto funcional con `npm run dev`, estructura de carpetas, design tokens configurados.

### 3.1 Tareas detalladas

| # | Tarea | Subagente | Archivos afectados | Detalle |
|---|---|---|---|---|
| 0.1 | Inicializar Next.js 16 + TypeScript | NEXO | `package.json`, `tsconfig.json`, `next.config.ts` | `npx create-next-app@latest` con App Router, TypeScript estricto, ESLint, sin Turbopack (estabilidad) |
| 0.2 | Configurar Tailwind CSS v4 | NEXO | `src/app/globals.css`, `tailwind.config.ts` | CSS-first config. Definir tokens de color Aureum Precision como custom properties. Breakpoints: móvil (<768), tablet (768-1023), desktop (≥1024) |
| 0.3 | Instalar dependencias core | NEXO | `package.json` | `zod`, `lucide-react`, `@supabase/supabase-js`, `@supabase/ssr` |
| 0.4 | `.env.example` | NEXO | `.env.example` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY` (server-only, sin NEXT_PUBLIC_) |
| 0.5 | `.gitignore` | NEXO | `.gitignore` | node_modules, .next, .env.local, .env |
| 0.6 | Estructura carpetas src/ | NEXO | Directorios vacíos + archivos index | `src/app/(auth)/`, `src/app/(protected)/`, `src/app/api/`, `src/components/{ui,camera,results,layout,mode,shared}/`, `src/lib/{supabase,gemini,canvas,validations,utils}/`, `src/hooks/`, `src/types/` |
| 0.7 | Configurar fuentes | Frontend | `src/app/layout.tsx` | Playfair Display + DM Sans + JetBrains Mono via `next/font/google`. Asignar CSS variables `--font-display`, `--font-ui`, `--font-mono` |
| 0.8 | PWA base | Frontend | `public/manifest.json`, iconos | `name: "Estefan AI Vision"`, `short_name: "AI Vision"`, `theme_color: "#1A1A2E"`, `background_color: "#F5F0EB"`, iconos 192px y 512px, `display: "standalone"` |
| 0.9 | Copiar assets disponibles | Frontend | `public/` | Logo EA desde `docs/logo-ea-estefan-acosta.png` → `public/logo-ea.png`. Generar favicon y iconos PWA a partir del logo |
| 0.10 | Git init + primer commit | NEXO | Todo | `feat: setup inicial del proyecto` |

### 3.2 Tokens de color Tailwind (referencia)

```css
/* globals.css — tokens Aureum Precision */
--color-background: #F5F0EB;    /* Crema — fondo principal, NUNCA blanco puro */
--color-surface: #FAF7F4;       /* Surface elevado */
--color-navy: #1A1A2E;          /* Headers, fondos oscuros — NUNCA negro puro */
--color-gold: #D4A854;          /* CTAs, acento premium, iconos activos */
--color-teal: #4ECDC4;          /* EXCLUSIVO Modo B y estados éxito */
--color-text-primary: #1C1C1C;  /* Texto principal */
--color-text-secondary: #6B7280; /* Texto secundario */
--color-error: #E74C3C;         /* Errores */
--color-dark-surface: #2D2D3A;  /* Superficies oscuras secundarias */
```

### 3.3 Criterios de aceptación

- [ ] `npm run dev` arranca sin errores
- [ ] `npm run build` compila sin warnings críticos
- [ ] Las 3 fuentes se cargan correctamente en el navegador
- [ ] Colores Aureum Precision accesibles como clases Tailwind
- [ ] Estructura de carpetas coincide con los CLAUDE.md anidados
- [ ] `.env.example` documenta todas las variables necesarias
- [ ] `manifest.json` válido con iconos

### 3.4 Decisiones técnicas Fase 0

- **Sin Turbopack** de momento — priorizar estabilidad sobre velocidad de HMR
- **Tailwind v4 CSS-first** — tokens como custom properties en CSS, no en JS config
- **next/font/google** — carga optimizada, sin flash of unstyled text
- **Sin service worker funcional aún** — solo manifest. SW completo en Fase 5

---

## 4. Fase 1 — Autenticación + Base de datos

**Complejidad:** Media  
**Subagentes:** DB (tablas + RLS) + Backend (middleware + validación) + Frontend (login UI)  
**Objetivo:** Login funcional, rutas protegidas, base de datos configurada.

### 4.1 Tareas detalladas

| # | Tarea | Subagente | Archivos afectados | Detalle |
|---|---|---|---|---|
| 1.1 | Crear proyecto Supabase | DB | Dashboard Supabase | Proyecto nuevo, región EU, anotar URL y keys |
| 1.2 | Migración: tabla `barber_profiles` | DB | `supabase/migrations/001_barber_profiles.sql` | `id UUID PK FK auth.users`, `display_name TEXT NOT NULL`, `role TEXT CHECK ('admin','barber') DEFAULT 'barber'`, `avatar_url TEXT`, `created_at`, `updated_at`. RLS habilitado. Políticas: SELECT/UPDATE propio usuario, INSERT solo admin |
| 1.3 | Migración: tabla `app_config` | DB | `supabase/migrations/002_app_config.sql` | `id UUID PK DEFAULT gen_random_uuid()`, `key TEXT UNIQUE NOT NULL`, `value JSONB NOT NULL`, `updated_at`. RLS habilitado. Políticas: SELECT autenticado, UPDATE solo admin |
| 1.4 | Seed: usuarios barbero | DB | `supabase/seed.sql` | Estefan (admin) y Guillermo (barber) con contraseñas de prueba. Config inicial: `daily_limit: 50`, `logo_enabled: true` |
| 1.5 | Trigger `updated_at` | DB | Dentro de migraciones | Función `handle_updated_at()` + triggers en ambas tablas |
| 1.6 | Cliente Supabase navegador | DB | `src/lib/supabase/client.ts` | `createBrowserClient()` con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| 1.7 | Cliente Supabase servidor | DB | `src/lib/supabase/server.ts` | `createServerClient()` con cookies para SSR |
| 1.8 | Tipos TypeScript generados | DB | `src/types/database.ts` | Tipos de tablas Supabase generados con CLI |
| 1.9 | Schema Zod login | Backend | `src/lib/validations/schemas.ts` | `loginSchema: { email: z.string().email(), password: z.string().min(6) }` |
| 1.10 | Middleware protección rutas | Backend | `src/middleware.ts` | Verificar sesión Supabase. Rutas `(protected)/*` → redirect `/login` si no auth. Ruta `/login` → redirect `/` si ya auth |
| 1.11 | API Route o Server Action login | Backend | `src/app/(auth)/login/actions.ts` | Server Action con validación Zod + `supabase.auth.signInWithPassword()` |
| 1.12 | API Route o Server Action logout | Backend | `src/app/(protected)/actions.ts` | `supabase.auth.signOut()` + redirect `/login` |
| 1.13 | Página Login | Frontend | `src/app/(auth)/login/page.tsx` | Según mockup `docs/DiseñoEstefanAIVision/login_screen/screen.png`. Gradiente `#1A1A2E→#2D2D3A`, logo centrado grande, inputs con borde dorado al foco, CTA "Entrar" full-width 56px+, checkbox "Mantener sesión" |
| 1.14 | Layout raíz | Frontend | `src/app/layout.tsx` | `<html lang="es">`, metadata title "Estefan AI Vision", theme-color `#1A1A2E`, fuentes, viewport |
| 1.15 | Layout auth | Frontend | `src/app/(auth)/layout.tsx` | Layout mínimo sin header/nav para pantalla login |
| 1.16 | Layout protegido | Frontend | `src/app/(protected)/layout.tsx` | Verificar sesión, mostrar header/nav, cargar perfil barbero |

### 4.2 Modelo de datos detallado

```sql
-- ══════════════════════════════════════════
-- TABLA: barber_profiles
-- Perfil del barbero vinculado a auth.users
-- ══════════════════════════════════════════
CREATE TABLE public.barber_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'barber')) DEFAULT 'barber',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.barber_profiles ENABLE ROW LEVEL SECURITY;

-- Cada barbero ve solo su perfil
CREATE POLICY "barber_select_own" ON public.barber_profiles
  FOR SELECT USING (auth.uid() = id);

-- Cada barbero actualiza solo su perfil
CREATE POLICY "barber_update_own" ON public.barber_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Solo admin puede insertar nuevos barberos
CREATE POLICY "admin_insert" ON public.barber_profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.barber_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ══════════════════════════════════════════
-- TABLA: app_config
-- Configuración clave-valor de la aplicación
-- ══════════════════════════════════════════
CREATE TABLE public.app_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Cualquier barbero autenticado puede leer config
CREATE POLICY "authenticated_select" ON public.app_config
  FOR SELECT USING (auth.role() = 'authenticated');

-- Solo admin puede modificar config
CREATE POLICY "admin_update" ON public.app_config
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.barber_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 4.3 Paralelismo posible

```
        ┌── DB: tablas + RLS + seed (1.1-1.8)
Inicio ─┤
        └── Frontend: login UI + layouts (1.13-1.16)
                          │
                          ▼
              Backend: middleware + validación + actions (1.9-1.12)
                          │
                          ▼
                    Integración + test manual
```

DB y Frontend pueden trabajar en paralelo porque no comparten archivos. Backend integra después cuando ambos estén listos.

### 4.4 Criterios de aceptación

- [ ] Login con credenciales válidas → redirige a Home
- [ ] Login con credenciales inválidas → mensaje de error claro
- [ ] Acceder a ruta protegida sin sesión → redirige a Login
- [ ] Acceder a Login con sesión activa → redirige a Home
- [ ] Logout funcional → redirige a Login
- [ ] RLS verificado: barbero solo ve su propio perfil
- [ ] Validación Zod en cliente (feedback inmediato) Y servidor (seguridad)
- [ ] Sin `service_role_key` en cliente
- [ ] Pantalla login fiel al mockup de diseño

---

## 5. Fase 2 — UI Core (Home + Layout + Componentes base)

**Complejidad:** Media  
**Subagentes:** Frontend (principal) + Backend (context + tipos)  
**Objetivo:** Design system implementado como componentes reutilizables. Home funcional.

### 5.1 Tareas detalladas

| # | Tarea | Subagente | Archivos afectados | Detalle |
|---|---|---|---|---|
| 2.1 | Componente `Button` | Frontend | `src/components/ui/Button.tsx` | Variantes: primary (dorado), secondary (navy), tertiary (ghost). Min 56px alto, border-radius 8px. Estados: hover (scale 0.97), active (scale 0.98), disabled, loading (spinner) |
| 2.2 | Componente `Chip` | Frontend | `src/components/ui/Chip.tsx` | Para selectores preferencias. Activo: dorado+negro. Inactivo: gris claro. Border-radius 22px. Touch-friendly ≥44px |
| 2.3 | Componente `Input` | Frontend | `src/components/ui/Input.tsx` | Fill surface-container-low. Focus: surface-container-lowest + 2px gold bottom border. Label flotante. Error state rojo |
| 2.4 | Componente `Card` | Frontend | `src/components/ui/Card.tsx` | Border-radius 12px. Sombra `0 4px 12px rgba(0,0,0,0.08)`. Sin bordes duros (regla No-Line). Variante IA con monograma EA 5% |
| 2.5 | Componente `EAMonogram` | Frontend | `src/components/shared/EAMonogram.tsx` | Monograma "EA" como SVG. Versiones: watermark (5% opacidad en tarjetas), loading (shimmer dorado animado), banner (40px dorado sobre navy) |
| 2.6 | Componente `Header` | Frontend | `src/components/layout/Header.tsx` | Logo EA pequeño (32px) + display_name barbero + botón logout (icono Lucide `LogOut`). Fondo navy `#1A1A2E` |
| 2.7 | Componente `LoadingScreen` | Frontend | `src/components/layout/LoadingScreen.tsx` | Monograma EA con shimmer gradient. Texto configurable. Para transiciones entre pantallas |
| 2.8 | Componente `ProgressBar` | Frontend | `src/components/layout/ProgressBar.tsx` | Barra segmentada (3 segmentos para fotos, genérica para otros). Color dorado sobre fondo gris |
| 2.9 | Componente `Toast` | Frontend | `src/components/shared/Toast.tsx` | Notificaciones flotantes. Tipos: success (teal), error (rojo), info (navy). Auto-dismiss 4s. Glassmorphism |
| 2.10 | Componente `ErrorMessage` | Frontend | `src/components/shared/ErrorMessage.tsx` | Mensaje inline de error con icono. Para formularios y errores de API |
| 2.11 | Página Home | Frontend | `src/app/(protected)/page.tsx` | Según mockup `docs/DiseñoEstefanAIVision/home_screen/screen.png`. Fondo crema. Botón central "Nueva consulta" 200×200px (tablet) / 150×150px (móvil), dorado, iconos cámara+tijeras. Footer: "X consultas hoy" |
| 2.12 | ConsultationContext | Backend | `src/lib/utils/consultation-context.tsx` | React Context para flujo completo. Estado: `photos[]`, `mode ('a'|'b')`, `preferences`, `description`, `analysisResult`, `generatedImages[]`. Acciones: `addPhoto`, `setMode`, `setPreferences`, `setDescription`, `setResults`, `reset` (limpia TODO + revoca URLs) |
| 2.13 | Tipos TypeScript compartidos | Backend | `src/types/consultation.ts` | `Photo { blob: Blob, url: string, angle: 'frontal'|'lateral'|'trasera' }`, `Preferences { length, style, beard, hairType }`, `AnalysisResult { faceShape, recommendations[] }`, `GeneratedImage { blob: Blob, url: string, prompt: string }` |
| 2.14 | Índices de exportación | Frontend | `src/components/*/index.ts` | Barrel exports por subcarpeta: `ui/`, `layout/`, `shared/` |

### 5.2 Especificación componentes clave

**Button — Variantes:**
```
Primary:   bg-gold text-navy    → hover: scale(0.97) shadow-lg
Secondary: bg-navy text-cream   → hover: scale(0.97) opacity-90
Tertiary:  bg-transparent       → hover: bg-surface
Sizes:     sm (40px), md (48px), lg (56px), xl (64px)
```

**Card — Regla No-Line:**
```
❌ PROHIBIDO: border: 1px solid #ccc
✅ CORRECTO:  bg-surface shadow-sm (cambio de fondo para separar secciones)
Si borde obligatorio: outline-variant 15% opacidad máximo
```

**ConsultationContext — Estado completo:**
```typescript
interface ConsultationState {
  photos: Photo[];                    // Máx 3 (frontal, lateral, trasera)
  mode: 'a' | 'b' | null;           // Modo seleccionado
  preferences: Preferences | null;    // Solo Modo A
  description: string | null;         // Solo Modo B
  analysisResult: AnalysisResult | null;  // Resultado análisis facial
  generatedImages: GeneratedImage[];      // 2 (Modo A) o 1 (Modo B)
  isLoading: boolean;
  error: string | null;
}
```

### 5.3 Criterios de aceptación

- [ ] Todos los componentes UI siguen design system Aureum Precision
- [ ] Regla No-Line: ningún componente usa `border: 1px solid` para seccionar
- [ ] Touch targets ≥44×44px en todos los elementos interactivos
- [ ] Texto mínimo 14px
- [ ] Home muestra nombre del barbero logueado
- [ ] Botón "Nueva consulta" navega a captura (ruta vacía por ahora)
- [ ] ConsultationContext funcional con todas las acciones
- [ ] Componentes exportados desde barrel index
- [ ] Responsive: home se ve bien en tablet y móvil

---

## 6. Fase 3 — Captura fotográfica + Selector de modo

**Complejidad:** Compleja  
**Subagentes:** Frontend (cámara + UI modos) + Backend (compresión + validación)  
**Objetivo:** Flujo completo desde "Nueva consulta" hasta elegir modo y configurar preferencias/descripción. Sin IA.

### 6.1 Tareas detalladas

| # | Tarea | Subagente | Archivos afectados | Detalle |
|---|---|---|---|---|
| 3.1 | Componente `CameraCapture` | Frontend | `src/components/camera/CameraCapture.tsx` | `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })`. Stream en `<video>` element. Botón captura: círculo 80px dorado. Capture via canvas snapshot |
| 3.2 | Componente `CaptureGuide` | Frontend | `src/components/camera/CaptureGuide.tsx` | Overlay SVG semitransparente sobre el visor. 3 variantes: silueta frontal, lateral, trasera. Color dorado 30% opacidad. Instrucción texto en parte superior |
| 3.3 | Componente `PhotoPreview` | Frontend | `src/components/camera/PhotoPreview.tsx` | Muestra foto capturada. 2 botones: "Repetir" (outline, volver a cámara) y "Confirmar ✓" (primary, guardar en context). Animación fade-in |
| 3.4 | Componente `PhotoStrip` | Frontend | `src/components/camera/PhotoStrip.tsx` | Tira horizontal con miniaturas de fotos confirmadas (esquina inferior). Indicador cuál es la actual. Máx 3 thumbs |
| 3.5 | Página Captura (flujo 3 fotos) | Frontend | `src/app/(protected)/capture/page.tsx` | Pantalla según mockup `capture_screen_frontal/screen.png`. Visor cámara 75% superior. Indicador "Foto 1/3: Frontal" + barra progreso 3 segmentos. Secuencia: frontal → lateral → trasera. Al completar 3: navegar a mode-select |
| 3.6 | Permisos cámara y errores | Frontend | Dentro de CameraCapture | Solicitar permiso. Si denegado: mensaje claro "Se necesita acceso a la cámara" + instrucciones. Si no hay cámara: mensaje alternativo |
| 3.7 | Compresión de imagen | Backend | `src/lib/utils/compress-image.ts` | Canvas offscreen. Redimensionar a máx 1024×1024px manteniendo aspect ratio. Exportar JPEG calidad 85%. Retorna Blob. Se ejecuta en cliente antes de enviar a API |
| 3.8 | Página Selector de Modo | Frontend | `src/app/(protected)/mode-select/page.tsx` | Según mockup `mode_selector/screen.png`. 2 tarjetas grandes: Modo A "La IA sugiere" (icono sparkles, dorado) + Modo B "Probar un corte" (icono scissors, teal). Strip fotos capturadas arriba. Al seleccionar: guarda en context y navega |
| 3.9 | Página Preferencias Modo A | Frontend | `src/app/(protected)/preferences/page.tsx` | Grid con 4 secciones de chips. **Longitud:** Corto / Medio / Largo. **Estilo:** Fade / Clásico / Texturizado / Sin preferencia (default). **Barba:** Mantener / Incluir sugerencia. **Tipo pelo:** Liso / Ondulado / Rizado. Strip fotos arriba. CTA "Analizar con IA ✨" |
| 3.10 | Página Descripción Modo B | Frontend | `src/app/(protected)/describe/page.tsx` | Campo `<textarea>` grande para describir el corte. Placeholder: "Describe el peinado que quieres probar...". Ejemplos sugeridos debajo como chips clickables. CTA "Generar preview". Strip fotos arriba |
| 3.11 | Schema Zod preferencias | Backend | `src/lib/validations/schemas.ts` | `preferencesSchema: { length: enum, style: enum, beard: enum, hairType: enum }` |
| 3.12 | Schema Zod descripción | Backend | `src/lib/validations/schemas.ts` | `descriptionSchema: { text: z.string().min(5, "Describe el corte con un poco más de detalle").max(500) }` |
| 3.13 | Transiciones entre pantallas | Frontend | Estilos globales | Slide horizontal 300ms ease-out entre captura → modo → preferencias/descripción |

### 6.2 Flujo de captura detallado

```
[Home] ── "Nueva consulta" ──→ [Captura Frontal]
                                    │
                                    │ Foto 1/3: "Sitúa el rostro de frente"
                                    │ Visor cámara + overlay silueta frontal
                                    │ Botón captura → preview → confirmar/repetir
                                    │
                                    ▼ (al confirmar)
                               [Captura Lateral]
                                    │
                                    │ Foto 2/3: "Ahora el perfil lateral"
                                    │ Overlay silueta lateral + miniatura foto 1
                                    │
                                    ▼ (al confirmar)
                               [Captura Trasera]
                                    │
                                    │ Foto 3/3: "Por último, la parte trasera"
                                    │ Overlay silueta trasera + miniaturas fotos 1,2
                                    │
                                    ▼ (al confirmar las 3)
                               [Selector de Modo]
                                    │
                              ┌─────┴─────┐
                              ▼           ▼
                         [Preferencias] [Descripción]
                          (Modo A)       (Modo B)
```

### 6.3 Regla de privacidad (crítica)

- Fotos SOLO en React state como Blob URLs (`URL.createObjectURL()`)
- Cada `createObjectURL` DEBE tener su `revokeObjectURL` en cleanup del componente
- Al navegar fuera del flujo o "Nueva consulta": `ConsultationContext.reset()` revoca TODO
- NUNCA: localStorage, sessionStorage, IndexedDB, cookies, disco, servidor

### 6.4 Criterios de aceptación

- [ ] Cámara se activa correctamente (preferencia trasera, fallback frontal)
- [ ] Overlay guía visible y correcto para cada ángulo
- [ ] Preview post-captura con opciones Repetir/Confirmar
- [ ] Barra de progreso refleja estado (1/3, 2/3, 3/3)
- [ ] Miniaturas de fotos confirmadas visibles
- [ ] Al completar 3 fotos → navega a selector de modo
- [ ] Selector de modo A/B funcional
- [ ] Preferencias Modo A: chips seleccionables, CTA activo
- [ ] Descripción Modo B: textarea con validación min 5 chars
- [ ] Compresión funcional: foto ≤1024px, JPEG 85%
- [ ] Zero data retention: fotos solo en memoria
- [ ] Responsive: funciona en tablet y móvil
- [ ] Permisos cámara denegados → mensaje claro

---

## 7. Fase 4 — Integración IA (Gemini) + Resultados

**Complejidad:** Compleja  
**Subagentes:** Backend (API proxy + prompts) + Frontend (loading + resultados) + DB (opcional Edge Functions)  
**Objetivo:** Flujo end-to-end funcional. Fotos + preferencias/descripción → IA → resultados visuales.

### 7.1 Tareas detalladas

| # | Tarea | Subagente | Archivos afectados | Detalle |
|---|---|---|---|---|
| 4.1 | API Route `/api/gemini/analyze` | Backend | `src/app/api/gemini/analyze/route.ts` | POST. Recibe: 3 fotos (base64) + preferencias. Valida con Zod. Llama Gemini API multimodal (text+vision). `temperature: 0.15`, `topP: 0.8`, `topK: 20`. `responseMimeType: "application/json"` + `responseSchema`. Retorna: forma rostro + 2 recomendaciones |
| 4.2 | API Route `/api/gemini/generate` | Backend | `src/app/api/gemini/generate/route.ts` | POST. Recibe: 3 fotos (base64) + descripción peinado (texto). Valida con Zod. Llama Nano Banana 2. `temperature: 0.75`, `topP: 0.9`, `responseModalities: ["IMAGE"]`. Retorna: imagen generada (base64) |
| 4.3 | Templates de prompts | Backend | `src/lib/gemini/prompts.ts` | **Análisis facial:** system instruction "world-class men's hairstylist", restricciones identidad PRIMERO, instrucciones creativas DESPUÉS, negative constraints AL FINAL. **Generación imagen:** "barber cape trick", descripción técnica 60-120 palabras, triptych 3 ángulos. Variables dinámicas: `{{BEARD_INSTRUCTION}}`, `{{VISUAL_DESCRIPTION}}`, etc. |
| 4.4 | Tipos respuesta Gemini | Backend | `src/lib/gemini/types.ts` | `GeminiAnalysisResponse { faceShape, recommendations[]{name, description, suitability, visualPrompt} }`. `GeminiGenerateResponse { image: base64string }` |
| 4.5 | Cliente Gemini (frontend → API routes) | Backend | `src/lib/gemini/client.ts` | `analyzeFace(photos, preferences): Promise<AnalysisResult>`. `generateImage(photos, prompt): Promise<Blob>`. Llaman a API routes internas, NO a Gemini directo |
| 4.6 | Schemas Zod API | Backend | `src/lib/validations/schemas.ts` | Schemas para request/response de ambas API routes. Validación estricta de input |
| 4.7 | Manejo de errores IA | Backend | `src/lib/gemini/client.ts` | API no responde → "La IA está ocupada, inténtalo de nuevo" + botón reintento. Límite free tier → "Has alcanzado el límite diario". Timeout 30s. Retry automático 1 vez |
| 4.8 | Rate limiting básico | Backend | `src/app/api/gemini/` middleware | Contador consultas diarias en `app_config`. Límite configurable (default 50/día) |
| 4.9 | Página Loading IA | Frontend | `src/app/(protected)/loading-ai/page.tsx` | Animación premium 15-25s. Monograma EA con shimmer dorado. Texto rotativo: "Analizando tu rostro...", "Generando el look perfecto...", "Casi listo...". Barra progreso indeterminada |
| 4.10 | Lógica flujo Modo A | Frontend | Orquestación en page/context | 1) Llamar `analyzeFace()` → 2) Recibir 2 recomendaciones → 3) Llamar `generateImage()` x2 en paralelo (`Promise.all`) → 4) Navegar a resultados |
| 4.11 | Lógica flujo Modo B | Frontend | Orquestación en page/context | 1) Llamar `generateImage(fotos, descripción)` → 2) Navegar a resultados |
| 4.12 | Página Resultados Modo A | Frontend | `src/app/(protected)/results/page.tsx` | Según mockup `results_mode_a_ia/screen.png`. 2 tarjetas lado a lado (tablet) / carrusel (móvil). Cada tarjeta: imagen triptych + nombre peinado + descripción + por qué te queda bien. Botones: "Descargar", "Regenerar" |
| 4.13 | Página Resultado Modo B | Frontend | `src/app/(protected)/results/page.tsx` | Según mockup `result_mode_b_custom/screen.png`. 1 imagen pantalla completa. Botones: "Descargar", "Probar otro corte" (vuelve a describe con mismas fotos), "Cambiar a Modo IA" (vuelve a preferencias) |
| 4.14 | Componente `ResultCard` | Frontend | `src/components/results/ResultCard.tsx` | Tarjeta resultado IA. Imagen, título peinado, descripción, monograma EA 5%. Sombra flotante |
| 4.15 | Componente `Triptych` | Frontend | `src/components/results/Triptych.tsx` | Visualización composición 3 ángulos generada por IA. Aspect ratio 3:1 o responsive |
| 4.16 | Botón "Regenerar" | Frontend | `src/components/results/RegenerateButton.tsx` | Reutiliza fotos + preferencias/descripción. Nueva llamada IA. Loading inline |

### 7.2 Flujo de datos Modo A (completo)

```
Cliente                          Servidor                         Gemini API
───────                          ────────                         ──────────
3 fotos (Blob)
  → comprimir (1024px JPEG 85%)
  → convertir a base64
  → POST /api/gemini/analyze
     { photos: [base64x3],       → Validar Zod
       preferences: {...} }      → Construir prompt (prompts.ts)
                                 → Gemini API (text+vision)  ────→ Análisis facial
                                 ← JSON { faceShape,         ←──── 2 recomendaciones
                                          recommendations[2] }
  ← AnalysisResult
  
  Para cada recomendación (x2, en paralelo):
  → POST /api/gemini/generate
     { photos: [base64x3],       → Validar Zod
       prompt: visualPrompt }    → Construir prompt generación
                                 → Nano Banana 2             ────→ Imagen triptych
                                 ← { image: base64 }         ←──── Imagen generada
  ← Blob (imagen)

  → Mostrar 2 ResultCards
```

### 7.3 Flujo de datos Modo B (completo)

```
Cliente                          Servidor                         Gemini API
───────                          ────────                         ──────────
3 fotos (Blob) + descripción texto
  → comprimir + base64
  → POST /api/gemini/generate
     { photos: [base64x3],       → Validar Zod (min 5 chars)
       prompt: descripción }     → Construir prompt generación
                                 → Nano Banana 2             ────→ Imagen triptych
                                 ← { image: base64 }         ←──── Imagen generada
  ← Blob (imagen)

  → Mostrar 1 resultado pantalla completa
```

### 7.4 Paralelismo posible

```
        ┌── Backend: API routes + prompts + tipos (4.1-4.8)
Inicio ─┤
        └── Frontend: loading + resultados UI con datos mock (4.9-4.16)
                          │
                          ▼
                    Integración: conectar UI real con API routes
                          │
                          ▼
                    Test end-to-end manual
```

### 7.5 Criterios de aceptación

- [ ] Modo A: 3 fotos + preferencias → 2 resultados con imagen + descripción
- [ ] Modo B: 3 fotos + texto → 1 resultado con imagen
- [ ] API key Gemini NUNCA expuesta al navegador (verificar Network tab)
- [ ] Loading screen visible durante procesamiento (15-25s)
- [ ] Error API → mensaje amigable + botón reintento
- [ ] Límite diario → mensaje "Has alcanzado el límite diario"
- [ ] Texto vago Modo B (<5 chars) → validación Zod con mensaje claro
- [ ] Regenerar reutiliza fotos sin repetir captura
- [ ] "Probar otro corte" (Modo B) vuelve a describe con mismas fotos
- [ ] Resultados respetan diseño Aureum Precision
- [ ] Responsive: carrusel en móvil, lado a lado en tablet
- [ ] Prompts en inglés, resultados al usuario en español

---

## 8. Fase 5 — Composición imagen + Descarga + Pulido final

**Complejidad:** Media  
**Subagentes:** Frontend (canvas + descarga) + NEXO (tests + auditorías + PWA + code review)  
**Objetivo:** App completa, testeada, auditada y lista para producción.

### 8.1 Tareas detalladas

| # | Tarea | Subagente | Archivos afectados | Detalle |
|---|---|---|---|---|
| 5.1 | Canvas compositor | Frontend | `src/lib/canvas/compositor.ts` | `<canvas>` tamaño imagen generada + 70px banner. Dibujar imagen. Banner inferior: fondo `#1A1A2E` 85% opacidad. Logo EA dorado 40×40px padding 10px izquierda. Texto "Estefan Acosta Barber Shop · Lugo" (DM Sans 14px, color `#F5F0EB`). Opcional: "Powered by Estefan AI Vision" (10px, `#6B7280`) |
| 5.2 | Marca de agua alternativa | Frontend | `src/lib/canvas/compositor.ts` | Monograma EA centrado 200×200px, 12% opacidad dorado. Configurable via `app_config` |
| 5.3 | Precargar fuente para canvas | Frontend | `src/lib/canvas/compositor.ts` | `FontFace API` para DM Sans. Esperar a que cargue antes de renderizar texto |
| 5.4 | Componente `DownloadButton` | Frontend | `src/components/results/DownloadButton.tsx` | `canvas.toBlob('image/jpeg', 0.92)`. Nombre: `estefan-ai-YYYY-MM-DD-HHmm.jpg`. Descarga via anchor `<a download>`. Incrementa contador consultas |
| 5.5 | Pantalla Compartir | Frontend | `src/app/(protected)/share/page.tsx` | Según mockup `compartir_resultados_qr/screen.png`. Botón "Descargar imagen" principal. Botón "Nueva consulta" secundario. Preview imagen con banner |
| 5.6 | "Nueva consulta" — cleanup total | Frontend | `ConsultationContext.reset()` | Revocar TODOS los `URL.createObjectURL()`. Limpiar state completo. Navegar a Home. Verificar que no queda nada en memoria |
| 5.7 | Tests unitarios: compresión | NEXO | `__tests__/lib/compress-image.test.ts` | Verificar resize ≤1024px, output JPEG, calidad ~85% |
| 5.8 | Tests unitarios: validación Zod | NEXO | `__tests__/lib/validations.test.ts` | Schemas login, preferencias, descripción. Casos válidos e inválidos |
| 5.9 | Tests unitarios: canvas compositor | NEXO | `__tests__/lib/canvas-compositor.test.ts` | Verificar dimensiones, banner, texto. (Canvas mock en jsdom) |
| 5.10 | Tests integración: flujo auth | NEXO | `__tests__/integration/auth.test.ts` | Login → Home → Logout. Rutas protegidas. Redirect correcto |
| 5.11 | `/privacy-scan` | NEXO | Auditoría completa | Verificar zero data retention. Red flags: localStorage, sessionStorage, INSERT fotos, fs.write. Yellow flags: createObjectURL sin revoke |
| 5.12 | `/design-audit` | NEXO | Auditoría completa | Verificar Aureum Precision: colores, fuentes, No-Line, touch targets, monograma, responsive |
| 5.13 | PWA completa | NEXO | Service worker, cache | Cache strategy: shell (cache-first), API (network-first). Offline: mostrar mensaje "Se necesita conexión". Splash screen personalizado |
| 5.14 | Metadata y SEO | NEXO | `src/app/layout.tsx` | Title, description, og:image, favicon, theme-color |
| 5.15 | `/code-review` | NEXO | Todo el proyecto | Score objetivo ≥80. Corregir todos los issues encontrados |
| 5.16 | Build final | NEXO | Verificación | `npm run build` limpio. Sin warnings críticos. Sin `console.log`. Sin `any` injustificado |

### 8.2 Especificación Canvas compositor

```
┌──────────────────────────────────────────┐
│                                          │
│                                          │
│          Imagen generada por IA          │
│          (triptych 3 ángulos)            │
│                                          │
│                                          │
├──────────────────────────────────────────┤  ← Banner 70px
│ [Logo EA]  Estefan Acosta Barber Shop    │
│  40×40px   · Lugo                        │
│  dorado    Powered by Estefan AI Vision  │
└──────────────────────────────────────────┘
  Fondo: #1A1A2E 85% opacidad
  Texto principal: DM Sans 14px #F5F0EB
  Texto secundario: DM Sans 10px #6B7280
```

### 8.3 Criterios de aceptación

- [ ] Imagen descargada incluye banner con logo y texto barbería
- [ ] Nombre archivo: `estefan-ai-YYYY-MM-DD-HHmm.jpg`
- [ ] Calidad JPG 92%
- [ ] "Nueva consulta" limpia TODO: fotos, resultados, URLs
- [ ] `/privacy-scan` pasa sin red flags
- [ ] `/design-audit` pasa sin issues críticos
- [ ] `/code-review` score ≥80
- [ ] `npm run build` sin errores ni warnings críticos
- [ ] PWA instalable desde navegador
- [ ] Service worker registrado y funcional
- [ ] Offline: mensaje claro "Se necesita conexión"
- [ ] Tests pasando (unitarios + integración)
- [ ] Sin `console.log` en producción
- [ ] Sin `any` no justificado
- [ ] Responsive: flujo completo funciona en tablet y móvil

---

## 9. Participación de subagentes por fase

| Fase | DB | Frontend | Backend | NEXO | Complejidad |
|---|---|---|---|---|---|
| **0 — Setup** | — | Fuentes, PWA base, assets | — | Config, deps, estructura, git | Simple |
| **1 — Auth+BD** | Tablas, RLS, seed, clientes Supabase, tipos | Login, layouts (auth + protected + raíz) | Middleware, Zod login, actions auth | — | Media |
| **2 — UI Core** | — | Componentes UI, Home, Header, Loading, Toast | ConsultationContext, tipos compartidos | — | Media |
| **3 — Cámara** | — | Camera, overlays, flujo 3 fotos, modos, preferencias, describe | Compresión imagen, Zod preferencias/descripción | — | Compleja |
| **4 — IA** | (Edge Fn opcional) | Loading IA, ResultCard, Triptych, resultados | API routes proxy, prompts, cliente Gemini, rate limit, errores | — | Compleja |
| **5 — Pulido** | — | Canvas compositor, descarga, compartir, cleanup | — | Tests, auditorías, PWA, code-review, build | Media |

### Carga de trabajo por subagente

```
DB:       ████░░░░░░░░░░░░░░░░  ~15% (concentrado en Fase 1)
Frontend: ██████████████████░░  ~40% (presente en todas las fases)
Backend:  ████████████░░░░░░░░  ~30% (Fases 1-4)
NEXO:     ██████░░░░░░░░░░░░░░  ~15% (Fases 0 y 5)
```

---

## 10. Oportunidades de paralelismo (Agent Teams)

### Fase 1 — Auth + BD (2 teammates)

| Teammate | Archivos | Tarea |
|---|---|---|
| DB + Backend | `supabase/**`, `src/lib/supabase/**`, `src/middleware.ts`, `src/lib/validations/**` | Tablas, RLS, clientes Supabase, middleware, Zod |
| Frontend | `src/app/(auth)/**`, `src/app/layout.tsx`, `src/app/(protected)/layout.tsx` | Login UI, layouts |

**Interface compartida:** tipos de base de datos (`src/types/database.ts`), definidos por DB antes de lanzar.

### Fase 4 — IA + Resultados (2 teammates)

| Teammate | Archivos | Tarea |
|---|---|---|
| Backend | `src/app/api/gemini/**`, `src/lib/gemini/**`, `src/lib/validations/**` | API routes proxy, prompts, tipos, cliente, errores |
| Frontend | `src/app/(protected)/loading-ai/**`, `src/app/(protected)/results/**`, `src/components/results/**` | Loading screen, ResultCard, Triptych, páginas resultado |

**Interface compartida:** tipos de respuesta Gemini (`src/lib/gemini/types.ts`) + datos mock para desarrollo Frontend.

### Cuándo NO usar Agent Teams

- Fase 0: tareas simples y secuenciales, no compensa overhead
- Fase 2: Frontend domina, Backend aporta poco
- Fase 3: Frontend domina, Backend aporta compresión
- Fase 5: NEXO y Frontend trabajan sobre el mismo código, riesgo de conflictos

**Decisión:** Proponer Agent Teams a Adrián solo en Fases 1 y 4 si busca velocidad. Si no, sesión única es más económica (3-5x más barata).

---

## 11. Protocolo por fase (Document & Clear)

Después de completar cada fase:

```
1. Commit final de la fase:  "feat: fase N — [descripción]"
2. Escribir resumen:         docs/progreso-fase-N.md
3. Guardar en memoria:       MEMORY.md actualizado
4. Adrián hace:              /clear
5. Nueva sesión empieza:     "Retomo. Lee progreso-fase-N.md + MEMORY.md"
```

### Estructura de `docs/progreso-fase-N.md`

```markdown
# Progreso Fase N — [Título]

**Fecha:** YYYY-MM-DD
**Estado:** Completada / En progreso

## Lo que se hizo
- Lista de tareas completadas con archivos afectados

## Lo que quedó pendiente (si algo)
- Deuda técnica o tareas diferidas

## Decisiones tomadas durante la fase
- Cambios respecto al plan original y por qué

## Estado de tests
- Qué tests existen, cuáles pasan

## Próximo paso
- Primera tarea de la siguiente fase
```

### Dentro de una fase

- Si el contexto supera ~50%: sugerir `/compact focus on [tarea actual]`
- Commits tras cada subtarea significativa
- Tests antes de marcar tarea como completada

---

## 12. Criterios de aceptación globales

Antes de considerar el proyecto listo para deploy (checklist completa en `docs/checklist-despliegue.md`):

### Funcionalidad
- [ ] Flujo completo Modo A: login → captura → preferencias → IA → 2 resultados → descarga
- [ ] Flujo completo Modo B: login → captura → descripción → IA → 1 resultado → descarga
- [ ] "Nueva consulta" limpia todo, vuelve a Home
- [ ] Regenerar / Probar otro corte funcional
- [ ] Responsive: tablet (principal) + móvil (secundario)

### Seguridad
- [ ] RLS en `barber_profiles` y `app_config`
- [ ] `GEMINI_API_KEY` nunca en cliente (verificar Network tab)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` nunca en cliente
- [ ] Validación Zod en cliente Y servidor
- [ ] Zero data retention verificado con `/privacy-scan`

### Calidad de código
- [ ] `/code-review` score ≥80
- [ ] `npm run build` sin errores
- [ ] Sin `console.log` en producción
- [ ] Sin `any` no justificado
- [ ] Tests unitarios e integración pasando

### Visual
- [ ] `/design-audit` sin issues críticos
- [ ] Paleta Aureum Precision consistente
- [ ] Fuentes cargando (Playfair Display, DM Sans, JetBrains Mono)
- [ ] Regla No-Line respetada
- [ ] Touch targets ≥44px

### PWA
- [ ] `manifest.json` válido
- [ ] Service worker registrado
- [ ] Iconos 192px y 512px
- [ ] Instalable desde navegador
- [ ] Offline: mensaje claro

---

## 13. Riesgos identificados

| Riesgo | Impacto | Probabilidad | Mitigación |
|---|---|---|---|
| Límites free tier Gemini API | Alto — app inusable | Media | Rate limiting, contador visible, mensaje claro al usuario |
| Inconsistencia facial en generación imagen | Alto — resultado no creíble | Media | Triptych como composición principal, "barber cape trick", iteración prompts |
| Latencia alta generación (>25s) | Medio — UX frustrante | Media | Loading premium con animación, texto rotativo, `Promise.all` para paralelo |
| Calidad fotos pobre (iluminación barbería) | Alto — análisis IA malo | Alta | Overlay guía, instrucciones claras, opción repetir, validación pre-check opcional |
| Cámara no disponible (permisos) | Medio — flujo bloqueado | Baja | Mensaje claro, instrucciones para habilitar, detección temprana |
| Canvas API limitaciones (fuentes) | Bajo — banner feo | Baja | FontFace API preload, fallback a system font |
| Supabase free tier límites | Bajo — para 2 usuarios | Muy baja | Solo 2 barberos, BD mínima, sin storage |

---

## 14. Decisiones de arquitectura (ADRs)

Documentadas en `docs/decisions/`:

| ADR | Título | Estado |
|---|---|---|
| [001](decisions/001-stack-y-arquitectura.md) | Stack tecnológico y arquitectura general | Aprobado |
| [002](decisions/002-zero-data-retention.md) | Zero data retention para fotos y resultados | Aprobado |
| [003](decisions/003-proxy-gemini-api.md) | Proxy server-side para Gemini API | Aprobado |

Se crearán ADRs adicionales durante el desarrollo cuando surjan decisiones significativas.

---

## Resumen ejecutivo

**6 fases** · **~55 tareas** · **4 subagentes** · **3 ADRs documentados**

| Fase | Complejidad | Qué se construye |
|---|---|---|
| 0 | Simple | Proyecto Next.js, Tailwind, fuentes, PWA base, estructura |
| 1 | Media | Supabase (2 tablas + RLS), auth completo, login UI |
| 2 | Media | Design system como componentes, Home, ConsultationContext |
| 3 | Compleja | Cámara 3 fotos, selector modo, preferencias, descripción |
| 4 | Compleja | Proxy Gemini API, prompts, loading IA, resultados |
| 5 | Media | Canvas + banner, descarga, tests, auditorías, PWA, deploy |

**Listo para empezar Fase 0.**
