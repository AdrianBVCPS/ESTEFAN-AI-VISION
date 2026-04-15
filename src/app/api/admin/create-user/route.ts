import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSuperadmin } from '@/lib/stripe'

const schema = z.object({
  email:        z.string().email(),
  password:     z.string().min(8),
  display_name: z.string().min(2).max(60),
  role:         z.enum(['barber', 'superadmin']).default('barber'),
})

// POST /api/admin/create-user
export async function POST(request: NextRequest) {
  // Solo superadmin puede crear usuarios
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!isSuperadmin(user.email)) {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
  }

  // Validar body
  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const { email, password, display_name, role } = parsed.data
  const adminClient = createAdminClient()

  // Crear usuario en auth.users
  const { data: newUser, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  // Crear perfil en barber_profiles
  const { error: profileError } = await adminClient
    .from('barber_profiles')
    .insert({
      id:                  newUser.user.id,
      display_name,
      role,
      subscription_status: 'pending',
    })

  if (profileError) {
    // Revertir: borrar el usuario auth creado
    await adminClient.auth.admin.deleteUser(newUser.user.id)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, user_id: newUser.user.id })
}
