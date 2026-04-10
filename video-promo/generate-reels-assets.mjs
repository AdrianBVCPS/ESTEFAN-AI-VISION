/**
 * Genera assets verticales (9:16) para el Reels de Instagram
 * Estefan Barber Shop — "Primera barbería con IA de toda Galicia"
 *
 * Veo 3: 3 clips verticales
 * Gemini: 4 imágenes verticales
 */
import { GoogleGenAI } from '@google/genai';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBN7HqBOvTfoRBOfjebhfwiBUKWyA2-hoc';
const ai = new GoogleGenAI({ apiKey: API_KEY });

const ASSETS_DIR = './public/generated/reels';
const VIDEO_DIR = './public/generated/reels/videos';
mkdirSync(ASSETS_DIR, { recursive: true });
mkdirSync(VIDEO_DIR, { recursive: true });

const IMAGE_MODEL = 'gemini-3.1-flash-image-preview';

// --- IMÁGENES VERTICALES (9:16) ---
const IMAGE_PROMPTS = [
  {
    id: 'reels-barbershop-hero',
    prompt: `Ultra-cinematic vertical portrait photograph of a premium barbershop interior at night. 9:16 portrait orientation. Dark moody atmosphere, Edison filament bulbs hanging from high ceiling casting warm golden light (#D4A854). Professional black leather barber chair centered in frame from floor to ceiling perspective. Dark walnut wood paneling. Large ornate gold-frame mirror reflecting warm light. Marble countertop with barber tools arranged artfully. Empty barbershop. Deep navy shadows (#1A1A2E). Film grain. 8K quality. Cinematic color grade: deep navy and warm gold. Ultra-realistic photography.`
  },
  {
    id: 'reels-ai-scan-vertical',
    prompt: `Futuristic AI face scanning visualization in portrait 9:16 format. A male face in center of frame with glowing golden geometric grid overlay mapping facial features. Deep navy (#1A1A2E) background with floating luminous data particles. Neural network golden lines radiating outward. Holographic scanning beam sweeps vertically through the face. Premium tech aesthetic. Color: navy background, gold (#D4A854) accent lines, subtle teal highlights. Vertical composition, highly detailed digital art, cinematic.`
  },
  {
    id: 'reels-barber-portrait',
    prompt: `Professional portrait of a confident male barber in his early 30s, vertical 9:16 full body shot. Wearing a crisp black apron over white shirt, arms crossed, powerful confident stance. Modern premium barbershop background with Edison bulbs bokeh. Warm golden ambient lighting. Strong jaw, professional expression. Cinematic shallow depth of field. Ultra-realistic photography. Color palette: warm gold, dark navy, black. Barbershop lifestyle photography.`
  },
  {
    id: 'reels-galicia-night',
    prompt: `Aerial vertical portrait photograph of Lugo city, Galicia, Spain at night. 9:16 orientation. The iconic ancient Roman walls of Lugo illuminated in warm gold light against deep navy night sky. Stars visible. Dramatic cinematic atmosphere. Majestic and powerful composition. Ultra-realistic photography, long exposure, deep navy sky with golden city lights. Premium quality.`
  }
];

// --- CLIPS VIDEO VEO 3 (9:16 VERTICAL) ---
const VIDEO_PROMPTS = [
  {
    id: 'reels-barbershop-vertical',
    model: 'veo-3.0-generate-001',
    prompt: `Slow cinematic vertical dolly shot inside a premium barbershop at night. 9:16 vertical format. Camera slowly pans from floor to ceiling: marble floor, professional barber chair, vintage gold-frame mirror, Edison bulbs casting warm golden light. Dark walnut wood walls. No people. Ultra-realistic, film grain, cinematic. Deep navy shadows, warm gold highlights. Atmospheric and luxurious.`,
    aspectRatio: '9:16',
  },
  {
    id: 'reels-scissors-vertical',
    model: 'veo-3.0-fast-generate-001',
    prompt: `Extreme close-up slow motion vertical video of professional barber scissors precisely cutting hair. 9:16 vertical format. Camera fills the frame with the scissor blades and hair detail. Warm Edison bulb bokeh in background. Ultra-realistic cinematic style. Golden warm tones. Artistic and dramatic. Hair falls in slow motion. Very premium, barbershop setting.`,
    aspectRatio: '9:16',
  },
  {
    id: 'reels-barber-client-vertical',
    model: 'veo-3.0-fast-generate-001',
    prompt: `Cinematic vertical slow motion shot of a professional barber working on a client's hair. 9:16 portrait. Barber's skilled hands using professional tools. Client sitting in leather chair facing large mirror. Warm Edison bulb lighting. Elegant barbershop interior in background. Ultra-realistic, film grain, deep navy and gold color palette. Luxury barbershop atmosphere.`,
    aspectRatio: '9:16',
  }
];

