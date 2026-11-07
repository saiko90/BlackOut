export type VilleSection = {
  heading: string
  paragraphs: string[]
}

export type VilleInfo = {
  label: string
  value: string
}

export type VilleFaq = {
  q: string
  a: string
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
  faq: VilleFaq[]
  ctaLabel: string
}

export const VILLES_CONTENT: Partial<Record<string, VilleContent>> = {
  geneve: {
    slug: 'geneve',
    title: 'Rallye urbain à Genève : jeu de piste EVJF/EVG | 29 CHF',
    description:
      "Jeu de piste dans Genève, de Cornavin au Jet d'Eau : 12 défis sur smartphone, ~2 h, film souvenir IA. 29 CHF pour toute l'équipe, joueurs illimités.",
    heroImage: {
      src: '/cities/geneve.jpg',
      alt: 'Rue de la vieille ville de Genève la nuit',
    },
    h1: 'Rallye urbain à Genève',
    subhead: "Jeu de piste de Cornavin au Jet d'Eau",
    intro: [
      "Tu te réveilles à Cornavin sans aucun souvenir de la nuit. Douze défis te séparent de la vérité, et Genève n'a pas l'intention de te faciliter la tâche.",
      "Black Out ! est un jeu de piste géolocalisé qui transforme le centre de Genève en terrain de jeu. Ton équipe suit les instructions sur son téléphone, le GPS valide chaque position, et personne ne ressort tout à fait pareil.",
      "À mi-chemin entre la chasse au trésor et l'escape game en plein air, tout se joue dans le navigateur : pas d'appli à installer, pas de guide, pas d'horaire imposé.",
    ],
    sections: [
      {
        heading: 'Le parcours dans Genève',
        paragraphs: [
          "Le départ se fait à la gare Cornavin. De là, le parcours descend la rive droite jusqu'à la rade, traverse le pont, grimpe dans la vieille ville — la plus grande de Suisse — puis redescend vers le lac pour un final face au Jet d'Eau. Comptez environ deux heures, tout à pied, sans dénivelé sérieux.",
          "Genève a un avantage sur les autres villes du jeu : tout tient dans un mouchoir de poche. Vous ne passerez pas la soirée dans les transports, vous la passerez à faire des choses que vous regretterez.",
        ],
      },
      {
        heading: 'Énigmes et défis entre la rade et la vieille ville',
        paragraphs: [
          "Sur la rade, puis dans les ruelles de la vieille ville, les énigmes vous obligent à regarder pour de vrai des façades et des monuments que vous croisez depuis des années sans les voir. Entre deux énigmes : des photos de groupe que vous n'oserez pas montrer à vos parents, des défis qui impliquent de parler à des inconnus, et un compteur de décibels qui ne fait aucune concession.",
          "Pour valider un défi, le téléphone de l'équipe doit être sur place : le GPS vérifie la position. Il faut donc marcher, chercher, et se mettre d'accord sur le chemin.",
          'Chaque équipe repart avec son film souvenir, monté automatiquement à partir de ses propres photos et vidéos.',
        ],
      },
      {
        heading: 'EVJF, EVG ou anniversaire à Genève',
        paragraphs: [
          "Un EVJF qui se termine en photo de groupe face au Jet d'Eau, un EVG qui traverse la vieille ville en chantant, un anniversaire ou une sortie d'équipe qui sort du bar habituel : le parcours part de Cornavin, à deux pas des trains, et personne n'a besoin de voiture.",
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
    faq: [
      {
        q: 'Où commence le jeu de piste à Genève ?',
        a: "À la gare de Genève-Cornavin. Le parcours descend ensuite vers la rade, monte dans la vieille ville et se termine au bord du lac, face au Jet d'Eau. Tout se fait à pied.",
      },
      {
        q: 'Combien coûte un EVJF ou un EVG à Genève ?',
        a: "29 CHF pour toute l'équipe, quel que soit le nombre de joueurs. Le film souvenir est inclus.",
      },
      {
        q: 'Faut-il réserver une date ?',
        a: "Non. Une fois le pass acheté, vous lancez la partie le jour et à l'heure de votre choix : le code n'expire pas.",
      },
      {
        q: 'Peut-on jouer à plusieurs équipes ?',
        a: 'Oui. Chaque équipe prend son propre pass et joue de son côté, même en même temps sur le même parcours. Vous pouvez ensuite comparer les scores.',
      },
    ],
    ctaLabel: 'Jouer à Genève →',
  },

  lausanne: {
    slug: 'lausanne',
    title: 'Rallye urbain à Lausanne : jeu de piste EVJF/EVG | 29 CHF',
    description:
      "Jeu de piste dans Lausanne, de la gare au Flon : 12 défis sur smartphone, ~2 h, film souvenir IA. 29 CHF pour toute l'équipe, joueurs illimités.",
    heroImage: {
      src: '/cities/lausanne.jpg',
      alt: 'Place de Lausanne éclairée la nuit',
    },
    h1: 'Rallye urbain à Lausanne',
    subhead: 'Rallye urbain de la gare au Flon, par la vieille ville',
    intro: [
      "Tu te réveilles devant la gare sans aucun souvenir de la nuit. Douze défis te séparent de la vérité, et Lausanne est une ville qui monte.",
      "Black Out ! est un jeu de piste géolocalisé qui transforme le centre de Lausanne en terrain de jeu. Ton équipe suit les instructions sur son téléphone, le GPS valide chaque position, et personne ne ressort tout à fait pareil.",
      "À mi-chemin entre la chasse au trésor et l'escape game en plein air, tout se joue dans le navigateur : pas d'appli à installer, pas de guide, pas d'horaire imposé.",
    ],
    sections: [
      {
        heading: 'Le parcours dans Lausanne',
        paragraphs: [
          "Départ devant la gare CFF. La première montée arrive tout de suite — Lausanne ne fait pas de cadeau, et vos mollets vont le comprendre avant vos cerveaux. Le parcours traverse ensuite Saint-François, plonge dans la vieille ville par les places et les escaliers, longe le Grand-Pont, puis redescend jusqu'au Flon pour le final.",
          "C'est la seule ville du jeu où le dénivelé fait partie des défis. Comptez environ deux heures, en prenant votre temps dans les montées. Chaussures fermées recommandées.",
        ],
      },
      {
        heading: 'Énigmes et défis dans la vieille ville de Lausanne',
        paragraphs: [
          "De Saint-François aux places et aux escaliers de la vieille ville, les énigmes vous obligent à regarder pour de vrai des bâtiments que vous croisez depuis des années sans les voir. Entre deux montées : des photos de groupe que vous n'oserez pas montrer à vos parents, des défis qui impliquent de parler à des inconnus dans une rue piétonne bondée, et un compteur de décibels qui ne fait aucune concession.",
          "Pour valider un défi, le téléphone de l'équipe doit être sur place : le GPS vérifie la position. À Lausanne, ça veut dire monter les marches pour de bon.",
          'Chaque équipe repart avec son film souvenir, monté automatiquement à partir de ses propres photos et vidéos.',
        ],
      },
      {
        heading: "EVJF, EVG ou sortie d'équipe à Lausanne",
        paragraphs: [
          "Un EVJF qui grimpe de la gare à la vieille ville, un EVG qui finit au Flon, un anniversaire ou une sortie d'équipe après le travail : le départ se fait devant la gare CFF, et le final tombe pile dans le quartier où la soirée peut continuer.",
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
    faq: [
      {
        q: 'Où commence le jeu de piste à Lausanne ?',
        a: 'Devant la gare de Lausanne. Le parcours passe par Saint-François, la vieille ville et le Grand-Pont, puis se termine dans le quartier du Flon. Prévoyez de bonnes chaussures : ça monte.',
      },
      {
        q: 'Combien coûte un EVJF ou un EVG à Lausanne ?',
        a: "29 CHF pour toute l'équipe, quel que soit le nombre de joueurs. Le film souvenir est inclus.",
      },
      {
        q: 'Faut-il réserver une date ?',
        a: "Non. Une fois le pass acheté, vous lancez la partie le jour et à l'heure de votre choix : le code n'expire pas.",
      },
      {
        q: 'Peut-on jouer à plusieurs équipes ?',
        a: 'Oui. Chaque équipe prend son propre pass et joue de son côté, même en même temps sur le même parcours. Vous pouvez ensuite comparer les scores.',
      },
    ],
    ctaLabel: 'Jouer à Lausanne →',
  },

  sion: {
    slug: 'sion',
    title: 'Jeu de piste à Sion : rallye urbain EVJF/EVG | 29 CHF',
    description:
      "Escape game en plein air à Sion : 12 défis sur smartphone, de la gare au château de Valère, ~2 h et film souvenir IA. 29 CHF pour toute l'équipe.",
    heroImage: {
      src: '/cities/sion.jpg',
      alt: 'Place de la vieille ville de Sion éclairée la nuit',
    },
    h1: 'Rallye urbain à Sion',
    subhead: 'Jeu de piste de la gare au château de Valère',
    intro: [
      "Tu te réveilles sur un banc devant la gare, sans aucun souvenir de la nuit. Douze défis te séparent de la vérité, et Sion t'attend avec deux châteaux qui te regardent de haut depuis huit siècles.",
      "Black Out ! est un jeu de piste géolocalisé qui transforme le centre de Sion en terrain de jeu. Ton équipe suit les instructions sur son téléphone, le GPS valide chaque position, et personne ne ressort tout à fait pareil.",
      "À mi-chemin entre la chasse au trésor et l'escape game en plein air, tout se joue dans le navigateur : pas d'appli à installer, pas de guide, pas d'horaire imposé.",
    ],
    sections: [
      {
        heading: 'Le parcours dans Sion',
        paragraphs: [
          "Départ à la gare. Le parcours remonte l'avenue de la Gare, traverse la Place du Midi et le Grand-Pont, passe par la Planta et la vieille ville, puis attaque la montée vers les hauteurs.",
          "C'est la seule ville du jeu où le final se joue en altitude, devant le château de Valère, avec toute la vallée du Rhône en dessous. La récompense se mérite : la dernière partie du parcours grimpe pour de bon.",
          "Sion est aussi la plus petite des trois villes, et c'est un avantage. Tout se fait à pied, rien n'est loin, et vous croiserez les mêmes passants trois fois — de plus en plus perplexes à chaque passage.",
        ],
      },
      {
        heading: 'Énigmes, défis photo et film souvenir à Sion',
        paragraphs: [
          "De la Planta aux ruelles de la vieille ville, les énigmes vous obligent à regarder pour de vrai des bâtiments que vous croisez depuis des années sans les voir. Entre deux énigmes : des photos de groupe que vous n'oserez pas montrer à vos parents, des défis qui impliquent de parler à des inconnus au milieu de la Place du Midi, et un compteur de décibels que les falaises renverront en écho.",
          "Pour valider un défi, le téléphone de l'équipe doit être sur place : le GPS vérifie la position. Le dernier se mérite : il faut monter jusqu'à Valère.",
          'Chaque équipe repart avec son film souvenir, monté automatiquement à partir de ses propres photos et vidéos.',
        ],
      },
      {
        heading: 'EVJF, EVG ou anniversaire à Sion',
        paragraphs: [
          "Un EVJF qui se termine en photo de groupe devant Valère, un EVG qui traverse la Place du Midi en criant, un anniversaire ou une sortie d'équipe : le départ se fait à la gare, tout se fait à pied, et la vallée du Rhône sert de décor au final.",
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
    faq: [
      {
        q: 'Où commence le jeu de piste à Sion ?',
        a: "À la gare de Sion. Le parcours remonte l'avenue de la Gare, passe par la Place du Midi, la Planta et la vieille ville, puis se termine sur les hauteurs, devant le château de Valère.",
      },
      {
        q: 'Combien coûte un EVJF ou un EVG à Sion ?',
        a: "29 CHF pour toute l'équipe, quel que soit le nombre de joueurs. Le film souvenir est inclus.",
      },
      {
        q: 'Faut-il réserver une date ?',
        a: "Non. Une fois le pass acheté, vous lancez la partie le jour et à l'heure de votre choix : le code n'expire pas.",
      },
      {
        q: 'Peut-on jouer à plusieurs équipes ?',
        a: 'Oui. Chaque équipe prend son propre pass et joue de son côté, même en même temps sur le même parcours. Vous pouvez ensuite comparer les scores.',
      },
    ],
    ctaLabel: 'Jouer à Sion →',
  },
}
