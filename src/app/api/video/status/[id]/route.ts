import { NextResponse } from 'next/server'

/* ────────────────────────────────────────────────────────────
   GET /api/video/status/[id]
   Interroge Shotstack pour le statut du rendu
──────────────────────────────────────────────────────────── */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

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
      headers: {
        'x-api-key': process.env.SHOTSTACK_API_KEY,
      },
      // Pas de cache — on veut le statut en temps réel
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

  const data = await res.json()
  const response = data?.response

  // Statuts Shotstack : queued | fetching | rendering | saving | done | failed
  return NextResponse.json({
    status: response?.status ?? 'unknown',
    url:    response?.url   ?? null,    // URL MP4 disponible quand status === 'done'
    poster: response?.poster ?? null,
  })
}
