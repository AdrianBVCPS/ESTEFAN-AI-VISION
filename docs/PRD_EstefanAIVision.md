# Estefan AI Vision — PRD (Product Requirements Document)

**Cliente:** Estefan Acosta Barber Shop  
**Ubicación:** Rúa Bolaño Rivadeneira, 22, bajo b, 27001 Lugo  
**Versión:** 1.0  
**Fecha:** 26 de marzo de 2026  
**Estado:** Borrador  
**Autor:** Adrián García Méndez — Process & Systems Analyst  

---

## 1. Resumen Ejecutivo

Estefan AI Vision es una aplicación web progresiva (PWA) diseñada exclusivamente para Estefan Acosta Barber Shop en Lugo. Su propósito es mejorar la experiencia del cliente mediante inteligencia artificial: analiza la forma del rostro del cliente a partir de fotografías, sugiere dos peinados óptimos personalizados, y genera imágenes fotorrealistas del cliente con cada peinado propuesto mostrando tres ángulos (frontal, lateral y trasero).

La aplicación es operada exclusivamente por el barbero desde su dispositivo (tablet o móvil) durante la consulta previa al corte. No almacena datos del cliente ni requiere registro por parte de este. El resultado se muestra en el momento y puede descargarse con el branding de la barbería.

### 1.1 Propuesta de valor

**Para el cliente:** visualizar su nuevo look antes de cortarse el pelo, reduciendo la incertidumbre y aumentando la satisfacción. Ya sea dejándose sorprender por las sugerencias de la IA (Modo A) o comprobando cómo le quedaría un corte concreto que tiene en mente (Modo B). Puede llevarse las imágenes descargadas con el logo de la barbería.

**Para el barbero:** herramienta diferenciadora que posiciona a Estefan Acosta Barber Shop como la primera barbería de Lugo con IA integrada. El Modo B resuelve el problema más habitual en la barbería: "quiero esto pero no sé cómo me quedará". Las imágenes descargadas con branding funcionan como marketing orgánico cuando el cliente las comparte.

### 1.2 Datos del negocio

| Dato | Valor |
|------|-------|
| Nombre comercial | Estefan Acosta Barber Shop |
| Dirección | Rúa Bolaño Rivadeneira, 22, bajo b, 27001 Lugo |
| Valoración Booksy | 4.9 estrellas (133 reseñas) |
| Barberos | 2 (Estefan y Guillermo) |
| Servicio estrella | Skin Fade (18€, 45 min) |
| Rango de precios | 5€ – 75€ |
| Reservas actuales | Booksy |
| Instagram | @estefanacostabarbershop |

---

## 2. Alcance del Producto

### 2.1 Dentro del alcance (MVP)

- Autenticación del barbero (usuario + contraseña).
- Captura de 3 fotografías del cliente (frontal, lateral, trasera) usando la cámara del dispositivo.
- **Selector de modo de consulta:**
  - **Modo A — "La IA sugiere":** Selector rápido de preferencias (longitud, estilo, barba, tipo de pelo). La IA analiza el rostro, sugiere 2 peinados con justificación, y genera 2 imágenes fotorrealistas (3 ángulos cada una).
  - **Modo B — "Probar un corte":** Campo de texto libre donde el barbero describe el peinado que el cliente quiere probar (ej: "modern mullet con degradado bajo"). La IA genera 1 imagen fotorrealista (3 ángulos) de cómo le quedaría.
- Presentación de resultados al cliente en pantalla.
- **Descarga de imágenes con branding:** cada imagen descargada incluye el logo de Estefan Acosta Barber Shop como marca de agua o banner integrado. El logo se proporciona al desarrollador como asset y se compone sobre la imagen generada en el momento de la descarga.
- Interfaz completamente en español.
- PWA instalable en tablet/móvil.

### 2.2 Fuera del alcance (MVP)

- Historial de clientes o resultados anteriores.
- Compartir resultados directamente por WhatsApp, redes sociales o email (el cliente descarga y comparte manualmente).
- Registro o login de clientes.
- Integración con Booksy u otros sistemas de reservas.
- Multiidioma.
- Panel de administración avanzado.
- Analíticas de uso o métricas.

---

## 3. Usuarios y Roles

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| Barbero (Admin) | Estefan o Guillermo. Opera la app durante la consulta con el cliente. | Login con usuario + contraseña. Acceso completo a todas las funcionalidades. |
| Cliente | Persona que se sienta en el sillón de barbero. | Sin registro. Visualiza resultados en la pantalla del barbero. Puede solicitar descarga de las imágenes. |

> **Nota:** En esta versión MVP, las credenciales del barbero se gestionan desde Supabase Auth. No existe panel de autogestión de usuarios.

---

## 4. Flujo Funcional Detallado

### 4.1 Pasos comunes (ambos modos)

1. **LOGIN** — El barbero abre la PWA e introduce sus credenciales (usuario + contraseña). Se mantiene la sesión activa mientras no cierre sesión explícitamente.

2. **NUEVA CONSULTA** — El barbero pulsa el botón "Nueva consulta" desde la pantalla principal.

3. **CAPTURA FOTOGRÁFICA** — Se activa la cámara del dispositivo. El barbero toma 3 fotos siguiendo indicaciones en pantalla:
   - Foto frontal: guía de posición del rostro centrado.
   - Foto lateral: perfil izquierdo o derecho.
   - Foto trasera: nuca y parte posterior de la cabeza.
   - Cada foto muestra una previsualización y permite repetirla antes de confirmar.

4. **SELECTOR DE MODO** — Tras confirmar las 3 fotos, el barbero elige el modo de consulta:
   - **"La IA sugiere"** (Modo A) → La IA analiza el rostro y propone 2 peinados.
   - **"Probar un corte"** (Modo B) → El barbero describe un peinado concreto que el cliente quiere ver.

### 4.2 Modo A — "La IA sugiere" (flujo completo con análisis facial)

