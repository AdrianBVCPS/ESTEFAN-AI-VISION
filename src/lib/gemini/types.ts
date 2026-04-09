// Tipos para el contrato de la API Gemini (server-side)

/** Recomendación de peinado generada por Gemini */
export interface Recommendation {
  name: string          // Nombre del peinado en español, e.g. "Skin Fade Texturizado"
  description: string   // Descripción del estilo, 1-2 frases en español
  suitability: string   // Por qué le queda bien al cliente, 1-2 frases en español
  visualPrompt: string  // Prompt técnico en inglés para la generación de imagen (60-120 palabras)
}

/** Respuesta del análisis facial (POST /api/gemini/analyze) */
export interface GeminiAnalysisResponse {
  faceShape: 'ovalado' | 'redondo' | 'cuadrado' | 'rectangular' | 'triangular' | 'corazon'
  recommendations: [Recommendation, Recommendation]  // exactamente 2
  confidence: number  // 0-1
}

/** Request para el analyze endpoint */
export interface AnalyzeRequest {
  photos: string[]        // base64 JPEG, exactamente 3 [frontal, lateral, trasera]
  preferences: {
    length: 'corto' | 'medio' | 'largo'
    style: 'clasico' | 'moderno' | 'informal' | 'urbano'
    beard: 'sin-barba' | 'barba-corta' | 'barba-larga' | 'perfilado'
    hairType: 'liso' | 'ondulado' | 'rizado' | 'muy-rizado'
  }
}

/** Request para el generate endpoint */
export interface GenerateRequest {
  photos: string[]   // base64 JPEG, exactamente 3
  prompt: string     // prompt técnico en inglés para el peinado (min 5 chars)
  title: string      // título descriptivo para la imagen en español
}

/** Response del generate endpoint */
export interface GeminiGenerateResponse {
  image: string      // base64 de la imagen generada (JPEG/PNG)
  mimeType: string   // 'image/jpeg' o 'image/png'
  title: string      // título pasado de vuelta
}
