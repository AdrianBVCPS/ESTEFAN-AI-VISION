---
paths:
  - src/components/camera/**
  - src/hooks/useCamera*
  - src/hooks/usePhotos*
---

# Reglas de cámara y privacidad

## Zero data retention (CRÍTICO)

- Fotos del cliente NUNCA se almacenan en servidor, localStorage, sessionStorage, cookies, IndexedDB ni disco.
- Fotos solo existen en memoria (React state / blob URLs).
- Todo `URL.createObjectURL()` DEBE tener su correspondiente `URL.revokeObjectURL()` en cleanup (useEffect return o al descartar).
- Al pulsar "Nueva consulta": limpiar TODAS las referencias a fotos del estado.
- Sin `console.log` de datos de imagen o base64.

## Captura de fotos

- Usar `navigator.mediaDevices.getUserMedia` con cámara trasera preferida.
- 3 fotos obligatorias: frontal, lateral, trasera. En ese orden.
- Cada foto tiene preview + opción "Repetir" antes de confirmar.
- Overlay de guía semitransparente (silueta del ángulo esperado) al 30% dorado.
- Indicador de progreso: "Foto 1/3: Frontal" con barra de 3 segmentos.

## Compresión pre-envío

- Redimensionar a máx 1024×1024px manteniendo aspect ratio.
- Exportar como JPEG calidad 85% (~1,290 tokens por imagen en Gemini).
- Usar canvas offscreen para la compresión.
