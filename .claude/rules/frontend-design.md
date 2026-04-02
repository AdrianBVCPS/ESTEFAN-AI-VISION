---
paths:
  - src/app/**/page.tsx
  - src/app/**/layout.tsx
  - src/components/**
---

# Reglas de diseño — Aureum Precision

Design system del proyecto. Referencia completa: @docs/DiseñoEstefanAIVision/aureum_precision/DESIGN.md

## Paleta (obligatoria)

- Fondo principal: `#F5F0EB` (crema). Nunca blanco puro `#FFF`.
- Navy: `#1A1A2E` (fondos oscuros, headers). Nunca negro puro `#000`.
- Dorado: `#D4A854` (CTAs, iconos activos, acento premium).
- Teal: `#4ECDC4` exclusivo para Modo B y estados de éxito.
- Gris texto: `#6B7280` (secundario), `#1C1C1C` (principal).

## Tipografía

- Display/títulos: Playfair Display Bold.
- UI/body: DM Sans Regular/Medium/Bold.
- Datos técnicos: JetBrains Mono.
- Patrón editorial: label small all-caps encima de título serif grande.

## Regla "No-Line"

- Prohibido `border: 1px solid` para seccionar contenido.
- Usar cambios de fondo (surface hierarchy) para definir límites.
- Si borde necesario: `outline-variant` al 15% opacidad máximo.

## Touch-first

- CTAs: mínimo 56px de alto, border-radius 12px.
- Zona táctil: mínimo 44×44px (WCAG).
- Texto mínimo: 14px. Acciones principales en mitad inferior.
- Hover/active: scale 0.97-0.98, transición 150ms.

## Componentes

- Sombras: `0 4px 12px rgba(0,0,0,0.08)` general, `0 8px 32px rgba(29,27,25,0.05)` flotantes.
- Border-radius: 12px tarjetas, 8px botones, 16px tarjetas resultado, 22px chips (píldora).
- Glassmorphism en paneles IA: 80% opacidad + 20px backdrop-blur.
- Iconos: Lucide React, stroke fino, 24px mínimo.
- Monograma EA al 5% opacidad como watermark en tarjetas de contenido IA.
