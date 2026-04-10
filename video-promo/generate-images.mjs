/**
 * Script de generación de imágenes con Google Gemini 3.1 Flash Image Preview
 * Para el video promocional de Estefan AI Vision
 */
import { GoogleGenAI } from '@google/genai';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBN7HqBOvTfoRBOfjebhfwiBUKWyA2-hoc';
const ai = new GoogleGenAI({ apiKey: API_KEY });

const ASSETS_DIR = './public/generated';
mkdirSync(ASSETS_DIR, { recursive: true });

// Usar gemini-3.1-flash-image-preview (más moderno disponible para esta key)
const IMAGE_MODEL = 'gemini-3.1-flash-image-preview';

const PROMPTS = [
  {
    id: 'barbershop-hero',
    prompt: `Cinematic interior of a premium modern barbershop at night. Dark and moody atmosphere with Edison filament bulbs hanging from the ceiling casting warm golden light (#D4A854). Professional black leather barber chair in center. Dark walnut wood paneling on walls. Large vintage mirror with gold frame. Marble countertop with professional barber tools. No people. Ultra-realistic photography style, 16:9 cinematic, color grade: deep navy and warm gold. 8K quality, highly detailed.`
  },
  {
    id: 'barber-tablet',
    prompt: `Professional male barber in his early 30s, wearing a crisp black apron over white shirt. Holding a modern tablet showing a futuristic AI hair analysis app interface. Standing in a stylish barbershop with warm Edison bulb lighting. Confident natural expression. Cinematic shallow depth of field. Ultra-realistic photography style, warm barbershop atmosphere, color palette: dark navy, gold accents.`
  },
  {
    id: 'ai-face-scan',
    prompt: `Futuristic AI face scanning visualization art. Male face shown in 3/4 view with glowing golden geometric grid lines mapping facial features. Dark navy (#1A1A2E) background with subtle floating data particles. Neural network connection lines in gold and teal. Premium tech UI aesthetic. Color scheme: deep navy background with gold (#D4A854) accent lines. Ultra-realistic digital art, cinematic.`
  },
  {
    id: 'before-after',
    prompt: `Split screen side by side comparison. Left side: young man with natural unstyled medium brown hair, casual uncertain look. Right side: same man with a perfect modern high fade haircut with textured top, confident smile. Professional barbershop setting, warm Edison bulb lighting, vintage mirrors in background. Cinematic photography style, ultra-realistic, warm color grading.`
  },
  {
    id: 'client-happy',
    prompt: `Young man in his mid-20s with a fresh modern fade haircut looking at his reflection with a huge satisfied smile. Professional barbershop interior background with dark wood and Edison bulbs. Warm golden lighting. Candid joyful moment. Ultra-realistic photography, lifestyle, warm cinematic color grade with gold and navy tones.`
  }
];

async function generateImage(item) {
  console.log(`Generando imagen: ${item.id} con ${IMAGE_MODEL}...`);
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: [
        {
          role: 'user',
          parts: [{ text: item.prompt }],
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const candidates = response.candidates || [];
    for (const candidate of candidates) {
      const parts = candidate.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
          const buffer = Buffer.from(part.inlineData.data, 'base64');
          const ext = part.inlineData.mimeType.split('/')[1] || 'png';
          const outputPath = join(ASSETS_DIR, `${item.id}.${ext}`);
          writeFileSync(outputPath, buffer);
          console.log(`  ✓ Guardada: ${outputPath} (${Math.round(buffer.length / 1024)}KB)`);
          return outputPath;
        }
      }
    }

    console.error(`  ✗ No se encontró imagen en la respuesta para: ${item.id}`);
    // Mostrar texto de respuesta si hay
    const text = response.candidates?.[0]?.content?.parts?.find(p => p.text)?.text;
    if (text) console.log(`  Respuesta texto: ${text.slice(0, 200)}`);
    return null;
  } catch (error) {
    console.error(`  ✗ Error generando ${item.id}:`, error.message || error);
    return null;
  }
}

async function main() {
  console.log('=== Generador de imágenes Estefan AI Vision ===\n');
  console.log(`Modelo: ${IMAGE_MODEL}`);
  console.log(`Imágenes a generar: ${PROMPTS.length}\n`);

  const results = [];
  for (const item of PROMPTS) {
    const path = await generateImage(item);
    results.push({ id: item.id, path });
    if (path) {
      // Pausa entre requests para respetar rate limits
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n=== Resumen ===');
  const success = results.filter(r => r.path !== null).length;
  console.log(`${success}/${PROMPTS.length} imágenes generadas exitosamente`);
  results.forEach(r => {
    console.log(`${r.path ? '✓' : '✗'} ${r.id}: ${r.path || 'FALLIDO'}`);
  });
}

main().catch(console.error);