5A. **PREFERENCIAS DEL CLIENTE** — Pantalla con selectores rápidos que el barbero marca en ~5 segundos:
   - Longitud deseada: corto / medio / largo.
   - Estilo preferido: fade / clásico / texturizado / sin preferencia.
   - Barba: mantener actual / incluir sugerencia.
   - Tipo de pelo: liso / ondulado / rizado.
   - Opción "Sin preferencia" disponible para dejar que la IA decida libremente.

6A. **ANÁLISIS IA** — Se envían las 3 fotos + preferencias a Gemini (modelo multimodal). La IA analiza:
   - Forma del rostro (oval, redonda, cuadrada, corazón, diamante, oblonga).
   - Proporciones faciales y tipo del cabello visible.
   - Devuelve 2 recomendaciones de peinado, cada una con: nombre, descripción visual detallada, y justificación.
   - Tiempo estimado: 5–10 segundos.

7A. **GENERACIÓN DE IMÁGENES** — Se generan 2 imágenes (una por peinado sugerido). Cada imagen es una composición con 3 vistas: frontal, lateral y trasera. Tiempo estimado: 4–8 segundos por imagen.

8A. **RESULTADOS** — 2 opciones lado a lado (carrusel en móvil). Cada opción muestra la imagen + nombre + justificación + botón "Descargar".

> **Llamadas API en Modo A:** 1 análisis facial + 2 generaciones de imagen = **3 llamadas**.

### 4.3 Modo B — "Probar un corte" (el cliente describe lo que quiere)

5B. **DESCRIPCIÓN DEL PEINADO** — Pantalla con:
   - **Campo de texto libre** donde el barbero escribe lo que el cliente quiere probar. Ejemplos que se muestran como placeholder/ayuda:
     - "Modern mullet con degradado bajo"
     - "Skin fade con crop texturizado"
     - "Corte clásico con raya al lado, sin degradado"
     - "Buzz cut del 3 con fade en los lados"
   - **Selector de barba** (mantener actual / incluir sugerencia) — el único selector que se mantiene.
   - **Botón "Generar preview".**

6B. **GENERACIÓN DE IMAGEN** — Se envían las 3 fotos + la descripción textual del barbero a Nano Banana 2. Se genera 1 imagen con la composición de 3 vistas (frontal, lateral, trasera). Tiempo estimado: 4–8 segundos.

7B. **RESULTADO** — 1 imagen a pantalla completa mostrando los 3 ángulos. Se muestra:
   - La imagen generada.
   - El texto que escribió el barbero como referencia.
   - **Botón "Descargar".**
   - **Botón "Probar otro corte"** → vuelve al paso 5B con las mismas fotos (sin repetir captura).
   - **Botón "Cambiar a Modo IA"** → va al paso 5A (Modo A) con las mismas fotos.

> **Llamadas API en Modo B:** 1 generación de imagen = **1 llamada por intento**. El cliente puede probar varios cortes sin repetir fotos.

### 4.4 Descarga con branding (común ambos modos)

Al pulsar "Descargar" en cualquier modo:
   - Se compone la imagen final en el cliente (Canvas API) añadiendo el logo de la barbería.
   - El logo se posiciona como banner inferior o marca de agua semitransparente (configurable).
   - Se genera un archivo JPG/PNG que se descarga al dispositivo del barbero.
   - El barbero puede compartir la imagen con el cliente (AirDrop, Bluetooth, mostrando un QR para descargar, etc.).

Al pulsar "Nueva consulta" se descartan todas las fotos y resultados. No se guarda nada en el servidor.

### 4.5 Flujos alternativos y errores

| Escenario | Comportamiento esperado |
|-----------|------------------------|
| Foto borrosa o mal encuadrada | El barbero puede repetir cualquier foto antes de confirmar. Guía visual de encuadre en la cámara. |
| Error de API (Gemini no responde) | Mensaje amigable: "La IA está ocupada, inténtalo de nuevo". Botón de reintento. |
| Límite de free tier alcanzado | Mensaje informativo: "Has alcanzado el límite diario. Vuelve mañana." Contador visible de usos restantes. |
| Sin conexión a internet | Mensaje: "Se necesita conexión a internet para analizar." La captura de fotos sigue disponible offline. |
| Resultado insatisfactorio (Modo A) | Botón "Regenerar" para repetir la generación con las mismas fotos y preferencias. |
| Resultado insatisfactorio (Modo B) | Botón "Probar otro corte" para reescribir la descripción y regenerar sin repetir fotos. |
| Texto demasiado vago (Modo B) | Si el barbero escribe menos de 5 caracteres o algo no interpretable, mensaje: "Describe el corte con un poco más de detalle." |
| Logo no configurado | Las imágenes se descargan sin branding. Se muestra aviso en configuración. |

---

## 5. Arquitectura Técnica

### 5.1 Stack tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Frontend | Next.js 16 + React 19 + TypeScript | Stack moderno, SSR/SSG, PWA nativa. Experiencia del desarrollador. |
| Estilos | Tailwind CSS v4 | CSS-first config, utilidades rápidas, responsive. |
| Backend/Auth | Supabase (Auth + Edge Functions) | Auth gestionado, Edge Functions para proxy de API, free tier generoso. |
| Base de datos | Supabase PostgreSQL | Solo para autenticación y configuración. No almacena datos de clientes. |
| IA — Análisis facial | Gemini API (multimodal text+vision) | Análisis de imagen + generación de texto estructurado en una sola llamada. |
| IA — Generación de imagen | Nano Banana 2 (Gemini 3.1 Flash Image) | Mejor modelo de generación de imagen 2026. Consistencia facial, 4K, rápido. |
| Composición de imagen | Canvas API (browser) | Composición del logo sobre la imagen generada en el cliente, sin backend. |
| Hosting | Vercel | Deploy automático desde GitHub, CDN global, free tier. |
| PWA | next-pwa / Service Workers | Instalable en dispositivo, splash screen personalizado. |

