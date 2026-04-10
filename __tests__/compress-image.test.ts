import { describe, it, expect } from 'vitest'
import { calcularDimensiones } from '@/lib/utils/compress-image'

describe('calcularDimensiones', () => {
  it('devuelve las dimensiones originales si ambos lados son menores que maxDimension', () => {
    expect(calcularDimensiones(800, 600, 1024)).toEqual({ width: 800, height: 600 })
  })

  it('no modifica imágenes ya pequeñas (cuadradas)', () => {
    expect(calcularDimensiones(512, 512, 1024)).toEqual({ width: 512, height: 512 })
  })

  it('escala correctamente en landscape (ancho > alto)', () => {
    const dims = calcularDimensiones(2000, 1500, 1024)
    expect(dims.width).toBe(1024)
    expect(dims.height).toBe(768)
  })

  it('escala correctamente en portrait (alto > ancho)', () => {
    const dims = calcularDimensiones(1200, 2400, 1024)
    expect(dims.width).toBe(512)
    expect(dims.height).toBe(1024)
  })

  it('maneja imágenes cuadradas grandes', () => {
    const dims = calcularDimensiones(2048, 2048, 1024)
    expect(dims.width).toBe(1024)
    expect(dims.height).toBe(1024)
  })

  it('respeta un maxDimension personalizado', () => {
    const dims = calcularDimensiones(3000, 2000, 800)
    expect(dims.width).toBe(800)
    expect(dims.height).toBe(533) // Math.round(2000/3000 * 800)
  })

  it('devuelve enteros (sin decimales)', () => {
    const dims = calcularDimensiones(1920, 1080, 1024)
    expect(Number.isInteger(dims.width)).toBe(true)
    expect(Number.isInteger(dims.height)).toBe(true)
  })
})
