import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { generateRequestSchema } from '@/lib/validations/schemas'
import { buildGeneratePromptModeA, buildGeneratePromptModeB } from '@/lib/gemini/prompts'

const MODEL_GENERATE = 'gemini-3.1-flash-image-preview'

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Servicio de IA no configurado' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const parsed = generateRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const ai = new GoogleGenAI({ apiKey })
  const { photos, prompt, title, promptMode } = parsed.data

  // Modo A: el visualPrompt ya viene formateado desde el análisis
  // Modo B: envolver la descripción libre del barbero con instrucciones técnicas
  const finalPrompt = promptMode === 'preformed'
    ? buildGeneratePromptModeA(prompt, title)
    : buildGeneratePromptModeB({ photos, prompt, title })

  const imageParts = photos.map(base64 => ({
    inlineData: { mimeType: 'image/jpeg' as const, data: base64 },
  }))

  try {
    const response = await ai.models.generateContent({
      model: MODEL_GENERATE,
      contents: [
        {
          role: 'user',
          parts: [
            ...imageParts,
            { text: finalPrompt },
          ],
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        temperature: 0.75,
        topP: 0.9,
      },
    })

    const parts = response.candidates?.[0]?.content?.parts ?? []
    const imagePartResult = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'))

    if (!imagePartResult?.inlineData) {
      const textResponse = parts.find(p => p.text)?.text
      console.error('[/api/gemini/generate] Sin imagen. Texto:', textResponse?.slice(0, 200))
      throw new Error('Gemini no devolvió imagen')
    }

    return NextResponse.json({
      image: imagePartResult.inlineData.data,
      mimeType: imagePartResult.inlineData.mimeType,
      title,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('[/api/gemini/generate] Error:', message)
    return NextResponse.json(
      { error: 'La IA está ocupada, inténtalo de nuevo en unos segundos.' },
      { status: 502 }
    )
  }
}
