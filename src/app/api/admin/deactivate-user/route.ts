import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe, isSuperadmin } from '@/lib/stripe'

const bodySchema = z.object({ target_user_id: z.string().uuid() })

export async function POST(request: NextRequest) {
  // Verificar superadmin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  if (!isSuperadmin(user.email)) {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
  }

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'target_user_id inválido' }, { status: 422 })
  }

  const { target_user_id } = parsed.data
  const adminClient = createAdminClient()

  // No permitir desactivar al superadmin
  // Cast necesario: @supabase/supabase-js@2.101 no infiere columnas nuevas en select parcial
  const { data: targetProfile } = await (adminClient as any)
    .from('barber_profiles')
    .select('role, stripe_subscription_id')
    .eq('id', target_user_id)
    .single() as { data: { role: string; stripe_subscription_id: string | null } | null; error: unknown }

  if (!targetProfile) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  if (targetProfile.role === 'superadmin') {
    return NextResponse.json({ error: 'No se puede desactivar al superadmin' }, { status: 403 })
  }

  // Cancelar suscripción en Stripe si existe
  if (targetProfile.stripe_subscription_id) {
    try {
      await stripe.subscriptions.cancel(targetProfile.stripe_subscription_id)
    } catch {
      // Si la suscripción ya estaba cancelada, continuar igualmente
    }
  }

  // Marcar como cancelado en la BD
  await adminClient
    .from('barber_profiles')
    .update({ subscription_status: 'canceled' })
    .eq('id', target_user_id)

  return NextResponse.json({ success: true })
}
