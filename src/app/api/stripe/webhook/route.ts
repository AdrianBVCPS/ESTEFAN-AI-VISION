import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import type { SubscriptionStatus } from '@/types/database'
import Stripe from 'stripe'

// En App Router el body no se parsea por defecto — request.text() funciona sin config extra

// Mapea el status de Stripe a nuestro enum
function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case 'active':    return 'active'
    case 'trialing':  return 'trialing'
    case 'past_due':  return 'past_due'
    case 'canceled':
    case 'incomplete_expired':
    case 'unpaid':    return 'canceled'
    default:          return 'pending'
  }
}

// Extrae el subscription ID desde invoice.parent (Stripe API v22+)
function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  if (invoice.parent?.type === 'subscription_details') {
    const sub = invoice.parent.subscription_details?.subscription
    if (typeof sub === 'string') return sub
    if (sub && typeof sub === 'object') return sub.id
  }
  return null
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Sin firma' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Firma inválida'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const adminClient = createAdminClient()

  // Idempotencia: procesar según tipo de evento
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id
      if (!userId || session.mode !== 'subscription') break

      await adminClient
        .from('barber_profiles')
        .update({
          subscription_status: 'active',
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        })
        .eq('id', userId)
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const subId = getSubscriptionIdFromInvoice(invoice)
      if (!subId) break

      const { data: profile } = await adminClient
        .from('barber_profiles')
        .select('id')
        .eq('stripe_subscription_id', subId)
        .maybeSingle()

      if (profile) {
        await adminClient
          .from('barber_profiles')
          .update({ subscription_status: 'active', last_payment_at: new Date().toISOString() })
          .eq('id', profile.id)
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subId = getSubscriptionIdFromInvoice(invoice)
      if (!subId) break

      const { data: profile } = await adminClient
        .from('barber_profiles')
        .select('id')
        .eq('stripe_subscription_id', subId)
        .maybeSingle()

      if (profile) {
        await adminClient
          .from('barber_profiles')
          .update({ subscription_status: 'past_due' })
          .eq('id', profile.id)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await adminClient
        .from('barber_profiles')
        .update({ subscription_status: 'canceled' })
        .eq('stripe_subscription_id', sub.id)
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const newStatus = mapStripeStatus(sub.status)
      const trialEnd = sub.trial_end
        ? new Date(sub.trial_end * 1000).toISOString()
        : null

      await adminClient
        .from('barber_profiles')
        .update({
          subscription_status: newStatus,
          trial_ends_at: trialEnd,
        })
        .eq('stripe_subscription_id', sub.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