// --- GENERACIÓN IMÁGENES ---
async function generateImage(item) {
  console.log(`\nGenerando imagen: ${item.id}...`);
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: [{ role: 'user', parts: [{ text: item.prompt }] }],
      config: { responseModalities: ['TEXT', 'IMAGE'] },
    });

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          const buffer = Buffer.from(part.inlineData.data, 'base64');
          const ext = part.inlineData.mimeType.split('/')[1] || 'jpeg';
          const outputPath = join(ASSETS_DIR, `${item.id}.${ext}`);
          writeFileSync(outputPath, buffer);
          console.log(`  ✓ ${outputPath} (${Math.round(buffer.length / 1024)}KB)`);
          return outputPath;
        }
      }
    }
    const text = response.candidates?.[0]?.content?.parts?.find(p => p.text)?.text;
    if (text) console.log(`  Respuesta texto: ${text.slice(0, 200)}`);
    console.error(`  ✗ No hay imagen en la respuesta`);
    return null;
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return null;
  }
}

// --- GENERACIÓN VÍDEOS ---
async function generateVideoClip(clip) {
  console.log(`\nGenerando clip Veo 3: ${clip.id} (${clip.model})...`);
  try {
    let operation = await ai.models.generateVideos({
      model: clip.model,
      prompt: clip.prompt,
      config: {
        aspectRatio: clip.aspectRatio,
        numberOfVideos: 1,
      },
    });

    console.log(`  Operación iniciada. Esperando (2-5 min)...`);
    const startTime = Date.now();
    let attempts = 0;
    while (!operation.done) {
      await new Promise(r => setTimeout(r, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
      attempts++;
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      process.stdout.write(`\r  Procesando... ${elapsed}s (intento ${attempts})`);
    }
    console.log('');

    if (operation.response?.generatedVideos?.length > 0) {
      const video = operation.response.generatedVideos[0];
      if (video.video?.uri) {
        console.log(`  Descargando...`);
        const videoResponse = await fetch(`${video.video.uri}&key=${API_KEY}`);
        if (!videoResponse.ok) throw new Error(`HTTP ${videoResponse.status}`);
        const buffer = Buffer.from(await videoResponse.arrayBuffer());
        const outputPath = join(VIDEO_DIR, `${clip.id}.mp4`);
        writeFileSync(outputPath, buffer);
        console.log(`  ✓ ${outputPath} (${Math.round(buffer.length / 1024 / 1024)}MB)`);
        return outputPath;
      }
    }
    console.error(`  ✗ Sin video en la respuesta`);
    return null;
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    if (error.message.includes('billing') || error.message.includes('quota')) {
      console.log(`  → Requiere cuenta de pago. Continuando sin este clip.`);
    }
    return null;
  }
}

// --- MAIN ---
async function main() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   Generador de Assets — Estefan Barber Shop Reels     ║');
  console.log('║   Primera barbería con IA de toda Galicia             ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  // Paso 1: Imágenes
  console.log('▶ FASE 1: Imágenes Gemini (4 imágenes verticales)');
  console.log('─'.repeat(55));
  const imageResults = [];
  for (const item of IMAGE_PROMPTS) {
    const path = await generateImage(item);
    imageResults.push({ id: item.id, path });
    if (path) await new Promise(r => setTimeout(r, 3000));
  }

  // Paso 2: Videos
  console.log('\n▶ FASE 2: Clips Veo 3 (3 clips 9:16 verticales)');
  console.log('─'.repeat(55));
  const videoResults = [];
  for (const clip of VIDEO_PROMPTS) {
    const path = await generateVideoClip(clip);
    videoResults.push({ id: clip.id, path });
  }

  // Resumen
  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║                  RESUMEN                  ║');
  console.log('╠═══════════════════════════════════════════╣');
  console.log('║ IMÁGENES:');
  imageResults.forEach(r => console.log(`║  ${r.path ? '✓' : '✗'} ${r.id}`));
  console.log('║ VÍDEOS:');
  videoResults.forEach(r => console.log(`║  ${r.path ? '✓' : '✗'} ${r.id}`));
  const total = [...imageResults, ...videoResults].filter(r => r.path).length;
  console.log(`╠═══════════════════════════════════════════╣`);
  console.log(`║ ${total}/${IMAGE_PROMPTS.length + VIDEO_PROMPTS.length} assets generados`);
  console.log('╚═══════════════════════════════════════════╝');

  if (total > 0) {
    console.log('\n✓ Listos para renderizar con Remotion.');
    console.log('  Ejecuta: npx remotion render ReelsVideo out/estefan-reels-instagram.mp4 --gl=swangle');
  }
}

main().catch(console.error);
