# Estefan AI Vision — Guía de Diseño UX/UI

**Proyecto:** Estefan AI Vision  
**Cliente:** Estefan Acosta Barber Shop, Lugo  
**Versión:** 1.0  
**Fecha:** 26 de marzo de 2026  
**Documento complementario a:** PRD_EstefanAIVision.md  

---

## 1. Principios de Diseño

- **Minimalismo operativo:** El barbero tiene las manos ocupadas (a veces con guantes, tijeras, producto). Debe poder operar la app con pocos toques y botones grandes.
- **Impacto visual:** Los resultados deben verse premium para impresionar al cliente. Es el momento "wow" de la experiencia.
- **Branding coherente:** Estética de barbería profesional alineada con la marca Estefan Acosta.
- **Zero friction:** Cada pantalla tiene un objetivo claro y un solo botón de acción principal.
- **Touch-first:** Diseñado para tablet como dispositivo principal, adaptable a móvil.

---

## 2. Identidad Visual

### 2.1 Paleta de colores

| Rol | Color | Hex | Uso |
|-----|-------|-----|-----|
| Primario | Negro profundo | `#1A1A2E` | Fondos principales, texto de títulos |
| Acento | Dorado barbería | `#D4A854` | CTAs, iconos activos, detalles premium |
| Fondo | Blanco crema | `#F5F0EB` | Fondos de tarjetas, áreas de contenido |
| Secundario | Gris oscuro | `#2D2D3A` | Texto secundario, bordes sutiles |
| Éxito / Activo | Verde acento | `#4ECDC4` | Estados de confirmación, indicadores de progreso |
| Error | Rojo cálido | `#E74C3C` | Mensajes de error, alertas |
| Texto principal | Casi negro | `#1C1C1C` | Cuerpo de texto |
| Texto secundario | Gris medio | `#6B7280` | Descripciones, labels |

### 2.2 Tipografía

| Tipo | Fuente | Peso | Uso |
|------|--------|------|-----|
| Display / Títulos | Playfair Display | Bold (700) | Logo en pantalla, títulos de sección, nombre de la app |
| Cuerpo / UI | DM Sans | Regular (400), Medium (500), Bold (700) | Texto funcional, botones, labels, descripciones |
| Monospace (código/datos) | JetBrains Mono | Regular (400) | Contador de usos, datos técnicos (si se muestran) |

### 2.3 Iconografía

- Estilo: línea fina (stroke), monocolor, esquinas redondeadas.
- Librería recomendada: Lucide React (consistente con el stack).
- Tamaño mínimo: 24px para táctil, 20px para informativo.
- Color de iconos: `#D4A854` (dorado) para acciones principales, `#6B7280` (gris) para secundarios.

### 2.4 Bordes y sombras

- Border radius: `12px` para tarjetas y contenedores, `8px` para botones e inputs.
- Sombras: sutiles, estilo `0 4px 12px rgba(0,0,0,0.08)` para elevación.
- Sin bordes duros. Separación visual mediante espaciado y contraste de fondo.

### 2.5 Logo y branding

- **Logo recibido:** Monograma "EA" (Estefan Acosta) — diseño geométrico con las letras E y A entrelazadas. Estilo moderno, líneas gruesas y angulares, negro sobre blanco. Transmite solidez y profesionalidad.
- **Archivo:** `/public/logo-ea.png` (PNG, fondo blanco). Se necesitará una versión con fondo transparente para el banner de las imágenes descargadas.
- **Variantes a generar para la app:**
  - Logo sobre fondo oscuro: invertir a blanco o dorado `#D4A854` sobre `#1A1A2E`.
  - Logo miniatura para header: 32×32px, monograma EA simplificado.
  - Logo para favicon/PWA: monograma EA centrado en cuadrado, fondo `#1A1A2E`, logo dorado.
- **Logo de la app ("Estefan AI Vision"):** Monograma EA + texto "Estefan AI Vision" en Playfair Display. El monograma funciona como icono standalone sin necesidad de texto.
- **Para las imágenes descargadas:** Banner inferior de 60-80px con fondo `#1A1A2E` al 85% opacidad. Monograma EA en dorado a la izquierda + texto "Estefan Acosta Barber Shop • Lugo" en DM Sans a la derecha. Opción alternativa: monograma EA como marca de agua centrada al 15% opacidad.

