import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const QR_EXPIRY_MINUTES_DEFAULT = 10

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('image') as File | null
  if (!file || !file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Imagen requerida' }, { status: 400 })
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'Imagen demasiado grande (máx 5 MB)' }, { status: 413 })
  }

  const adminClient = createAdminClient()

  // Obtener minutos de expiración desde app_config
  const { data: configRow } = await adminClient
    .from('app_config')
    .select('value')
    .eq('key', 'qr_expiry_minutes')
    .single()
  const expiryMinutes = configRow?.value
    ? Number(configRow.value)
    : QR_EXPIRY_MINUTES_DEFAULT

  // Subir imagen a Storage
  const ext = file.type === 'image/png' ? 'png' : 'jpg'
  const fileName = `${user.id}/${crypto.randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await adminClient.storage
    .from('shared-looks')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json(
      { error: 'Error al subir imagen' },
      { status: 500 }
    )
  }

  // Crear registro en shared_looks
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString()

  const { data: shared, error: insertError } = await adminClient
    .from('shared_looks')
    .insert({
      user_id: user.id,
      image_path: fileName,
      expires_at: expiresAt,
    })
    .select('id')
    .single()

  if (insertError || !shared) {
    return NextResponse.json(
      { error: 'Error al crear enlace compartido' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    id: shared.id,
    expires_at: expiresAt,
  })
}
