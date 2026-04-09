'use client'

import type { Photo, PhotoAngle } from '@/types/consultation'

interface PhotoStripProps {
  photos: Photo[]
  currentAngle?: PhotoAngle
  totalAngles?: number
}

// Abreviaturas visuales para cada ángulo
const ANGLE_ABBR: Record<PhotoAngle, string> = {
  frontal: 'F',
  lateral: 'L',
  trasera: 'T',
}

// Orden canónico de los ángulos en la tira
const ANGLES_ORDER: PhotoAngle[] = ['frontal', 'lateral', 'trasera']

function PhotoStrip({ photos, currentAngle, totalAngles = 3 }: PhotoStripProps) {
  // Construye el mapa de ángulo → foto capturada
  const fotosPorAngulo = new Map(photos.map(p => [p.angle, p]))

  const slots = ANGLES_ORDER.slice(0, totalAngles)

  return (
    <div
      className="flex justify-center items-center gap-2 px-4 py-3"
      role="list"
      aria-label="Fotos capturadas"
    >
      {slots.map((angle) => {
        const foto = fotosPorAngulo.get(angle)
        const esActual = angle === currentAngle
        const etiqueta = ANGLE_ABBR[angle]

        return (
          <div
            key={angle}
            role="listitem"
            aria-label={`Foto ${angle}${foto ? ' — capturada' : esActual ? ' — en curso' : ' — pendiente'}`}
            className="relative"
            style={{
              width: 56,
              height: 56,
              // Anillo dorado en el slot activo
              borderRadius: 10,
              outline: esActual ? '2px solid #D4A854' : '2px solid transparent',
              outlineOffset: 2,
            }}
          >
            {foto ? (
              // Slot con foto capturada
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={foto.url}
                  alt={`Foto ${angle}`}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: 8 }}
                />
                {/* Etiqueta de ángulo en esquina inferior derecha */}
                <span
                  className="absolute bottom-1 right-1 font-mono font-bold leading-none"
                  style={{
                    fontSize: 10,
                    color: '#D4A854',
                    textShadow: '0 0 4px rgba(0,0,0,0.8)',
                  }}
                  aria-hidden="true"
                >
                  {etiqueta}
                </span>
              </>
            ) : esActual ? (
              // Slot actual vacío — borde punteado dorado con pulso
              <div
                className="w-full h-full flex items-center justify-center animate-pulse"
                style={{
                  borderRadius: 8,
                  border: '2px dashed rgba(212,168,84,0.6)',
                  background: 'rgba(212,168,84,0.06)',
                }}
                aria-hidden="true"
              >
                <span
                  className="font-mono font-bold"
                  style={{ fontSize: 14, color: 'rgba(212,168,84,0.7)' }}
                >
                  {etiqueta}
                </span>
              </div>
            ) : (
              // Slot futuro vacío — gris tenue
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  borderRadius: 8,
                  border: '2px dashed rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.04)',
                }}
                aria-hidden="true"
              >
                <span
                  className="font-mono font-bold"
                  style={{ fontSize: 14, color: 'rgba(255,255,255,0.2)' }}
                >
                  {etiqueta}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { PhotoStrip }
export type { PhotoStripProps }