---

## 3. Mapa de Pantallas

```
[Login] → [Home] → [Captura Frontal] → [Captura Lateral] → [Captura Trasera]
                                                                     ↓
                                                            [Selector de Modo]
                                                            ↙                ↘
                                                   MODO A                  MODO B
                                              "La IA sugiere"        "Probar un corte"
                                                    ↓                       ↓
                                             [Preferencias]        [Describir corte]
                                                    ↓                       ↓
                                              [Loading IA]           [Loading IA]
                                                    ↓                       ↓
                                         [Resultados: 2 opciones]  [Resultado: 1 imagen]
                                          ↙        ↓                  ↓         ↘
                                  [Descargar] [Nueva consulta] [Probar otro] [Descargar]
                                                                     ↓
                                                            (vuelve a Modo B
                                                            con mismas fotos)
```

---

## 4. Especificación de Pantallas

### 4.1 Login

**Objetivo:** El barbero se identifica.

| Elemento | Especificación |
|----------|---------------|
| Fondo | Gradiente oscuro `#1A1A2E` → `#2D2D3A` con textura sutil de barbería |
| Logo | Centrado, grande. Logo de la barbería + "Estefan AI Vision" debajo |
| Campos | Email + contraseña. Inputs con fondo ligeramente más claro, borde dorado al foco |
| CTA | Botón "Entrar" — fondo dorado `#D4A854`, texto negro, ancho completo |
| Extra | Checkbox "Mantener sesión" activado por defecto |
| Tamaño CTA | Mínimo 56px de alto (táctil) |

### 4.2 Home

**Objetivo:** Punto de partida. Una sola acción posible.

| Elemento | Especificación |
|----------|---------------|
| Fondo | Fondo crema `#F5F0EB` |
| Header | Logo de la barbería (pequeño) + nombre del barbero logueado + botón logout (icono) |
| Centro | Botón grande circular o cuadrado redondeado "Nueva consulta" con icono de cámara + tijeras |
| Tamaño botón | ~200px × 200px en tablet, ~150px en móvil |
| Color botón | Dorado con efecto hover/press |
| Footer | Contador discreto: "X consultas hoy" (calculado localmente, no persiste) |

### 4.3 Captura Fotográfica (3 pantallas: Frontal / Lateral / Trasera)

**Objetivo:** Tomar una foto guiada.

| Elemento | Especificación |
|----------|---------------|
| Visor cámara | Ocupa el 75% superior de la pantalla |
| Overlay guía | Silueta semitransparente del ángulo esperado (frontal: óvalo de cara, lateral: perfil, trasera: nuca). Color: dorado `#D4A854` al 30% opacidad |
| Indicador paso | "Foto 1/3: Frontal" — barra de progreso dorada con 3 segmentos |
| Instrucción | Texto breve en la parte superior: "Centra el rostro del cliente en la guía" |
| Botón captura | Círculo grande (80px) centrado abajo. Icono de cámara. Dorado. |
| Post-captura | Preview de la foto tomada. Dos botones: "Repetir" (outline) y "Confirmar ✓" (dorado sólido) |
| Miniatura | Las fotos ya confirmadas se muestran como miniaturas (40px) en la esquina inferior |

### 4.4 Preferencias del Cliente

**Objetivo:** Seleccionar las preferencias en ~5 segundos.

| Elemento | Especificación |
|----------|---------------|
| Layout | Grid de 4 secciones, cada una con selector tipo "chip" (botones píldora) |
| Sección 1 | **Longitud:** Corto / Medio / Largo — iconos de siluetas de pelo |
| Sección 2 | **Estilo:** Fade / Clásico / Texturizado / Sin preferencia — iconos de cortes |
| Sección 3 | **Barba:** Mantener / Incluir sugerencia — iconos de barba |
| Sección 4 | **Tipo de pelo:** Liso / Ondulado / Rizado — iconos de texturas |
| Selección | Chip seleccionado: fondo dorado, texto negro. No seleccionado: fondo gris claro, texto gris |
| Preview | Strip horizontal con las 3 fotos tomadas (confirmación visual) |
| CTA | Botón "Analizar con IA ✨" — grande, dorado, ancho completo |
| Default | "Sin preferencia" preseleccionado en estilo. El resto sin selección previa. |

