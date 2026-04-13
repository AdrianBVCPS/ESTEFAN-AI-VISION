import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Cliente con service_role — NUNCA exponer al cliente
// Solo para uso en API routes server-side y webhooks.
// Sin generic Database: @supabase/supabase-js@2.101 tiene regresión de tipos
// con columnas nuevas en Update/select parcial. La seguridad se garantiza via
// Zod en los inputs de cada route handler.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAdminClient(): ReturnType<typeof createSupabaseClient<any>> {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
