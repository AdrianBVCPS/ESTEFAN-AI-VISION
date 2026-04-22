import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSuperadmin } from '@/lib/stripe'

// GET /api/admin/stats — Métricas globales para el dashboard del superadmin
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!isSuperadmin(user.email)) {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
  }

  const adminClient = createAdminClient()
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  // Ejecutar todas las queries en paralelo
  const [
    { count: totalUsers },
    { count: activeUsers },
    { count: trialingUsers },
    { count: pendingUsers },
    { count: todayUsage },
    { count: monthUsage },
    { data: dailyUsage },
  ] = await Promise.all([
    adminClient.from('barber_profiles').select('*', { count: 'exact', head: true }),
    adminClient.from('barber_profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
    adminClient.from('barber_profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'trialing'),
    adminClient.from('barber_profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'pending'),
    adminClient.from('usage_logs').select('*', { count: 'exact', head: true }).gte('created_at', today),
    adminClient.from('usage_logs').select('*', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth),
    // Uso diario últimos 30 días
    adminClient.from('usage_logs')
      .select('created_at')
      .gte('created_at', new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ])

  // Agrupar uso diario por fecha (YYYY-MM-DD)
  const dailyMap: Record<string, number> = {}
  for (const log of dailyUsage ?? []) {
    const day = log.created_at.slice(0, 10)
    dailyMap[day] = (dailyMap[day] ?? 0) + 1
  }

  return NextResponse.json({
    total_users: totalUsers ?? 0,
    active_users: activeUsers ?? 0,
    trialing_users: trialingUsers ?? 0,
    pending_users: pendingUsers ?? 0,
    revenue_this_month: (activeUsers ?? 0) * 16,
    usage_today: todayUsage ?? 0,
    usage_this_month: monthUsage ?? 0,
    daily_usage_last_30: dailyMap,
  })
}
