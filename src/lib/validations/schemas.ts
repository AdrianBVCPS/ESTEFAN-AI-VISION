import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Introduce un correo válido.'),
  // bcrypt trunca silenciosamente a 72 caracteres — acotar para evitar DoS
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.').max(72, 'La contraseña no puede superar los 72 caracteres.'),
})

export type LoginInput = z.infer<typeof loginSchema>
