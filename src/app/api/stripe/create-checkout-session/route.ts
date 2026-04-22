import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe, STRIPE_PRICE_ID, SUPERADMIN_EMAIL } from '@/lib/stripe'

export async function POST(_request: NextRequest) {
  try {
    // 1. Verificar sesión del usuario
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // El admin nunca paga
    if (user.email === SUPERADMIN_EMAIL) {
      return NextResponse.json({ error: 'El administrador no necesita suscripción' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // 2. Obtener o crear Stripe Customer
    const { data: profile } = await adminClient
      .from('barber_profiles')
      .select('stripe_customer_id, display_name')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: profile?.display_name ?? undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      await adminClient
        .from('barber_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // 3. Crear Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${appUrl}/?payment=success`,
      cancel_url: `${appUrl}/blocked?payment=canceled`,
      metadata: { supabase_user_id: user.id },
      subscription_data: {
        metadata: { supabase_user_id: user.id },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[Stripe Checkout Error]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
