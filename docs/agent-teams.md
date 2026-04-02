# Delegación: Subagentes y Agent Teams

> Sesión única es la norma con 1M de contexto. Agent Teams es DISPONIBLE, no obligatorio.

## Subagentes (dentro de una sesión)

Tareas enfocadas en contexto aislado con Sonnet 4.6 [1m]. Resultado devuelto al agente principal.
**Cuándo:** investigar bug, generar componente, research, analizar archivo.

## Agent Teams (múltiples sesiones en paralelo)

### Activación
```json
{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
```

### Cuándo proponerlos
Feature con 2+ capas independientes · Code review multiperspectiva · Debugging con hipótesis competidoras.

### Cuándo NO
Tareas lineales · Fixes pequeños · Ediciones en el mismo archivo.

### Cómo proponerlos
Presentar a Adrian: nº teammates, qué hace cada uno, file ownership sin solapamiento, Sonnet 4.6. **Esperar aprobación.**

### División de tareas
Claude Code define interfaces compartidas ANTES de lanzar, asigna file ownership exclusivo. Teammates se comunican entre sí directamente.

### Control de costes
Teammates en Sonnet 4.6 · Máximo 3-4 · Sesión única es 3-5x más barata.
