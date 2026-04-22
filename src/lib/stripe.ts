import Stripe from 'stripe'

// Cliente Stripe server-side. Nunca exportar al cliente.
// httpClient: fetch nativo — el cliente Node http falla en Vercel serverless.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
  typescript: true,
  httpClient: Stripe.createFetchHttpClient(),
})

// Precio de suscripción mensual (crear en Stripe Dashboard o vía script)
export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID!

// Email del superadmin — acceso gratuito permanente, inmutable
export const SUPERADMIN_EMAIL = 'adriangarciamendez87@gmail.com'

/** Comprueba si el usuario autenticado es el superadmin por email */
export function isSuperadmin(email: string | null | undefined): boolean {
  return email === SUPERADMIN_EMAIL
}
