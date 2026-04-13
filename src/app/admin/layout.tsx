import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'

// Layout minimal para el panel de superadmin — sin ConsultationProvider
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F0EB' }}>
      {/* Header navy */}
      <header
        className="flex items-center justify-between px-5 py-0 shrink-0"
        style={{ background: '#1A1A2E', height: 56 }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} strokeWidth={1.5} style={{ color: '#D4A854' }} />
          <span className="font-ui font-bold text-sm" style={{ color: '#F5F0EB' }}>
            Panel Admin — EA
          </span>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 font-ui text-sm transition-opacity hover:opacity-70"
          style={{ color: 'rgba(245,240,235,0.6)' }}
        >
          <ArrowLeft size={15} strokeWidth={1.5} />
          Volver a la app
        </Link>
      </header>

      {/* Contenido */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  )
}