### 5.2 Flujo de datos y llamadas API

Cada consulta de un cliente consume un número variable de llamadas según el modo:

**Modo A — "La IA sugiere":**

| Llamada | Modelo | Input | Output | Coste estimado |
|---------|--------|-------|--------|----------------|
| 1. Análisis facial | Gemini (text+vision) | 3 fotos + preferencias (texto) | JSON: forma rostro + 2 peinados + justificación | ~$0.01 |
| 2. Imagen peinado A | Nano Banana 2 | 3 fotos + prompt peinado A | 1 imagen composición 3 ángulos (1K–2K) | $0.045 – $0.067 |
| 3. Imagen peinado B | Nano Banana 2 | 3 fotos + prompt peinado B | 1 imagen composición 3 ángulos (1K–2K) | $0.045 – $0.067 |

- **Total Modo A:** 3 llamadas, coste ~$0.10 – $0.14.

**Modo B — "Probar un corte":**

| Llamada | Modelo | Input | Output | Coste estimado |
|---------|--------|-------|--------|----------------|
| 1. Imagen peinado | Nano Banana 2 | 3 fotos + descripción textual del barbero | 1 imagen composición 3 ángulos (1K–2K) | $0.045 – $0.067 |

- **Total Modo B:** 1 llamada por intento, coste ~$0.05 – $0.07. Si el cliente prueba 3 cortes: ~$0.15 – $0.20.

**Free tier disponible:** ~500 requests/día en Google AI Studio. Según el modo: ~166 clientes/día en Modo A, o ~500 previews/día en Modo B. Más que suficiente.

La composición del logo se realiza en el navegador con Canvas API, sin llamadas adicionales al servidor.

### 5.3 Arquitectura de seguridad

1. Las fotos del cliente **NUNCA** se almacenan en servidor ni en el dispositivo. Se procesan en memoria y se envían directamente a la API de Gemini.
2. Los resultados generados **NUNCA** se persisten en el servidor. Al cerrar la consulta o iniciar una nueva, se descartan de la memoria del navegador.
3. La API key de Gemini se almacena como variable de entorno en Vercel/Supabase Edge Functions, nunca expuesta al cliente.
4. La comunicación con la API de Gemini se realiza a través de una Supabase Edge Function (proxy), no directamente desde el frontend.
5. Supabase Auth gestiona la sesión del barbero con JWT. RLS activo.
6. Las imágenes descargadas existen solo en el dispositivo donde se descargan. El servidor no guarda copia.

### 5.4 Modelo de datos (Supabase)

La base de datos es mínima. Solo gestiona autenticación y configuración:

| Tabla | Campos | Propósito |
|-------|--------|-----------|
| `auth.users` (Supabase Auth) | id, email, encrypted_password, created_at | Credenciales del barbero. Gestionado por Supabase Auth. |
| `public.barber_profiles` | id (FK auth.users), display_name, role ('admin'\|'barber'), avatar_url | Perfil del barbero para mostrar en la UI. |
| `public.app_config` | id, key, value, updated_at | Configuración de la app (API limits, mensajes, logo_url, etc.). |

> **No existen tablas de clientes, sesiones de consulta, fotos ni resultados.**

### 5.5 Composición de imagen con logo (descarga)

La funcionalidad de descarga con branding se implementa **enteramente en el cliente** usando la Canvas API del navegador:

1. Se crea un `<canvas>` del tamaño de la imagen generada + espacio para el banner inferior.
2. Se dibuja la imagen generada por Nano Banana 2 en el canvas.
3. Se dibuja un banner inferior (fondo oscuro semi-transparente) con el logo de la barbería y opcionalmente el texto "Estefan Acosta Barber Shop" y "Powered by Estefan AI Vision".
4. Se exporta el canvas como blob JPG/PNG y se dispara la descarga.
5. Alternativa configurable: logo como marca de agua semitransparente centrada en la imagen.

El logo se almacena como asset estático en el proyecto (`/public/logo.png`) y se carga en el componente de resultados. Cuando el barbero proporcione el logo, se incluirá como archivo del proyecto.

---

## 6. Diseño de Prompts (Prompt Engineering)

> **Nota técnica:** Los prompts se escriben en inglés para maximizar la calidad de respuesta de Gemini. Los resultados se presentan al usuario en español. Se usa `responseMimeType: "application/json"` y `responseSchema` en la llamada API para garantizar JSON válido sin post-procesamiento.

### 6.0 Prompt de validación de fotos (pre-check, opcional)

Antes de enviar las fotos al análisis facial, se puede ejecutar una validación rápida para evitar desperdiciar llamadas API con fotos inutilizables. Esta llamada es opcional y se puede omitir para reducir latencia.

**Prompt (Gemini Flash, llamada ligera):**

```
Evaluate these 3 photographs for suitability in a facial analysis and hairstyle recommendation system.

For EACH photo, assess:
1. Face visibility (is the face/head clearly visible and in focus?)
2. Lighting (sufficient and even, or too dark/overexposed/backlighted?)
3. Angle correctness (Photo 1 must be frontal, Photo 2 side profile, Photo 3 back of head)
4. Obstructions (sunglasses, hat, hand covering face, mask, phone blocking face?)
5. Distance (is the head large enough in frame for facial analysis? Minimum 30% of frame)

Rate overall suitability: "ready" | "usable_with_warnings" | "retake_needed"
If "retake_needed", specify WHICH photo (1, 2, or 3) and WHY in one short sentence in Spanish.
```

**Response schema:**

```json
{
  "type": "object",
  "properties": {
    "overall_status": { "type": "string", "enum": ["ready", "usable_with_warnings", "retake_needed"] },
    "retake_photo": { "type": "integer", "description": "Which photo needs retaking (1, 2, or 3). Null if ready." },
    "retake_reason_es": { "type": "string", "description": "Reason in Spanish for the user. Null if ready." },
    "warnings": { "type": "array", "items": { "type": "string" }, "description": "Non-blocking warnings." }
  },
  "required": ["overall_status"]
}
```

