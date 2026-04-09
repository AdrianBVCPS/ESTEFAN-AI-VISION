'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useConsultation } from '@/lib/utils/consultation-context'
import { PhotoStrip } from '@/components/camera'
import { Chip, Button } from '@/components/ui'

// Longitud máxima permitida en el textarea
const MAX_CHARS = 500

// Sugerencias rápidas para que el barbero no empiece desde cero
const SUGERENCIAS = [
  'Fade bajo con textura en la parte superior',
  'Corte clásico con raya al lado',
  'Undercut con volumen arriba',
  'Degradado con barba perfilada',
  'Crop con flequillo texturizado',
]

export default function DescribePage() {
  const router = useRouter()
  const consultation = useConsultation()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [text, setText] = useState(consultation.description ?? '')

  // Guardia: sin 3 fotos o modo incorrecto, redirigir
  useEffect(() => {
    if (consultation.photos.length < 3) {
      router.replace('/capture')
    } else if (consultation.mode !== 'b') {
      router.replace('/mode-select')
    }
  }, [consultation.photos.length, consultation.mode, router])

  // Añadir sugerencia al texto existente
  const handleSugerencia = (sugerencia: string) => {
    setText(prev => {
      const nuevo = prev.trim() ? `${prev.trim()}, ${sugerencia}` : sugerencia
      // Respetar el límite de caracteres
      return nuevo.slice(0, MAX_CHARS)
    })
    // Enfocar el textarea para que el usuario vea el resultado
    textareaRef.current?.focus()
  }

  const handleGenerate = () => {
    const trimmed = text.trim()
    if (trimmed.length < 5) return

    consultation.setDescription(trimmed)
    // La página loading-ai se implementa en Fase 4
    router.push('/loading-ai')
  }

  const textTrimmed = text.trim()
  const ctaDisabled = textTrimmed.length < 5
  const charsRestantes = MAX_CHARS - text.length

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] bg-background">
      {/* Header */}
      <div
        className="flex items-center justify-between h-14 px-2 shrink-0"
        style={{ background: '#1A1A2E' }}
      >
        <button
          onClick={() => router.back()}
          aria-label="Volver"
          className="flex items-center justify-center w-11 h-11 rounded-lg text-background transition-opacity hover:opacity-70 active:opacity-50"
        >
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>

        <p className="font-ui text-sm font-bold text-background">
          Describir el corte
        </p>

        <div className="w-11" />
      </div>

      {/* Tira de fotos capturadas */}
      <div
        className="shrink-0"
        style={{ background: '#1A1A2E', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }}
      >
        <PhotoStrip photos={consultation.photos} totalAngles={3} />
      </div>

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-6 pt-6 pb-4">
          <h1 className="font-display font-bold text-2xl text-navy leading-tight">
            Describe el corte
          </h1>
          <p className="font-ui text-sm text-text-secondary mt-1">
            Explica qué peinado quieres probar en el cliente
          </p>
        </div>

        <div className="px-6 flex flex-col gap-5">
          {/* Área de texto principal */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Ej: Fade bajo en los laterales, textura en la parte superior con un poco de volumen..."
              rows={5}
              className="w-full bg-surface rounded-xl p-4 font-ui text-base text-text-primary resize-none outline-none transition-colors duration-150 placeholder:text-text-secondary/50"
              style={{
                // Borde inferior dorado al foco — usando box-shadow para no violate la Regla No-Line
                boxShadow: 'none',
              }}
              onFocus={e => {
                e.currentTarget.style.boxShadow = '0 2px 0 0 #D4A854'
              }}
              onBlur={e => {
                e.currentTarget.style.boxShadow = 'none'
              }}
              aria-label="Descripción del corte"
              aria-describedby="contador-chars"
              maxLength={MAX_CHARS}
            />

            {/* Contador de caracteres */}
            <p
              id="contador-chars"
              className="text-right font-mono text-xs mt-1"
              style={{ color: charsRestantes < 50 ? '#E74C3C' : '#6B7280' }}
            >
              {text.length}/{MAX_CHARS}
            </p>
          </div>

          {/* Chips de sugerencias */}
          <section>
            <p className="font-ui text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">
              Ejemplos
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGERENCIAS.map(sugerencia => (
                <button
                  key={sugerencia}
                  onClick={() => handleSugerencia(sugerencia)}
                  className="inline-flex items-center px-3 py-2 rounded-[22px] font-ui text-sm text-text-secondary transition-colors duration-150 active:scale-[0.97]"
                  style={{
                    background: '#FAF7F4',
                    minHeight: 44,
                    // Accent teal para Modo B
                    border: '1.5px solid rgba(78,205,196,0.25)',
                  }}
                  aria-label={`Añadir sugerencia: ${sugerencia}`}
                >
                  {sugerencia}
                </button>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* CTA fijo en la parte inferior — teal para Modo B */}
      <div
        className="fixed bottom-0 left-0 right-0 px-6 py-4 shrink-0"
        style={{ background: '#F5F0EB', boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}
      >
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={ctaDisabled}
          onClick={handleGenerate}
          style={!ctaDisabled ? { background: '#4ECDC4', color: '#1A1A2E' } : undefined}
        >
          Generar preview
        </Button>
      </div>
    </div>
  )
}
