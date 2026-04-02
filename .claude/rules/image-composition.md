---
paths:
  - src/lib/canvas/**
  - src/components/**/Download*
  - src/components/results/**
---

# Reglas de composición de imagen con logo

## Composición (Canvas API, client-side)

- Enteramente en el navegador. Sin llamadas a servidor para componer.
- Se crea un `<canvas>` del tamaño de la imagen generada + espacio para banner.

## Banner inferior

- Franja de 60-80px en la parte inferior de la imagen.
- Fondo: `#1A1A2E` al 85% opacidad.
- Logo EA: dorado `#D4A854`, 40×40px, padding 10px desde borde izquierdo.
- Texto: "Estefan Acosta Barber Shop • Lugo" en DM Sans 14px, color `#F5F0EB`.
- Opcional: "Powered by Estefan AI Vision" en DM Sans 10px, color `#6B7280`.

## Marca de agua alternativa

- Monograma EA centrado, 200×200px, opacidad 12%, dorado `#D4A854`.
- Se activa como alternativa al banner si el barbero lo prefiere.

## Exportación

- Formato: JPG calidad 92%.
- Nombre: `estefan-ai-YYYY-MM-DD-HHmm.jpg`.
- Usar `canvas.toBlob('image/jpeg', 0.92)` + descarga via anchor tag.

## Assets

- Logo: `/public/logo-ea.png` (PNG, fondo blanco — necesita versión transparente).
- Fuente DM Sans: precargar para el canvas (usar FontFace API).
