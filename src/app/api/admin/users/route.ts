import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSuperadmin } from '@/lib/stripe'

// GET /api/admin/users — Lista todos los usuarios con stats de uso
export async function GET() {
  // Verificar que el caller es superadmin por email (sin query BD)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!isSuperadmin(user.email)) {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
  }

  const adminClient = createAdminClient()

  // Obtener todos los perfiles
  const { data: profiles, error } = await adminClient
    .from('barber_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Para cada usuario, contar sus consultas (este mes y total)
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const enriched = await Promise.all((profiles ?? []).map(async (profile) => {
    const [{ count: totalCount }, { count: monthCount }] = await Promise.all([
      adminClient
        .from('usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id),
      adminClient
        .from('usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .gte('created_at', firstDayOfMonth),
    ])

    return {
      ...profile,
      usage_total: totalCount ?? 0,
      usage_this_month: monthCount ?? 0,
    }
  }))

  return NextResponse.json({ users: enriched })
}