### 4.5 Selector de Modo (nueva pantalla — después de captura de fotos)

**Objetivo:** El barbero elige cómo quiere usar la IA.

| Elemento | Especificación |
|----------|---------------|
| Layout | 2 tarjetas grandes lado a lado (tablet) o apiladas (móvil) |
| Tarjeta Modo A | Icono de cerebro/IA + título "La IA sugiere" + descripción: "Analizo el rostro y propongo 2 peinados ideales" + color dorado |
| Tarjeta Modo B | Icono de teclado/texto + título "Probar un corte" + descripción: "Escribe un peinado y te muestro cómo quedaría" + color verde acento `#4ECDC4` |
| Preview fotos | Strip horizontal debajo con las 3 fotos confirmadas (recordatorio visual) |
| Tamaño tarjetas | ~45% del ancho cada una en tablet. Full-width en móvil. Mínimo 120px de alto. |
| Feedback táctil | Al tocar: scale 0.97 + borde dorado/verde según modo |

### 4.6 Describir Corte (Modo B)

**Objetivo:** El barbero escribe el peinado que el cliente quiere probar.

| Elemento | Especificación |
|----------|---------------|
| Campo de texto | `textarea` grande, mínimo 3 líneas visibles. Fondo claro, borde sutil, borde dorado al foco |
| Placeholder | Texto gris: "Ej: Modern mullet con degradado bajo..." |
| Ejemplos rápidos | Chips pulsables debajo del campo con sugerencias frecuentes: "Skin fade + crop", "Mullet moderno", "Corte clásico", "Buzz cut fade", "Texturizado largo". Al pulsar un chip, se inserta el texto en el campo. |
| Selector barba | Igual que en Modo A: "Mantener actual" / "Incluir sugerencia" |
| Preview fotos | Strip horizontal con las 3 fotos (igual que en preferencias) |
| CTA | Botón "Generar preview ✨" — grande, dorado, ancho completo |
| Validación | El campo no puede estar vacío. Mínimo 5 caracteres. Mensaje: "Describe el corte que quiere probar." |

### 4.7 Resultado Modo B (imagen única)

**Objetivo:** Mostrar 1 resultado a pantalla completa con opciones de iteración.

| Elemento | Especificación |
|----------|---------------|
| Imagen | Ocupa el 60-70% de la pantalla. Full-width en móvil. Border-radius 16px. |
| Texto referencia | Debajo de la imagen, en un chip/badge: el texto que escribió el barbero. Estilo label, fondo `#F0F0F0`. |
| Botón descargar | Icono descarga + "Descargar" — outline dorado. A la derecha del texto. |
| Botón "Probar otro corte" | Botón grande, estilo secundario verde `#4ECDC4`: "Probar otro corte". Vuelve al paso 4.6 con las mismas fotos. |
| Botón "Cambiar a Modo IA" | Botón outline sutil: "Que la IA sugiera" → va a Preferencias (Modo A) con las mismas fotos. |
| Botón "Nueva consulta" | Botón outline gris en la parte inferior: reinicia todo (nuevas fotos + nuevo cliente). |

### 4.8 Loading IA

**Objetivo:** Gestionar la espera de forma premium (15–25 segundos).

| Elemento | Especificación |
|----------|---------------|
| Fondo | Oscuro `#1A1A2E` para contraste dramático |
| Animación central | Silueta de rostro con líneas de escaneo (tipo sci-fi). Animación suave. |
| Mensajes rotativos | Cada 3s cambia: "Analizando la forma del rostro..." → "Identificando proporciones..." → "Buscando el peinado perfecto..." → "Generando tu nuevo look..." |
| Barra de progreso | Lineal, dorada, debajo de la animación. Progreso estimado (no real). |
| Branding sutil | "Estefan AI Vision" en texto pequeño en la parte inferior |

