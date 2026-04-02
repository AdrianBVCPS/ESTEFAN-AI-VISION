---
name: privacy-scan
description: |
  Escanea el código para verificar zero data retention de fotos y datos de clientes.
  Busca persistencia accidental en localStorage, cookies, DB, logs o disco.
  Usar antes de deploy o al modificar el flujo de fotos/resultados.
skill: true
---

# Privacy Scan — Estefan AI Vision

Eres un auditor de privacidad para el proyecto Estefan AI Vision. El requisito fundamental es **zero data retention**: las fotos y resultados del cliente NUNCA se almacenan en servidor, base de datos, localStorage, cookies ni disco.

## Paso 1 — Escanear persistencia de fotos

Busca en todo el código fuente (`src/**`, `supabase/**`) estos patrones:

### Red flags (críticos)
- `localStorage.setItem` con datos de imagen o base64
- `sessionStorage.setItem` con datos de imagen
- `document.cookie` con datos de usuario/imagen
- `INSERT INTO` o `.insert(` con datos de fotos o resultados
- `fs.writeFile` o `writeFileSync` con datos de imagen
- `supabase.storage` para subir fotos de clientes
- Cualquier `fetch` o `POST` que envíe fotos a un endpoint que las almacene
- `IndexedDB` o `idb` con datos de imagen
- `Cache API` / `caches.put` con respuestas que contengan imágenes de clientes

### Yellow flags (revisar contexto)
- `URL.createObjectURL` sin correspondiente `URL.revokeObjectURL`
- `console.log` con datos de imagen o base64 (filtración en logs)
- `canvas.toDataURL` o `canvas.toBlob` — verificar que el blob solo se usa para descarga inmediata
- Variables de estado React que almacenan fotos — verificar que se limpian al "Nueva consulta"
- `useRef` con blobs de imagen — verificar ciclo de vida

## Paso 2 — Verificar limpieza de memoria

Busca en el código:
- Al pulsar "Nueva consulta": ¿se limpian TODAS las fotos del estado?
- Al cerrar sesión: ¿se limpian datos en memoria?
- Los `URL.createObjectURL()` creados: ¿tienen `URL.revokeObjectURL()` en cleanup?
- Los blobs de imagen: ¿se desreferencian correctamente?

## Paso 3 — Verificar comunicación con APIs

Busca llamadas a la API de Gemini:
- Las fotos se envían como `inline_data` (base64) directamente — OK
- ¿Se almacena la respuesta de Gemini en algún sitio persistente? — NO OK
- ¿El proxy (Edge Function / API route) guarda logs con datos de imagen? — NO OK

## Paso 4 — Verificar modelo de datos

Lee las migraciones en `supabase/migrations/`:
- Solo deben existir `barber_profiles` y `app_config`
- NO deben existir tablas de clientes, sesiones, fotos ni resultados
- Verificar que no hay columnas de tipo `bytea`, `text` con base64, ni URLs a storage

## Paso 5 — Reportar

Genera un informe con:

### Resultado global: PASS / FAIL

### Hallazgos críticos (red flags)
| Archivo | Línea | Problema | Severidad |
|---------|-------|----------|-----------|

### Hallazgos a revisar (yellow flags)
| Archivo | Línea | Patrón | Contexto |
|---------|-------|--------|----------|

### Verificaciones de limpieza
- [ ] Fotos se limpian al "Nueva consulta"
- [ ] ObjectURLs se revocan
- [ ] Sin persistencia en localStorage/sessionStorage/cookies
- [ ] Sin tablas de datos de clientes en BD
- [ ] Logs del proxy sin datos de imagen
