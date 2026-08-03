import { ImageResponse } from 'next/og'
import { loadGeistFont } from './og-font'

export const OG_SIZE = { width: 1200, height: 630 }

type OgImageOptions = {
  subtitle: string
  bottomText: string
  badgeText: string
}

export async function buildOgImage({ subtitle, bottomText, badgeText }: OgImageOptions) {
  const [bold, medium] = await Promise.all([loadGeistFont(800), loadGeistFont(500)])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#09090B',
          position: 'relative',
          fontFamily: 'Geist',
        }}
      >
        {/* Glow radial violet depuis le haut */}
        <div
          style={{
            position: 'absolute',
            top: -260,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 1000,
            height: 1000,
            borderRadius: 1000,
            backgroundImage:
              'radial-gradient(circle, rgba(124,58,237,0.5) 0%, rgba(124,58,237,0) 68%)',
            display: 'flex',
          }}
        />

        {/* Badge pill */}
        <div
          style={{
            position: 'absolute',
            top: 56,
            left: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: 'rgba(52,211,153,0.14)',
            border: '2px solid rgba(52,211,153,0.4)',
            borderRadius: 999,
            padding: '12px 26px',
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: 16, backgroundColor: '#34D399', display: 'flex' }} />
          <span style={{ color: '#34D399', fontSize: 28, fontWeight: 700, fontFamily: 'Geist-Medium' }}>
            {badgeText}
          </span>
        </div>

        {/* Contenu central */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ color: '#ffffff', fontSize: 128, fontWeight: 800, letterSpacing: -4 }}>
              Black Out
            </span>
            <span
              style={{
                marginLeft: 20,
                fontSize: 128,
                fontWeight: 800,
                backgroundImage: 'linear-gradient(90deg, #A78BFA 0%, #E879F9 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              !
            </span>
          </div>
          <div style={{ display: 'flex', fontSize: 40, color: '#a1a1aa', fontFamily: 'Geist-Medium', fontWeight: 500 }}>
            {subtitle}
          </div>
        </div>

        {/* Bas de page */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 60 }}>
          <span style={{ fontSize: 28, color: '#71717a', fontFamily: 'Geist-Medium', fontWeight: 500 }}>
            {bottomText}
          </span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Geist', data: bold, style: 'normal', weight: 800 },
        { name: 'Geist-Medium', data: medium, style: 'normal', weight: 500 },
      ],
    }
  )
}
