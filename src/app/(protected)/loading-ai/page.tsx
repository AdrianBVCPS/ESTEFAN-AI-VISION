'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { EAMonogram } from '@/components/shared/EAMonogram'
import { Button } from '@/components/ui'
import { useConsultation } from '@/lib/utils/consultation-context'
import { analyzeFace, generateImage } from '@/lib/gemini/client'
import { createClient } from '@/lib/supabase/client'

// Registra un uso de IA en background — fire-and-forget, nunca bloquea el flujo.
// Workaround de cast necesario: @supabase/ssr@0.10 no resuelve el genérico
// de Insert para tablas añadidas post-generación de tipos.
function registrarUso(mode: 'mode_a' | 'mode_b') {
  const supabase = createClient()
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (!user) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(supabase as any).from('usage_logs').insert({ user_id: user.id, mode }).then(() => {})
  })
}

const TEXTOS_MODO_A = [
  'Analizando la forma de tu rostro...',
  'Estudiando tus rasgos faciales...',
  'Calculando los peinados ideales...',
  'Generando el primer look...',
  'Generando el segundo look...',
  'Aplicando los últimos detalles...',
  'Casi listo...',
]

const TEXTOS_MODO_B = [
  'Interpretando tu descripción...',
  'Visualizando el corte...',
  'Renderizando tu look personalizado...',
  'Aplicando los últimos detalles...',
  'Casi listo...',
]

export default function LoadingAIPage() {
  const router = useRouter()
  const consultation = useConsultation()
  const [textoIndex, setTextoIndex] = useState(0)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const hasStarted = useRef(false)

  const textos = consultation.mode === 'b' ? TEXTOS_MODO_B : TEXTOS_MODO_A

  // Rotar textos cada 3 segundos
  useEffect(() => {
    if (errorMsg) return
    const interval = setInterval(() => {
      setTextoIndex(i => (i + 1) % textos.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [textos.length, errorMsg])

  const ejecutarFlujoIA = useCallback(async () => {
    setErrorMsg(null)
    consultation.setError(null)

    try {
      if (consultation.mode === 'a') {
        // Modo A: analizar rostro + generar 2 imágenes en paralelo
        if (!consultation.preferences) throw new Error('Faltan preferencias')

        const analysis = await analyzeFace(consultation.photos, consultation.preferences)
        consultation.setAnalysisResult(analysis)

        const [img1, img2] = await Promise.all([
          generateImage(
            consultation.photos,
            analysis.recommendations[0].visualPrompt,
            analysis.recommendations[0].name,
            'preformed'
          ),
          generateImage(
            consultation.photos,
            analysis.recommendations[1].visualPrompt,
            analysis.recommendations[1].name,
            'preformed'
          ),
        ])

        consultation.setGeneratedImages([img1, img2])

        // Registrar uso en background — fire-and-forget, no bloquea el flujo
        // Cast necesario: @supabase/ssr@0.10 no resuelve el genérico de tablas nuevas
        registrarUso('mode_a')

      } else if (consultation.mode === 'b') {
        // Modo B: generar una sola imagen basada en la descripción del barbero
        if (!consultation.description) throw new Error('Falta la descripción del corte')

        const img = await generateImage(
          consultation.photos,
          consultation.description,
          'Tu visión digital'
        )

        consultation.setGeneratedImages([img])

        // Registrar uso en background
        registrarUso('mode_b')

      } else {
        router.replace('/mode-select')
        return
      }

      router.push('/results')

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setErrorMsg(msg)
      consultation.setError(msg)
    }
  }, [consultation, router])

  // Arrancar al montar — solo una vez
  useEffect(() => {
    if (hasStarted.current) return
    if (consultation.photos.length < 3) {
      router.replace('/capture')
      return
    }
    hasStarted.current = true
    ejecutarFlujoIA()
  }, [consultation.photos.length, ejecutarFlujoIA, router])

  /* ─── PANTALLA DE ERROR ─── */
  if (errorMsg) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center px-6 gap-6"
        style={{ background: '#1A1A2E' }}
      >
        <EAMonogram variant="loading" size={80} />

        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle size={32} className="text-error" strokeWidth={1.5} />
          <p className="font-ui font-bold text-background text-lg">
            Algo salió mal
          </p>
          <p className="font-ui text-sm max-w-xs leading-relaxed" style={{ color: '#6B7280' }}>
            {errorMsg}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => {
              hasStarted.current = false
              ejecutarFlujoIA()
            }}
          >
            <RefreshCw size={18} strokeWidth={1.5} />
            Reintentar
          </Button>
          <Button
            variant="tertiary"
            size="md"
            fullWidth
            onClick={() => router.back()}
            style={{ color: '#6B7280' }}
          >
            Volver
          </Button>
        </div>
      </div>
    )
  }

  /* ─── PANTALLA DE LOADING ─── */
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center px-6"
      style={{ background: '#1A1A2E' }}
      role="status"
      aria-live="polite"
      aria-label="Procesando con inteligencia artificial"
    >
      {/* Monograma EA con shimmer dorado */}
      <EAMonogram variant="loading" size={120} />

      {/* Texto rotativo con animación fade */}
      <div className="mt-8 h-6 overflow-hidden flex items-center justify-center w-full max-w-xs">
        <p
          key={textoIndex}
          className="font-ui text-sm text-center"
          style={{ color: '#F5F0EB', animation: 'fadeInText 0.4s ease' }}
        >
          {textos[textoIndex]}
        </p>
      </div>

      {/* Barra de progreso indeterminada dorada */}
      <div
        className="mt-6 w-48 overflow-hidden"
        style={{ height: 2, background: 'rgba(245,240,235,0.12)', borderRadius: 999 }}
      >
        <div
          className="h-full"
          style={{
            background: '#D4A854',
            borderRadius: 999,
            width: '40%',
            animation: 'progressSlide 1.8s ease-in-out infinite',
          }}
        />
      </div>

      {/* Etiqueta de modo — discreta en la parte inferior */}
      <p className="mt-8 font-mono text-xs" style={{ color: 'rgba(245,240,235,0.3)' }}>
        {consultation.mode === 'a' ? 'MODO A — IA SUGIERE' : 'MODO B — VISIÓN DIGITAL'}
      </p>
    </div>
  )
}
