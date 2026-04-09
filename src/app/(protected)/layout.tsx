import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/app/(auth)/login/actions'
import { Header } from '@/components/layout'
import { ConsultationProvider } from '@/lib/utils/consultation-context'

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

  // Carga solo display_name del barbero para el header
  const { data } = await supabase
    .from('barber_profiles')
    .select('display_name')
    .eq('id', user.id)
    .maybeSingle()

  const displayName = (data as { display_name: string } | null)?.display_name ?? null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header displayName={displayName} logoutAction={logoutAction} />
      <main className="flex-1">
        <ConsultationProvider>
          {children}
        </ConsultationProvider>
      </main>
    </div>
  )
}