> **Coste:** ~$0.002 por validación. **Latencia:** ~1-2 segundos. Se puede skipear si la guía visual de captura es suficiente.

---

### 6.1 Prompt de análisis facial (Gemini multimodal text+vision)

Se envían las 3 fotografías (frontal, lateral, trasera) junto con este prompt. Se fuerza JSON estructurado vía API.

**System instruction:**

```
You are a world-class men's hairstylist, barber, and certified visagism consultant with 20+ years of experience. You trained at elite barbershops and specialize in analyzing male facial morphology to recommend the most flattering haircuts for each unique face.

<task>
Analyze the client's 3 reference photographs (front view, side profile, back of head) and produce a structured hairstyle recommendation grounded in visagism principles.
</task>

<visagism_knowledge_base>
Apply these face-shape-to-hairstyle rules as your foundation, then adapt to client preferences:

OVAL (forehead slightly wider than jaw, gentle curve):
- Most versatile. Suits almost any style.
- Best: textured crops, pompadours, side parts, quiffs.
- Avoid: heavy fringes that hide the balanced proportions.

ROUND (equal width and length, soft jawline):
- Goal: ADD vertical height, CREATE angular illusion.
- Best: high fades, pompadours, flat tops, disconnected undercuts. Height on top elongates.
- Avoid: rounded cuts, ear-length sides, center parts that emphasize width.

SQUARE (strong jaw, equal width at forehead/cheeks/jaw):
- Goal: SOFTEN angles without losing structure.
- Best: textured fringes, side parts with volume, tapered sides (not hard fades). Messy texture.
- Avoid: buzz cuts and very short crops that expose and emphasize the angular jaw.

HEART (wide forehead, narrow chin/jaw):
- Goal: BALANCE top-heaviness, add width at jaw level.
- Best: side parts, medium-length textured styles, fringe. Sideburns add jaw width.
- Avoid: excessive volume on top, slicked-back styles exposing wide forehead.

DIAMOND (narrow forehead and jaw, wide cheekbones):
- Goal: ADD width at forehead and jaw, soften cheekbones.
- Best: fringes, side-swept bangs, textured medium-length styles. Fuller sides near temples.
- Avoid: very short sides that emphasize narrow temples.

OBLONG (longer than wide, straight cheek line):
- Goal: REDUCE length perception, add width.
- Best: fringes/bangs, layered sides with volume, low to mid fades (not high).
- Avoid: tall pompadours, high fades, anything that adds height on top.
</visagism_knowledge_base>

<hairstyle_naming_convention>
Use professional barbershop terminology. Always specify fade level + top style + distinguishing feature.
Valid examples: "Low Skin Fade with Textured Crop", "Mid Taper Fade with Side Part", "Disconnected Undercut with Slick Back", "French Crop with Line-Up", "Buzz Cut with Skin Fade (#2 on top)", "Edgar Cut with Low Taper".
</hairstyle_naming_convention>

<visual_description_format>
The visual_description field is CRITICAL — it will be injected DIRECTLY into an AI image generator prompt (Nano Banana 2).

RULES:
1. PURELY about the hairstyle — NEVER describe face, skin, body, or clothing.
2. TECHNICALLY PRECISE — use exact measurements: mm for fade grades, inches/cm for top length.
3. STRUCTURED in this order: sides → back → top → texture/finish → parting → product.
4. 60-120 words. English only.

EXCELLENT example:
"Skin fade starting at 0mm at the temples, blending to 3mm mid-temple, graduating to 12mm at the parietal ridge. Back: matching skin fade blending into a clean tapered neckline with soft edge-up. Top: 4 inches of layered hair with piece-y texture, swept to the right with a natural side part starting above the left eyebrow. Front: slight quiff with 2 inches of lift at the hairline. Texture: separated strands with natural movement and volume. Finish: matte clay product, no shine, lived-in look."

BAD example (DO NOT do this): "A cool modern haircut that would look great on him. Short on sides, longer on top. Styled nicely."
</visual_description_format>

<constraints>
- The client's preferences are: {{PREFERENCES}}
- If preferences conflict with face-shape suitability, prioritize the preference but note the trade-off in reasoning.
- The 2 suggestions MUST be meaningfully different (e.g., one conservative + one bolder, or different fade levels, or different top treatments). Never suggest two near-identical cuts.
- Write "reasoning" in Spanish (es-ES) — friendly professional tone, no jargon. This is shown to clients in Lugo, Spain.
- Write all other fields in English.
- If the client has thinning hair or receding hairline, factor this empathetically — suggest styles that work WITH the hairline.
- If the client has very curly or coily hair, recommend styles that leverage that texture rather than fighting it.
</constraints>
```

**User prompt:**

```
Three photographs of the client are attached:
- Photo 1 (front view): face centered, eyes visible, natural expression.
- Photo 2 (side profile): left or right profile showing ear, jawline, and hairline.
- Photo 3 (back of head): nape, crown, and hair growth pattern.

Client preferences: {{PREFERENCES_FORMATTED}}

Analyze the client's facial structure across all 3 photos and recommend 2 hairstyles.
```

**Variable `{{PREFERENCES_FORMATTED}}`:**

```
Format: "Length: [short|medium|long]. Style: [fade|classic|textured|no preference]. Beard: [keep current|include suggestion]. Hair type (self-reported): [straight|wavy|curly]."
Example: "Length: short. Style: fade. Beard: keep current. Hair type: wavy."
```

**Response schema (`responseSchema` en la API):**

