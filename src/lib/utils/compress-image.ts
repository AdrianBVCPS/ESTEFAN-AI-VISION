// compress-image.ts
// Comprime una imagen a máx maxDimension×maxDimension px, JPEG calidad 85%.
// Se ejecuta en el cliente (usa canvas del navegador). Sin dependencias externas.

/**
 * Calcula nuevas dimensiones manteniendo el aspect ratio.
 * Si ambos lados son menores que maxDimension, devuelve las dimensiones originales.
 * Exportada para tests unitarios.
 */
export function calcularDimensiones(
  width: number,
  height: number,
  maxDimension: number,
): { width: number; height: number } {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height }
  }

  if (width >= height) {
    return {
      width: maxDimension,
      height: Math.round((height / width) * maxDimension),
    }
  }

  return {
    width: Math.round((width / height) * maxDimension),
    height: maxDimension,
  }
}

/**
 * Comprime vía OffscreenCanvas (workers y browsers modernos).
 * Requiere que createImageBitmap esté disponible.
 */
async function comprimirConOffscreenCanvas(
  blob: Blob,
  targetWidth: number,
  targetHeight: number,
): Promise<Blob> {
  const bitmap = await createImageBitmap(blob)
  const canvas = new OffscreenCanvas(targetWidth, targetHeight)
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    bitmap.close()
    throw new Error('No se pudo obtener el contexto 2D de OffscreenCanvas')
  }

  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)
  bitmap.close()

  return canvas.convertToBlob({ type: 'image/jpeg', quality: 0.85 })
}

/**
 * Comprime vía HTMLCanvasElement. Fallback para browsers sin OffscreenCanvas.
 * Requiere documento DOM disponible.
 */
function comprimirConHTMLCanvas(
  source: HTMLImageElement | ImageBitmap,
  targetWidth: number,
  targetHeight: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('No se pudo obtener el contexto 2D de HTMLCanvasElement'))
      return
    }

    ctx.drawImage(source, 0, 0, targetWidth, targetHeight)

    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error('canvas.toBlob devolvió null — el navegador no pudo codificar la imagen'))
          return
        }
        resolve(result)
      },
      'image/jpeg',
      0.85,
    )
  })
}

/**
 * Comprime un Blob de imagen redimensionando a máx maxDimension px en su lado mayor,
 * manteniendo el aspect ratio. Exporta JPEG calidad 85.
 *
 * Estrategia:
 * 1. OffscreenCanvas + createImageBitmap (browsers modernos, disponible en workers)
 * 2. HTMLCanvasElement + createImageBitmap (browsers sin OffscreenCanvas)
 * 3. HTMLCanvasElement + <img> load event (browsers sin createImageBitmap)
 *
 * @param blob          Imagen original capturada por la cámara
 * @param maxDimension  Tamaño máximo en px del lado mayor (default 1024)
 * @returns Blob JPEG comprimido
 */
export async function compressImage(blob: Blob, maxDimension = 1024): Promise<Blob> {
  // Ruta 1: OffscreenCanvas + createImageBitmap
  if (typeof OffscreenCanvas !== 'undefined' && typeof createImageBitmap !== 'undefined') {
    const bitmap = await createImageBitmap(blob)
    const dims = calcularDimensiones(bitmap.width, bitmap.height, maxDimension)
    // Comparar ANTES de cerrar el bitmap para evitar acceso a valores tras close()
    const yaEsPequena = dims.width === bitmap.width && dims.height === bitmap.height
    bitmap.close()

    if (yaEsPequena) return blob

    return comprimirConOffscreenCanvas(blob, dims.width, dims.height)
  }

  // Ruta 2: HTMLCanvasElement + createImageBitmap
  if (typeof createImageBitmap !== 'undefined') {
    const bitmap = await createImageBitmap(blob)
    const dims = calcularDimensiones(bitmap.width, bitmap.height, maxDimension)
    const yaEsPequena = dims.width === bitmap.width && dims.height === bitmap.height

    if (yaEsPequena) {
      bitmap.close()
      return blob
    }

    const result = await comprimirConHTMLCanvas(bitmap, dims.width, dims.height)
    bitmap.close()
    return result
  }

  // Ruta 3: HTMLCanvasElement + <img> como fallback completo
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)
      const dims = calcularDimensiones(img.naturalWidth, img.naturalHeight, maxDimension)

      if (dims.width === img.naturalWidth && dims.height === img.naturalHeight) {
        resolve(blob)
        return
      }

      comprimirConHTMLCanvas(img, dims.width, dims.height)
        .then(resolve)
        .catch(reject)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo cargar la imagen para compresión'))
    }

    img.src = url
  })
}
