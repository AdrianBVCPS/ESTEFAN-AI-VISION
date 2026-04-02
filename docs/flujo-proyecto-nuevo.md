# Flujo de trabajo: Empezar un proyecto nuevo

> Guía paso a paso para Adrian. Versión 6.0 con mejoras de auditoría.

---

## Fase 0 — Preparar la documentación (TÚ)

### 0.1 Escribe el PRD (obligatorio)

Crea `docs/PRD.md` con: nombre del proyecto, qué problema resuelve, quién lo usa, tipo (A/B/C), lista de funcionalidades, y detalles técnicos relevantes.

> Cuanto más detallado, mejor resultado. Aquí es donde más valor aportas.

### 0.2 Diseña las pantallas (solo Tipo A)

Crea `docs/diseno-ui-ux.md` con wireframes, componentes necesarios, y vistas móvil vs. escritorio.

### 0.3 Copia la plantilla base

```
mi-nuevo-proyecto/
├── claude.md                      ← Copia
├── .claude/
│   ├── settings.json              ← Copia
│   ├── rules/tipos-proyecto.md    ← Copia
│   └── agents/                    ← Copia (db.md, frontend.md, backend.md, nexo.md)
└── docs/
    ├── PRD.md                     ← Lo escribes tú
    ├── diseno-ui-ux.md            ← Lo escribes tú (si Tipo A)
    ├── convenciones-supabase.md   ← Copia
    ├── sistema-diseno-bv.md       ← Copia (solo Tipo A)
    ├── checklist-despliegue.md    ← Copia
    └── agent-teams.md             ← Copia
```

---

## Fase 1 — Primer arranque (3 prompts secuenciales)

Abre Claude Code en la carpeta del proyecto. Usa los 3 prompts de `promptfirst.md` EN ORDEN:

**Prompt 1 → Contexto:** Claude lee docs, identifica tipo, instala code-review.
**Prompt 2 → Estructura:** Claude propone skills, rules, CLAUDE.md anidados. Tú apruebas.
**Prompt 3 → Plan:** Claude crea la estructura y presenta plan por fases. Tú apruebas.

> ¿Por qué 3 prompts y no uno? Cada prompt está enfocado en una tarea. Claude sigue mejor 3 instrucciones claras que 9 de golpe.

---

## Fase 2 — Desarrollo con "Document & Clear"

### Tu equipo de 4 subagentes

Claude Code (Opus) actúa como **lead** y delega trabajo a 4 subagentes especializados que trabajan con Sonnet (más rápido y barato):

| Subagente | Se encarga de | Ejemplo |
|---|---|---|
| **DB** | Base de datos, tablas, migraciones, RLS | "Crea la tabla empleados con RLS por rol" |
| **Frontend** | Componentes, páginas, estilos, responsive | "Construye el dashboard con cronómetro circular" |
| **Backend** | API routes, auth, validación, lógica servidor | "Crea el endpoint de inicio de pausa" |
| **NEXO** | Tests, config, docs, deploy, herramientas | "Escribe tests para la lógica de turnos" |

**No necesitas invocarlos tú.** Claude Code (el lead) decide cuándo delegar a cada subagente según la tarea. Tú solo ves el resultado. Si quieres invocar uno explícitamente: `usa el subagente DB para crear las migraciones`.

**¿Cómo ahorra?** Opus piensa y planifica (caro pero inteligente). Los subagentes ejecutan con Sonnet (barato y rápido). El lead solo recibe el resultado resumido, no todo el contexto del subagente.

### El ciclo de cada fase

```
1. "Empieza la Fase [N]: [nombre]"
   ↓
2. Claude trabaja, tú pruebas y das feedback
   ↓
3. "Fase [N] terminada. Escribe resumen en docs/progreso-fase-N.md
    y guarda en memoria"
   ↓
4. /clear
   ↓
5. "Retomo. Lee docs/progreso-fase-[N].md y MEMORY.md.
    Empieza la Fase [N+1]"
```

### ¿Por qué /clear entre fases?

Incluso con 1M de contexto, la calidad degrada después de muchas interacciones. `/clear` reinicia la conversación pero NO pierdes nada:

- `claude.md` se recarga automáticamente
- `MEMORY.md` se recarga automáticamente
- Los CLAUDE.md anidados se cargan cuando Claude toca esos archivos
- Skills, rules, todo el código en disco → intacto
- El resumen de progreso (`docs/progreso-fase-N.md`) tiene el contexto necesario

### Dentro de una fase: /compact con foco

Si la conversación se alarga mucho dentro de una fase:

```
/compact focus on [la tarea actual]
```

Esto comprime el contexto preservando lo relevante para la tarea en curso. Úsalo cuando `/context` muestre más del 50%.

### Commits: después de cada tarea

Claude Code hace git commit con mensaje descriptivo después de cada tarea completada. Si ves que no lo ha hecho, dile:

```
Haz commit de lo que acabas de implementar.
```

Los commits son tu red de seguridad. Sin ellos, un error puede forzarte a rehacer trabajo.

### Testing: antes de dar por buena una tarea

Claude Code ejecuta los tests relevantes antes de marcar una tarea como completa. Si no lo hace, dile:

```
Ejecuta los tests antes de pasar a lo siguiente.
```

### Agent Teams: si Claude los propone

Durante una fase, Claude puede proponer Agent Teams si detecta trabajo paralelizable. Verás algo como: "La Fase 3 tiene frontend, backend y tests independientes. ¿Lanzo un equipo de 3?"

Tú decides. Di "adelante" o "hazlo en sesión única".

### Si algo se rompe

```
Eso no funciona. Arréglalo.
```

### Ejemplo completo

```
── PROMPT 1-2-3: Setup y plan ─────────────────────
   → Aprobado → /clear

── FASE 1: Base de datos y auth ───────────────────
   Lead (Opus) planifica → delega a DB (Sonnet): tablas, RLS
                         → delega a Backend (Sonnet): auth, middleware
   Commits... tests vía NEXO...
   → Resumen + memoria → /clear

── FASE 2: Frontend ───────────────────────────────
   "Retomo. Lee progreso-fase-1.md"
   Lead → delega a Frontend (Sonnet): componentes, páginas
        → delega a NEXO (Sonnet): tests de componentes
   Commits...
   → Resumen + memoria → /clear

── FASE 3: Lógica + integración ───────────────────
   "Retomo. Lee progreso-fase-2.md"
   Lead → Backend: endpoints + Frontend: conexión con API
   → Resumen + memoria → /clear

── FASE FINAL ─────────────────────────────────────
   → /code-review → corregir
   → NEXO: checklist de deploy
   → /desplegar → producción
   → Guardar en memoria
```

---

## Fase 3 — Despliegue

```
/code-review
```
Corrige todo. Después:
```
/desplegar
```

---

## Fase 4 — Volver otro día

```
Retomo el proyecto. ¿Cuál es el estado actual y qué queda pendiente?
```

---

## Resumen rápido

```
0. Escribe PRD + diseño              → /docs
1. Prompt 1 (contexto)               → confirma tipo
2. Prompt 2 (estructura)             → aprueba skills/rules
3. Prompt 3 (plan)                   → aprueba plan
4. Por cada fase:
   a. Claude trabaja + tests + commits
   b. Resumen + memoria → /clear
5. /code-review → /desplegar
6. Vuelves otro día → "retomo"
```

---

*Flujo de trabajo v6.0 — Marzo 2026 (post-auditoría)*
