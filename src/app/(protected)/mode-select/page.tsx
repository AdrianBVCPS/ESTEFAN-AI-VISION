'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Sparkles, Scissors } from 'lucide-react'
import { useConsultation } from '@/lib/utils/consultation-context'
import { PhotoStrip } from '@/components/camera'

export default function ModeSelectPage() {
  const router = useRouter()
  const consultation = useConsultation()

  // Guardia: sin 3 fotos, volver a captura
  useEffect(() => {
    if (consultation.photos.length < 3) {
      router.replace('/capture')
    }
  }, [consultation.photos.length, router])

  const handleSeleccionarModo = (modo: 'a' | 'b') => {
    consultation.setMode(modo)

    if (modo === 'a') {
      router.push('/preferences')
    } else {
      router.push('/describe')
    }
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
          Elige el modo
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

      {/* Cuerpo con las 2 tarjetas de modo */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 p-6 items-center justify-center">

        {/* Modo A — La IA sugiere */}
        <button
          onClick={() => handleSeleccionarModo('a')}
          className="w-full md:flex-1 flex flex-col items-center justify-center gap-4 p-6 rounded-2xl text-left transition-transform duration-150 active:scale-[0.98] hover:scale-[0.98] cursor-pointer"
          style={{
            background: '#FAF7F4',
            minHeight: 180,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
          aria-label="Modo A: La IA sugiere peinados"
        >
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 56,
              height: 56,
              background: 'rgba(212,168,84,0.12)',
            }}
          >
            <Sparkles size={32} color="#D4A854" strokeWidth={1.5} />
          </div>

          <div className="text-center">
            <p className="font-ui font-bold text-lg text-gold mb-1">
              Modo A
            </p>
            <p className="font-display font-bold text-xl text-navy leading-snug mb-2">
              La IA sugiere
            </p>
            <p className="font-ui text-sm text-text-secondary leading-relaxed">
              Gemini analiza el rostro y propone 2 peinados personalizados
            </p>
          </div>
        </button>

        {/* Modo B — Probar un corte */}
        <button
          onClick={() => handleSeleccionarModo('b')}
          className="w-full md:flex-1 flex flex-col items-center justify-center gap-4 p-6 rounded-2xl text-left transition-transform duration-150 active:scale-[0.98] hover:scale-[0.98] cursor-pointer"
          style={{
            background: '#FAF7F4',
            minHeight: 180,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
          aria-label="Modo B: Probar un corte específico"
        >
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 56,
              height: 56,
              background: 'rgba(78,205,196,0.12)',
            }}
          >
            <Scissors size={32} color="#4ECDC4" strokeWidth={1.5} />
          </div>

          <div className="text-center">
            <p className="font-ui font-bold text-lg mb-1" style={{ color: '#4ECDC4' }}>
              Modo B
            </p>
            <p className="font-display font-bold text-xl text-navy leading-snug mb-2">
              Probar un corte
            </p>
            <p className="font-ui text-sm text-text-secondary leading-relaxed">
              Tú describes el corte y la IA lo visualiza sobre el cliente
            </p>
          </div>
        </button>

      </div>
    </div>
  )
}
