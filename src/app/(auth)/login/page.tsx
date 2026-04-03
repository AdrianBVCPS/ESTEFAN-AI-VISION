'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { loginAction } from './actions'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [keepSession, setKeepSession] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    // keepSession se pasa como checkbox — 'on' si marcado, ausente si no
    if (!keepSession) formData.delete('keepSession')

    startTransition(async () => {
      const result = await loginAction(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ background: 'linear-gradient(160deg, #1A1A2E 0%, #2D2D3A 100%)' }}
    >
      {/* Logo y título */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <div className="w-24 h-24 relative">
          <Image
            src="/logo-ea.png"
            alt="Estefan Acosta"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-gold tracking-wide">
            Estefan AI Vision
          </h1>
          <p className="font-ui text-sm mt-1" style={{ color: '#9CA3AF' }}>
            Barber Shop · Lugo
          </p>
        </div>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-5"
        noValidate
      >
        {/* Campo email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="font-ui text-xs font-medium uppercase tracking-widest"
            style={{ color: '#9CA3AF' }}
          >
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isPending}
            className="login-input w-full h-14 px-4 rounded-lg font-ui text-sm outline-none transition-all disabled:opacity-50"
          />
        </div>

        {/* Campo contraseña */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="font-ui text-xs font-medium uppercase tracking-widest"
            style={{ color: '#9CA3AF' }}
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              disabled={isPending}
              className="login-input w-full h-14 px-4 pr-12 rounded-lg font-ui text-sm outline-none transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded"
              style={{ color: '#6B7280' }}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Mantener sesión */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            name="keepSession"
            checked={keepSession}
            onChange={e => setKeepSession(e.target.checked)}
            className="w-4 h-4 rounded accent-gold"
          />
          <span className="font-ui text-sm" style={{ color: '#9CA3AF' }}>
            Mantener sesión iniciada
          </span>
        </label>

        {/* Error — role="alert" para lectores de pantalla */}
        {error && (
          <p
            role="alert"
            className="font-ui text-sm text-center px-3 py-2 rounded-lg"
            style={{ color: '#E74C3C', background: 'rgba(231,76,60,0.1)' }}
          >
            {error}
          </p>
        )}

        {/* Botón entrar */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-14 rounded-lg font-ui font-bold text-base flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: '#D4A854', color: '#1A1A2E' }}
        >
          {isPending ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Entrando…
            </>
          ) : (
            'Entrar'
          )}
        </button>
      </form>
    </div>
  )
}
