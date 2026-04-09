import { createClient } from '@/lib/supabase/server'

const DAILY_LIMIT = 50

/**
 * Comprueba el límite diario de uso de Gemini y lo incrementa si hay cupo.
 * Usa la función SQL `increment_gemini_usage` que opera de forma atómica,
 * evitando la race condition del patrón read-then-write.
 *
 * Retorna true si se permite la operación, false si se alcanzó el límite.
 * En caso de error de BD, permite la operación (fail-open) para no bloquear el servicio.
 *
 * Nota: @supabase/ssr@0.10 + __InternalSupabase no resuelve correctamente el genérico
 * de Functions en supabase.rpc. Usamos un wrapper tipado acotado para este RPC específico.
 */
export async function checkAndIncrementUsage(): Promise<boolean> {
  try {
    const supabase = await createClient()

    // Wrapper tipado acotado: evita el error de tipos de @supabase/ssr@0.10
    // sin recurrir a `as any` global. El cast está documentado y es seguro.
    const typedRpc = supabase.rpc as unknown as (
      fn: 'increment_gemini_usage',
      args: { p_key: string; p_limit: number }
    ) => Promise<{ data: boolean | null; error: { message: string } | null }>

    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const configKey = `gemini_usage_${today}`

    const { data, error } = await typedRpc('increment_gemini_usage', {
      p_key: configKey,
      p_limit: DAILY_LIMIT,
    })

    if (error) return true  // fallo silencioso: no bloquear por error de BD
    return data === true
  } catch {
    return true
  }
}
