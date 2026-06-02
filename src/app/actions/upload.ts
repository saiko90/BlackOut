'use server'

import { getSupabaseAdmin } from '@/lib/supabase/admin'

// Step 1 — called by the client to get a signed upload URL.
// The browser then uploads directly to Supabase (no Next.js body-size limit).
export async function getUploadToken(
  userId: string,
  sessionId: string,
  stepId: number,
  mimeType: string,
): Promise<{ token: string; path: string } | { error: string }> {
  const supabase = getSupabaseAdmin()

  // Normalise extension (iOS returns video/quicktime for .mov files)
  const rawExt = mimeType.split('/')[1] ?? 'bin'
  const ext    = rawExt === 'quicktime' ? 'mov' : rawExt

  const path = `${userId}/${sessionId}/step_${stepId}_${Date.now()}.${ext}`

  const { data, error } = await supabase.storage
    .from('game-media')
    .createSignedUploadUrl(path)

  if (error || !data) {
    console.error(`[getUploadToken] ${error?.message}`)
    return { error: error?.message ?? 'Signed URL unavailable' }
  }

  return { token: data.token, path }
}

// Step 2 — called after the browser upload succeeds, to record the media in the DB.
export async function recordMediaUpload(
  sessionId: string,
  userId: string,
  stepId: number,
  mediaType: 'photo' | 'video',
  path: string,
): Promise<{ publicUrl: string }> {
  const supabase = getSupabaseAdmin()

  const { data: { publicUrl } } = supabase.storage
    .from('game-media')
    .getPublicUrl(path)

  const { error } = await supabase.from('media_uploads').insert({
    session_id:  sessionId,
    user_id:     userId,
    step_number: stepId,
    media_url:   publicUrl,
    media_type:  mediaType,
  })

  if (error) {
    // Non-fatal: media is in storage, game can continue
    console.error(`[recordMediaUpload] ${error.message}`)
  }

  return { publicUrl }
}
