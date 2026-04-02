# ADR-003: Proxy server-side para Gemini API

**Estado:** Aprobado  
**Fecha:** 2026-04-01  
**Contexto:** Cómo exponer Gemini API al frontend de forma segura

## Decisión

La API key de Gemini se consume **exclusivamente** desde el servidor:
- **Opción principal:** Next.js API Routes (`/api/gemini/analyze`, `/api/gemini/generate`)
- **Opción alternativa:** Supabase Edge Functions (si se necesita independencia del hosting)

El frontend llama a las API routes internas, que a su vez llaman a Gemini con la key del servidor.

## Flujo

```
Cliente (fotos base64) → POST /api/gemini/analyze → Gemini API → JSON respuesta → Cliente
Cliente (fotos + prompt) → POST /api/gemini/generate → Gemini API → imagen → Cliente
```

## Consecuencias

- `GEMINI_API_KEY` es variable server-only (sin `NEXT_PUBLIC_`)
- Latencia adicional mínima (~50ms por hop)
- Permite rate limiting y validación en servidor
- Logs del proxy nunca incluyen contenido de imágenes