### 4.9 Resultados Modo A

**Objetivo:** Mostrar las 2 propuestas y permitir descarga.

| Elemento | Especificación |
|----------|---------------|
| Layout tablet | 2 tarjetas lado a lado, cada una ocupa el 48% del ancho |
| Layout móvil | Carrusel horizontal con indicador de puntos |
| Tarjeta | Fondo blanco, sombra sutil, border-radius 16px |
| Imagen | Ocupa la parte superior de la tarjeta. Aspect ratio 16:9 o 3:2. Bordes redondeados arriba. |
| Nombre peinado | Título con Playfair Display Bold. Ej: "Skin Fade Texturizado" |
| Justificación | Texto DM Sans regular, 14px, color gris. 2–3 líneas máximo. Ej: "Ideal para tu rostro ovalado: el degradado lateral estiliza..." |
| Botón descargar | Icono de descarga + "Descargar" — dentro de cada tarjeta. Estilo outline dorado. |
| Botón regenerar | Secundario, debajo de ambas tarjetas: "🔄 Regenerar sugerencias" |
| CTA principal | Botón grande inferior: "Nueva consulta" — dorado sólido |
| Forma del rostro | Badge discreto en la parte superior: "Tu rostro: Ovalado" con icono |

### 4.10 Imagen descargada (composición con logo)

**Objetivo:** Imagen profesional que el cliente se lleva y comparte.

| Elemento | Especificación |
|----------|---------------|
| Imagen principal | La imagen generada por IA con los 3 ángulos del peinado |
| Banner inferior | Franja de 60–80px, fondo `#1A1A2E` al 85% opacidad |
| Logo izquierda | Monograma "EA" en dorado `#D4A854`, 40×40px, con padding de 10px desde el borde izquierdo |
| Texto centro-derecha | "Estefan Acosta Barber Shop • Lugo" en DM Sans Regular 14px, color `#F5F0EB` (crema) |
| Powered by (opcional) | "Powered by Estefan AI Vision" en DM Sans 10px, color `#6B7280`, debajo del texto principal |
| Marca de agua alternativa | Monograma EA centrado en la imagen, 200×200px, opacidad 12%, dorado `#D4A854`. Se activa si el barbero lo prefiere al banner. |
| Formato | JPG calidad 92% (balance tamaño/calidad para compartir por WhatsApp) |
| Nombre archivo | `estefan-ai-[fecha]-[hora].jpg` (ej: `estefan-ai-2026-03-26-1430.jpg`) |

---

## 5. Componentes UI Reutilizables

### 5.1 Botón primario (CTA)

```
- Fondo: #D4A854 (dorado)
- Texto: #1A1A2E (negro), DM Sans Bold, 16px
- Altura: 56px mínimo
- Border-radius: 12px
- Hover/Active: brillo +10%, scale 0.98
- Disabled: opacidad 50%
- Full-width en móvil
```

### 5.2 Botón secundario

```
- Fondo: transparente
- Borde: 1.5px solid #D4A854
- Texto: #D4A854, DM Sans Medium, 14px
- Altura: 48px
- Border-radius: 8px
```

### 5.3 Chip selector

```
- No seleccionado: fondo #F0F0F0, texto #6B7280, borde none
- Seleccionado: fondo #D4A854, texto #1A1A2E, borde none
- Altura: 44px
- Border-radius: 22px (píldora)
- Padding horizontal: 20px
- Transición: 150ms ease
```

### 5.4 Tarjeta de resultado

```
- Fondo: #FFFFFF
- Sombra: 0 4px 20px rgba(0,0,0,0.08)
- Border-radius: 16px
- Padding interno: 0 (imagen edge-to-edge arriba), 20px (contenido texto)
- Ancho: 48% en tablet, 100% en móvil
```

### 5.5 Input de texto (login)

