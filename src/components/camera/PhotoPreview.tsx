'use client'

import { useEffect, useState } from 'react'
import { RotateCcw, Check } from 'lucide-react'
import { Button } from '@/components/ui'
import type { PhotoAngle } from '@/types/consultation'

interface PhotoPreviewProps {
  url: string
  angle: PhotoAngle
  onRetake: () => void
  onConfirm: () => void
  loading?: boolean
}

// Etiquetas legibles por ángulo
const ANGLE_LABELS: Record<PhotoAngle, string> = {
  frontal: 'Foto frontal',
  lateral: 'Foto lateral',
  trasera: 'Foto trasera',
}

function PhotoPreview({ url, angle, onRetake, onConfirm, loading = false }: PhotoPreviewProps) {
  // Controla el fade-in: visible tras montar
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Pequeño delay para que la transición se dispare después del primer render
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
    return () => cancelAnimationFrame(timer)
  }, [])

  return (
    <div
      className="relative flex-1 overflow-hidden transition-opacity duration-200"
      style={{
        background: '#000',
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Imagen de previsualización — cubre todo el área */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={`Previsualización — ${ANGLE_LABELS[angle]}`}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Panel inferior con glass morphism */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-5 flex flex-col gap-3"
        style={{
          background: 'rgba(26,26,46,0.82)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Label del ángulo */}
        <p className="font-ui text-xs font-bold uppercase tracking-widest text-gold">
          {ANGLE_LABELS[angle]}
        </p>

        {/* Acciones: Repetir y Confirmar */}
        <div className="flex gap-3">
          <Button
            variant="tertiary"
            size="lg"
            onClick={onRetake}
            disabled={loading}
            className="flex-1 text-background border border-white/20"
            style={{ color: '#F5F0EB' } as React.CSSProperties}
          >
            <RotateCcw size={18} strokeWidth={1.5} />
            Repetir
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={onConfirm}
            loading={loading}
            className="flex-1"
          >
            {!loading && <Check size={18} strokeWidth={1.5} />}
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  )
}

export { PhotoPreview }
export type { PhotoPreviewProps }
