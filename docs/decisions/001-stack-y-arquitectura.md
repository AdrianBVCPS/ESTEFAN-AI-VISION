# ADR-001: Stack tecnológico y arquitectura general

**Estado:** Aprobado  
**Fecha:** 2026-04-01  
**Contexto:** Definición del stack para Estefan AI Vision (Tipo B)

## Decisión

| Capa | Tecnología | Justificación |
|---|---|---|
| Frontend | Next.js 16 + React 19 + TypeScript | App Router, SSR/SSG, ecosistema maduro |
| Estilos | Tailwind CSS v4 | CSS-first config, utilidades, responsive |
| Auth + BD | Supabase (Auth + PostgreSQL) | Free tier generoso, RLS nativo, Edge Functions |
| IA Análisis | Gemini API (text+vision) | Multimodal, JSON estructurado, free tier |
| IA Imagen | Nano Banana 2 (Gemini 3.1 Flash Image) | Consistencia facial, calidad, velocidad |
| Composición | Canvas API (browser) | Logo sobre imagen sin backend |
| Hosting | Vercel | Deploy automático, CDN global, free tier |
| PWA | Service Workers nativos | Instalable, splash personalizado |

## Principios clave

1. **Zero data retention** — fotos y resultados solo en memoria cliente
2. **Proxy server-side** — API key Gemini nunca expuesta al navegador
3. **BD mínima** — solo 2 tablas custom (barber_profiles, app_config) + auth.users
4. **Todo gratuito** — free tier en todos los servicios

## Alternativas descartadas

- **OpenAI/DALL-E**: menor calidad en consistencia facial, más caro
- **Firebase**: menos control sobre RLS, vendor lock-in más fuerte
- **Prisma**: innecesario para 2 tablas, Supabase client basta
