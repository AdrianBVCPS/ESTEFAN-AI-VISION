# Módulo: Páginas y Routing

App Router de Next.js. Cada página es un Server Component por defecto salvo que necesite interactividad.

## Estructura de rutas

```
src/app/
├── layout.tsx              ← Layout raíz: PWA meta, fuentes, theme-color #1A1A2E
├── (auth)/
│   └── login/page.tsx      ← Login del barbero (email + contraseña)
├── (protected)/
│   ├── layout.tsx          ← Verificar sesión via middleware, redirect a /login si no auth
│   ├── page.tsx            ← Home: botón "Nueva consulta"
│   ├── capture/page.tsx    ← Captura 3 fotos (frontal, lateral, trasera)
│   ├── mode-select/page.tsx ← Selector: Modo A ("IA sugiere") o Modo B ("Probar corte")
│   ├── preferences/page.tsx ← Modo A: longitud, estilo, barba, tipo pelo
│   ├── describe/page.tsx   ← Modo B: campo texto libre + chips sugerencia
│   ├── loading-ai/page.tsx ← Pantalla loading premium (15-25s)
│   ├── results/page.tsx    ← Resultados (2 tarjetas Modo A / 1 imagen Modo B)
│   └── share/page.tsx      ← Compartir via QR / descargar
```

## Estado de consulta

- Usar React Context (`ConsultationContext`) para el flujo completo: fotos, modo, preferencias, resultados.
- NO persistir estado en base de datos. Todo en memoria del cliente.
- Al "Nueva consulta": resetear TODO el contexto.

## Convenciones

- Idioma interfaz: español (es-ES).
- Metadata: title dinámico por página, theme-color `#1A1A2E`.
- Loading states: skeleton/spinner en cada página que haga fetch. Nunca pantalla en blanco.
- Transiciones entre páginas: slide horizontal suave (300ms ease-out).

## Gotchas frecuentes

- **Tailwind v4:** Los estilos globales (html, body, *, etc.) deben estar dentro de `@layer base` en `globals.css`. Sin el layer, la especificidad es incorrecta.
- **Viewport:** Usar `maximumScale: 5` en lugar de `userScalable: false`. El segundo viola WCAG 1.4.4 (accesibilidad de zoom).
