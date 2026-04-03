'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema } from '@/lib/validations/schemas'

export async function loginAction(formData: FormData) {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: 'Correo o contraseña no válidos.' }
  }

  // keepSession=false → cookie de sesión (expira al cerrar navegador)
  const keepSession = formData.get('keepSession') === 'on'

  try {
    const supabase = await createClient(keepSession)
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (error) {
      return { error: 'Credenciales incorrectas. Inténtalo de nuevo.' }
    }
  } catch {
    return { error: 'Error de conexión. Inténtalo de nuevo.' }
  }

  redirect('/')
}

export async function logoutAction() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch {
    // Continuar aunque falle el signOut — redirigir igualmente
  }
  redirect('/login')
}
