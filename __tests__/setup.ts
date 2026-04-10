import { vi } from 'vitest'

// Mock de HTMLCanvasElement para jsdom — que no implementa canvas real
const mockCtx = {
  save: vi.fn(),
  restore: vi.fn(),
  drawImage: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  stroke: vi.fn(),
  measureText: vi.fn(() => ({ width: 100 })),
  globalAlpha: 1,
  fillStyle: '',
  strokeStyle: '',
  font: '',
  textAlign: 'left' as CanvasTextAlign,
  textBaseline: 'alphabetic' as CanvasTextBaseline,
  lineWidth: 1,
}

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => mockCtx),
  writable: true,
})

Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: vi.fn((callback: (blob: Blob | null) => void, type?: string) => {
    callback(new Blob(['mock-canvas-data'], { type: type ?? 'image/jpeg' }))
  }),
  writable: true,
})
