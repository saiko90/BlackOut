import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

/* ────────────────────────────────────────────────────────────
   GET /api/video/status/[id]?session_id=<uuid>
   Interroge Shotstack pour le statut du rendu.
   Quand done, persiste final_video_url dans game_sessions.
──────────────────────────────────────────────────────────── */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const sessionId = new URL(req.url).searchParams.get('session_id')

  if (!id) {
    return NextResponse.json({ error: 'render_id manquant' }, { status: 400 })
  }

  if (!process.env.SHOTSTACK_API_KEY) {
    return NextResponse.json({ error: 'SHOTSTACK_API_KEY manquant' }, { status: 500 })
  }

  let res: Response
  try {
    res = await fetch(`https://api.shotstack.io/stage/render/${id}`, {
      method: 'GET',
      headers: { 'x-api-key': process.env.SHOTSTACK_API_KEY },
      cache: 'no-store',
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Impossible de contacter Shotstack', details: String(err) },
      { status: 502 }
    )
  }

  if (!res.ok) {
    const raw = await res.text()
    return NextResponse.json(
      { error: `Shotstack a répondu ${res.status}`, details: raw },
      { status: 502 }
    )
  }

  const data     = await res.json()
  const response = data?.response
  const status: string = response?.status ?? 'unknown'

  if (status === 'failed') {
    const shotstackError: string = response?.error ?? 'Erreur inconnue côté Shotstack'
    console.error(`[status] render_id=${id} FAILED — ${shotstackError}`)
    return NextResponse.json({ status: 'failed', error: shotstackError })
  }

  if (status === 'done' && response?.url) {
    const videoUrl: string = response.url

    // Persister l'URL dans game_sessions si on connaît la session
    if (sessionId) {
      try {
        const db = getSupabaseAdmin()
        const { error } = await db
          .from('game_sessions')
          .update({ final_video_url: videoUrl })
          .eq('id', sessionId)

        if (error) {
          console.error(`[status] Impossible de persister final_video_url — ${error.message}`)
        } else {
          console.log(`[status] final_video_url persisté pour session=${sessionId}`)
        }
      } catch (err) {
        // Ne pas bloquer la réponse pour une erreur de persistance
        console.error(`[status] Erreur admin client — ${String(err)}`)
      }
    }

    return NextResponse.json({ status: 'done', url: videoUrl, poster: response?.poster ?? null })
  }

  // queued | fetching | rendering | saving → en cours
  return NextResponse.json({
    status,
    url:    response?.url    ?? null,
    poster: response?.poster ?? null,
  })
}