```
- Fondo: rgba(255,255,255,0.08) (sobre fondo oscuro)
- Borde: 1px solid rgba(255,255,255,0.2)
- Foco: borde #D4A854
- Texto: #F5F0EB
- Placeholder: rgba(255,255,255,0.4)
- Altura: 52px
- Border-radius: 10px
- Padding: 0 16px
```

---

## 6. Responsive Breakpoints

| Breakpoint | Dispositivo | Layout |
|------------|------------|--------|
| ≥ 1024px | Tablet landscape (principal) | 2 columnas en resultados, sidebar si aplica |
| 768px – 1023px | Tablet portrait | 2 columnas en resultados, más compacto |
| < 768px | Móvil | 1 columna, carrusel en resultados, botones full-width |

El diseño se optimiza primero para **tablet** (el dispositivo principal del barbero), con adaptación a móvil como secundario.

---

## 7. Animaciones y Microinteracciones

| Interacción | Animación |
|-------------|-----------|
| Transición entre pantallas | Slide horizontal suave (300ms ease-out) |
| Captura de foto | Flash blanco breve (150ms) + vibración háptica |
| Selección de chip | Scale 0.95 → 1.0 + cambio de color (150ms) |
| Loading IA | Pulso de silueta (2s loop) + fade de texto (3s) |
| Aparición de resultados | Fade in + slide up escalonado (tarjeta 1 a 0ms, tarjeta 2 a 150ms) |
| Botón presionado | Scale 0.97 (100ms) + ripple sutil |
| Descarga | Icono anima hacia abajo + toast de confirmación |

---

## 8. Estados de Carga y Error

### 8.1 Mensajes de loading rotativos

1. "Analizando la forma del rostro..."
2. "Identificando proporciones faciales..."
3. "Buscando el peinado perfecto para ti..."
4. "Generando tu nuevo look..."
5. "Últimos retoques..."

### 8.2 Mensajes de error

| Error | Mensaje | Tono |
|-------|---------|------|
| API no responde | "La IA está ocupada ahora mismo. ¿Lo intentamos de nuevo?" | Amigable |
| Límite diario | "Has llegado al límite de hoy. Mañana más y mejor." | Informativo |
| Sin internet | "Sin conexión. Conéctate a internet para analizar." | Neutro |
| Foto no válida | "Esa foto no ha quedado bien. ¿La repetimos?" | Positivo |
| Error genérico | "Algo no ha salido bien. Inténtalo de nuevo." | Neutro |

---

## 9. Consideraciones de Accesibilidad en Barbería

- **Contraste alto:** ratio mínimo 4.5:1 para texto sobre fondos.
- **Botones grandes:** mínimo 44px × 44px zona de toque (WCAG), recomendado 56px para CTA.
- **Sin texto pequeño:** tamaño mínimo de texto 14px.
- **Legible a distancia:** el cliente puede ver los resultados desde el sillón (a ~60cm de la pantalla).
- **Modo una mano:** las acciones principales están en la mitad inferior de la pantalla.
- **Sin gestos complejos:** no requiere swipe largo, pinch-to-zoom ni gestos multi-touch.

---

## 10. Assets Pendientes del Cliente

| Asset | Estado | Notas |
|-------|--------|-------|
| Logo de la barbería (PNG) | ✅ Recibido | Monograma "EA" geométrico, negro sobre blanco. Estilo moderno, líneas gruesas, angular. Archivo: `1000140957.png`. Ubicación en proyecto: `/public/logo-ea.png` |
| Fotos del local (para inspiración de fondo/texturas) | ⏳ Opcional | Podrían usarse como fondos sutiles en la UI |
| Colores de marca oficiales | ✅ Confirmado (parcial) | Logo es negro puro sobre blanco. La paleta dorado+negro propuesta complementa perfectamente el monograma. Confirmar con Estefan. |
| Icono de la app (para PWA) | 🔨 Por crear | Se generará a partir del monograma EA recibido. Versiones: 192×192 y 512×512 con fondo `#1A1A2E` y logo en dorado `#D4A854`. |
| Splash screen | 🔨 Por crear | Monograma EA centrado + texto "Estefan AI Vision" debajo en Playfair Display. Fondo `#1A1A2E`. |

---

*— Fin de la guía de diseño —*
