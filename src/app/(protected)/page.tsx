'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Scissors, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function HomePage() {
  const [esSuperadmin, setEsSuperadmin] = useState(false)
  const supabase = createClient()

  // Detectar si el usuario es superadmin para mostrar el acceso al panel
  // Cast necesario: @supabase/ssr@0.10 no resuelve bien el tipo genérico del select
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(supabase as any)
        .from('barber_profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data }: { data: { role: string } | null }) => {
          if (data?.role === 'superadmin') setEsSuperadmin(true)
        })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[calc(100vh-56px)] px-6 py-12 bg-background">

      {/* Icono de admin — solo visible para superadmin, esquina superior derecha */}
      {esSuperadmin && (
        <Link
          href="/admin"
          aria-label="Ir al panel admin"
          className="absolute top-4 right-4 transition-opacity hover:opacity-100"
          style={{ color: 'rgba(212,168,84,0.4)' }}
        >
          <Settings size={20} strokeWidth={1.5} />
        </Link>
      )}

      {/* Espaciador superior */}
      <div />

      {/* Botón principal + subtexto */}
      <div className="flex flex-col items-center gap-6">
        <Link
          href="/capture"
          className="flex flex-col items-center justify-center gap-3 rounded-2xl transition-transform duration-150 hover:scale-[0.97] active:scale-[0.95]"
          style={{
            width: 'clamp(150px, 40vw, 200px)',
            height: 'clamp(150px, 40vw, 200px)',
            background: '#D4A854',
            boxShadow: '0 8px 32px rgba(212,168,84,0.35)',
          }}
        >
          <Scissors size={48} color="#1A1A2E" strokeWidth={1.5} />
          <span className="font-ui font-bold text-base text-center leading-tight" style={{ color: '#1A1A2E' }}>
            Nueva<br />consulta
          </span>
        </Link>

        <p className="font-ui text-sm text-center text-text-secondary">
          Visualiza el nuevo look de tu cliente
        </p>
      </div>

      {/* Footer en flujo normal — no absolute */}
      <footer className="text-center pb-2">
        <p className="font-ui text-xs" style={{ color: '#D1C4B0', opacity: 0.5 }}>
          Estefan Acosta Barber Shop · Lugo
        </p>
      </footer>
    </div>
  )
}
