'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Download, QrCode, RefreshCw, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { ResultCard } from '@/components/results'
import { EAMonogram } from '@/components/shared/EAMonogram'
import { useConsultation } from '@/lib/utils/consultation-context'

export default function ResultsPage() {
  const router = useRouter()
  const consultation = useConsultation()

  // Guardia: si no hay imágenes generadas, volver al inicio
  useEffect(() => {
    if (consultation.generatedImages.length === 0) {
      router.replace('/')
    }
  }, [consultation.generatedImages.length, router])

  const handleNuevaConsulta = () => {
    consultation.reset()
    router.push('/')
  }

  const handleProbarOtroCorte = () => {
    // Mantener las fotos, limpiar solo resultados
    consultation.setGeneratedImages([])
    consultation.setError(null)
    router.push('/describe')
  }

  const handleIASugiera = () => {
    // Mantener las fotos, cambiar a flujo Modo A
    consultation.setGeneratedImages([])
    consultation.setError(null)
    router.push('/preferences')
  }

  // Mientras el guardia redirige, no renderizar nada
  if (consultation.generatedImages.length === 0) {
    return null
  }

  /* ─── MODO A: 2 tarjetas de recomendación ─── */
  if (consultation.mode === 'a' && consultation.analysisResult) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-56px)] bg-background">
        {/* Header editorial navy */}
        <div
          className="px-6 pt-6 pb-4 shrink-0"
          style={{ background: '#1A1A2E' }}
        >
          <p
            className="font-mono text-xs uppercase tracking-widest mb-1"
            style={{ color: 'rgba(212,168,84,0.7)' }}
          >
            MODO A — SUGERENCIAS IA
          </p>
          <h1 className="font-display font-bold text-3xl text-background leading-tight">
            Tus Sugerencias<br />Personalizadas
          </h1>
          <p className="font-ui text-sm mt-1" style={{ color: 'rgba(245,240,235,0.6)' }}>
            Rostro {consultation.analysisResult.faceShape} · 2 opciones para ti
          </p>
        </div>

        {/* Tarjetas — carrusel horizontal en móvil, columna en tablet+ */}
        <div className="flex-1 overflow-y-auto pb-28 pt-4">

          {/* Móvil: scroll horizontal snapping */}
          <div className="flex gap-4 px-4 overflow-x-auto snap-x snap-mandatory md:hidden pb-2">
            {consultation.generatedImages.map((img, i) => (
              <div key={i} className="shrink-0 w-[85vw] snap-center">
                <ResultCard
                  image={img}
                  recommendation={consultation.analysisResult!.recommendations[i]}
                  index={i}
                  onDownload={() => router.push(`/share?index=${i}`)}
                  onShare={() => router.push(`/share?index=${i}`)}
                />
              </div>
            ))}
          </div>

          {/* Tablet+: columna centrada */}
          <div className="hidden md:flex flex-col gap-4 px-4 max-w-lg mx-auto">
            {consultation.generatedImages.map((img, i) => (
              <ResultCard
                key={i}
                image={img}
                recommendation={consultation.analysisResult!.recommendations[i]}
                index={i}
                onDownload={() => router.push(`/share?index=${i}`)}
                onShare={() => router.push(`/share?index=${i}`)}
              />
            ))}
          </div>
        </div>

        {/* CTA fijo al fondo */}
        <div
          className="fixed bottom-0 left-0 right-0 px-6 py-4"
          style={{ background: '#1A1A2E' }}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleNuevaConsulta}
          >
            <Home size={18} strokeWidth={1.5} />
            Nueva consulta
          </Button>
        </div>
      </div>
    )
  }

  /* ─── MODO B: imagen a pantalla completa con overlay ─── */
  const imagen = consultation.generatedImages[0]

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] relative bg-navy overflow-hidden">
      {/* Imagen de fondo a pantalla completa */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagen.url}
          alt="Tu visión digital generada por IA"
          className="w-full h-full object-cover"
        />
        {/* Gradiente navy para legibilidad del contenido inferior */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(26,26,46,0.3) 0%, rgba(26,26,46,0.85) 60%, rgba(26,26,46,0.98) 100%)',
          }}
        />
      </div>

      {/* Badge AI RENDER ACTIVE — esquina superior derecha */}
      <div className="absolute top-4 right-4 z-10">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5"
          style={{
            background: 'rgba(78,205,196,0.2)',
            backdropFilter: 'blur(12px)',
            borderRadius: 8,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span className="font-mono text-xs text-teal font-bold tracking-wider">
            AI RENDER ACTIVE
          </span>
        </div>
      </div>

      {/* Monograma EA watermark — esquina superior izquierda */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <EAMonogram variant="watermark" size={72} />
      </div>

      {/* Contenido inferior superpuesto */}
      <div className="relative z-10 flex flex-col justify-end min-h-[calc(100vh-56px)] px-6 pb-6 gap-4">
        {/* Labels editoriales + título */}
        <div>
          <p
            className="font-mono text-xs uppercase tracking-widest mb-2"
            style={{ color: 'rgba(212,168,84,0.7)' }}
          >
            MODO B / AI SIMULATION
          </p>
          <h1 className="font-display font-bold text-3xl text-background leading-tight">
            Tu Visión Digital
          </h1>
          {consultation.description && (
            <div className="flex items-center gap-2 mt-2">
              <Wand2 size={14} className="text-teal shrink-0" strokeWidth={1.5} />
              <p className="font-ui text-sm" style={{ color: 'rgba(245,240,235,0.7)' }}>
                {consultation.description.length > 60
                  ? consultation.description.slice(0, 60) + '...'
                  : consultation.description}
              </p>
            </div>
          )}
        </div>

        {/* Botón principal — Probar otro corte (teal) */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleProbarOtroCorte}
          style={{ background: '#4ECDC4', color: '#1A1A2E' }}
        >
          <RefreshCw size={18} strokeWidth={1.5} />
          Probar otro corte
        </Button>

        {/* Botones secundarios */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => router.push('/share?index=0')}
          >
            <Download size={16} strokeWidth={1.5} />
            Descargar
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => router.push('/share?index=0')}
            style={{ minWidth: 48 }}
          >
            <QrCode size={16} strokeWidth={1.5} />
          </Button>
          <Button
            variant="tertiary"
            size="md"
            fullWidth
            onClick={handleIASugiera}
            style={{ color: '#D4A854', background: 'rgba(212,168,84,0.12)' }}
          >
            ✦ IA Sugiera
          </Button>
        </div>

        {/* Nueva consulta — acción discreta de escape */}
        <button
          onClick={handleNuevaConsulta}
          className="font-ui text-sm text-center py-2 transition-opacity hover:opacity-80 active:opacity-60"
          style={{ color: 'rgba(245,240,235,0.4)' }}
        >
          NUEVA CONSULTA
        </button>
      </div>
    </div>
  )
}
