/* ── Pages d'intention (/evjf, /evg).
   Règles : aucun chiffre non sourcé (pas de prix de concurrent, pas de « prix moyen »),
   faits sûrs uniquement (29 CHF par équipe, 12 défis, ~2 h, joueurs illimités,
   départs et arrivées de src/data/villes.ts). Les blocs villes renvoient vers les
   pages villes au lieu de recopier leur texte. Pas de pages ville × intention. ── */

export type IntentionSection = {
  heading: string
  paragraphs: string[]
}

export type IntentionCityBlock = {
  slug: string
  name: string
  text: string
  linkLabel: string
}

export type IntentionFaq = {
  q: string
  a: string
}

export type IntentionContent = {
  slug: string
  title: string
  description: string
  breadcrumbName: string
  h1: string
  intro: string[]
  sections: IntentionSection[]
  citiesHeading: string
  cities: IntentionCityBlock[]
  budget: IntentionSection
  faqHeading: string
  faq: IntentionFaq[]
  ctaLabel: string
}

export const INTENTIONS_CONTENT: Record<'evjf' | 'evg', IntentionContent> = {
  evjf: {
    slug: 'evjf',
    title: 'EVJF à Sion, Lausanne ou Genève : jeu de piste à 29 CHF',
    description:
      'EVJF original en Suisse romande : jeu de piste sur smartphone à Sion, Lausanne ou Genève. 12 défis, film souvenir IA, 29 CHF pour toute l\'équipe.',
    breadcrumbName: 'EVJF',
    h1: 'EVJF : un jeu de piste en ville pour la future mariée',
    intro: [
      "Organiser un enterrement de vie de jeune fille, c'est souvent jongler entre des amies qui ne se connaissent pas toutes, un budget à tenir et une future mariée qui ne veut surtout pas d'un programme gênant… ou qui le mérite un peu. Black Out ! règle une bonne partie du problème : un jeu de piste en équipe, sur smartphone, dans les rues de Sion, Lausanne ou Genève.",
      "Douze défis, environ deux heures à pied, et un film souvenir monté automatiquement par IA à partir de vos propres photos et vidéos. Rien à installer : le jeu s'ouvre dans le navigateur du téléphone.",
    ],
    sections: [
      {
        heading: "Le déroulé d'une après-midi d'EVJF",
        paragraphs: [
          "Rendez-vous à la gare de la ville choisie, à l'heure qui vous arrange : il n'y a pas de créneau à réserver. Une seule personne ouvre le lien reçu par e-mail, autorise le GPS et la caméra, et la partie démarre.",
          "Le téléphone guide ensuite l'équipe d'une étape à l'autre. Énigmes à résoudre sur des bâtiments du centre, photos de groupe, gages filmés, défis qui impliquent des inconnus : la future mariée est au centre de l'attention, les témoins tiennent le téléphone. Chaque défi se valide sur place, grâce au GPS.",
          "Après le dernier défi, le film souvenir de l'équipe est monté automatiquement. La suite de la journée reste libre : apéro, repas ou soirée, à vous de choisir ce qui vient après.",
        ],
      },
      {
        heading: 'Quelques conseils pour réussir le jeu',
        paragraphs: [
          'Chargez le téléphone qui sert au jeu, ou prenez une batterie externe : GPS, caméra et vidéos consomment vite.',
          "Prévoyez des chaussures confortables, surtout à Lausanne et pour la montée finale à Sion. Le parcours est en extérieur toute l'année : jetez un œil à la météo avant de partir.",
          "Gardez la suite de la soirée près de l'arrivée : vous finirez à pied, et probablement avec soif.",
        ],
      },
    ],
    citiesHeading: 'Choisir la ville de votre EVJF',
    cities: [
      {
        slug: 'sion',
        name: 'Sion',
        text: 'Départ à la gare, traversée de la vieille ville, puis final devant le château de Valère, avec la vallée du Rhône en dessous. La plus compacte des trois villes.',
        linkLabel: 'Le jeu de piste à Sion',
      },
      {
        slug: 'lausanne',
        name: 'Lausanne',
        text: "Départ devant la gare, passage par Saint-François et la vieille ville, final au Flon. C'est la ville où ça monte le plus : baskets conseillées.",
        linkLabel: 'Le rallye urbain à Lausanne',
      },
      {
        slug: 'geneve',
        name: 'Genève',
        text: "Départ à Cornavin, traversée de la rade et de la vieille ville, final au bord du lac face au Jet d'Eau. Tout se fait à pied, sans dénivelé sérieux.",
        linkLabel: 'Le rallye urbain à Genève',
      },
    ],
    budget: {
      heading: "Budget : 29 CHF pour toute l'équipe",
      paragraphs: [
        "Le pass coûte 29 CHF pour toute l'équipe, quel que soit le nombre de joueuses. Pas de prix par personne : le film souvenir est inclus, et le reste du budget peut aller au repas ou au cadeau de la future mariée.",
        'Le paiement se fait en ligne, par TWINT ou carte bancaire. Pour un grand groupe, formez plusieurs équipes : chacune prend son pass et vous comparez les scores à la fin.',
      ],
    },
    faqHeading: "Questions sur l'EVJF Black Out !",
    faq: [
      {
        q: 'Combien de personnes peuvent participer ?',
        a: "Il n'y a pas de limite de joueuses par pass. Le jeu est le plus agréable de 3 à 15 personnes environ par équipe ; au-delà, plusieurs équipes peuvent jouer en même temps sur le même parcours.",
      },
      {
        q: 'Faut-il réserver une date ?',
        a: "Non. Une fois le pass acheté, vous lancez la partie le jour et à l'heure de votre choix : le code n'expire pas.",
      },
      {
        q: 'La future mariée doit-elle connaître la ville ?',
        a: "Non. Le jeu guide l'équipe d'une étape à l'autre depuis la gare. Il suffit d'un smartphone chargé avec le GPS et la caméra activés.",
      },
      {
        q: "Peut-on acheter le pass à l'avance ?",
        a: "Oui. Comme le code n'expire pas, vous pouvez l'acheter dès que la date de l'EVJF est fixée, ou l'offrir.",
      },
    ],
    ctaLabel: 'Choisir la ville de l\'EVJF →',
  },

  evg: {
    slug: 'evg',
    title: 'EVG à Sion, Lausanne ou Genève : rallye urbain à 29 CHF',
    description:
      "EVG à Sion, Lausanne ou Genève : 12 défis absurdes sur smartphone, film souvenir IA, environ 2 h. 29 CHF pour toute l'équipe, joueurs illimités.",
    breadcrumbName: 'EVG',
    h1: 'EVG : un rallye urbain pour enterrer sa vie de garçon',
    intro: [
      "Pour un enterrement de vie de garçon, il y a les classiques qu'on a tous déjà faits. Black Out ! propose autre chose : un rallye urbain sur smartphone où le futur marié et ses potes enchaînent douze défis absurdes dans les rues de Sion, Lausanne ou Genève.",
      "Le scénario : vous vous réveillez à la gare sans aucun souvenir de la veille, et douze défis vous séparent de la vérité. Environ deux heures à pied, un téléphone par équipe, et à la fin un film souvenir monté par IA que le marié ne pourra pas effacer.",
    ],
    sections: [
      {
        heading: "Le déroulé d'un EVG Black Out !",
        paragraphs: [
          "Vous vous retrouvez à la gare de la ville choisie, quand vous voulez : pas de réservation, pas de guide, pas d'horaire imposé. Un seul téléphone ouvre le lien reçu par e-mail, autorise le GPS et la caméra, et c'est parti.",
          "Les défis mélangent énigmes, photos de groupe, gages filmés et un compteur de décibels : à un moment, il faudra crier en pleine rue. Chaque défi se valide sur place grâce au GPS, donc impossible de tout faire depuis une terrasse.",
          "Le jeu dure environ deux heures : il trouve sa place en début d'après-midi, avant le repas ou la soirée. À l'arrivée, le film souvenir de l'équipe est monté automatiquement avec vos photos et vidéos.",
        ],
      },
      {
        heading: 'Plusieurs équipes, un seul marié',
        paragraphs: [
          "Si vous êtes nombreux, formez deux équipes ou plus. Chacune prend son pass et joue de son côté, même en même temps sur le même parcours. À la fin, vous comparez les scores, et l'équipe perdante sait ce qu'elle doit au marié.",
          "Le jeu est pensé pour des groupes d'adultes à pied, avec un peu d'humour potache et beaucoup d'autodérision. Une condition physique correcte suffit, mais le marié doit pouvoir marcher deux heures.",
        ],
      },
    ],
    citiesHeading: "Choisir la ville de l'EVG",
    cities: [
      {
        slug: 'sion',
        name: 'Sion',
        text: 'Départ à la gare, passage par la Place du Midi et la Planta, final en hauteur devant le château de Valère. La dernière montée est pour le marié.',
        linkLabel: 'Le jeu de piste à Sion',
      },
      {
        slug: 'lausanne',
        name: 'Lausanne',
        text: 'Départ devant la gare, montée vers la vieille ville par les escaliers, final au Flon, là où la soirée peut continuer sans reprendre le train.',
        linkLabel: 'Le rallye urbain à Lausanne',
      },
      {
        slug: 'geneve',
        name: 'Genève',
        text: "Départ à Cornavin, puis la rade, le pont et la vieille ville, avant un final face au Jet d'Eau. Tout tient à pied.",
        linkLabel: 'Le rallye urbain à Genève',
      },
    ],
    budget: {
      heading: "Budget : 29 CHF pour toute l'équipe",
      paragraphs: [
        "Pas de prix par tête : 29 CHF pour toute l'équipe, quel que soit le nombre de joueurs, film souvenir inclus. Le reste du budget va où vous voulez.",
        'Le paiement se fait en ligne, par TWINT ou carte bancaire, et le code reste valable : vous pouvez le prendre dès que la date est fixée.',
      ],
    },
    faqHeading: "Questions sur l'EVG Black Out !",
    faq: [
      {
        q: 'Combien coûte un EVG avec Black Out ! ?',
        a: "29 CHF pour toute l'équipe, quel que soit le nombre de joueurs. Le film souvenir est inclus.",
      },
      {
        q: 'Combien de temps dure le rallye ?',
        a: 'Comptez environ 1 h 30 à 2 h selon votre rythme et vos pauses.',
      },
      {
        q: 'Faut-il installer une application ?',
        a: "Non. Le jeu s'ouvre dans le navigateur du téléphone (Safari ou Chrome). Un smartphone chargé avec le GPS et la caméra activés suffit.",
      },
      {
        q: 'Faut-il réserver une date ?',
        a: "Non. Une fois le pass acheté, vous lancez la partie le jour et à l'heure de votre choix : le code n'expire pas.",
      },
    ],
    ctaLabel: "Choisir la ville de l'EVG →",
  },
}
