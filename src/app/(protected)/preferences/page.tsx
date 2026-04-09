'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Sparkles } from 'lucide-react'
import { useConsultation } from '@/lib/utils/consultation-context'
import { PhotoStrip } from '@/components/camera'
import { Chip, Button } from '@/components/ui'
import type { Preferences } from '@/types/consultation'

// Opciones para cada dimensión de preferencia
const OPCIONES_LONGITUD = [
  { label: 'Corto', value: 'corto' as const },
  { label: 'Medio', value: 'medio' as const },
  { label: 'Largo', value: 'largo' as const },
]

const OPCIONES_ESTILO = [
  { label: 'Clásico', value: 'clasico' as const },
  { label: 'Moderno', value: 'moderno' as const },
  { label: 'Informal', value: 'informal' as const },
  { label: 'Urbano', value: 'urbano' as const },
]

const OPCIONES_BARBA = [
  { label: 'Sin barba', value: 'sin-barba' as const },
  { label: 'Barba corta', value: 'barba-corta' as const },
  { label: 'Barba larga', value: 'barba-larga' as const },
  { label: 'Perfilado', value: 'perfilado' as const },
]

const OPCIONES_PELO = [
  { label: 'Liso', value: 'liso' as const },
  { label: 'Ondulado', value: 'ondulado' as const },
  { label: 'Rizado', value: 'rizado' as const },
  { label: 'Muy rizado', value: 'muy-rizado' as const },
]

export default function PreferencesPage() {
  const router = useRouter()
  const consultation = useConsultation()

  // Estado local de preferencias — inicializado desde el contexto si ya existen
  const [prefs, setPrefs] = useState<Preferences>(() => consultation.preferences ?? {
    length: 'corto',
    style: 'clasico',
    beard: 'sin-barba',
    hairType: 'liso',
  })

  // Guardia: sin 3 fotos, volver a captura
  useEffect(() => {
    if (consultation.photos.length < 3) {
      router.replace('/capture')
    }
  }, [consultation.photos.length, router])

  const handleAnalyze = () => {
    consultation.setPreferences(prefs)
    // La página loading-ai se implementa en Fase 4
    router.push('/loading-ai')
  }

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
          Preferencias
        </p>

        <div className="w-11" />
      </div>

      {/* Tira de fotos capturadas */}
      <div
        className="shrink-0"
        style={{ background: '#1A1A2E', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <PhotoStrip photos={consultation.photos} totalAngles={3} />
      </div>

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-6 pt-6 pb-4">
          <h1 className="font-display font-bold text-2xl text-navy leading-tight">
            ¿Cómo quieres el look?
          </h1>
          <p className="font-ui text-sm text-text-secondary mt-1">
            La IA usará estas preferencias para personalizar las sugerencias
          </p>
        </div>

        <div className="px-6 flex flex-col gap-6">

          {/* Longitud */}
          <section>
            <p className="font-ui text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">
              Longitud
            </p>
            <div className="flex flex-wrap gap-2">
              {OPCIONES_LONGITUD.map(op => (
                <Chip
                  key={op.value}
                  label={op.label}
                  selected={prefs.length === op.value}
                  onClick={() => setPrefs(p => ({ ...p, length: op.value }))}
                />
              ))}
            </div>
          </section>

          {/* Estilo */}
          <section>
            <p className="font-ui text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">
              Estilo
            </p>
            <div className="flex flex-wrap gap-2">
              {OPCIONES_ESTILO.map(op => (
                <Chip
                  key={op.value}
                  label={op.label}
                  selected={prefs.style === op.value}
                  onClick={() => setPrefs(p => ({ ...p, style: op.value }))}
                />
              ))}
            </div>
          </section>

          {/* Barba */}
          <section>
            <p className="font-ui text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">
              Barba
            </p>
            <div className="flex flex-wrap gap-2">
              {OPCIONES_BARBA.map(op => (
                <Chip
                  key={op.value}
                  label={op.label}
                  selected={prefs.beard === op.value}
                  onClick={() => setPrefs(p => ({ ...p, beard: op.value }))}
                />
              ))}
            </div>
          </section>

          {/* Tipo de pelo */}
          <section>
            <p className="font-ui text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">
              Tipo de pelo
            </p>
            <div className="flex flex-wrap gap-2">
              {OPCIONES_PELO.map(op => (
                <Chip
                  key={op.value}
                  label={op.label}
                  selected={prefs.hairType === op.value}
                  onClick={() => setPrefs(p => ({ ...p, hairType: op.value }))}
                />
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* CTA fijo en la parte inferior */}
      <div
        className="fixed bottom-0 left-0 right-0 px-6 py-4 shrink-0"
        style={{ background: '#F5F0EB', boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}
      >
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleAnalyze}
        >
          <Sparkles size={18} strokeWidth={1.5} />
          Analizar con IA
        </Button>
      </div>
    </div>
  )
}
