'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useConsultation } from '@/lib/utils/consultation-context'
import { compressImage } from '@/lib/utils/compress-image'
import { CameraCapture, PhotoPreview, PhotoStrip } from '@/components/camera'
import { ProgressBar } from '@/components/layout'
import type { PhotoAngle, Photo } from '@/types/consultation'

// Orden canónico de captura
const ANGLES: PhotoAngle[] = ['frontal', 'lateral', 'trasera']

// Etiquetas del header por ángulo
const ANGLE_LABELS: Record<PhotoAngle, string> = {
  frontal: 'Frontal',
  lateral: 'Lateral',
  trasera: 'Trasera',
}

export default function CapturePage() {
  const router = useRouter()
  const consultation = useConsultation()

  const [angleIndex, setAngleIndex] = useState(0)
  const [phase, setPhase] = useState<'camera' | 'preview'>('camera')
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)

  // Revocar URL pendiente si el componente se desmonta sin confirmar
  useEffect(() => {
    return () => {
      if (pendingUrl) {
        URL.revokeObjectURL(pendingUrl)
      }
    }
    // Solo al desmontar — dependencia vacía intencional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Foto capturada por la cámara — mostrar preview
  const handleCapture = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob)
    setPendingBlob(blob)
    setPendingUrl(url)
    setPhase('preview')
  }, [])

  // Volver a la cámara y descartar la foto pendiente
  const handleRetake = useCallback(() => {
    if (pendingUrl) {
      URL.revokeObjectURL(pendingUrl)
    }
    setPendingBlob(null)
    setPendingUrl(null)
    setPhase('camera')
  }, [pendingUrl])

  // Confirmar foto: comprimir, añadir al contexto y avanzar
  const handleConfirm = useCallback(async () => {
    if (!pendingBlob || !pendingUrl) return

    setCompressing(true)

    try {
      const compressed = await compressImage(pendingBlob)
      const compressedUrl = URL.createObjectURL(compressed)

      const photo: Photo = {
        blob: compressed,
        url: compressedUrl,
        angle: ANGLES[angleIndex],
        capturedAt: new Date(),
      }

      consultation.addPhoto(photo)

      // Revocar URL del preview de alta resolución
      URL.revokeObjectURL(pendingUrl)
      setPendingBlob(null)
      setPendingUrl(null)

      if (angleIndex < ANGLES.length - 1) {
        // Avanzar al siguiente ángulo
        setAngleIndex(prev => prev + 1)
        setPhase('camera')
      } else {
        // Las 3 fotos completadas — ir a selección de modo
        router.push('/mode-select')
      }
    } finally {
      setCompressing(false)
    }
  }, [pendingBlob, pendingUrl, angleIndex, consultation, router])

  // Botón de retroceso en el header
  const handleBack = useCallback(() => {
    if (phase === 'preview') {
      // En preview: descartar foto y volver a la cámara
      handleRetake()
      return
    }

    if (angleIndex > 0) {
      // En cámara no-primera foto: retroceder al ángulo anterior
      setAngleIndex(prev => prev - 1)
    } else {
      // Primera foto: salir del flujo de captura
      router.back()
    }
  }, [phase, angleIndex, handleRetake, router])

  const currentAngle = ANGLES[angleIndex]
  const fotoLabel = `Foto ${angleIndex + 1}/${ANGLES.length} · ${ANGLE_LABELS[currentAngle]}`

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]" style={{ background: '#000' }}>
      {/* Header de la captura */}
      <div
        className="flex items-center justify-between h-14 px-2 shrink-0"
        style={{ background: '#1A1A2E' }}
      >
        <button
          onClick={handleBack}
          aria-label="Volver"
          className="flex items-center justify-center w-11 h-11 rounded-lg text-background transition-opacity hover:opacity-70 active:opacity-50"
        >
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>

        <p className="font-ui text-sm font-bold text-background">
          {fotoLabel}
        </p>

        {/* Espaciador derecho para centrar el título */}
        <div className="w-11" />
      </div>

      {/* Barra de progreso de las 3 fotos */}
      <div className="px-4 py-2 shrink-0" style={{ background: '#1A1A2E' }}>
        <ProgressBar total={3} current={consultation.photos.length} />
      </div>

      {/* Área principal — cámara o preview */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {phase === 'camera' ? (
          <CameraCapture
            key={currentAngle} // Fuerza re-mount al cambiar ángulo para reiniciar stream
            angle={currentAngle}
            onCapture={handleCapture}
          />
        ) : (
          pendingUrl && (
            <PhotoPreview
              url={pendingUrl}
              angle={currentAngle}
              onRetake={handleRetake}
              onConfirm={handleConfirm}
              loading={compressing}
            />
          )
        )}
      </div>

      {/* Tira de fotos fija sobre el botón de captura */}
      <div
        className="shrink-0"
        style={{ background: 'rgba(0,0,0,0.75)' }}
      >
        <PhotoStrip
          photos={consultation.photos}
          currentAngle={currentAngle}
          totalAngles={3}
        />
      </div>
    </div>
  )
}
