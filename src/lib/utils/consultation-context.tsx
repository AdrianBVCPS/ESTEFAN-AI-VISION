'use client'

// ConsultationContext — gestiona el estado completo del flujo de consulta en memoria.
// Este componente es un Client Component y debe importarse en el layout protegido:
//
//   import { ConsultationProvider } from '@/lib/utils/consultation-context'
//
//   // En el layout (protected)/layout.tsx, envolver {children} dentro de <main>:
//   <main className="flex-1">
//     <ConsultationProvider>
//       {children}
//     </ConsultationProvider>
//   </main>
//
// El layout protegido es un Server Component, pero puede importar Client Components
// directamente — Next.js maneja el boundary automáticamente.

import { createContext, useContext, useReducer, useCallback } from 'react'
import type {
  ConsultationState,
  ConsultationActions,
  Photo,
  Preferences,
  AnalysisResult,
  GeneratedImage,
  PhotoAngle,
} from '@/types/consultation'

// ---------------------------------------------------------------------------
// Estado inicial
// ---------------------------------------------------------------------------

const initialState: ConsultationState = {
  photos: [],
  mode: null,
  preferences: null,
  description: null,
  analysisResult: null,
  generatedImages: [],
  isLoading: false,
  error: null,
}

// ---------------------------------------------------------------------------
// Tipos de acción del reducer
// ---------------------------------------------------------------------------

type Action =
  | { type: 'ADD_PHOTO'; payload: Photo }
  | { type: 'REMOVE_PHOTO'; payload: PhotoAngle }
  | { type: 'SET_MODE'; payload: 'a' | 'b' }
  | { type: 'SET_PREFERENCES'; payload: Preferences }
  | { type: 'SET_DESCRIPTION'; payload: string }
  | { type: 'SET_ANALYSIS_RESULT'; payload: AnalysisResult }
  | { type: 'SET_GENERATED_IMAGES'; payload: GeneratedImage[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' }

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function consultationReducer(state: ConsultationState, action: Action): ConsultationState {
  switch (action.type) {
    case 'ADD_PHOTO': {
      const fotoExistente = state.photos.find(p => p.angle === action.payload.angle)

      // Si ya existe una foto del mismo ángulo, revocar su URL antes de reemplazarla
      if (fotoExistente) {
        URL.revokeObjectURL(fotoExistente.url)
      }

      const fotosActualizadas = fotoExistente
        ? state.photos.map(p => (p.angle === action.payload.angle ? action.payload : p))
        : [...state.photos, action.payload]

      return { ...state, photos: fotosActualizadas }
    }

    case 'REMOVE_PHOTO': {
      const foto = state.photos.find(p => p.angle === action.payload)

      // Revocar la URL antes de eliminar la foto del estado
      if (foto) {
        URL.revokeObjectURL(foto.url)
      }

      return {
        ...state,
        photos: state.photos.filter(p => p.angle !== action.payload),
      }
    }

    case 'SET_MODE':
      return { ...state, mode: action.payload }

    case 'SET_PREFERENCES':
      return { ...state, preferences: action.payload }

    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload }

    case 'SET_ANALYSIS_RESULT':
      return { ...state, analysisResult: action.payload }

    case 'SET_GENERATED_IMAGES':
      return { ...state, generatedImages: action.payload }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    case 'RESET': {
      // Revocar todas las object URLs para liberar memoria antes de limpiar el estado
      state.photos.forEach(p => URL.revokeObjectURL(p.url))
      state.generatedImages.forEach(img => URL.revokeObjectURL(img.url))

      return { ...initialState }
    }

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type ConsultationContextValue = ConsultationState & ConsultationActions

export const ConsultationContext = createContext<ConsultationContextValue | null>(null)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ConsultationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(consultationReducer, initialState)

  // Acciones memoizadas para evitar renders innecesarios en consumidores

  const addPhoto = useCallback((photo: Photo) => {
    dispatch({ type: 'ADD_PHOTO', payload: photo })
  }, [])

  const removePhoto = useCallback((angle: PhotoAngle) => {
    dispatch({ type: 'REMOVE_PHOTO', payload: angle })
  }, [])

  const setMode = useCallback((mode: 'a' | 'b') => {
    dispatch({ type: 'SET_MODE', payload: mode })
  }, [])

  const setPreferences = useCallback((preferences: Preferences) => {
    dispatch({ type: 'SET_PREFERENCES', payload: preferences })
  }, [])

  const setDescription = useCallback((description: string) => {
    dispatch({ type: 'SET_DESCRIPTION', payload: description })
  }, [])

  const setAnalysisResult = useCallback((result: AnalysisResult) => {
    dispatch({ type: 'SET_ANALYSIS_RESULT', payload: result })
  }, [])

  const setGeneratedImages = useCallback((images: GeneratedImage[]) => {
    dispatch({ type: 'SET_GENERATED_IMAGES', payload: images })
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const value: ConsultationContextValue = {
    // Estado
    ...state,
    // Acciones
    addPhoto,
    removePhoto,
    setMode,
    setPreferences,
    setDescription,
    setAnalysisResult,
    setGeneratedImages,
    setLoading,
    setError,
    reset,
  }

  return (
    <ConsultationContext.Provider value={value}>
      {children}
    </ConsultationContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook de consumo
// ---------------------------------------------------------------------------

/**
 * Hook para acceder al contexto de consulta.
 * Lanza un error claro si se usa fuera del ConsultationProvider.
 */
export function useConsultation(): ConsultationContextValue {
  const context = useContext(ConsultationContext)

  if (context === null) {
    throw new Error(
      'useConsultation debe usarse dentro de un <ConsultationProvider>. ' +
      'Asegúrate de que el layout protegido envuelve {children} con <ConsultationProvider>.'
    )
  }

  return context
}
