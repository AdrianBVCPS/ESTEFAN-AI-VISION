import Link from 'next/link'
import { Scissors } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-56px)] px-6 py-12 bg-background">

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
