'use server'

// Required Supabase migration before deploying:
//   ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS current_step integer NOT NULL DEFAULT 0;

import { getSupabaseAdmin } from '@/lib/supabase/admin'

type ActivateResult =
  | { sessionId: string; error?: never }
  | { sessionId?: never; error: string }

export async function activateToken(
  tokenId: string,
  userId: string,
  teamName: string,
): Promise<ActivateResult> {
  const supabase = getSupabaseAdmin()

  // Atomic claim: UPDATE only if token belongs to this user and is still unused.
  // If two requests race, only one UPDATE will match the is_used=false condition.
  const { data: token, error: tokenError } = await supabase
    .from('tokens')
    .update({ is_used: true, used_at: new Date().toISOString() })
    .eq('id', tokenId)
    .eq('user_id', userId)
    .eq('is_used', false)
    .select('id, city')
    .single()

  if (tokenError || !token) {
    return { error: 'Ce pass est invalide ou a déjà été utilisé.' }
  }

  const { data: session, error: sessionError } = await supabase
    .from('game_sessions')
    .insert({
      user_id: userId,
      team_name: teamName,
      city: token.city,
      start_time: new Date().toISOString(),
      score: 0,
      is_completed: false,
      current_step: 0,
    })
    .select('id')
    .single()

  if (sessionError || !session) {
    // Best-effort rollback so the token isn't stranded as used
    await supabase
      .from('tokens')
      .update({ is_used: false, used_at: null })
      .eq('id', tokenId)
    return { error: 'Erreur lors de la création de la session de jeu.' }
  }

  return { sessionId: session.id }
}
