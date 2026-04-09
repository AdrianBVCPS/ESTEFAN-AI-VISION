'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Camera, RefreshCw } from 'lucide-react'
import { CaptureGuide } from './CaptureGuide'
import type { PhotoAngle } from '@/types/consultation'

interface CameraCaptureProps {
  angle: PhotoAngle
  onCapture: (blob: Blob) => void
}

type CameraState = 'loading' | 'ready' | 'error'

function CameraCapture({ angle, onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [estado, setEstado] = useState<CameraState>('loading')
  const [capturando, setCapturando] = useState(false)

  // Inicia la cámara — primero intenta trasera, luego frontal
  const iniciarCamara = useCallback(async () => {
    setEstado('loading')

    // Detener stream anterior si existe
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }

    let stream: MediaStream | null = null

    try {
      // Intentar cámara trasera primero (ideal para el barbero fotografiando al cliente)
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })
    } catch {
      // Si falla con environment, intentar cualquier cámara disponible
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
      } catch {
        setEstado('error')
        return
      }
    }

    streamRef.current = stream

    if (videoRef.current) {
      videoRef.current.srcObject = stream

      // Esperar a que el video tenga frames antes de habilitar la captura
      videoRef.current.oncanplay = () => {
        setEstado('ready')
      }

      videoRef.current.play().catch(() => {
        // play() puede rechazarse si el componente se desmontó mientras esperaba
      })
    } else {
      setEstado('ready')
    }
  }, [])

  // Montar y desmontar
  useEffect(() => {
    iniciarCamara()

    return () => {
      // Cleanup: detener todos los tracks al desmontar para liberar la cámara
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }
    }
  }, [iniciarCamara])

  // Captura un frame del video como JPEG de alta calidad
  const handleCapturar = useCallback(() => {
    if (!videoRef.current || capturando) return

    const video = videoRef.current
    if (video.readyState < 2) return // HAVE_CURRENT_DATA mínimo

    setCapturando(true)

    // Canvas offscreen con las dimensiones reales del video
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setCapturando(false)
      return
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Calidad alta aquí — la compresión final la hace compressImage
    canvas.toBlob(
      (blob) => {
        setCapturando(false)
        if (blob) {
          onCapture(blob)
        }
      },
      'image/jpeg',
      0.92
    )
  }, [capturando, onCapture])

  // Estado de error: permisos denegados o cámara no disponible
  if (estado === 'error') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8"
        style={{ background: '#1A1A2E' }}>
        <Camera size={48} color="#D4A854" strokeWidth={1.5} />
        <div className="text-center">
          <p className="font-ui font-bold text-lg text-background mb-2">
            Se necesita acceso a la cámara
          </p>
          <p className="font-ui text-sm text-text-secondary leading-relaxed">
            Permite el acceso a la cámara en la configuración de tu navegador y vuelve a intentarlo.
          </p>
        </div>
        <button
          onClick={iniciarCamara}
          className="flex items-center gap-2 font-ui font-bold text-navy bg-gold rounded-lg px-6 h-14 transition-all duration-150 active:scale-[0.97]"
        >
          <RefreshCw size={18} strokeWidth={1.5} />
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="relative flex-1 overflow-hidden" style={{ background: '#000' }}>
      {/* Video principal — ocupa todo el espacio disponible */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
        aria-label={`Vista de cámara — ángulo ${angle}`}
      />

      {/* Overlay guía de posicionamiento */}
      {estado === 'ready' && <CaptureGuide angle={angle} />}

      {/* Indicador de carga sobre el visor */}
      {estado === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        </div>
      )}

      {/* Botón de captura — círculo dorado centrado en la parte inferior */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <button
          onClick={handleCapturar}
          disabled={estado !== 'ready' || capturando}
          aria-label="Capturar foto"
          className="flex items-center justify-center rounded-full transition-all duration-150 active:scale-[0.95] disabled:opacity-50"
          style={{
            width: 80,
            height: 80,
            background: '#D4A854',
            boxShadow: '0 4px 20px rgba(212,168,84,0.5)',
          }}
        >
          {capturando ? (
            <div className="w-6 h-6 rounded-full border-2 border-navy border-t-transparent animate-spin" />
          ) : (
            <Camera size={32} color="#1A1A2E" strokeWidth={1.5} />
          )}
        </button>
      </div>
    </div>
  )
}

export { CameraCapture }
export type { CameraCaptureProps }
