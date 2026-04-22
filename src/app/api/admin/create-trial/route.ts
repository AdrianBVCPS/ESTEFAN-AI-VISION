import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe, STRIPE_PRICE_ID, isSuperadmin } from '@/lib/stripe'

const bodySchema = z.object({ target_user_id: z.string().uuid() })

export async function POST(request: NextRequest) {
  try {
  // Verificar superadmin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  if (!isSuperadmin(user.email)) {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
  }

  // Validar body con Zod
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

  // Obtener datos del usuario objetivo
  // Cast necesario: @supabase/supabase-js@2.101 no infiere columnas nuevas en select parcial
  const { data: targetProfile } = await (adminClient as any)
    .from('barber_profiles')
    .select('stripe_customer_id, subscription_status')
    .eq('id', target_user_id)
    .single() as { data: { stripe_customer_id: string | null; subscription_status: string } | null; error: unknown }

  if (!targetProfile) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  // No se puede dar trial si ya tiene suscripción activa
  if (targetProfile.subscription_status === 'active') {
    return NextResponse.json({ error: 'El usuario ya tiene suscripción activa' }, { status: 409 })
  }

  // Obtener email del usuario para crear customer Stripe si no existe
  const { data: authUser } = await adminClient.auth.admin.getUserById(target_user_id)
  const email = authUser.user?.email

  let customerId = targetProfile.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: email ?? undefined,
      metadata: { supabase_user_id: target_user_id },
    })
    customerId = customer.id
    await adminClient
      .from('barber_profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', target_user_id)
  }

  // Crear suscripción con trial de 15 días
  const trialDays = 15
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: STRIPE_PRICE_ID }],
    trial_period_days: trialDays,
    payment_behavior: 'allow_incomplete',
    trial_settings: { end_behavior: { missing_payment_method: 'cancel' } },
    metadata: { supabase_user_id: target_user_id },
  })

  const trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toISOString()

  await adminClient
    .from('barber_profiles')
    .update({
      subscription_status: 'trialing',
      stripe_subscription_id: subscription.id,
      trial_ends_at: trialEndsAt,
    })
    .eq('id', target_user_id)

  return NextResponse.json({ success: true, trial_ends_at: trialEndsAt })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[Stripe Trial Error]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
