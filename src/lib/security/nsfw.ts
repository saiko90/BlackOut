const SIGHTENGINE_URL = 'https://api.sightengine.com/1.0/check.json'

export async function checkImageSafety(file: File): Promise<boolean> {
  const apiUser   = process.env.SIGHTENGINE_API_USER
  const apiSecret = process.env.SIGHTENGINE_API_SECRET

  if (!apiUser || !apiSecret) {
    console.warn('[nsfw] credentials missing — skipping check')
    return true
  }

  try {
    const fd = new FormData()
    fd.append('models', 'nudity-2.0')
    fd.append('api_user', apiUser)
    fd.append('api_secret', apiSecret)
    fd.append('media', file)

    const res = await fetch(SIGHTENGINE_URL, { method: 'POST', body: fd })
    if (!res.ok) {
      console.error(`[nsfw] API ${res.status} — fail-open`)
      return true
    }

    const data = await res.json()
    const n = data?.nudity
    if (!n) return true

    if (
      (n.sexual_activity ?? 0) > 0.5 ||
      (n.suggestive       ?? 0) > 0.8 ||
      (n.erotica          ?? 0) > 0.5
    ) {
      console.warn('[nsfw] blocked:', { sexual_activity: n.sexual_activity, suggestive: n.suggestive, erotica: n.erotica })
      return false
    }

    return true
  } catch (err) {
    // Fail-open: never block the game if moderation API is down
    console.error(`[nsfw] check failed — ${String(err)}`)
    return true
  }
}
