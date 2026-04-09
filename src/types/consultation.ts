// Tipos compartidos para el flujo de consulta de Estefan AI Vision.
// Todo el estado vive en memoria del cliente — sin persistencia en servidor.

/** Ángulo desde el que se captura la foto del cliente */
export type PhotoAngle = 'frontal' | 'lateral' | 'trasera'

/**
 * Foto capturada durante el flujo de consulta.
 * blob se usa para enviar a la IA; url se usa para previsualizar en la UI.
 * La url debe revocarse con URL.revokeObjectURL() al resetear el contexto.
 */
export interface Photo {
  blob: Blob
  url: string       // URL.createObjectURL(blob) — revocar al resetear
  angle: PhotoAngle
  capturedAt: Date
}

/**
 * Preferencias estéticas del cliente para el Modo A ("La IA sugiere").
 * Determinan el estilo de peinado que Gemini tomará como referencia.
 */
export interface Preferences {
  length: 'corto' | 'medio' | 'largo'
  style: 'clasico' | 'moderno' | 'informal' | 'urbano'
  beard: 'sin-barba' | 'barba-corta' | 'barba-larga' | 'perfilado'
  hairType: 'liso' | 'ondulado' | 'rizado' | 'muy-rizado'
}

/**
 * Resultado del análisis facial de Gemini (Modo A).
 * confidence: valor 0-1 que indica la fiabilidad del análisis.
 */
export interface AnalysisResult {
  faceShape: 'ovalado' | 'redondo' | 'cuadrado' | 'rectangular' | 'triangular' | 'corazon'
  skinTone: string          // descripción libre del tono de piel
  currentStyle: string      // descripción del estilo actual detectado
  recommendations: string[] // 2-3 recomendaciones de peinado en texto
  confidence: number        // 0-1, confianza del análisis
}

/**
 * Imagen generada por la IA (Imagen de Gemini o similar).
 * La url debe revocarse con URL.revokeObjectURL() al resetear el contexto.
 */
export interface GeneratedImage {
  blob: Blob
  url: string    // URL.createObjectURL(blob) — revocar al resetear
  prompt: string // prompt usado para generarla (útil para regenerar o debug)
  title: string  // título descriptivo para mostrar al barbero en la UI
}

/**
 * Estado completo del flujo de consulta.
 * - photos: máximo 3 (una por ángulo)
 * - mode: null hasta que el barbero elija
 * - preferences: solo Modo A
 * - description: solo Modo B (texto libre del barbero)
 * - generatedImages: 2 en Modo A, 1 en Modo B
 */
export interface ConsultationState {
  photos: Photo[]
  mode: 'a' | 'b' | null
  preferences: Preferences | null
  description: string | null
  analysisResult: AnalysisResult | null
  generatedImages: GeneratedImage[]
  isLoading: boolean
  error: string | null
}

/**
 * Acciones disponibles para modificar el estado de consulta.
 * reset() limpia TODO el estado y revoca todas las object URLs activas.
 */
export interface ConsultationActions {
  addPhoto: (photo: Photo) => void
  removePhoto: (angle: PhotoAngle) => void
  setMode: (mode: 'a' | 'b') => void
  setPreferences: (preferences: Preferences) => void
  setDescription: (description: string) => void
  setAnalysisResult: (result: AnalysisResult) => void
  setGeneratedImages: (images: GeneratedImage[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}
