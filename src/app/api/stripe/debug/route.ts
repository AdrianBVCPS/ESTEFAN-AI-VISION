import { NextResponse } from 'next/server'

export async function GET() {
  const sk = process.env.STRIPE_SECRET_KEY ?? ''
  const priceId = process.env.STRIPE_PRICE_ID ?? ''

  const result: Record<string, unknown> = {
    stripe_key_prefix: sk.slice(0, 25) + '...',
    stripe_key_length: sk.length,
    price_id: priceId,
  }

  // Test 1: fetch directo a Stripe (sin SDK)
  try {
    const res = await fetch(`https://api.stripe.com/v1/prices/${priceId}`, {
      headers: { Authorization: `Bearer ${sk}` },
    })
    const data = await res.json()
    if (res.ok) {
      result.fetch_test = 'OK'
      result.precio_cents = data.unit_amount
      result.precio_active = data.active
    } else {
      result.fetch_test = 'ERROR'
      result.fetch_status = res.status
      result.fetch_error = data.error?.message ?? JSON.stringify(data)
    }
  } catch (err) {
    result.fetch_test = 'NETWORK_ERROR'
    result.fetch_error = err instanceof Error ? err.message : String(err)
  }

  return NextResponse.json(result)
}
