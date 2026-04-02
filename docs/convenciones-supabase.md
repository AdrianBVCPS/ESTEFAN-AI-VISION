# Convenciones Supabase

## Naming

- **Tablas:** snake_case, plural (`empleados`, `fichajes`, `pausas`)
- **Columnas:** snake_case (`created_at`, `id_maquina`, `nombre_completo`)
- **Enums:** snake_case en PostgreSQL, mapeados a tipos TypeScript
- **Funciones SQL:** snake_case descriptivo (`calcular_tiempo_descanso`)

## RLS (Row Level Security)

- Habilitar RLS al crear cada tabla. **Sin excepciones.**
- Políticas específicas por rol — nunca `true` genérico.
- Patrón habitual: `empleado`, `responsable`, `admin` (adaptar según proyecto).
- Usar `auth.uid()` y metadata JWT.

## Migraciones

- En `/supabase/migrations/` con timestamp.
- Idempotentes cuando sea posible. Comentarios en español.

## Cliente Supabase

- Servidor: `/src/lib/supabase/server.ts`
- Navegador: `/src/lib/supabase/client.ts`
- **NUNCA** exponer `service_role_key` en cliente.
- Env vars: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
