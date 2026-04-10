// compositor.ts
// Composición de imagen IA con banner de la barbería.
// Enteramente client-side — sin llamadas al servidor.

const BANNER_HEIGHT = 70
const JPEG_QUALITY = 0.92
const PADDING = 16
const EA_CIRCLE_RADIUS = 20

export interface ComposeOptions {
  /** URL blob: o data: de la imagen generada por Gemini */
  imageUrl: string
  /** Calidad JPEG (0-1). Default 0.92 */
  quality?: number
}

/** Carga una imagen desde una URL y devuelve el HTMLImageElement listo. */
function cargarImagen(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('No se pudo cargar la imagen para el compositor'))
    img.src = url
  })
}

/**
 * Dibuja la franja de marca en la parte inferior del canvas.
 * Overlay semitransparente navy con monograma EA + nombre del negocio.
 * Usa save/restore para no contaminar el estado del contexto.
 */
function dibujarBanner(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
): void {
  ctx.save()

  const bannerY = canvasHeight - BANNER_HEIGHT

  // Fondo semitransparente navy
  ctx.globalAlpha = 0.88
  ctx.fillStyle = '#1A1A2E'
  ctx.fillRect(0, bannerY, canvasWidth, BANNER_HEIGHT)
  ctx.globalAlpha = 1

  // Círculo dorado del monograma EA
  const circleX = PADDING + EA_CIRCLE_RADIUS
  const circleY = bannerY + BANNER_HEIGHT / 2
  ctx.beginPath()
  ctx.arc(circleX, circleY, EA_CIRCLE_RADIUS, 0, Math.PI * 2)
  ctx.strokeStyle = '#D4A854'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Letras "EA" dentro del círculo
  ctx.fillStyle = '#D4A854'
  ctx.font = `bold ${Math.round(EA_CIRCLE_RADIUS * 0.9)}px "Playfair Display", serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('EA', circleX, circleY)

  // Nombre principal de la barbería
  const textX = PADDING + EA_CIRCLE_RADIUS * 2 + 12
  ctx.textAlign = 'left'
  ctx.fillStyle = '#F5F0EB'
  ctx.font = `500 14px "DM Sans", system-ui, sans-serif`
  ctx.fillText('Estefan Acosta Barber Shop', textX, circleY - 8)

  // Ciudad + crédito IA
  ctx.fillStyle = 'rgba(212,168,84,0.75)'
  ctx.font = `400 11px "DM Sans", system-ui, sans-serif`
  ctx.fillText('Lugo  ·  Powered by Estefan AI Vision', textX, circleY + 9)

  ctx.restore()
}

/**
 * Compone la imagen generada con el banner de la barbería.
 * El banner se superpone en la parte inferior de la imagen original.
 *
 * @returns Blob JPEG con el banner aplicado
 */
export async function composeBrandedImage({
  imageUrl,
  quality = JPEG_QUALITY,
}: ComposeOptions): Promise<Blob> {
  const img = await cargarImagen(imageUrl)

  if (img.naturalWidth === 0 || img.naturalHeight === 0) {
    throw new Error('La imagen cargada tiene dimensiones inválidas (0×0)')
  }

  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas')
  }

  // Dibujar imagen generada
  ctx.drawImage(img, 0, 0)

  // Superponer banner de marca
  dibujarBanner(ctx, canvas.width, canvas.height)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Error al exportar: canvas.toBlob devolvió null'))
          return
        }
        resolve(blob)
      },
      'image/jpeg',
      quality,
    )
  })
}

/**
 * Nombre de archivo para la descarga branded.
 * Formato: estefan-ai-YYYY-MM-DD-HHmm.jpg
 */
export function getBrandedFilename(): string {
  const fecha = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '')
  return `estefan-ai-${fecha}.jpg`
}
