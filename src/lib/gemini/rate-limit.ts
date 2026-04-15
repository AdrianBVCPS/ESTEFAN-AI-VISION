import { createClient } from '@/lib/supabase/server'

// Límites diarios globales ajustados al free tier de Gemini (abril 2026)
// gemini-3-flash-preview:      ~500 RPD free → 25 seguros (margen 95%)
// gemini-3-pro-image-preview:  ~50  RPD free → 15 seguros (margen 70%)
//
// En la práctica esto equivale a:
//   Modo A (1 analyze + 2 generate): máx ~7 sesiones/día
//   Modo B (1 analyze + 1 generate): máx ~15 sesiones/día
const ANALYZE_DAILY_LIMIT  = 25
const GENERATE_DAILY_LIMIT = 15

/**
 * Comprueba y atomiza el uso diario de una operación Gemini.
 * Usa `increment_gemini_usage` (SQL atómica) para evitar race conditions.
 * Fail-open: si la BD falla, permite la operación para no bloquear el servicio.
 */
async function checkAndIncrement(key: string, limit: number): Promise<boolean> {
  try {
    const supabase = await createClient()

    const typedRpc = supabase.rpc as unknown as (
      fn: 'increment_gemini_usage',
      args: { p_key: string; p_limit: number }
    ) => Promise<{ data: boolean | null; error: { message: string } | null }>

    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const { data, error } = await typedRpc('increment_gemini_usage', {
      p_key: `gemini_${key}_${today}`,
      p_limit: limit,
    })

    if (error) return true
    return data === true
  } catch {
    return true
  }
}

/** Llamada a gemini-3-flash-preview (análisis facial) */
export function checkAndIncrementUsage(): Promise<boolean> {
  return checkAndIncrement('analyze', ANALYZE_DAILY_LIMIT)
}

/** Llamada a gemini-3-pro-image-preview (generación de imagen) */
export function checkAndIncrementGenerateUsage(): Promise<boolean> {
  return checkAndIncrement('generate', GENERATE_DAILY_LIMIT)
}
