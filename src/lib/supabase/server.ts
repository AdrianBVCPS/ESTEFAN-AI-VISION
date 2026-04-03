import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

/**
 * Cliente Supabase para contexto de servidor (Server Components, Server Actions, Route Handlers).
 * @param persistent - Si es false, las cookies de sesión expiran al cerrar el navegador.
 */
export async function createClient(persistent = true) {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Si el usuario no marcó "mantener sesión", omitir maxAge → cookie de sesión
              const cookieOptions = persistent
                ? options
                : { ...options, maxAge: undefined }
              cookieStore.set(name, value, cookieOptions)
            })
          } catch {
            // En Server Components las cookies las gestiona el proxy
          }
        },
      },
    }
  )
}
