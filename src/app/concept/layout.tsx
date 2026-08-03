import type { Metadata } from 'next'
import { marketingViewport } from '@/lib/seo/viewport'
import { JsonLd } from '@/components/seo/JsonLd'

export const viewport = marketingViewport

export const metadata: Metadata = {
  title: 'Le concept',
  description:
    "Comment se déroule Black Out ! : achetez un pass d'équipe, rendez-vous à la gare, relevez 12 défis dans la ville et repartez avec un film souvenir généré par IA. Le mode d'emploi complet.",
  alternates: {
    canonical: '/concept',
  },
}

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Combien de temps ça dure ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Comptez environ 1h30 à 2h selon votre rythme et vos pauses hydratation.",
      },
    },
    {
      '@type': 'Question',
      name: 'Faut-il installer une application ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Non, le jeu s'ouvre directement dans le navigateur de votre téléphone (Safari ou Chrome), rien à télécharger depuis les stores. Vous pouvez ajouter un raccourci sur l'écran d'accueil pour plus de confort.",
      },
    },
    {
      '@type': 'Question',
      name: 'Que faut-il prévoir ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un smartphone avec la batterie pleine (ou une powerbank), une connexion 4G/5G, et de bonnes chaussures.',
      },
    },
    {
      '@type': 'Question',
      name: 'Peut-on jouer quand on veut ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui, une fois le pass acheté, vous lancez la partie le jour et l'heure de votre choix. Le code n'expire pas.",
      },
    },
    {
      '@type': 'Question',
      name: "Et s'il pleut ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le jeu se joue par presque tous les temps ; en cas d\'alerte météo sévère, contactez-nous.',
      },
    },
    {
      '@type': 'Question',
      name: 'Peut-on jouer en plusieurs équipes en même temps ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, chaque équipe achète son propre pass et joue indépendamment, même en même temps sur le même parcours.',
      },
    },
    {
      '@type': 'Question',
      name: "C'est adapté à qui ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Des groupes d'adultes à pied, sans limite de joueurs, pour un EVG, un EVJF, un anniversaire ou une sortie entre collègues.",
      },
    },
  ],
}

const BREADCRUMB_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.theblackoutgame.ch/' },
    { '@type': 'ListItem', position: 2, name: 'Le concept', item: 'https://www.theblackoutgame.ch/concept' },
  ],
}

export default function ConceptLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={FAQ_JSON_LD} />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      {children}
    </>
  )
}
