// Cliente Gemini para componentes del navegador.
// Llama a las API routes del servidor — nunca a Gemini directamente.
// La GEMINI_API_KEY nunca está presente en este archivo.

import type { Photo, Preferences, AnalysisResult, GeneratedImage } from '@/types/consultation'
import type { GeminiAnalysisResponse, GeminiGenerateResponse } from '@/lib/gemini/types'
import { compressImage } from '@/lib/utils/compress-image'

// Timeout para llamadas a la IA (60s — la generación de imagen puede tardar)
const AI_TIMEOUT_MS = 60_000

/**
 * Convierte un Blob a base64 string sin el prefijo data:image/...;base64,
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      if (!base64) reject(new Error('No se pudo convertir a base64'))
      else resolve(base64)
    }
    reader.onerror = () => reject(new Error('Error al leer el blob'))
    reader.readAsDataURL(blob)
  })
}

/**
 * Comprime y serializa las fotos del cliente a base64 JPEG 85%, máx 1024px.
 * Reduce el payload de ~24 MB a ~1-2 MB antes de enviar a las API routes.
 */
async function prepararFotos(photos: Photo[]): Promise<string[]> {
  return Promise.all(
    photos.map(async p => blobToBase64(await compressImage(p.blob)))
  )
}

/**
 * Fetch con timeout via AbortController. Lanza AbortError si supera el límite.
 */
async function fetchConTimeout(url: string, init: RequestInit, timeoutMs = AI_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Analiza las 3 fotos del cliente y devuelve forma de rostro + 2 recomendaciones.
 * Llama a POST /api/gemini/analyze (server-side, con GEMINI_API_KEY).
 */
export async function analyzeFace(
  photos: Photo[],
  preferences: Preferences
): Promise<AnalysisResult> {
  const photosBase64 = await prepararFotos(photos)

  let response: Response
  try {
    response = await fetchConTimeout('/api/gemini/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photos: photosBase64, preferences }),
    })
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('La IA tardó demasiado. Inténtalo de nuevo.')
    }
    throw err
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: string }
    throw new Error(err.error ?? `Error ${response.status}: La IA no respondió`)
  }

  const data: GeminiAnalysisResponse = await response.json()

  return {
    faceShape: data.faceShape,
    recommendations: data.recommendations,
    confidence: data.confidence,
  }
}

/**
 * Genera una imagen de peinado personalizada para el cliente.
 * Modo A: pasar el visualPrompt de la recomendación como prompt.
 * Modo B: pasar la descripción libre del barbero como prompt.
 * Llama a POST /api/gemini/generate (server-side, con GEMINI_API_KEY).
 */
export async function generateImage(
  photos: Photo[],
  prompt: string,
  title: string,
  promptMode: 'preformed' | 'description' = 'description'
): Promise<GeneratedImage> {
  const photosBase64 = await prepararFotos(photos)

  let response: Response
  try {
    response = await fetchConTimeout('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photos: photosBase64, prompt, title, promptMode }),
    })
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('La IA tardó demasiado generando la imagen. Inténtalo de nuevo.')
    }
    throw err
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: string }
    throw new Error(err.error ?? `Error ${response.status}: No se pudo generar la imagen`)
  }

  const data: GeminiGenerateResponse = await response.json()

  // Convertir base64 a Blob y crear object URL
  const byteCharacters = atob(data.image)
  const byteArr = new Uint8Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArr[i] = byteCharacters.charCodeAt(i)
  }
  const blob = new Blob([byteArr], { type: data.mimeType })
  const url = URL.createObjectURL(blob)

  return { blob, url, prompt, title: data.title }
}
