# Módulo: Lógica de negocio y utilidades

Capa de servicios, clientes API, validación y utilidades del proyecto.

## Estructura de carpetas

```
src/lib/
├── supabase/
│   ├── client.ts       ← Cliente Supabase para el navegador
│   └── server.ts       ← Cliente Supabase para el servidor (cookies)
├── gemini/
│   ├── client.ts       ← Funciones para llamar a la API de Gemini (via proxy)
│   ├── prompts.ts      ← Templates de prompts (análisis facial, generación imagen)
│   └── types.ts        ← Tipos TypeScript para schemas de respuesta Gemini
├── canvas/
│   └── compositor.ts   ← Composición imagen + logo EA (Canvas API, client-side)
├── validations/
│   └── schemas.ts      ← Schemas Zod para cada flujo (login, preferencias, descripción)
└── utils/
    ├── compress-image.ts ← Compresión de fotos a 1024px JPEG 85%
    └── format-date.ts    ← Formateo de fechas para nombre de archivo descarga
```

## Reglas clave

### Gemini API
- SIEMPRE via proxy server-side. Nunca llamar directamente desde el cliente.
- El cliente (`src/lib/gemini/client.ts`) llama a API routes internas (`/api/gemini/*`).
- Las API routes hacen la llamada real a Gemini con la API key del servidor.

### Supabase
- `client.ts`: usa `createBrowserClient` — para componentes client-side.
- `server.ts`: usa `createServerClient` con cookies — para Server Components y API routes.
- Nunca exponer `service_role_key`. Solo `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en cliente.

### Validación
- Schemas Zod en `validations/schemas.ts`.
- Validar en cliente (UX) Y en servidor (seguridad). Sin excepciones.

### Canvas
- Composición enteramente client-side. Sin servidor.
- Logo desde `/public/logo-ea.png`.
