/**
 * Script de generación de clips de video con Google Veo 3
 * Para el video promocional de Estefan AI Vision
 */
import { GoogleGenAI, Modality } from '@google/genai';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBN7HqBOvTfoRBOfjebhfwiBUKWyA2-hoc';
const ai = new GoogleGenAI({ apiKey: API_KEY });

const VIDEO_DIR = './public/generated/videos';
mkdirSync(VIDEO_DIR, { recursive: true });

// Clips a generar con Veo 3
const VIDEO_PROMPTS = [
  {
    id: 'barbershop-cinematic',
    model: 'veo-3.0-generate-001',
    prompt: `Slow cinematic dolly pan through a premium modern barbershop interior at night. Edison filament bulbs casting warm golden light. Professional black barber chair in center. Dark walnut wood walls. No people. Ultra-realistic, film grain, cinematic color grade: deep navy and gold.`,
  },
  {
    id: 'barber-scissors',
    model: 'veo-3.0-fast-generate-001',
    prompt: `Extreme close-up slow motion of professional barber scissors snipping through hair with perfect precision. Warm Edison bulb bokeh in background. Ultra-realistic cinematic style. Golden warm tones. Barbershop setting. Artistic and dramatic.`,
  }
];

async function generateVideoClip(prompt) {
  console.log(`\nGenerando clip: ${prompt.id} con ${prompt.model}...`);

  try {
    console.log(`  Enviando solicitud...`);
    let operation = await ai.models.generateVideos({
      model: prompt.model,
      prompt: prompt.prompt,
      config: {
        aspectRatio: '16:9',
        numberOfVideos: 1,
      },
    });

    console.log(`  Operación iniciada. Esperando resultado (2-5 min)...`);

    const startTime = Date.now();
    let attempts = 0;
    while (!operation.done) {
      await new Promise(r => setTimeout(r, 10000)); // esperar 10s
      operation = await ai.operations.getVideosOperation({ operation });
      attempts++;
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      process.stdout.write(`\r  Procesando... ${elapsed}s (intento ${attempts})`);
    }
    console.log(''); // nueva línea

    if (operation.response?.generatedVideos?.length > 0) {
      const video = operation.response.generatedVideos[0];
      if (video.video?.uri) {
        // Descargar el video desde la URI
        const videoUri = video.video.uri;
        console.log(`  Descargando video desde: ${videoUri.slice(0, 60)}...`);
        const videoResponse = await fetch(`${videoUri}&key=${API_KEY}`);
        if (!videoResponse.ok) {
          throw new Error(`Error descargando: ${videoResponse.status}`);
        }
        const buffer = Buffer.from(await videoResponse.arrayBuffer());
        const outputPath = join(VIDEO_DIR, `${prompt.id}.mp4`);
        writeFileSync(outputPath, buffer);
        console.log(`  ✓ Guardado: ${outputPath} (${Math.round(buffer.length / 1024 / 1024)}MB)`);
        return outputPath;
      }
    }

    console.error(`  ✗ No se generó video en la respuesta`);
    console.log(`  Respuesta:`, JSON.stringify(operation.response || {}).slice(0, 500));
    return null;

  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    if (error.message.includes('billing') || error.message.includes('quota') || error.message.includes('403')) {
      console.log(`  → Este modelo puede requerir cuenta de pago. Continuando sin este clip.`);
    }
    return null;
  }
}

async function main() {
  console.log('=== Generador de clips Veo 3 para Estefan AI Vision ===\n');

  const results = [];
  for (const prompt of VIDEO_PROMPTS) {
    const path = await generateVideoClip(prompt);
    results.push({ id: prompt.id, path });
  }

  console.log('\n=== Resumen ===');
  results.forEach(r => {
    console.log(`${r.path ? '✓' : '✗'} ${r.id}: ${r.path || 'FALLIDO'}`);
  });

  if (results.some(r => r.path)) {
    console.log('\n✓ Clips generados. Para integrarlos al video de Remotion, colócalos en:');
    console.log('  video-promo/public/generated/videos/');
  }
}

main().catch(console.error);
