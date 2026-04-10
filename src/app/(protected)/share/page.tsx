'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Download, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui'
import { EAMonogram } from '@/components/shared/EAMonogram'
import { useConsultation } from '@/lib/utils/consultation-context'
import { composeBrandedImage, getBrandedFilename } from '@/lib/canvas/compositor'

// Contenido real de la pantalla — necesita useSearchParams → dentro de Suspense
function ShareContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const consultation = useConsultation()

  const [brandedUrl, setBrandedUrl] = useState<string | null>(null)
  const [isComposing, setIsComposing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hasStarted = useRef(false)
  const mountedRef = useRef(true)

  const rawIndex = Number(searchParams.get('index') ?? '0')
  const index = Number.isNaN(rawIndex) ? 0 : rawIndex
  const image = consultation.generatedImages[index]
  const imageUrl = image?.url

  // Guardia: si no hay imagen, volver al inicio
  useEffect(() => {
    if (!imageUrl) {
      router.replace('/')
    }
  }, [imageUrl, router])

  // Componer la imagen con el banner de marca
  useEffect(() => {
    mountedRef.current = true

    if (!imageUrl || hasStarted.current) return
    hasStarted.current = true

    let objectUrl: string | null = null

    composeBrandedImage({ imageUrl })
      .then((blob) => {
        // Si el componente se desmontó mientras componía, descartar el blob
        if (!mountedRef.current) return
        objectUrl = URL.createObjectURL(blob)
        setBrandedUrl(objectUrl)
        setIsComposing(false)
      })
      .catch(() => {
        if (!mountedRef.current) return
        setError('No se pudo aplicar el branding a la imagen.')
        setIsComposing(false)
      })

    return () => {
      mountedRef.current = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [imageUrl])

  const handleDownload = () => {
    if (!brandedUrl) return
    const a = document.createElement('a')
    a.href = brandedUrl
    a.download = getBrandedFilename()
    a.click()
  }

  const handleDescargarOriginal = () => {
    if (!imageUrl) return
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = getBrandedFilename()
    a.click()
  }

  if (!image) return null

  /* ─── Estado: componiendo imagen ─── */
  if (isComposing) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)]"
        style={{ background: '#1A1A2E' }}
      >
        <EAMonogram variant="loading" size={80} />
        <p
          className="font-mono text-xs uppercase tracking-widest mt-6"
          style={{ color: 'rgba(212,168,84,0.7)' }}
        >
          Aplicando tu marca...
        </p>
      </div>
    )
  }

  /* ─── Estado: error al componer ─── */
  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-6 gap-5"
        style={{ background: '#1A1A2E' }}
      >
        <p
          className="font-ui text-base text-center leading-relaxed"
          style={{ color: 'rgba(245,240,235,0.7)' }}
        >
          {error}
        </p>
        <Button variant="secondary" size="md" onClick={handleDescargarOriginal}>
          <Download size={16} strokeWidth={1.5} />
          Descargar sin branding
        </Button>
        <button
          onClick={() => router.back()}
          className="font-ui text-sm py-2 transition-opacity hover:opacity-70"
          style={{ color: 'rgba(245,240,235,0.4)' }}
        >
          Volver a resultados
        </button>
      </div>
    )
  }

  /* ─── Estado: imagen branded lista ─── */
  return (
    <div
      className="flex flex-col min-h-[calc(100vh-56px)]"
      style={{ background: '#1A1A2E' }}
    >
      {/* Cabecera con botón volver */}
      <div className="flex items-center px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-opacity hover:opacity-70 active:opacity-50"
          style={{ color: 'rgba(245,240,235,0.6)' }}
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
          <span className="font-ui text-sm">Resultados</span>
        </button>
      </div>

      {/* Label editorial + título */}
      <div className="px-6 pb-4 shrink-0">
        <p
          className="font-mono text-xs uppercase tracking-widest mb-0.5"
          style={{ color: 'rgba(212,168,84,0.7)' }}
        >
          LISTA PARA COMPARTIR
        </p>
        <h1
          className="font-display font-bold text-2xl leading-tight"
          style={{ color: '#F5F0EB' }}
        >
          Tu Look con Marca
        </h1>
      </div>

      {/* Previsualización de la imagen branded */}
      <div className="flex-1 px-4 pb-4 flex flex-col gap-3 overflow-y-auto">
        <div
          className="w-full overflow-hidden"
          style={{
            borderRadius: 12,
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brandedUrl!}
            alt="Imagen con marca Estefan Acosta Barber Shop"
            className="w-full h-auto block"
          />
        </div>

        {/* Indicador de marca aplicada */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(212,168,84,0.08)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#D4A854' }} />
          <p className="font-mono text-xs" style={{ color: '#D4A854' }}>
            Estefan Acosta Barber Shop · Lugo
          </p>
        </div>
      </div>

      {/* CTA fijo al fondo */}
      <div
        className="px-6 py-4 shrink-0"
        style={{
          background: 'rgba(26,26,46,0.96)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Button variant="primary" size="lg" fullWidth onClick={handleDownload}>
          <Download size={18} strokeWidth={1.5} />
          Descargar imagen
        </Button>
      </div>
    </div>
  )
}

// Loading fallback mientras se resuelve useSearchParams
function ShareLoading() {
  return (
    <div
      className="flex items-center justify-center min-h-[calc(100vh-56px)]"
      style={{ background: '#1A1A2E' }}
    >
      <EAMonogram variant="loading" size={64} />
    </div>
  )
}

export default function SharePage() {
  return (
    <Suspense fallback={<ShareLoading />}>
      <ShareContent />
    </Suspense>
  )
}
