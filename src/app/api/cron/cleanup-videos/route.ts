import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

/* ────────────────────────────────────────────────────────────
   GET /api/cron/cleanup-videos
   Supprime les vidéos expirées (> 48h après la fin de session) :
     1. Suppression du rendu sur Shotstack
     2. Suppression des fichiers médias dans Supabase Storage
     3. Nullification de final_video_url + shotstack_render_id en base

   Appelé automatiquement par Vercel Cron (vercel.json).
   Protégé par CRON_SECRET (envoyé en Authorization: Bearer par Vercel).
──────────────────────────────────────────────────────────── */
export async function GET(req: Request) {
  // ── Auth ──────────────────────────────────────────────────
  const auth = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db  = getSupabaseAdmin()
  const now = new Date().toISOString()

  // ── 1. Sessions expirées avec une vidéo encore stockée ────
  const { data: sessions, error: fetchError } = await db
    .from('game_sessions')
    .select('id, shotstack_render_id')
    .not('final_video_url', 'is', null)
    .lt('video_expires_at', now)

  if (fetchError) {
    console.error(`[cleanup] Erreur lecture sessions — ${fetchError.message}`)
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!sessions || sessions.length === 0) {
    console.log('[cleanup] Aucune vidéo expirée.')
    return NextResponse.json({ cleaned: 0 })
  }

  console.log(`[cleanup] ${sessions.length} session(s) expirée(s) à nettoyer`)

  const results = await Promise.allSettled(sessions.map(session => cleanSession(db, session)))

  const cleaned = results.filter(r => r.status === 'fulfilled').length
  const failed  = results.filter(r => r.status === 'rejected').length

  console.log(`[cleanup] Terminé — nettoyées: ${cleaned}, échecs: ${failed}`)
  return NextResponse.json({ cleaned, failed })
}

/* ────────────────────────────────────────────────────────────
   Nettoyage d'une session
──────────────────────────────────────────────────────────── */
async function cleanSession(
  db: ReturnType<typeof getSupabaseAdmin>,
  session: { id: string; shotstack_render_id: string | null },
) {
  // ── a. Supprimer le rendu Shotstack ──────────────────────
  if (session.shotstack_render_id && process.env.SHOTSTACK_API_KEY) {
    try {
      await fetch(`https://api.shotstack.io/edit/v1/render/${session.shotstack_render_id}`, {
        method:  'DELETE',
        headers: { 'x-api-key': process.env.SHOTSTACK_API_KEY },
      })
      console.log(`[cleanup] Shotstack render supprimé — ${session.shotstack_render_id}`)
    } catch (err) {
      // Non-bloquant : si Shotstack est indisponible on continue quand même
      console.warn(`[cleanup] Shotstack DELETE échoué — ${String(err)}`)
    }
  }

  // ── b. Récupérer les chemins des fichiers dans Supabase Storage ──
  const { data: medias } = await db
    .from('media_uploads')
    .select('media_url')
    .eq('session_id', session.id)

  if (medias && medias.length > 0) {
    // L'URL publique a la forme : .../object/public/game-media/<path>
    const paths = medias
      .map((m: { media_url: string }) => {
        const marker = '/object/public/game-media/'
        const idx = m.media_url.indexOf(marker)
        return idx !== -1 ? m.media_url.slice(idx + marker.length) : null
      })
      .filter((p): p is string => p !== null)

    if (paths.length > 0) {
      const { error: storageError } = await db.storage.from('game-media').remove(paths)
      if (storageError) {
        console.warn(`[cleanup] Storage remove partiel pour session=${session.id} — ${storageError.message}`)
      } else {
        console.log(`[cleanup] ${paths.length} fichier(s) supprimé(s) pour session=${session.id}`)
      }
    }
  }

  // ── c. Nullifier les champs vidéo en base ────────────────
  const { error: updateError } = await db
    .from('game_sessions')
    .update({
      final_video_url:     null,
      shotstack_render_id: null,
    })
    .eq('id', session.id)

  if (updateError) {
    throw new Error(`[cleanup] Mise à jour DB échouée pour session=${session.id} — ${updateError.message}`)
  }

  console.log(`[cleanup] Session ${session.id} nettoyée`)
}
