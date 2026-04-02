# Módulo: Componentes UI

Librería de componentes del proyecto. Design system: **Aureum Precision** (ver `docs/DiseñoEstefanAIVision/aureum_precision/DESIGN.md`).

## Estructura de carpetas

```
src/components/
├── ui/           ← Primitivos reutilizables (Button, Chip, Input, Card)
├── camera/       ← CameraCapture, PhotoPreview, CaptureGuide, PhotoStrip
├── results/      ← ResultCard, Triptych, DownloadButton, RegenerateButton
├── layout/       ← Header, BottomNav, LoadingScreen, ProgressBar
├── mode/         ← ModeSelector, PreferencesForm, DescribeForm, BeardSelector
└── shared/       ← EAMonogram, ErrorMessage, Toast
```

## Reglas de componentes

- Funcionales con TypeScript estricto. Props tipadas, sin `any`.
- Tailwind CSS exclusivamente. Sin CSS modules, styled-components ni inline styles.
- Iconos: Lucide React, stroke-width 1.5.
- Exportar desde `index.ts` en cada subcarpeta.

## Design system (resumen rápido)

- **Paleta:** navy `#1A1A2E`, dorado `#D4A854`, crema `#F5F0EB`, teal `#4ECDC4` (solo Modo B).
- **Fuentes:** Playfair Display (títulos), DM Sans (UI), JetBrains Mono (datos).
- **Sin bordes duros** para seccionar. Usar cambios de fondo.
- **Touch-first:** botones ≥56px (CTA), zona táctil ≥44px. Acciones principales abajo.
- **Monograma EA** al 5% opacidad como watermark en tarjetas de contenido IA.

## Referencia visual

Los mockups de cada pantalla están en `docs/DiseñoEstefanAIVision/` con `screen.png` y `code.html` de referencia. Consultar para mantener fidelidad visual.
