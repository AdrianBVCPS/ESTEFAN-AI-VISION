'use client'

import Image from 'next/image'
import { LogOut } from 'lucide-react'

interface HeaderProps {
  displayName: string | null
  logoutAction: () => Promise<void>
}

function Header({ displayName, logoutAction }: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-6 h-14"
      style={{ background: '#1A1A2E' }}
    >
      {/* Logo + nombre app */}
      <div className="flex items-center gap-2.5">
        <Image
          src="/logo-ea.png"
          alt="Estefan AI Vision"
          width={32}
          height={32}
          className="rounded"
          onError={(e) => {
            /* Si no existe el logo, oculta el img sin romper */
            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
          }}
        />
        <span className="font-display text-gold text-lg font-bold tracking-wide">
          Estefan AI Vision
        </span>
      </div>

      {/* Nombre barbero + logout */}
      <div className="flex items-center gap-3">
        {displayName && (
          <span className="font-ui text-sm hidden sm:block" style={{ color: '#9CA3AF' }}>
            {displayName}
          </span>
        )}

        <form action={logoutAction}>
          <button
            type="submit"
            aria-label="Cerrar sesión"
            className="flex items-center justify-center w-11 h-11 rounded-lg transition-colors duration-150 text-text-secondary hover:text-error"
          >
            <LogOut size={20} strokeWidth={1.5} />
          </button>
        </form>
      </div>
    </header>
  )
}

export { Header }
export type { HeaderProps }
