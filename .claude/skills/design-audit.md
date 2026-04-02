---
name: design-audit
description: |
  Audita la implementación UI contra el design system Aureum Precision.
  Verifica colores, tipografía, spacing, regla "no-line", zona táctil y responsive.
  Usar antes de entregar una fase de frontend o antes de deploy.
skill: true
---

# Design Audit — Estefan AI Vision

Eres un auditor de diseño para el proyecto Estefan AI Vision. Tu trabajo es verificar que la implementación respeta el design system "Aureum Precision".

## Paso 1 — Cargar referencias

Lee estos archivos de referencia:
- `docs/DiseñoEstefanAIVision/aureum_precision/DESIGN.md` (design system)
- `docs/DisenoEstefanAIVision 1-2.md` (guía UX/UI con specs de pantallas)

## Paso 2 — Escanear componentes

Busca en `src/components/**` y `src/app/**/*.tsx` todos los archivos de UI.

## Paso 3 — Verificar cada regla

Para cada componente encontrado, verifica:

### Colores
- [ ] Fondo principal: `#F5F0EB` (crema), no blanco puro
- [ ] Navy: `#1A1A2E` (headers, fondos oscuros), nunca `#000`
- [ ] Dorado: `#D4A854` (CTAs, iconos activos)
- [ ] Teal: `#4ECDC4` solo para Modo B y estados de éxito
- [ ] Sin colores fuera de la paleta definida

### Tipografía
- [ ] Playfair Display para títulos/display
- [ ] DM Sans para UI/body
- [ ] JetBrains Mono para datos técnicos (si aplica)
- [ ] Labels: sans-serif, all-caps, +10% letter-spacing encima de títulos serif

### Regla "No-Line"
- [ ] Sin `border-1px solid` para seccionar contenido
- [ ] Separación visual mediante cambios de fondo (surface hierarchy)
- [ ] Si hay borde obligatorio: `outline-variant` al 15% opacidad máximo

### Touch & Accesibilidad
- [ ] Botones CTA: mínimo 56px de alto
- [ ] Zona táctil: mínimo 44×44px (WCAG)
- [ ] Texto mínimo: 14px
- [ ] Contraste ratio ≥ 4.5:1

### Componentes específicos
- [ ] Monograma EA como watermark al 5% en tarjetas de contenido IA
- [ ] Glassmorphism en paneles flotantes (80% opacidad + 20px backdrop-blur)
- [ ] Sombras ultra-difusas: `0 8px 32px rgba(29,27,25,0.05)`
- [ ] Border-radius: 12px tarjetas, 8px botones, 16px tarjetas resultado
- [ ] Iconos Lucide React, stroke fino, 24px mínimo táctil

### Responsive
- [ ] Tablet landscape (≥1024px): layout principal
- [ ] Tablet portrait (768-1023px): adaptado
- [ ] Móvil (<768px): 1 columna, botones full-width

## Paso 4 — Reportar

Genera un informe con:
1. **Cumple**: componentes que respetan el design system
2. **Desviaciones**: componentes con problemas, indicando archivo:línea y qué regla incumplen
3. **Recomendaciones**: mejoras opcionales de diseño

Formato del informe: markdown con tablas y checkboxes.
