import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/app/(auth)/login/actions'
import type { BarberProfile } from '@/types/database'
import { LogOut } from 'lucide-react'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Carga el perfil del barbero
  const { data: profile } = await supabase
    .from('barber_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle() as { data: BarberProfile | null, error: unknown }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-6 py-4" style={{ background: '#1A1A2E' }}>
        <span className="font-display text-gold text-lg font-bold tracking-wide">
          Estefan AI Vision
        </span>
        <div className="flex items-center gap-4">
          {profile && (
            <span className="font-ui text-sm hidden sm:block" style={{ color: '#9CA3AF' }}>
              {profile.display_name}
            </span>
          )}
          <form action={logoutAction}>
            <button
              type="submit"
              className="p-2 rounded-lg transition-colors"
              style={{ color: '#6B7280' }}
              aria-label="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
