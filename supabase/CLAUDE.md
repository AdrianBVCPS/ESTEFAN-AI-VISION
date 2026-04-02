# Módulo: Base de datos y Edge Functions

Supabase como backend: autenticación, base de datos mínima y proxy para Gemini API.

## Modelo de datos (mínimo)

Solo 2 tablas custom + `auth.users` (gestionado por Supabase Auth):

```sql
-- Perfil del barbero
public.barber_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'barber')) DEFAULT 'barber',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)

-- Configuración de la app
public.app_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
)
```

**NO existen** tablas de clientes, sesiones de consulta, fotos ni resultados. Zero data retention.

## RLS (obligatorio)

- `barber_profiles`: SELECT/UPDATE para el propio usuario (`auth.uid() = id`). INSERT solo admin.
- `app_config`: SELECT para cualquier usuario autenticado. UPDATE solo admin.

## Migraciones

- En `supabase/migrations/` con timestamp.
- Idempotentes cuando sea posible.
- Comentarios en español.
- Naming: snake_case para todo.

## Edge Functions (si se usan como proxy Gemini)

- En `supabase/functions/`.
- Verificar JWT del barbero antes de hacer la llamada a Gemini.
- Nunca loguear contenido de imágenes ni datos de clientes.
- La API key de Gemini como secret de Supabase, no hardcodeada.

## Convenciones

Referencia completa: `docs/convenciones-supabase.md`
