'use client'

import { cn } from '@/lib/utils'

const LINKS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/blackoutgamech/',
    color: 'hover:text-pink-400',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.41.59.22 1.01.49 1.45.93.44.44.71.86.93 1.45.17.46.36 1.26.41 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.41 2.43-.22.59-.49 1.01-.93 1.45-.44.44-.86.71-1.45.93-.46.17-1.26.36-2.43.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.41a3.92 3.92 0 0 1-1.45-.93 3.92 3.92 0 0 1-.93-1.45c-.17-.46-.36-1.26-.41-2.43C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.24-1.97.41-2.43.22-.59.49-1.01.93-1.45.44-.44.86-.71 1.45-.93.46-.17 1.26-.36 2.43-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84ZM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4Zm6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z',
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@blackout4179',
    color: 'hover:text-cyan-300',
    path: 'M16.6 5.82A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61590411963951',
    color: 'hover:text-blue-400',
    path: 'M22 12.06C22 6.5 17.5 2 12 2S2 6.5 2 12.06c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.85h2.78l-.45 2.89h-2.33v6.99C18.34 21.19 22 17.06 22 12.06Z',
  },
]

type SocialLinksProps = {
  className?: string
  label?: string
}

export function SocialLinks({ className, label = 'Suivez-nous' }: SocialLinksProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {label && (
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">{label}</p>
      )}
      <div className="flex items-center gap-4">
        {LINKS.map(({ name, href, color, path }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className={cn('text-zinc-400 transition-colors', color)}
          >
            <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" aria-hidden>
              <path d={path} />
            </svg>
          </a>
        ))}
      </div>
    </div>
  )
}
