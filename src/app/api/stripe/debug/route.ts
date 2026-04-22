import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET() {
  const sk = process.env.STRIPE_SECRET_KEY ?? ''
  const priceId = process.env.STRIPE_PRICE_ID ?? ''

  const result: Record<string, unknown> = {
    stripe_key_prefix: sk.slice(0, 20) + '...',
    price_id: priceId,
  }

  try {
    const stripe = new Stripe(sk)
    const prices = await stripe.prices.retrieve(priceId)
    result.conexion = 'OK'
    result.precio_amount = prices.unit_amount
    result.precio_currency = prices.currency
    result.precio_active = prices.active
  } catch (err) {
    result.conexion = 'ERROR'
    result.error_type = err instanceof Stripe.errors.StripeError ? err.type : 'unknown'
    result.error_message = err instanceof Error ? err.message : String(err)
  }

  return NextResponse.json(result)
}
