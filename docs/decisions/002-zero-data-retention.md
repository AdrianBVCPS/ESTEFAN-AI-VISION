# ADR-002: Zero data retention para fotos y resultados

**Estado:** Aprobado  
**Fecha:** 2026-04-01  
**Contexto:** Política de privacidad para datos de clientes de la barbería

## Decisión

Las fotos del cliente y los resultados generados por IA **nunca** se almacenan en:
- Servidor (BD, storage, logs)
- localStorage / sessionStorage / cookies / IndexedDB
- Disco del dispositivo (salvo descarga explícita del barbero)

Todo vive en React state (memoria) y se destruye al navegar fuera o pulsar "Nueva consulta".

## Consecuencias

- No hay historial de consultas
- Cada sesión es efímera
- `URL.createObjectURL()` siempre con cleanup `revokeObjectURL()`
- Proxy Gemini no loguea contenido de imágenes
- Skill `/privacy-scan` verifica cumplimiento

## Motivación

- Privacidad del cliente (no consiente almacenamiento)
- Simplifica arquitectura (menos tablas, menos RLS)
- Reduce riesgo legal (GDPR, LOPDGDD)