```json
{
  "type": "object",
  "properties": {
    "face_shape": {
      "type": "string",
      "enum": ["oval", "round", "square", "heart", "diamond", "oblong"],
      "description": "Face shape classified from front-view using forehead-to-jaw ratio, cheekbone prominence, jawline angle"
    },
    "face_shape_confidence": {
      "type": "string",
      "enum": ["high", "medium", "mixed"],
      "description": "'mixed' if the face shows clear traits of 2 shapes (e.g., oval-square)"
    },
    "face_features": {
      "type": "object",
      "properties": {
        "forehead": { "type": "string", "description": "Width and height relative to face" },
        "cheekbones": { "type": "string", "description": "Prominence and width" },
        "jawline": { "type": "string", "description": "Definition and angle" },
        "chin": { "type": "string", "description": "Shape: pointed, square, rounded" },
        "symmetry_notes": { "type": "string", "description": "Notable asymmetries or 'Symmetrical'" }
      },
      "required": ["forehead", "cheekbones", "jawline", "chin", "symmetry_notes"]
    },
    "current_hair": {
      "type": "object",
      "properties": {
        "type": { "type": "string", "enum": ["straight", "wavy", "curly", "coily"] },
        "density": { "type": "string", "enum": ["thin", "medium", "thick"] },
        "current_length_top": { "type": "string", "description": "Approximate top length in cm" },
        "current_length_sides": { "type": "string", "description": "Approximate sides length" },
        "hairline": { "type": "string", "description": "straight, widow's peak, receding, mature, M-shaped" },
        "growth_direction": { "type": "string", "description": "Cowlicks, crown whorl direction" },
        "hair_color": { "type": "string", "description": "Natural color observed: dark brown, black, etc." }
      },
      "required": ["type", "density", "current_length_top", "hairline", "hair_color"]
    },
    "suggestions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "description": "Professional barbershop style name" },
          "visual_description": { "type": "string", "description": "AI image generation description. Sides>back>top>texture>parting>finish. English. 60-120 words. Hair ONLY." },
          "reasoning": { "type": "string", "description": "Why this flatters this face shape. Spanish (es-ES). Friendly. 2-3 sentences. Reference specific face features." },
          "difficulty": { "type": "string", "enum": ["easy", "medium", "advanced"] },
          "maintenance_frequency": { "type": "string", "description": "e.g. 'every 3-4 weeks'" },
          "products_needed": { "type": "string", "description": "e.g. 'matte clay' or 'pomade + hairspray'" },
          "styling_time_minutes": { "type": "integer", "description": "Daily styling time estimate" }
        },
        "required": ["name", "visual_description", "reasoning", "difficulty", "maintenance_frequency", "products_needed", "styling_time_minutes"]
      },
      "minItems": 2,
      "maxItems": 2
    }
  },
  "required": ["face_shape", "face_shape_confidence", "face_features", "current_hair", "suggestions"],
  "propertyOrdering": ["face_shape", "face_shape_confidence", "face_features", "current_hair", "suggestions"]
}
```

**Parámetros API:**

```javascript
{
  model: "gemini-3.1-flash-image-preview",
  generationConfig: {
    temperature: 0.15,        // Muy bajo: respuestas deterministas
    topP: 0.8,
    topK: 20,
    maxOutputTokens: 2048,
    responseMimeType: "application/json",
    responseSchema: SCHEMA_ABOVE
  }
}
```

---

### 6.2 Prompt de generación de imagen (Nano Banana 2 / Gemini 3.1 Flash Image)

Se envían las 3 fotos originales como imágenes de referencia junto con este prompt. Se ejecuta una llamada por peinado (2 total).

**Prompt template:**

```
Use the 3 attached reference photographs to identify this person. They show the SAME male client from three angles: front face, side profile, and back of head.

FACIAL IDENTITY LOCK — NON-NEGOTIABLE:
Preserve with 100% fidelity from reference photos:
• Every facial feature: exact eye shape and color, nose shape and size, lip shape, ear shape and size, eyebrow shape and thickness, jaw contour, chin shape
• Exact skin tone, complexion, visible freckles, moles, scars, or marks
• Exact facial hair state: {{BEARD_INSTRUCTION}}
• Neck, shoulder width, and body build
• Natural skin texture — do NOT smooth, retouch, beautify, age, or de-age
The output person MUST be immediately recognizable as the same person. Zero deviation.

HAIRSTYLE CHANGE — THE ONLY MODIFICATION:
Replace the current hairstyle with this new cut:
{{VISUAL_DESCRIPTION}}
Requirements for the new hairstyle:
• Natural hair color: {{HAIR_COLOR}}
• Natural hair texture: {{HAIR_TYPE}}
• Hair density: {{HAIR_DENSITY}}
• Must look freshly cut — as if the client just got up from the barber chair
• Realistic hair physics: natural fall, gravity, strand separation, volume
• Product finish as specified in the style description

IMAGE COMPOSITION — TRIPTYCH LAYOUT:
Single horizontal image, 16:9 landscape, divided into 3 panels:

┌─────────────────┬────────────┬────────────┐
│   FRONT VIEW    │ SIDE VIEW  │ BACK VIEW  │
│   (40% width)   │(30% width) │(30% width) │
│                 │            │            │
│ Face centered,  │ Profile    │ Back of    │
│ direct eye      │ matching   │ head,      │
│ contact, subtle │ ref photo  │ matching   │
│ confident smile,│ 2 angle,   │ ref photo  │
│ head slightly   │ showing    │ 3 angle,   │
│ tilted.         │ ear and    │ nape and   │
│ Shoulders       │ fade/taper │ crown      │
│ visible.        │ detail.    │ detail.    │
└─────────────────┴────────────┴────────────┘

Panel separation: subtle soft gradient transitions (not hard lines).
All 3 panels: SAME person, SAME hairstyle, consistent lighting.

PHOTOGRAPHY SPECIFICATIONS:
• Genre: professional barbershop portfolio, ultra-realistic, NOT artistic/painterly/illustrated
• Lighting: warm barbershop (3500K), bright and even, slight warm fill from right, subtle rim light on hair for texture/shine
• Background: softly blurred modern barbershop — dark wood shelving, warm Edison bulbs, mirror reflections. Consistent all panels.
• Camera: 85mm f/2.0, shallow DOF on background ONLY. Hair and face tack-sharp.
• Color grade: warm, slightly desaturated, professional (NOT Instagram-filtered)
• Hair detail: individual strands visible, realistic highlights/lowlights/shadows, three-dimensional volume
• Clothing: classic black barber cape/gown with white neck strip at collar — all 3 views

NEGATIVE CONSTRAINTS — DO NOT INCLUDE:
• No text, typography, labels, or watermarks
• No logos or branding
• No extra people, hands, or body parts
• No hats, sunglasses, or accessories not in references
• No unrealistic skin smoothing or beauty retouching
• No glowing, neon, or fantasy lighting
• No cartoon, illustration, anime, or painterly style
• No body proportion distortion
• No age/weight/ethnicity changes
• No background text (signs, posters with text)
```

