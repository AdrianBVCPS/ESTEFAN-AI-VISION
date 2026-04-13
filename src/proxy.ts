import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Email del superadmin — acceso total sin verificar suscripción
const SUPERADMIN_EMAIL = 'adriangarciamendez87@gmail.com'

// Rutas que no requieren sesión ni suscripción
const PUBLIC_PATHS = [
  '/login',
  '/blocked',
  '/api/stripe/webhook',
  '/_next',
  '/favicon',
  '/icons',
  '/manifest',
  '/sw.js',
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Archivos estáticos — pasar directamente
  if (/\.(png|jpg|svg|ico|webp|json|txt|js|css|woff2?)$/.test(pathname)) {
    return NextResponse.next()
  }

  // Rutas públicas — no requieren sesión
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca la sesión y obtiene el usuario
  const { data: { user } } = await supabase.auth.getUser()

  // Sin sesión → redirigir a login (o 401 para API routes)
  if (!user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    // Si ya va a /login, pasar
    if (pathname === '/login') return supabaseResponse
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Superadmin por email → acceso total siempre
  if (user.email === SUPERADMIN_EMAIL) {
    // Si va a /login con sesión activa, redirigir al home
    if (pathname === '/login') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // Usuario con sesión → redirigir de /login al home
  if (pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Rutas de API → dejar pasar (cada handler verifica auth internamente)
  if (pathname.startsWith('/api/')) {
    return supabaseResponse
  }

  // Para páginas de barbero: verificar subscription_status
  const { data: profile } = await supabase
    .from('barber_profiles')
    .select('role, subscription_status')
    .eq('id', user.id)
    .maybeSingle()

  // Superadmin por rol (segunda verificación)
  if (profile?.role === 'superadmin') {
    return supabaseResponse
  }

  const status = profile?.subscription_status ?? 'pending'
  const tieneAcceso = status === 'active' || status === 'trialing'

  // Sin suscripción activa → bloquear (excepto si ya está en /blocked)
  if (!tieneAcceso && pathname !== '/blocked') {
    const url = request.nextUrl.clone()
    url.pathname = '/blocked'
    url.searchParams.set('reason', status)
    return NextResponse.redirect(url)
  }

  // Con suscripción activa en /blocked → redirigir al home
  if (tieneAcceso && pathname === '/blocked') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
