/* ── Charge un poids de la police Geist (déjà utilisée sur le site via next/font/google)
   depuis Google Fonts, au format ttf/otf/woff exploitable par next/og (satori).
   L'en-tête User-Agent "ancien navigateur" force Google à répondre avec un format
   statique plutôt que woff2 (non supporté par satori). ── */
const LEGACY_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'

export async function loadGeistFont(weight: number): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Geist:wght@${weight}`
  const css = await fetch(cssUrl, { headers: { 'User-Agent': LEGACY_USER_AGENT } }).then((res) =>
    res.text()
  )
  const match = css.match(/src: url\(([^)]+)\) format\('(?:woff|opentype|truetype)'\)/)
  if (!match) {
    throw new Error(`Impossible de charger Geist ${weight} depuis Google Fonts`)
  }
  const fontRes = await fetch(match[1])
  return fontRes.arrayBuffer()
}
