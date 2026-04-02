# Tipos de proyecto — Reglas detalladas

## Tipo A — App corporativa Bureau Veritas

- Identidad visual BV obligatoria: ver @docs/sistema-diseno-bv.md
- PWA obligatoria (manifest.json, service worker, iconos 192/512)
- Supabase con RLS estricto por roles
- Layout BV: header navy + banda roja + sidebar + contenido
- Footer: "Bureau Veritas CPS — Laboratorio Textil de Lugo"
- Logo BV en header/sidebar desde /public/images/
- Responsive: desktop ≥1024, tablet 768-1023, móvil <768

## Tipo B — App personal/side project

- Diseño libre, sin branding BV
- Mismo stack técnico salvo indicación contraria
- PWA recomendada pero no obligatoria
- Menor rigor formal, más libertad creativa

## Tipo C — App legacy instrumental

- Stack legacy: Electron o HTML/CSS/JS puro
- Cero dependencias online, todo embebido
- UI funcional y clara, sin necesidad visual sofisticada
- Prioridad: rendimiento rápido en hardware limitado
- Considerar pantallas pequeñas y resoluciones antiguas
