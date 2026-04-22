'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { EAMonogram } from '@/components/shared/EAMonogram'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import type { SubscriptionStatus } from '@/types/database'

// Mensajes según el motivo de bloqueo
const MENSAJES: Record<string, string> = {
  pending: 'Activa tu suscripción para empezar a usar la app.',
  past_due: 'Tu último pago no se procesó. Actualiza tu método de pago.',
  canceled: 'Tu suscripción fue cancelada. Reactívala para seguir usando la app.',
  payment_canceled: 'El pago fue cancelado. Puedes intentarlo de nuevo cuando quieras.',
}

// Contenido real — necesita Suspense por useSearchParams
function BlockedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  // Detectar motivo desde query params
  const reason = searchParams.get('reason') ?? ''
  const paymentCanceled = searchParams.get('payment') === 'canceled'
  const motivoKey = paymentCanceled ? 'payment_canceled' : (reason || 'pending')
  const mensaje = MENSAJES[motivoKey] ?? MENSAJES['pending']

  const [cargandoStripe, setCargandoStripe] = useState(false)
  const [errorPago, setErrorPago] = useState<string | null>(null)
  const [statusReal, setStatusReal] = useState<SubscriptionStatus | null>(null)

  // Obtener el status real del usuario al montar
  // Cast necesario: @supabase/ssr@0.10 no infiere columnas nuevas en select parcial
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(supabase as any)
        .from('barber_profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single()
        .then(({ data }: { data: { subscription_status: SubscriptionStatus } | null }) => {
          if (data) setStatusReal(data.subscription_status)
        })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Si el usuario ya está activo (p.ej. volvió de Stripe con éxito), redirigir
  useEffect(() => {
    if (statusReal === 'active' || statusReal === 'trialing') {
      router.replace('/')
    }
  }, [statusReal, router])

  const handleActivar = async () => {
    setCargandoStripe(true)
    setErrorPago(null)
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Error al crear la sesión de pago')
      }
      const { url } = await res.json()
      if (!url) throw new Error('No se recibió URL de pago')
      window.location.href = url
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setErrorPago(msg)
      setCargandoStripe(false)
    }
  }

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ background: '#1A1A2E' }}
    >
      {/* Monograma EA — grande y centrado */}
      <div className="mb-8">
        <EAMonogram variant="banner" size={96} />
      </div>

      {/* Título y subtítulo */}
      <div className="flex flex-col items-center gap-2 mb-8 text-center">
        <h1
          className="font-display font-bold text-3xl"
          style={{ color: '#D4A854' }}
        >
          Estefan AI Vision
        </h1>
        <p className="font-ui text-base" style={{ color: 'rgba(245,240,235,0.7)' }}>
          Tu suscripción no está activa
        </p>
      </div>

      {/* Caja con mensaje específico */}
      <div
        className="w-full max-w-sm rounded-2xl px-6 py-5 mb-8 text-center"
        style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <p className="font-ui text-sm leading-relaxed" style={{ color: 'rgba(245,240,235,0.85)' }}>
          {mensaje}
        </p>
      </div>

      {/* CTA principal */}
      <div className="w-full max-w-sm flex flex-col gap-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={cargandoStripe}
          onClick={handleActivar}
          style={{ height: 56, borderRadius: 12 }}
        >
          {!cargandoStripe && 'Activar suscripción → 16€/mes'}
          {cargandoStripe && 'Redirigiendo a Stripe...'}
        </Button>

        {/* Mensaje de error de pago */}
        {errorPago && (
          <p className="font-ui text-xs text-center" style={{ color: '#EF4444' }}>
            {errorPago}
          </p>
        )}

        {/* Texto de contacto */}
        <p
          className="font-ui text-xs text-center mt-2"
          style={{ color: 'rgba(245,240,235,0.5)' }}
        >
          ¿Necesitas ayuda? Contacta con el administrador.
        </p>

        {/* Botón cerrar sesión */}
        <button
          onClick={handleCerrarSesion}
          className="flex items-center justify-center gap-2 font-ui text-xs mx-auto transition-opacity hover:opacity-70 cursor-pointer"
          style={{ color: 'rgba(245,240,235,0.3)' }}
        >
          <LogOut size={14} strokeWidth={1.5} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

// Wrapper con Suspense — requerido por useSearchParams en Next.js App Router
export default function BlockedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1A1A2E' }}>
        <EAMonogram variant="loading" size={80} />
      </div>
    }>
      <BlockedContent />
    </Suspense>
  )
}
