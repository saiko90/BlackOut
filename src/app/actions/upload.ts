'use server'

import { getSupabaseAdmin } from '@/lib/supabase/admin'

type UploadResult =
  | { publicUrl: string; error?: never }
  | { publicUrl?: never; error: string }

export async function uploadMedia(formData: FormData): Promise<UploadResult> {
  const file      = formData.get('file')      as File   | null
  const sessionId = formData.get('sessionId') as string | null
  const userId    = formData.get('userId')    as string | null
  const stepId    = Number(formData.get('stepId'))
  const mediaType = formData.get('mediaType') as 'photo' | 'video' | null

  if (!file || !sessionId || !userId || !mediaType) {
    return { error: 'Paramètres manquants.' }
  }

  const supabase = getSupabaseAdmin()
  const ext  = file.name.split('.').pop() ?? 'bin'
  const path = `${userId}/${sessionId}/step_${stepId}_${Date.now()}.${ext}`

  const { error: storageError } = await supabase.storage
    .from('game-media')
    .upload(path, file, { upsert: false })

  if (storageError) {
    console.error(`[upload] storage — ${storageError.message}`)
    return { error: storageError.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('game-media')
    .getPublicUrl(path)

  const { error: dbError } = await supabase.from('media_uploads').insert({
    session_id:  sessionId,
    user_id:     userId,
    step_number: stepId,
    media_url:   publicUrl,
    media_type:  mediaType,
  })

  if (dbError) {
    // Non-fatal: media is uploaded, game can continue
    console.error(`[upload] media_uploads insert — ${dbError.message}`)
  }

  return { publicUrl }
}
