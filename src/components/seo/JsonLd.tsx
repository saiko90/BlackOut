type JsonLdProps = {
  data: Record<string, unknown>
}

/* ── Rendu côté serveur uniquement (jamais via useEffect) — voir doc Next.js JSON-LD ── */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