**Variables dinámicas:**

| Variable | Fuente | Ejemplo |
|----------|--------|---------|
| `{{BEARD_INSTRUCTION}}` | Preferencias | `"Keep beard/facial hair EXACTLY as in reference photos — same length, shape, coverage"` o `"Suggest complementary well-groomed beard: short stubble, clean cheek lines, defined neckline"` |
| `{{VISUAL_DESCRIPTION}}` | `suggestions[N].visual_description` | `"Skin fade starting at 0mm at temples, blending to 3mm mid-temple, graduating to 12mm at parietal ridge. Back: matching fade, clean tapered neckline. Top: 4 inches layered with piece-y texture, swept right, natural side part above left eyebrow. Front: slight quiff, 2 inches lift. Finish: matte clay, no shine, lived-in movement."` |
| `{{HAIR_COLOR}}` | `current_hair.hair_color` | `"dark brown"` |
| `{{HAIR_TYPE}}` | `current_hair.type` | `"wavy"` |
| `{{HAIR_DENSITY}}` | `current_hair.density` | `"thick"` |

**Parámetros API:**

```javascript
{
  model: "gemini-3.1-flash-image-preview",
  generationConfig: {
    temperature: 0.75,         // Moderada: realismo con variación natural
    topP: 0.9,
    responseModalities: ["IMAGE"]
  }
}
```

---

### 6.3 Prompt para Modo B — "Probar un corte" (Nano Banana 2)

En el Modo B no hay análisis facial previo. El barbero escribe directamente lo que el cliente quiere y se envía a Nano Banana 2 junto con las 3 fotos de referencia. El texto del barbero se interpreta y se enriquece con un prompt wrapper.

**Prompt template:**

```
Use the 3 attached reference photographs to identify this person. They show the SAME male client from three angles: front face, side profile, and back of head.

FACIAL IDENTITY LOCK — NON-NEGOTIABLE:
Preserve with 100% fidelity from reference photos:
• Every facial feature: exact eye shape, eye color, nose shape, lip shape, ear shape, eyebrow shape, jaw contour, chin shape
• Exact skin tone, complexion, visible freckles, moles, scars, or marks
• Exact facial hair state: {{BEARD_INSTRUCTION}}
• Neck, shoulder width, and body build
• Natural skin texture — do NOT smooth, retouch, beautify, age, or de-age
The output person MUST be immediately recognizable as the same person. Zero deviation.

HAIRSTYLE — CLIENT'S REQUEST:
The client has requested this specific hairstyle: "{{BARBER_TEXT_INPUT}}"

Interpret the client's request as a professional barber would. If the description is informal or vague (e.g., "algo moderno"), apply your barbershop expertise to produce a realistic, well-executed version of what the client likely means. Use the client's natural hair color and texture from the reference photos.

The hairstyle must look freshly cut and professionally styled — as if the client just got up from the barber chair.

IMAGE COMPOSITION — TRIPTYCH LAYOUT:
Single horizontal image, 16:9 landscape, 3 panels:
LEFT (40%): Front view — face centered, direct eye contact, subtle confident smile.
CENTER (30%): Side profile — showing ear, sideburn, and fade/taper detail.
RIGHT (30%): Back view — showing nape, crown, and back styling detail.
Soft gradient transitions between panels. Same person, same hairstyle, consistent lighting.

PHOTOGRAPHY:
• Ultra-realistic barbershop portfolio photography, NOT artistic/painterly
• Warm barbershop lighting (3500K), bright, even, slight warm fill from right
• Background: softly blurred modern barbershop interior
• Camera: 85mm f/2.0, shallow DOF on background only
• Hair: individual strands visible, realistic highlights, three-dimensional volume
• Clothing: classic black barber cape with white neck strip — all 3 views

DO NOT INCLUDE: text, watermarks, logos, extra people, unrealistic smoothing, cartoon style, body distortion, age/ethnicity changes.
```

**Variable `{{BARBER_TEXT_INPUT}}`:** Texto escrito por el barbero tal cual. Ejemplos reales:
- `"Modern mullet con degradado bajo"`
- `"Skin fade alto con texturizado arriba, flequillo largo"`
- `"Corte clásico con raya al lado, tipo peaky blinders"`
- `"Buzz cut del 2 con fade"`
- `"Lo que lleva ahora pero más corto arriba y fade medio"`

> **Nota sobre idioma:** El barbero escribe en español. Nano Banana 2 entiende español correctamente para generación de imagen, ya que se apoya en el conocimiento multilingüe de Gemini. No es necesario traducir a inglés.

> **Nota sobre "Probar otro corte":** Cuando el cliente quiere probar otro peinado, se reutilizan las mismas 3 fotos de referencia (no se repite la captura). Solo se cambia el texto y se hace una nueva llamada.

**Parámetros API:**

```javascript
{
  model: "gemini-3.1-flash-image-preview",
  generationConfig: {
    temperature: 0.75,
    topP: 0.9,
    responseModalities: ["IMAGE"]
  }
}
```

---

### 6.4 Estrategia de fallback: generación por paneles separados

Si la composición triptych produce identidad inconsistente entre paneles, se activa el fallback automáticamente:

