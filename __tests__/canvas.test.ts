import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getBrandedFilename, composeBrandedImage } from '@/lib/canvas/compositor'

describe('getBrandedFilename', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-10T15:30:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('genera un nombre con el formato correcto', () => {
    const filename = getBrandedFilename()
    expect(filename).toMatch(/^estefan-ai-\d{4}-\d{2}-\d{2}-\d{4}\.jpg$/)
  })

  it('incluye la fecha actual en el nombre', () => {
    const filename = getBrandedFilename()
    expect(filename).toContain('2026-04-10')
  })

  it('siempre termina en .jpg', () => {
    expect(getBrandedFilename().endsWith('.jpg')).toBe(true)
  })
})

describe('composeBrandedImage', () => {
  it('rechaza con mensaje claro si getContext devuelve null', async () => {
    // Forzar getContext → null para simular fallo de canvas
    const mockGetContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValueOnce(null)

    // Mock de Image que carga de inmediato
    const OriginalImage = global.Image
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global as any).Image = class {
      naturalWidth = 512
      naturalHeight = 512
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      set src(_: string) {
        // Disparar onload en el siguiente tick
        setTimeout(() => this.onload?.(), 0)
      }
    }

    await expect(composeBrandedImage({ imageUrl: 'blob:mock' })).rejects.toThrow(
      'No se pudo obtener el contexto 2D del canvas',
    )

    global.Image = OriginalImage
    mockGetContext.mockRestore()
  })

  it('resuelve con un Blob JPEG cuando el canvas funciona correctamente', async () => {
    // El setup global ya mockea getContext y toBlob
    const OriginalImage = global.Image
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global as any).Image = class {
      naturalWidth = 512
      naturalHeight = 512
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      set src(_: string) {
        setTimeout(() => this.onload?.(), 0)
      }
    }

    const blob = await composeBrandedImage({ imageUrl: 'blob:mock' })
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('image/jpeg')

    global.Image = OriginalImage
  })
})
