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

  lausanne: {
    slug: 'lausanne',
    title: 'Rallye urbain à Lausanne — EVG, EVJF & sorties entre amis | Black Out !',
    description:
      "Jeu de piste géolocalisé dans Lausanne. 12 défis, ~2h, départ à la gare. 29 CHF pour toute l'équipe, joueurs illimités. Rien à télécharger.",
    heroImage: {
      src: '/cities/lausanne.jpg',
      alt: 'Place de Lausanne éclairée la nuit',
    },
    h1: 'Rallye urbain à Lausanne',
    subhead: 'Ta ville. Ton équipe. Douze mauvaises décisions.',
    intro: [
      "Tu te réveilles devant la gare sans aucun souvenir de la nuit. Douze défis te séparent de la vérité, et Lausanne est une ville qui monte.",
      "Black Out ! est un jeu de piste géolocalisé qui transforme le centre de Lausanne en terrain de jeu. Ton équipe suit les instructions sur son téléphone, le GPS valide chaque position, et personne ne ressort tout à fait pareil.",
    ],
    sections: [
      {
        heading: 'Le terrain',
        paragraphs: [
          "Départ devant la gare CFF. La première montée arrive tout de suite — Lausanne ne fait pas de cadeau, et vos mollets vont le comprendre avant vos cerveaux. Le parcours traverse ensuite Saint-François, plonge dans la vieille ville par les places et les escaliers, longe le Grand-Pont, puis redescend jusqu'au Flon pour le final.",
          "C'est la seule ville du jeu où le dénivelé fait partie des défis. Comptez environ deux heures, en prenant votre temps dans les montées. Chaussures fermées recommandées.",
        ],
      },
      {
        heading: 'Ce qui vous attend',
        paragraphs: [
          "Des énigmes qui demandent d'ouvrir les yeux sur des bâtiments que vous croisez depuis des années sans les regarder. Des photos de groupe que vous n'oserez pas montrer à vos parents. Des défis qui impliquent de parler à des inconnus dans une rue piétonne bondée. Et un compteur de décibels qui ne fait aucune concession.",
          'Chaque équipe repart avec son film souvenir, monté automatiquement à partir de ses propres photos et vidéos.',
        ],
      },
      {
        heading: 'Pour qui',
        paragraphs: [
          "EVG, EVJF, anniversaire, sortie d'équipe, ou simplement un samedi après-midi à Lausanne dont vous parlerez encore dans dix ans.",
          'De 3 à 15 joueurs environ. Au-delà, jouez en plusieurs équipes et comparez les scores.',
          'Un conseil : le final se joue au Flon. Ne prévoyez rien juste après.',
        ],
      },
    ],
    infosPratiques: [
      { label: 'Départ', value: 'gare de Lausanne' },
      { label: 'Arrivée', value: 'quartier du Flon' },
      { label: 'Durée', value: 'environ 2 heures' },
      { label: 'Prix', value: "29 CHF pour toute l'équipe, nombre de joueurs illimité" },
      { label: 'Matériel', value: 'un smartphone chargé par équipe, GPS et caméra activés' },
      { label: 'Installation', value: "aucune. Le jeu s'ouvre dans le navigateur" },
      { label: 'Quand', value: "toute l'année, à l'heure que vous voulez" },
      { label: 'Terrain', value: 'dénivelé important, chaussures confortables conseillées' },
    ],
    ctaLabel: 'Jouer à Lausanne →',
  },

  sion: {
    slug: 'sion',
    title: 'Rallye urbain à Sion — EVG, EVJF & sorties entre amis | Black Out !',
    description:
      "Jeu de piste géolocalisé dans Sion. 12 défis, ~2h, départ à la gare, final sous les châteaux. 29 CHF pour toute l'équipe, joueurs illimités. Rien à télécharger.",
    heroImage: {
      src: '/cities/sion.jpg',
      alt: 'Place de la vieille ville de Sion éclairée la nuit',
    },
    h1: 'Rallye urbain à Sion',
    subhead: 'Ta ville. Ton équipe. Douze mauvaises décisions.',
    intro: [
      "Tu te réveilles sur un banc devant la gare, sans aucun souvenir de la nuit. Douze défis te séparent de la vérité, et Sion t'attend avec deux châteaux qui te regardent de haut depuis huit siècles.",
      "Black Out ! est un jeu de piste géolocalisé qui transforme le centre de Sion en terrain de jeu. Ton équipe suit les instructions sur son téléphone, le GPS valide chaque position, et personne ne ressort tout à fait pareil.",
    ],
    sections: [
      {
        heading: 'Le terrain',
        paragraphs: [
          "Départ à la gare. Le parcours remonte l'avenue de la Gare, traverse la Place du Midi et le Grand-Pont, passe par la Planta et la vieille ville, puis attaque la montée vers les hauteurs.",
          "C'est la seule ville du jeu où le final se joue en altitude, devant le château de Valère, avec toute la vallée du Rhône en dessous. La récompense se mérite : la dernière partie du parcours grimpe pour de bon.",
          "Sion est aussi la plus petite des trois villes, et c'est un avantage. Tout se fait à pied, rien n'est loin, et vous croiserez les mêmes passants trois fois — de plus en plus perplexes à chaque passage.",
        ],
      },
      {
        heading: 'Ce qui vous attend',
        paragraphs: [
          "Des énigmes qui demandent d'ouvrir les yeux sur des bâtiments que vous croisez depuis des années sans les regarder. Des photos de groupe que vous n'oserez pas montrer à vos parents. Des défis qui impliquent de parler à des inconnus au milieu de la Place du Midi. Et un compteur de décibels que les falaises renverront en écho.",
          'Chaque équipe repart avec son film souvenir, monté automatiquement à partir de ses propres photos et vidéos.',
        ],
      },
      {
        heading: 'Pour qui',
        paragraphs: [
          "EVG, EVJF, anniversaire, sortie d'équipe, ou simplement un samedi après-midi à Sion dont vous parlerez encore dans dix ans.",
          'De 3 à 15 joueurs environ. Au-delà, jouez en plusieurs équipes et comparez les scores.',
        ],
      },
    ],
    infosPratiques: [
      { label: 'Départ', value: 'gare de Sion' },
      { label: 'Arrivée', value: 'hauteurs de la vieille ville, sous les châteaux' },
      { label: 'Durée', value: 'environ 2 heures' },
      { label: 'Prix', value: "29 CHF pour toute l'équipe, nombre de joueurs illimité" },
      { label: 'Matériel', value: 'un smartphone chargé par équipe, GPS et caméra activés' },
      { label: 'Installation', value: "aucune. Le jeu s'ouvre dans le navigateur" },
      { label: 'Quand', value: "toute l'année, à l'heure que vous voulez" },
      {
        label: 'Terrain',
        value:
          'montée finale, chaussures confortables conseillées. En été, partez en fin de journée : la vallée tape fort à midi',
      },
    ],
    ctaLabel: 'Jouer à Sion →',
  },
}
