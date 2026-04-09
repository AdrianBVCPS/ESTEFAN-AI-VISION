'use client'

import { EAMonogram } from '@/components/shared/EAMonogram'

interface LoadingScreenProps {
  text?: string
}

function LoadingScreen({ text = 'Procesando...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy">
      <EAMonogram variant="loading" size={80} />

      {/* Texto con puntos animados */}
      <p className="mt-6 font-ui text-sm text-gold flex items-center gap-0.5">
        {text.replace(/\.+$/, '')}
        <span className="loading-dots" aria-hidden="true">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
    </div>
  )
}

export { LoadingScreen }
export type { LoadingScreenProps }
