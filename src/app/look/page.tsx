'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function LookContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [expired, setExpired] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const supabase = createClient()

    // Cast: shared_looks no está en tipos generados aún
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(supabase as any)
      .from('shared_looks')
      .select('image_path, expires_at')
      .eq('id', id)
      .single()
      .then(({ data, error }: { data: { image_path: string; expires_at: string } | null; error: unknown }) => {
        if (error || !data) {
          setNotFound(true)
          setLoading(false)
          return
        }

        if (new Date(data.expires_at) < new Date()) {
          setExpired(true)
          setLoading(false)
          return
        }

        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/shared-looks/${data.image_path}`
        setImageUrl(url)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: '#1A1A2E' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
          style={{ background: 'rgba(212,168,84,0.15)' }}
        >
          <span
            className="text-lg font-bold"
            style={{ color: '#D4A854', fontFamily: "'Playfair Display', serif" }}
          >
            EA
          </span>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: '#1A1A2E' }}
      >
        <h1
          className="font-bold text-2xl text-center mb-2"
          style={{ color: '#D4A854', fontFamily: "'Playfair Display', serif" }}
        >
          Enlace no encontrado
        </h1>
        <p
          className="text-sm text-center max-w-xs"
          style={{ color: 'rgba(245,240,235,0.6)', fontFamily: "'DM Sans', sans-serif" }}
        >
          Este enlace no existe o ya fue eliminado.
        </p>
      </div>
    )
  }

  if (expired) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: '#1A1A2E' }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(212,168,84,0.15)' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4A854" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h1
          className="font-bold text-2xl text-center mb-2"
          style={{ color: '#D4A854', fontFamily: "'Playfair Display', serif" }}
        >
          Enlace expirado
        </h1>
        <p
          className="text-sm text-center max-w-xs"
          style={{ color: 'rgba(245,240,235,0.6)', fontFamily: "'DM Sans', sans-serif" }}
        >
          Este enlace ya no est&aacute; disponible. Pide a tu barbero que genere uno nuevo.
        </p>
        <div className="mt-8 flex flex-col items-center gap-1">
          <p
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: 'rgba(212,168,84,0.5)', fontFamily: "'DM Sans', sans-serif" }}
          >
            Estefan Acosta Barber Shop
          </p>
          <p
            className="text-xs"
            style={{ color: 'rgba(245,240,235,0.3)', fontFamily: "'DM Sans', sans-serif" }}
          >
            Lugo &middot; Powered by Estefan AI Vision
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#1A1A2E' }}
    >
      {/* Header branding */}
      <div className="px-6 pt-8 pb-4 shrink-0 text-center">
        <div
          className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'rgba(212,168,84,0.15)' }}
        >
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: '#D4A854', fontFamily: "'Playfair Display', serif" }}
          >
            EA
          </span>
        </div>
        <p
          className="text-xs font-bold tracking-widest uppercase mb-1"
          style={{ color: 'rgba(212,168,84,0.7)', fontFamily: "'DM Sans', sans-serif" }}
        >
          TU NUEVO LOOK
        </p>
        <h1
          className="font-bold text-2xl"
          style={{ color: '#F5F0EB', fontFamily: "'Playfair Display', serif" }}
        >
          Estefan AI Vision
        </h1>
      </div>

      {/* Imagen */}
      <div className="flex-1 px-4 pb-4">
        <div
          className="w-full overflow-hidden mx-auto"
          style={{
            borderRadius: 12,
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            maxWidth: 480,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl!}
            alt="Tu nuevo look generado por IA"
            className="w-full h-auto block"
          />
        </div>
      </div>

      {/* Footer branding */}
      <div className="px-6 py-6 shrink-0 text-center">
        <p
          className="text-xs font-bold tracking-widest uppercase mb-1"
          style={{ color: 'rgba(212,168,84,0.5)', fontFamily: "'DM Sans', sans-serif" }}
        >
          Estefan Acosta Barber Shop
        </p>
        <p
          className="text-xs"
          style={{ color: 'rgba(245,240,235,0.3)', fontFamily: "'DM Sans', sans-serif" }}
        >
          Lugo &middot; Powered by Estefan AI Vision
        </p>
      </div>
    </div>
  )
}

export default function LookPage() {
  return (
    <Suspense fallback={
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#1A1A2E' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
          style={{ background: 'rgba(212,168,84,0.15)' }}
        >
          <span
            className="text-lg font-bold"
            style={{ color: '#D4A854', fontFamily: "'Playfair Display', serif" }}
          >
            EA
          </span>
        </div>
      </div>
    }>
      <LookContent />
    </Suspense>
  )
}
