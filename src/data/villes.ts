export type VilleSection = {
  heading: string
  paragraphs: string[]
}

export type VilleInfo = {
  label: string
  value: string
}

export type VilleContent = {
  slug: string
  title: string
  description: string
  heroImage: { src: string; alt: string }
  h1: string
  subhead: string
  intro: string[]
  sections: VilleSection[]
  infosPratiques: VilleInfo[]
  ctaLabel: string
}

export const VILLES_CONTENT: Partial<Record<string, VilleContent>> = {
  geneve: {
    slug: 'geneve',
    title: 'Rallye urbain à Genève — EVG, EVJF & sorties entre amis | Black Out !',
    description:
      "Jeu de piste géolocalisé dans Genève. 12 défis, ~2h, départ à Cornavin. 29 CHF pour toute l'équipe, joueurs illimités. Rien à télécharger.",
    heroImage: {
      src: '/cities/geneve.jpg',
      alt: 'Rue de la vieille ville de Genève la nuit',
    },
    h1: 'Rallye urbain à Genève',
    subhead: 'Ta ville. Ton équipe. Douze mauvaises décisions.',
    intro: [
      "Tu te réveilles à Cornavin sans aucun souvenir de la nuit. Douze défis te séparent de la vérité, et Genève n'a pas l'intention de te faciliter la tâche.",
      "Black Out ! est un jeu de piste géolocalisé qui transforme le centre de Genève en terrain de jeu. Ton équipe suit les instructions sur son téléphone, le GPS valide chaque position, et personne ne ressort tout à fait pareil.",
    ],
    sections: [
      {
        heading: 'Le terrain',
        paragraphs: [
          "Le départ se fait à la gare Cornavin. De là, le parcours descend la rive droite jusqu'à la rade, traverse le pont, grimpe dans la vieille ville — la plus grande de Suisse — puis redescend vers le lac pour un final face au Jet d'Eau. Comptez environ deux heures, tout à pied, sans dénivelé sérieux.",
          "Genève a un avantage sur les autres villes du jeu : tout tient dans un mouchoir de poche. Vous ne passerez pas la soirée dans les transports, vous la passerez à faire des choses que vous regretterez.",
        ],
      },
      {
        heading: 'Ce qui vous attend',
        paragraphs: [
          "Des énigmes qui demandent d'ouvrir les yeux sur des bâtiments que vous croisez depuis des années sans les regarder. Des photos de groupe que vous n'oserez pas montrer à vos parents. Des défis qui impliquent de parler à des inconnus. Et un compteur de décibels qui ne fait aucune concession.",
          'Chaque équipe repart avec son film souvenir, monté automatiquement à partir de ses propres photos et vidéos.',
        ],
      },
      {
        heading: 'Pour qui',
        paragraphs: [
          "EVG, EVJF, anniversaire, sortie d'équipe, ou simplement un samedi après-midi à Genève dont vous parlerez encore dans dix ans.",
          'De 3 à 15 joueurs environ. Au-delà, jouez en plusieurs équipes et comparez les scores.',
        ],
      },
    ],
    infosPratiques: [
      { label: 'Départ', value: 'gare de Genève-Cornavin' },
      { label: 'Durée', value: 'environ 2 heures' },
      { label: 'Prix', value: "29 CHF pour toute l'équipe, nombre de joueurs illimité" },
      { label: 'Matériel', value: 'un smartphone chargé par équipe, GPS et caméra activés' },
      { label: 'Installation', value: "aucune. Le jeu s'ouvre dans le navigateur" },
      { label: 'Quand', value: "toute l'année, à l'heure que vous voulez" },
      { label: 'Météo', value: 'le parcours est extérieur. Prévoyez en conséquence' },
    ],
    ctaLabel: 'Jouer à Genève →',
  },

  // sion: // TODO: contenu Sion

  // lausanne: // TODO: contenu Lausanne
}
