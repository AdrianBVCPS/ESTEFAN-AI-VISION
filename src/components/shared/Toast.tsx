'use client'

import { useEffect, useCallback, useState } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

/* ─── Tipos ─────────────────────────────────────────────── */

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

/* ─── Componente Toast individual ───────────────────────── */

interface ToastProps {
  message: string
  type: ToastType
  onDismiss: () => void
}

const typeConfig: Record<
  ToastType,
  { Icon: typeof CheckCircle; colorClass: string }
> = {
  success: { Icon: CheckCircle, colorClass: 'text-teal' },
  error: { Icon: AlertCircle, colorClass: 'text-error' },
  info: { Icon: Info, colorClass: 'text-navy' },
}

function Toast({ message, type, onDismiss }: ToastProps) {
  const { Icon, colorClass } = typeConfig[type]

  /* Auto-dismiss a los 4 segundos */
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className={[
        'flex items-start gap-3 w-full max-w-sm',
        'px-4 py-3 rounded-xl',
        'bg-surface/80 backdrop-blur-lg',
        'shadow-lg',
        /* Animación slide-in desde arriba */
        'animate-toast-in',
      ].join(' ')}
      role="alert"
      aria-live="assertive"
    >
      <Icon
        size={18}
        strokeWidth={1.5}
        className={`${colorClass} shrink-0 mt-0.5`}
      />
      <p className="font-ui text-sm text-text-primary flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Cerrar notificación"
        className="text-text-secondary hover:text-text-primary transition-colors ml-1 shrink-0"
      >
        <X size={16} strokeWidth={1.5} />
      </button>
    </div>
  )
}

/* ─── Contenedor de todos los toasts ────────────────────── */

interface ToastContainerProps {
  toasts: ToastItem[]
  dismissToast: (id: string) => void
}

function ToastContainer({ toasts, dismissToast }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end"
      aria-label="Notificaciones"
    >
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onDismiss={() => dismissToast(t.id)}
        />
      ))}
    </div>
  )
}

/* ─── Hook useToast ──────────────────────────────────────── */

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, showToast, dismissToast }
}

export { Toast, ToastContainer, useToast }
export type { ToastItem, ToastType, ToastProps }
