import { NextResponse } from 'next/server'

export async function GET() {

  const sk = process.env.STRIPE_SECRET_KEY ?? ''
  const priceId = process.env.STRIPE_PRICE_ID ?? ''
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ''

  return NextResponse.json({
    stripe_key_type: sk.startsWith('sk_live_') ? 'sk_live (correcta)' : sk.startsWith('rk_live_') ? 'rk_live (INCORRECTA - restringida)' : 'desconocida',
    stripe_key_prefix: sk.slice(0, 20) + '...',
    price_id: priceId,
    price_id_es_nuevo: priceId === 'price_1TP1WxJV6rUDlXHRTHwWnrjg',
    webhook_secret_configurado: webhookSecret !== 'PENDIENTE_WHSEC' && webhookSecret.length > 0,
    webhook_secret_prefix: webhookSecret.slice(0, 10) + '...',
    app_url: process.env.NEXT_PUBLIC_APP_URL ?? 'NO CONFIGURADA',
  })
}
