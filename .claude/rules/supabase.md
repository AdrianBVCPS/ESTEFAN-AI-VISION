---
paths:
  - supabase/**
  - src/lib/supabase/**
---

# Reglas Supabase

1. **RLS obligatorio** en cada tabla nueva. Habilitar inmediatamente.
2. **Naming:** tablas snake_case plural, columnas snake_case.
3. **Migraciones** en /supabase/migrations/ con timestamp e idempotentes.
4. **Nunca** exponer `service_role_key` en cliente.
5. **Políticas** específicas por rol, nunca genéricas.

Detalle completo: @docs/convenciones-supabase.md
