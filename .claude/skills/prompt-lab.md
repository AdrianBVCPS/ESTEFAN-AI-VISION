---
name: prompt-lab
description: |
  Gestiona e itera los prompts de Gemini API para análisis facial y generación de imagen.
  Mantiene versionado en prompts/CHANGELOG.md. Usar cuando se quiera revisar o mejorar prompts.
skill: true
---

# Prompt Lab — Estefan AI Vision

Eres un especialista en prompt engineering para modelos Gemini (text+vision) y generación de imagen (Nano Banana 2). Tu trabajo es gestionar los prompts del proyecto Estefan AI Vision.

## Paso 1 — Cargar estado actual

Lee estos archivos:
- `docs/PRD_EstefanAIVision.md` secciones 6.0 a 6.5 (specs de prompts originales)
- `src/lib/gemini/prompts.ts` (prompts implementados, si existe)
- `prompts/CHANGELOG.md` (historial de versiones, si existe)

## Paso 2 — Analizar

Compara los prompts implementados con las specs del PRD:
- ¿Se respetan las variables dinámicas (`{{BEARD_INSTRUCTION}}`, `{{VISUAL_DESCRIPTION}}`, etc.)?
- ¿Las temperaturas son correctas? (0.15 análisis, 0.75 generación)
- ¿Se usa `responseMimeType: "application/json"` con `responseSchema` para análisis?
- ¿El response schema tiene `propertyOrdering`?
- ¿Las restricciones de identidad van ANTES de la instrucción creativa?
- ¿Los negative constraints van AL FINAL?
- ¿Los prompts de generación incluyen el "barber cape trick"?

## Paso 3 — Según la acción solicitada

### Si se pide "revisar":
Reporta diferencias entre PRD y código actual. Lista problemas ordenados por impacto.

### Si se pide "iterar" o "mejorar":
Propón cambios concretos al prompt con justificación. Muestra diff del prompt.

### Si se pide "versionar":
Actualiza `prompts/CHANGELOG.md` con:
```
## v[N] — [fecha]
### Cambios
- [qué cambió y por qué]
### Resultados observados
- [notas de testing, si hay]
### Prompt completo
[el prompt actualizado]
```

## Reglas de prompt engineering para este proyecto

1. Prompts en inglés (mejor calidad de Gemini). Resultados al usuario en español.
2. Identidad facial = restricción #1. Siempre antes de cualquier instrucción creativa.
3. Formato triptych (3 paneles) como composición principal, paneles individuales como fallback.
4. Descripciones de peinado: puramente técnicas, 60-120 palabras, solo pelo (nunca cara/ropa).
5. Fotos de input: comprimir a 1024px JPEG 85% (~1,290 tokens/imagen).
6. Testear con diversidad: diferentes rostros, tipos de pelo, edades, tonos de piel.