**Prompt por vista individual (se ejecuta 3 veces variando ángulo):**

```
Use the attached reference photos to identify this person. Preserve face and identity with 100% accuracy — zero deviation from reference.

Apply this new hairstyle: {{VISUAL_DESCRIPTION}}

Generate a single {{VIEW_ANGLE}} photograph of this person with the new haircut.

Photography: ultra-realistic barbershop portfolio, 85mm f/2.0, warm lighting (3500K), blurred barbershop background, black barber cape with white neck strip. Hair in tack-sharp focus with visible strand detail. Natural hair color: {{HAIR_COLOR}}. Texture: {{HAIR_TYPE}}.

Do NOT: add text, smooth skin, change face, add accessories, use artistic/cartoon style.
```

| `{{VIEW_ANGLE}}` | Instrucción adicional |
|-------------------|----------------------|
| `front-facing portrait` | `Face centered, direct eye contact, subtle confident smile. Shoulders visible.` |
| `side profile portrait` | `Profile showing ear, jawline, sideburn, and fade graduation detail.` |
| `back-of-head portrait` | `Back view showing nape, crown, and styling. Head slightly tilted forward.` |

> **Trade-off:** 6 llamadas por cliente (3 vistas × 2 peinados). Coste: ~$0.27–$0.40. La composición se hace en Canvas API en el frontend.

---

### 6.5 Consideraciones técnicas de implementación

1. **Structured Output API:** `responseMimeType: "application/json"` + `responseSchema` con `propertyOrdering` (requerido por Gemini 3+). JSON válido garantizado sin parsing.

2. **Fotos como reference images:** Se envían como `inline_data` (base64, MIME `image/jpeg`) en el array de `parts`. Nano Banana 2 soporta hasta 14 referencias; usamos 3. Comprimir a ~1024px y JPEG 85% antes de enviar (~1,290 tokens/imagen).

3. **Constraint placement (Gemini 3 best practice):** Restricciones de identidad ANTES de la instrucción creativa. Negative constraints AL FINAL como guardrails de output.

4. **Composición triptych vs. paneles:** Prompt principal: 3 vistas en 1 imagen. Fallback automático: si el resultado tiene inconsistencia facial entre paneles (detectable por el barbero), botón "Regenerar por separado" activa modo paneles.

5. **Barber cape trick:** El prompt incluye "black barber cape with white neck strip" intencionalmente: (a) oculta la ropa real del cliente (evita discrepancias), (b) refuerza el contexto de barbería para el modelo.

6. **Iteración de prompts (CRÍTICO):**
   - Mantener `prompts/CHANGELOG.md` con versiones y resultados.
   - Testear con 10+ fotos reales (diferentes rostros, tipos de pelo, edades, tonos de piel).
   - Evaluar: fidelidad de identidad, realismo del peinado, coherencia entre paneles.
   - Los prompts son el 80% del valor del producto.

7. **Temperatura:** Análisis facial: `0.15` (determinista). Generación de imagen: `0.75` (variedad controlada). Validación: `0.1`.

8. **Aspect ratio:** Triptych: 16:9 landscape (vía prompt + parámetro API si disponible). Paneles individuales: 3:4 portrait.

9. **Compresión de fotos input:** Redimensionar a máx 1024×1024px, JPEG 85%. Reduce tokens y latencia sin perder información facial.

10. **Paralelización:** Las 2 llamadas de generación de imagen (peinado A y B) se pueden ejecutar en paralelo (`Promise.all`). Esto reduce la latencia percibida de ~12-16s a ~6-8s.


---

## 7. Análisis de Costes

### 7.1 Costes de infraestructura (Free Tier)

| Servicio | Free Tier | Uso estimado/mes | Coste mensual |
|----------|-----------|-----------------|---------------|
| Vercel (hosting) | 100GB ancho de banda, builds ilimitados | < 5GB | $0 |
| Supabase | 500MB DB, 50K auth MAU, 500K Edge invocations | < 1MB DB, 2 usuarios, ~600 invocaciones | $0 |
| Google AI Studio (Gemini API) | ~500 requests/día, free tier | ~600 requests/mes (10 clientes/día × 3 calls × 20 días) | $0 |
| Dominio (opcional) | N/A | estefanaivision.com o similar | ~12€/año |

**Coste mensual total en free tier: $0** (excluyendo dominio opcional).

### 7.2 Escenario de crecimiento (si supera free tier)

| Escenario | Clientes/día | Calls API/mes | Coste API/mes | Coste total/mes |
|-----------|-------------|--------------|--------------|----------------|
| Free tier (MVP) | ~10 | ~600 | $0 | $0 |
| Uso medio | ~20 | ~1.200 | ~$6–8 | ~$8 |
| Uso alto | ~30 | ~1.800 | ~$12–15 | ~$15 |
| Máximo 2 barberos | ~40 | ~2.400 | ~$16–20 | ~$20 |

> Incluso en el escenario máximo, el coste operativo es inferior a 20€/mes, muy por debajo del valor percibido por el cliente.

---

## 8. Requisitos No Funcionales

| Requisito | Especificación | Métrica |
|-----------|---------------|---------|
| Rendimiento | Tiempo total desde captura hasta resultado | < 30 segundos |
| Disponibilidad | Uptime mínimo del servicio | 99.5% |
| Compatibilidad | Dispositivos soportados | Android 10+ / iOS 15+ / Chrome, Safari |
| PWA | Instalable como app nativa | Manifest + Service Worker + HTTPS |
| Responsive | Adaptación a pantallas | Optimizado para tablet (principal) y móvil |
| Accesibilidad | Uso en entorno de barbería | Contraste alto, botones grandes, uso con una mano |
| Privacidad | Datos del cliente | Zero data retention en servidor. Sin cookies de tracking. |
| Idioma | Interfaz de usuario | Español (España) |
| Offline | Funcionalidad sin conexión | Solo captura de fotos. Análisis requiere conexión. |
| Descarga | Imágenes exportables | JPG/PNG con logo de la barbería integrado |

