import { createClient } from '@/lib/supabase/server'

const DAILY_LIMIT = 50

/**
 * Comprueba el límite diario de uso de Gemini y lo incrementa si hay cupo.
 * Retorna true si se permite la operación, false si se ha alcanzado el límite.
 *
 * Nota: @supabase/ssr@0.10 + supabase-js@2.101 tienen una incompatibilidad de tipos
 * con tablas que no forman parte del schema inicial. Usamos cast acotado para evitarlo.
 */
export async function checkAndIncrementUsage(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const configKey = `gemini_usage_${today}`

    // Cast acotado: evita el error de tipos de la versión de @supabase/ssr
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any

    const { data } = await db
      .from('app_config')
      .select('value')
      .eq('key', configKey)
      .single()

    const currentCount = (data?.value as { count?: number } | null)?.count ?? 0

    if (currentCount >= DAILY_LIMIT) {
      return false
    }

    await db
      .from('app_config')
      .upsert(
        { key: configKey, value: { count: currentCount + 1 }, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )

    return true
  } catch {
    // Si falla el rate limit (tabla no disponible, error de red, etc.), permitir la operación
    return true
  }
}
