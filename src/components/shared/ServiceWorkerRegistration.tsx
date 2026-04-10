'use client'

import { useEffect } from 'react'

// Registra el service worker para habilitar funcionalidad PWA y caché offline.
// Componente sin renderizado — solo efectos de registro al montar.
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      // El SW no es crítico — si falla el registro, la app sigue funcionando
    })
  }, [])

  return null
}
