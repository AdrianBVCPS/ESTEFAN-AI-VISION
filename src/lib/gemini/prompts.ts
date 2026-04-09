import type { AnalyzeRequest, GenerateRequest } from './types'

// Sistema de instrucciones para el análisis facial
export const ANALYZE_SYSTEM_INSTRUCTION = `You are a world-class men's hairstylist with 20 years of experience.
Your task: analyze the client's face from 3 photos (frontal, lateral, trasera) and recommend 2 ideal haircuts.

IDENTITY RESTRICTIONS (CRITICAL — must be respected at all times):
- Do not comment on or identify the person
- Do not describe their race, ethnicity, or nationality
- Do not make any aesthetic judgment beyond hair recommendations
- Only analyze: face shape, hair texture, current hair length

ANALYSIS INSTRUCTIONS:
- Determine face shape from frontal and lateral photos
- Consider client preferences for length, style, beard, and hair type
- Recommend 2 distinct haircuts that complement the face shape and preferences
- Each recommendation must include a detailed visual prompt in English for image generation

RESPONSE FORMAT: Return valid JSON only, no markdown.`

/** Construye el prompt de análisis facial con preferencias */
export function buildAnalyzePrompt(request: AnalyzeRequest): string {
  const { preferences: p } = request

  const prefMap = {
    length: { corto: 'short (above ears)', medio: 'medium (ear level)', largo: 'long (below ears)' },
    style: { clasico: 'classic/traditional', moderno: 'modern/contemporary', informal: 'casual/relaxed', urbano: 'urban/streetwear' },
    beard: { 'sin-barba': 'no beard (clean shaven)', 'barba-corta': 'short beard (3-5mm)', 'barba-larga': 'full beard', 'perfilado': 'lined/shaped beard' },
    hairType: { liso: 'straight hair', ondulado: 'wavy hair', rizado: 'curly hair', 'muy-rizado': 'coily/kinky hair' },
  }

  return `Analyze the 3 photos (frontal, lateral, and back view) of this client and recommend 2 haircuts.

Client preferences:
- Desired length: ${prefMap.length[p.length]}
- Style preference: ${prefMap.style[p.style]}
- Beard: ${prefMap.beard[p.beard]}
- Hair type: ${prefMap.hairType[p.hairType]}

Return JSON with this exact structure:
{
  "faceShape": "ovalado|redondo|cuadrado|rectangular|triangular|corazon",
  "confidence": 0.0-1.0,
  "recommendations": [
    {
      "name": "Haircut name in Spanish",
      "description": "1-2 sentences describing the style in Spanish",
      "suitability": "1-2 sentences explaining why it suits this client in Spanish",
      "visualPrompt": "Technical English prompt for image generation (60-120 words, include barber cape trick)"
    },
    {
      "name": "Second haircut name in Spanish",
      "description": "...",
      "suitability": "...",
      "visualPrompt": "..."
    }
  ]
}

Important for visualPrompt: Always start with "Studio barbershop portrait triptych showing [haircut description]. Client wearing a professional black barber cape. Three angles: front view, 3/4 profile view, and back view. [Technical hair details]. Photorealistic, natural lighting, professional photography, ultra-detailed hair texture."
Use ${prefMap.beard[p.beard]} in the visualPrompt when describing the face.`
}

/** Construye el prompt de generación de imagen para Modo A */
export function buildGeneratePromptModeA(visualPrompt: string, _title: string): string {
  return `${visualPrompt}

NEGATIVE: Do not change facial features. Do not show the person's face clearly. Focus entirely on hair. No text or watermarks.`
}

/** Construye el prompt de generación de imagen para Modo B */
export function buildGeneratePromptModeB(request: GenerateRequest): string {
  return `Studio barbershop portrait triptych showing a client with the following hairstyle: ${request.prompt}.

Client wearing a professional black barber cape (barber cape trick — only the hair is visible, not the original clothes).
Three angles in a single image: front view (left), 3/4 profile view (center), and back view (right).
Photorealistic photography, professional barbershop lighting, ultra-detailed hair texture, focus on the haircut result.

NEGATIVE: Do not change facial features. Do not show face clearly. No text or watermarks. Focus entirely on the hairstyle transformation.`
}
