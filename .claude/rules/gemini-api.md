---
paths:
  - src/app/api/gemini/**
  - src/lib/gemini/**
  - supabase/functions/**
---

# Reglas de integración Gemini API

## Seguridad

- API key de Gemini NUNCA en el cliente. Siempre via proxy server-side (API route o Edge Function).
- Variable de entorno: `GEMINI_API_KEY` (server-only, sin prefijo `NEXT_PUBLIC_`).

## Configuración de llamadas

- Análisis facial: `temperature: 0.15`, `topP: 0.8`, `topK: 20`, `maxOutputTokens: 2048`.
- Generación de imagen: `temperature: 0.75`, `topP: 0.9`, `responseModalities: ["IMAGE"]`.
- Siempre usar `responseMimeType: "application/json"` + `responseSchema` con `propertyOrdering` para análisis.

## Estructura de prompts

- Restricciones de identidad facial ANTES de instrucciones creativas.
- Negative constraints AL FINAL como guardrails de output.
- Visual descriptions: puramente técnicas, 60-120 palabras, solo pelo.
- Incluir "barber cape trick" en generación de imagen.

## Optimización

- Fotos de input: comprimir a máx 1024×1024px, JPEG 85% antes de enviar.
- Paralelizar las 2 generaciones de imagen (Modo A) con `Promise.all`.
- Triptych (3 vistas en 1 imagen) como composición principal.
- Fallback a paneles individuales si la identidad facial es inconsistente.

## Manejo de errores

- API no responde: mensaje amigable + botón reintento.
- Límite free tier: "Has llegado al límite de hoy."
- Texto vago en Modo B (<5 chars): "Describe el corte con un poco más de detalle."
