'use client'

import { Suspense, useEffect, useRef, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Download, ArrowLeft, QrCode, X } from 'lucide-react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui'
import { EAMonogram } from '@/components/shared/EAMonogram'
import { useConsultation } from '@/lib/utils/consultation-context'
import { composeBrandedImage, getBrandedFilename } from '@/lib/canvas/compositor'

function ShareContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const consultation = useConsultation()

  const [brandedUrl, setBrandedUrl] = useState<string | null>(null)
  const [brandedBlob, setBrandedBlob] = useState<Blob | null>(null)
  const [isComposing, setIsComposing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // QR
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [qrError, setQrError] = useState<string | null>(null)
  const [showQrModal, setShowQrModal] = useState(false)
  const shareIdRef = useRef<string | null>(null)

  const hasStarted = useRef(false)
  const mountedRef = useRef(true)

  const rawIndex = Number(searchParams.get('index') ?? '0')
  const index = Number.isNaN(rawIndex) ? 0 : rawIndex
  const image = consultation.generatedImages[index]
  const imageUrl = image?.url

  useEffect(() => {
    if (!imageUrl) {
      router.replace('/')
    }
  }, [imageUrl, router])

  useEffect(() => {
    mountedRef.current = true

    if (!imageUrl || hasStarted.current) return
    hasStarted.current = true

    let objectUrl: string | null = null

    composeBrandedImage({ imageUrl })
      .then((blob) => {
        if (!mountedRef.current) return
        objectUrl = URL.createObjectURL(blob)
        setBrandedUrl(objectUrl)
        setBrandedBlob(blob)
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

  const handleGenerarQR = useCallback(async () => {
    if (!brandedBlob) return
    if (shareIdRef.current) {
      setShowQrModal(true)
      return
    }

    setQrLoading(true)
    setQrError(null)

    try {
      const formData = new FormData()
      formData.append('image', brandedBlob, 'look.jpg')

      const res = await fetch('/api/share', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Error al compartir')
      }

      const { id } = await res.json()
      shareIdRef.current = id

      const appUrl = window.location.origin
      const lookUrl = `${appUrl}/look?id=${id}`

      const dataUrl = await QRCode.toDataURL(lookUrl, {
        width: 320,
        margin: 2,
        color: { dark: '#1A1A2E', light: '#F5F0EB' },
        errorCorrectionLevel: 'M',
      })

      if (!mountedRef.current) return
      setQrDataUrl(dataUrl)
      setShowQrModal(true)
    } catch (err) {
      if (!mountedRef.current) return
      setQrError(err instanceof Error ? err.message : 'Error al generar QR')
    } finally {
      setQrLoading(false)
    }
  }, [brandedBlob])

  if (!image) return null

  /* Estado: componiendo imagen */
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

  /* Estado: error al componer */
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

  /* Estado: imagen branded lista */
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

        {/* Error QR */}
        {qrError && (
          <p className="font-ui text-xs text-center" style={{ color: '#EF4444' }}>
            {qrError}
          </p>
        )}
      </div>

      {/* CTAs fijos al fondo */}
      <div
        className="px-6 py-4 shrink-0 flex flex-col gap-3"
        style={{
          background: 'rgba(26,26,46,0.96)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Button variant="primary" size="lg" fullWidth onClick={handleDownload}>
          <Download size={18} strokeWidth={1.5} />
          Descargar imagen
        </Button>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          loading={qrLoading}
          onClick={handleGenerarQR}
        >
          <QrCode size={18} strokeWidth={1.5} />
          {qrLoading ? 'Generando QR...' : 'Mostrar QR al cliente'}
        </Button>
      </div>

      {/* Modal QR a pantalla completa */}
      {showQrModal && qrDataUrl && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
          style={{ background: 'rgba(26,26,46,0.97)' }}
        >
          <button
            onClick={() => setShowQrModal(false)}
            className="absolute top-4 right-4 p-2 rounded-full transition-opacity hover:opacity-70"
            style={{ background: 'rgba(245,240,235,0.1)', color: '#F5F0EB' }}
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          <p
            className="font-mono text-xs uppercase tracking-widest mb-6"
            style={{ color: 'rgba(212,168,84,0.7)' }}
          >
            ESCANEA PARA VER TU LOOK
          </p>

          <div
            className="rounded-2xl p-6"
            style={{ background: '#F5F0EB' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="Código QR para ver tu look"
              className="block"
              style={{ width: 256, height: 256 }}
            />
          </div>

          <p
            className="font-ui text-sm text-center mt-6 max-w-xs"
            style={{ color: 'rgba(245,240,235,0.6)' }}
          >
            El cliente escanea este QR con su móvil para ver el resultado
          </p>

          <p
            className="font-mono text-xs mt-4"
            style={{ color: 'rgba(245,240,235,0.3)' }}
          >
            Expira en unos minutos
          </p>
        </div>
      )}
    </div>
  )
}

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
