import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  preferencesSchema,
  geminiAnalysisResponseSchema,
} from '@/lib/validations/schemas'

// Recomendación válida para reutilizar en varios tests
const recomendacionValida = {
  name: 'Pompadour clásico',
  description: 'Corte elegante y atemporal.',
  suitability: 'Ideal para tu forma de cara ovalada.',
  visualPrompt: 'photorealistic man with pompadour haircut, studio lighting, sharp detail',
}

describe('loginSchema', () => {
  it('valida credenciales correctas', () => {
    const r = loginSchema.safeParse({ email: 'barbero@estefan.es', password: 'secreta123' })
    expect(r.success).toBe(true)
  })

  it('rechaza email inválido', () => {
    const r = loginSchema.safeParse({ email: 'no-es-un-email', password: 'secreta123' })
    expect(r.success).toBe(false)
  })

  it('rechaza contraseña demasiado corta (< 6 chars)', () => {
    const r = loginSchema.safeParse({ email: 'a@b.com', password: '123' })
    expect(r.success).toBe(false)
  })

  it('rechaza contraseña superior a 72 caracteres (límite bcrypt)', () => {
    const r = loginSchema.safeParse({ email: 'a@b.com', password: 'a'.repeat(73) })
    expect(r.success).toBe(false)
  })

  it('acepta exactamente 6 caracteres de contraseña', () => {
    const r = loginSchema.safeParse({ email: 'a@b.com', password: '123456' })
    expect(r.success).toBe(true)
  })
})

describe('preferencesSchema', () => {
  it('valida preferencias válidas completas', () => {
    const r = preferencesSchema.safeParse({
      length: 'corto',
      style: 'moderno',
      beard: 'sin-barba',
      hairType: 'liso',
    })
    expect(r.success).toBe(true)
  })

  it('rechaza length con valor no permitido', () => {
    const r = preferencesSchema.safeParse({
      length: 'extra-largo',
      style: 'moderno',
      beard: 'sin-barba',
      hairType: 'liso',
    })
    expect(r.success).toBe(false)
  })

  it('rechaza campo faltante', () => {
    const r = preferencesSchema.safeParse({
      length: 'corto',
      style: 'moderno',
      beard: 'sin-barba',
      // hairType falta
    })
    expect(r.success).toBe(false)
  })
})

describe('geminiAnalysisResponseSchema', () => {
  const respuestaValida = {
    faceShape: 'ovalado',
    confidence: 0.85,
    recommendations: [recomendacionValida, { ...recomendacionValida, name: 'Fade moderno' }],
  }

  it('valida respuesta completa de Gemini', () => {
    const r = geminiAnalysisResponseSchema.safeParse(respuestaValida)
    expect(r.success).toBe(true)
  })

  it('rechaza forma de cara desconocida', () => {
    const r = geminiAnalysisResponseSchema.safeParse({
      ...respuestaValida,
      faceShape: 'hexagonal',
    })
    expect(r.success).toBe(false)
  })

  it('rechaza confidence > 1', () => {
    const r = geminiAnalysisResponseSchema.safeParse({ ...respuestaValida, confidence: 1.5 })
    expect(r.success).toBe(false)
  })

  it('rechaza confidence negativo', () => {
    const r = geminiAnalysisResponseSchema.safeParse({ ...respuestaValida, confidence: -0.1 })
    expect(r.success).toBe(false)
  })

  it('rechaza si solo hay 1 recomendación (se requieren exactamente 2)', () => {
    const r = geminiAnalysisResponseSchema.safeParse({
      ...respuestaValida,
      recommendations: [recomendacionValida],
    })
    expect(r.success).toBe(false)
  })

  it('rechaza si visualPrompt es demasiado corto', () => {
    const r = geminiAnalysisResponseSchema.safeParse({
      ...respuestaValida,
      recommendations: [
        { ...recomendacionValida, visualPrompt: 'corto' },
        recomendacionValida,
      ],
    })
    expect(r.success).toBe(false)
  })
})
