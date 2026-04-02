# Checklist de Despliegue

## Funcionalidad
- [ ] Funcionalidades del PRD implementadas o diferidas explícitamente
- [ ] Flujo completo: login → uso principal → logout
- [ ] Responsive: desktop, tablet, móvil

## Seguridad
- [ ] RLS en TODAS las tablas
- [ ] Políticas RLS verificadas por rol
- [ ] Variables de entorno en hosting (no hardcodeadas)
- [ ] `service_role_key` nunca en cliente
- [ ] Validación Zod en cliente y servidor

## Código
- [ ] `/code-review` ejecutado — todos los issues ≥80 corregidos
- [ ] Sin `console.log` en producción
- [ ] Sin `any` no justificado
- [ ] Sin dependencias no utilizadas
- [ ] Build limpio sin warnings críticos
- [ ] Tests pasando para lógica crítica

## PWA (Tipo A)
- [ ] manifest.json con nombre, iconos, colores
- [ ] Service worker registrado
- [ ] Iconos 192px y 512px
- [ ] theme-color y background-color coherentes

## Visual (Tipo A)
- [ ] Logo BV en header/sidebar
- [ ] Banda roja visible
- [ ] Footer corporativo
- [ ] Paleta coherente
- [ ] Fuentes cargando (Source Sans 3, DM Mono)

## Meta
- [ ] title y meta description
- [ ] og:image para apps públicas
- [ ] Favicon

## Post-despliegue
- [ ] Guardar estado en memoria (`/memory`)
- [ ] Confirmar URL de producción con Adrian
