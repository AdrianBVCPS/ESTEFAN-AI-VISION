import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Introduce un correo válido.'),
  // bcrypt trunca silenciosamente a 72 caracteres — acotar para evitar DoS
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.').max(72, 'La contraseña no puede superar los 72 caracteres.'),
})

export type LoginInput = z.infer<typeof loginSchema>

// Schema de preferencias estéticas para Modo A
export const preferencesSchema = z.object({
  length: z.enum(['corto', 'medio', 'largo']),
  style: z.enum(['clasico', 'moderno', 'informal', 'urbano']),
  beard: z.enum(['sin-barba', 'barba-corta', 'barba-larga', 'perfilado']),
  hairType: z.enum(['liso', 'ondulado', 'rizado', 'muy-rizado']),
})

export type PreferencesInput = z.infer<typeof preferencesSchema>

// Schema de descripción de corte para Modo B
export const descriptionSchema = z.object({
  text: z.string()
    .min(5, 'Describe el corte con un poco más de detalle')
    .max(500, 'Máximo 500 caracteres'),
})

export type DescriptionInput = z.infer<typeof descriptionSchema>

// ---------------------------------------------------------------------------
// Schemas para las API routes de Gemini
// ---------------------------------------------------------------------------

// Base64 sin el prefijo data:image/...;base64,
const base64ImageSchema = z.string()
  .min(100, 'Imagen inválida')
  .regex(/^[A-Za-z0-9+/]+=*$/, 'Formato base64 inválido')

export const analyzeRequestSchema = z.object({
  photos: z.array(base64ImageSchema).length(3, 'Se requieren exactamente 3 fotos'),
  preferences: z.object({
    length: z.enum(['corto', 'medio', 'largo']),
    style: z.enum(['clasico', 'moderno', 'informal', 'urbano']),
    beard: z.enum(['sin-barba', 'barba-corta', 'barba-larga', 'perfilado']),
    hairType: z.enum(['liso', 'ondulado', 'rizado', 'muy-rizado']),
  }),
})

export const generateRequestSchema = z.object({
  photos: z.array(base64ImageSchema).length(3, 'Se requieren exactamente 3 fotos'),
  prompt: z.string().min(5, 'El prompt es demasiado corto').max(2000, 'Prompt demasiado largo'),
  title: z.string().min(1).max(200),
  // 'preformed' = visualPrompt de Modo A (ya formateado); 'description' = texto libre de Modo B
  promptMode: z.enum(['preformed', 'description']).default('description'),
})

export type AnalyzeRequestInput = z.infer<typeof analyzeRequestSchema>
export type GenerateRequestInput = z.infer<typeof generateRequestSchema>
