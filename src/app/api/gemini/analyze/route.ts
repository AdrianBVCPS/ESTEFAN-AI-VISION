import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { analyzeRequestSchema } from '@/lib/validations/schemas'
import { buildAnalyzePrompt, ANALYZE_SYSTEM_INSTRUCTION } from '@/lib/gemini/prompts'
import { checkAndIncrementUsage } from '@/lib/gemini/rate-limit'
import type { GeminiAnalysisResponse } from '@/lib/gemini/types'

const MODEL_ANALYZE = 'gemini-2.0-flash'

export async function POST(request: NextRequest) {
  // 1. Validar que la API key esté configurada
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Servicio de IA no configurado' }, { status: 503 })
  }

  // 2. Parsear y validar body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const parsed = analyzeRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  // 3. Rate limiting diario
  const usageOk = await checkAndIncrementUsage()
  if (!usageOk) {
    return NextResponse.json(
      { error: 'Has alcanzado el límite diario de consultas. Inténtalo mañana.' },
      { status: 429 }
    )
  }

  // 4. Llamar a Gemini API
  const ai = new GoogleGenAI({ apiKey })
  const { photos, preferences } = parsed.data

  const prompt = buildAnalyzePrompt({ photos, preferences })

  const imageParts = photos.map(base64 => ({
    inlineData: { mimeType: 'image/jpeg' as const, data: base64 },
  }))

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ANALYZE,
      contents: [
        {
          role: 'user',
          parts: [
            ...imageParts,
            { text: prompt },
          ],
        },
      ],
      config: {
        systemInstruction: ANALYZE_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.15,
        topP: 0.8,
        topK: 20,
      },
    })

    const text = response.candidates?.[0]?.content?.parts?.find(p => p.text)?.text
    if (!text) {
      throw new Error('Respuesta vacía de Gemini')
    }

    const result = JSON.parse(text) as GeminiAnalysisResponse

    // Validación básica de estructura
    if (!result.faceShape || !Array.isArray(result.recommendations) || result.recommendations.length < 2) {
      throw new Error('Estructura de respuesta inválida')
    }

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('[/api/gemini/analyze] Error:', message)
    return NextResponse.json(
      { error: 'La IA está ocupada, inténtalo de nuevo en unos segundos.' },
      { status: 502 }
    )
  }
}
