// sw.js — Service Worker de Estefan AI Vision
// Estrategia: Cache First para assets estáticos, Network First para páginas.

const CACHE_NAME = 'estefan-ai-v1'

// Assets del shell de la app que se pre-cachean al instalar
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// Instalar: pre-cachear shell de la app y activar inmediatamente
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  )
})

// Activar: limpiar caches de versiones anteriores y tomar control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Solo interceptar GET del mismo origen
  if (request.method !== 'GET') return
  if (url.origin !== self.location.origin) return

  // API routes — siempre red (Gemini necesita conexión)
  if (url.pathname.startsWith('/api/')) return

  // Assets estáticos de Next.js → Cache First (inmutables por hash)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
            }
            return response
          }),
      ),
    )
    return
  }

  // Páginas y resto de recursos → Network First con fallback a caché
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(() =>
        caches
          .match(request)
          .then((cached) => cached || caches.match('/'))
          // caches.match('/') puede devolver undefined — devolver 503 como último recurso
          .then((fallback) => fallback || new Response('Offline', { status: 503 })),
      ),
  )
})
