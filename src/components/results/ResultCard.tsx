'use client'

import { Download, QrCode } from 'lucide-react'
import { EAMonogram } from '@/components/shared/EAMonogram'
import { Button } from '@/components/ui'
import type { GeneratedImage } from '@/types/consultation'
import type { Recommendation } from '@/lib/gemini/types'

interface ResultCardProps {
  image: GeneratedImage
  recommendation: Recommendation
  index: number
  onDownload: (image: GeneratedImage, title: string) => void
  onShare?: (image: GeneratedImage) => void
  onRegenerate?: () => void
  isRegenerating?: boolean
}

export function ResultCard({
  image,
  recommendation,
  index,
  onDownload,
  onShare,
  onRegenerate,
  isRegenerating,
}: ResultCardProps) {
  return (
    <article
      className="relative overflow-hidden flex flex-col"
      style={{
        background: '#FAF7F4',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(29,27,25,0.08)',
      }}
    >
      {/* Monograma EA watermark */}
      <div className="absolute top-2 right-2 z-10 pointer-events-none">
        <EAMonogram variant="watermark" size={60} />
      </div>

      {/* Imagen del peinado */}
      <div className="relative w-full" style={{ aspectRatio: '3/2', background: '#E8E3DC' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={`Peinado ${index + 1}: ${recommendation.name}`}
          className="w-full h-full object-cover"
          style={{ borderRadius: '16px 16px 0 0' }}
        />

        {/* Badge "IA RENDER" */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1"
          style={{
            background: 'rgba(26,26,46,0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: 8,
          }}
        >
          <span className="font-mono text-xs text-gold">✦ IA RENDER</span>
        </div>
      </div>

      {/* Contenido textual */}
      <div className="flex-1 flex flex-col p-4 gap-3">
        {/* Header editorial: label + título */}
        <div>
          <p className="font-ui text-xs font-bold uppercase tracking-widest text-text-secondary mb-1">
            OPCIÓN {index + 1}
          </p>
          <h2 className="font-display font-bold text-xl text-navy leading-tight">
            {recommendation.name}
          </h2>
        </div>

        {/* Descripción */}
        <p className="font-ui text-sm text-text-primary leading-relaxed">
          {recommendation.description}
        </p>

        {/* Por qué le queda bien — destacado */}
        <div
          className="px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(212,168,84,0.08)' }}
        >
          <p className="font-ui text-xs font-bold text-gold uppercase tracking-wider mb-1">
            Por qué te queda
          </p>
          <p className="font-ui text-sm text-text-primary leading-relaxed">
            {recommendation.suitability}
          </p>
        </div>
      </div>

      {/* Acciones */}
      <div className="px-4 pb-4 flex gap-2">
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => onDownload(image, recommendation.name)}
        >
          <Download size={16} strokeWidth={1.5} />
          Descargar
        </Button>
        {onShare && (
          <Button
            variant="secondary"
            size="md"
            onClick={() => onShare(image)}
            className="shrink-0"
            style={{ minWidth: 44 }}
          >
            <QrCode size={16} strokeWidth={1.5} />
          </Button>
        )}
        {onRegenerate && (
          <Button
            variant="secondary"
            size="md"
            loading={isRegenerating}
            onClick={onRegenerate}
            className="shrink-0"
          >
            ↻
          </Button>
        )}
      </div>
    </article>
  )
}
