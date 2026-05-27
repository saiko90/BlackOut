import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

/* ────────────────────────────────────────────────────────────
   Types internes
──────────────────────────────────────────────────────────── */
type MediaItem = {
  media_url: string
  media_type: 'photo' | 'video'
  step_number: number
}

type ShotstackClip = {
  asset: Record<string, unknown>
  start: number
  length: number
  transition?: { in?: string; out?: string }
  effect?: string
  fit?: string
}

/* ────────────────────────────────────────────────────────────
   Builder de payload Shotstack
──────────────────────────────────────────────────────────── */
function buildPayload(teamName: string, score: number, medias: MediaItem[]) {
  const clips: ShotstackClip[] = []
  let cursor = 0

  /* ── Intro ── */
  const INTRO_DUR = 3
  clips.push({
    asset: {
      type: 'title',
      text: `BLACK OUT !\n${teamName}`,
      style: 'minimal',
      color: '#ffffff',
      size: 'large',
      background: '#09090b',
      position: 'center',
    },
    start: cursor,
    length: INTRO_DUR,
    transition: { in: 'fade', out: 'fade' },
  })
  cursor += INTRO_DUR

  /* ── Médias ou fallback ── */
  if (medias.length === 0) {
    // Aucun média (parties 100% textuelles) : clip narratif de substitution
    clips.push({
      asset: {
        type: 'title',
        text: 'Aucune preuve visuelle.\nCe qui se passe à Sion\nreste à Sion.',
        style: 'minimal',
        color: '#a78bfa',
        size: 'medium',
        background: '#09090b',
        position: 'center',
      },
      start: cursor,
      length: 5,
      transition: { in: 'fade', out: 'fade' },
    })
    cursor += 5
  } else {
    for (const media of medias) {
      const duration = media.media_type === 'photo' ? 3 : 4
      const clip: ShotstackClip = {
        asset:
          media.media_type === 'photo'
            ? { type: 'image', src: media.media_url }
            : { type: 'video', src: media.media_url, volume: 0.7 },
        start: cursor,
        length: duration,
        fit: 'cover',
        transition: { in: 'fade', out: 'fade' },
      }
      // Effet zoom léger sur les photos
      if (media.media_type === 'photo') clip.effect = 'zoomIn'
      clips.push(clip)
      cursor += duration
    }
  }

  /* ── Outro score ── */
  clips.push({
    asset: {
      type: 'title',
      text: `Score final\n${score} pts\n#BlackOutSion`,
      style: 'minimal',
      color: '#22d3ee',
      size: 'medium',
      background: '#09090b',
      position: 'center',
    },
    start: cursor,
    length: 4,
    transition: { in: 'fade', out: 'fade' },
  })

  return {
    timeline: {
      background: '#09090b',
      tracks: [{ clips }],
    },
    output: {
      format: 'mp4',
      resolution: 'hd', // 1280×720
    },
  }
}

/* ────────────────────────────────────────────────────────────
   POST /api/video/render
──────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  /* Vérification de la clé API */
  if (!process.env.SHOTSTACK_API_KEY) {
    return NextResponse.json(
      { error: 'SHOTSTACK_API_KEY manquant dans .env.local' },
      { status: 500 }
    )
  }

  let session_id: string
  try {
    const body = await req.json()
    session_id = body.session_id
    if (!session_id) throw new Error()
  } catch {
    return NextResponse.json({ error: 'session_id requis dans le body' }, { status: 400 })
  }

  /* ── 1. Client admin (lazy) ── */
  let db: ReturnType<typeof getSupabaseAdmin>
  try {
    db = getSupabaseAdmin()
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }

  /* ── 2. Récupérer la session de jeu ── */
  const { data: session, error: sessionError } = await db
    .from('game_sessions')
    .select('team_name, score, city')
    .eq('id', session_id)
    .single()

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Session introuvable', details: sessionError?.message }, { status: 404 })
  }

  /* ── 3. Récupérer les médias triés par étape ── */
  const { data: medias, error: mediasError } = await db
    .from('media_uploads')
    .select('media_url, media_type, step_number')
    .eq('session_id', session_id)
    .order('step_number', { ascending: true })

  if (mediasError) {
    return NextResponse.json({ error: 'Erreur lecture médias', details: mediasError.message }, { status: 500 })
  }

  /* ── 4. Construire le payload Shotstack ── */
  const payload = buildPayload(
    session.team_name ?? 'Équipe',
    session.score ?? 0,
    (medias as MediaItem[]) ?? []
  )

  /* ── 5. Envoyer à Shotstack ── */
  let shotstackRes: Response
  try {
    shotstackRes = await fetch('https://api.shotstack.io/stage/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.SHOTSTACK_API_KEY,
      },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Impossible de contacter Shotstack', details: String(err) },
      { status: 502 }
    )
  }

  if (!shotstackRes.ok) {
    const raw = await shotstackRes.text()
    return NextResponse.json(
      { error: `Shotstack a répondu ${shotstackRes.status}`, details: raw },
      { status: 502 }
    )
  }

  const result = await shotstackRes.json()
  const render_id: string | undefined = result?.response?.id

  if (!render_id) {
    return NextResponse.json(
      { error: 'Aucun render_id reçu de Shotstack', details: result },
      { status: 502 }
    )
  }

  return NextResponse.json({ render_id, media_count: medias?.length ?? 0 })
}