---

## 9. Estructura para Claude Code (Capsule Corp Flow)

Este proyecto se desarrollará usando el framework Capsule Corp Flow con Claude Code. La asignación de agentes para Estefan AI Vision es la siguiente:

| Agente (Personaje) | Rol | Responsabilidades en este proyecto |
|--------------------|-----|-----------------------------------|
| Bulma (Opus 4.6) | Lead / Arquitecta | Orquestación general. Revisión de PRD. Decisiones arquitectónicas. Prompt engineering. |
| Goku (Sonnet 4.6) | Backend | Supabase Edge Functions (proxy API Gemini). Auth. Lógica de procesamiento de imágenes. |
| Vegeta (Sonnet 4.6) | Frontend | Componentes React 19. UI/UX de captura de fotos, selectores, pantalla de resultados. Composición de logo con Canvas API. PWA config. |
| Piccolo (Sonnet 4.6) | Base de datos | Migraciones Supabase. RLS policies. Tabla barber_profiles y app_config. |
| Trunks del Futuro (Sonnet 4.6) | NEXO (Tests/Deploy) | Tests E2E. Configuración Vercel. CI/CD. Documentación técnica. |

### 9.1 Estructura de archivos Claude Code

```
.claude/
├── agents/          # Configuración de cada agente (Bulma, Goku, Vegeta, Piccolo, Trunks)
├── rules/           # Stack inmutable, convenciones de código, principios de seguridad
docs/
├── PRD_EstefanAIVision.md           # Este documento
├── DisenoEstefanAIVision.md         # Guía de diseño UX/UI (documento separado)
public/
├── logo.png                        # Logo de la barbería (proporcionado por el cliente)
```

---

## 10. Roadmap de Desarrollo

### 10.1 Fase 1: MVP (2–3 semanas)

| Semana | Entregable | Agente responsable |
|--------|-----------|-------------------|
| Semana 1 | Setup proyecto (Next.js + Supabase + Vercel). Auth barbero. Estructura de carpetas. | Piccolo + Trunks |
| Semana 1 | UI de captura de fotos con cámara del dispositivo. Pantalla de preferencias. | Vegeta |
| Semana 2 | Edge Function proxy para Gemini API. Prompt de análisis facial. Prompt de generación. | Goku |
| Semana 2 | Pantalla de resultados con descarga. Composición de logo con Canvas API. Loading states. Flujo completo E2E. | Vegeta + Goku |
| Semana 3 | PWA config (manifest, service worker, icons). Testing completo. Deploy Vercel. | Trunks |
| Semana 3 | Revisión UX con barbero. Ajustes de prompts según resultados reales. Integración del logo real. | Bulma |

### 10.2 Fase 2: Refinamiento (post-MVP)

- Optimización de prompts basada en feedback real del barbero y clientes.
- Mejora de guías visuales de captura de foto (overlay AR-like para posición del rostro).
- Añadir opción de compartir resultados por WhatsApp (si el cliente lo solicita).
- Historial básico de consultas (opcional, con consentimiento).
- Branding personalizable para escalar a otras barberías.
- Configuración de posición y estilo del logo (marca de agua vs banner).

---

## 11. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| Calidad inconsistente de generación de imágenes | Media | Alto | Prompt engineering iterativo. Botón "Regenerar". Testing con fotos reales variadas. |
| Reducción del free tier de Google AI | Media | Medio | Arquitectura preparada para migrar a API de pago con coste mínimo (~$15/mes). |
| Fotos de mala calidad (iluminación barbería) | Alta | Medio | Guías visuales en pantalla. Recomendación de iluminación al barbero. Pre-procesamiento de imagen. |
| Latencia percibida como lenta | Baja | Medio | Loading states premium con mensajes progresivos. Generación en paralelo de ambas imágenes. |
| Privacidad: preocupación del cliente por sus fotos | Baja | Alto | Comunicación clara: las fotos no se guardan. Mensaje visible en la UI. Sin almacenamiento en servidor. |
| Cambios en la API de Gemini / Nano Banana | Baja | Medio | Abstracción de la capa de IA en Edge Functions. Cambiar modelo requiere cambiar solo el proxy. |
| Logo no proporcionado por el barbero | Baja | Bajo | Las imágenes se descargan sin branding. Aviso en configuración. |

---

## 12. Criterios de Aceptación del MVP

1. El barbero puede hacer login con usuario y contraseña y mantener sesión activa.
2. Se pueden capturar 3 fotos (frontal, lateral, trasera) desde la cámara del dispositivo.
3. Cada foto puede repetirse antes de confirmar.
4. Se pueden seleccionar preferencias del cliente en menos de 10 segundos.
5. La IA devuelve 2 sugerencias de peinado con justificación en menos de 15 segundos.
6. Se generan 2 imágenes fotorrealistas del cliente con los peinados sugeridos.
7. Cada imagen muestra los 3 ángulos (frontal, lateral, trasero) del cliente.
8. Los resultados se muestran de forma clara y profesional en pantalla.
9. **Las imágenes se pueden descargar individualmente con el logo de la barbería integrado.**
10. **El logo se muestra correctamente como banner inferior o marca de agua en las imágenes descargadas.**
11. No se almacenan fotos, resultados ni datos del cliente en el servidor en ningún momento.
12. La aplicación es instalable como PWA en tablet y móvil.
13. Los errores de API se manejan con mensajes amigables y opción de reintento.
14. El flujo completo (de captura a resultado) se completa en menos de 45 segundos.
15. **Modo B: el barbero puede escribir una descripción libre de un peinado y generar una imagen del cliente con ese corte.**
16. **Modo B: el botón "Probar otro corte" permite generar nuevos peinados sin repetir la captura de fotos.**
17. **El selector de modo (A/B) aparece después de la captura de fotos y permite cambiar entre modos sin perder las fotos.**

---

*— Fin del PRD —*
