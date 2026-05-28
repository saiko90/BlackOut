export type StepType = 'photo' | 'video' | 'text' | 'audio' | 'decibel'

export type Step = {
  id: number
  title: string
  context: string
  instruction: string
  type: StepType
  gpsCoordinates: string   // format "lat,lng" — obligatoire pour le bouton Maps
  expectedAnswer?: string
  penalty: string
  points: number
}

export const SION_SCENARIO: Step[] = [
  {
    id: 1,
    title: 'Le Réveil des Morts',
    context: 'Vous vous réveillez sur un banc de la Gare de Sion. Bouche pâteuse, aucun souvenir, et un SMS anonyme : "J\'ai vos clés de voiture. Si vous les voulez, jouez avec moi." Début du carnage.',
    instruction: "Trouvez le panneau d'affichage des bus CarPostal devant la gare. Quel est le numéro de la ligne principale pour monter à Veysonnaz ? (Indice : deux réponses possibles, entrez l'un des deux numéros)",
    type: 'text',
    gpsCoordinates: '46.227759,7.358565',
    expectedAnswer: '363', // Le code de validation acceptera l'une des deux réponses si configuré, ou fixons 363 pour le test
    penalty: "Le capitaine doit mimer un bus en faisant 'Biiip biiip' à chaque passant pendant 1 minute.",
    points: 100,
  },
  {
    id: 2,
    title: 'La Fashion Week de l\'Épave',
    context: "Le ravisseur confirme qu'il vous observe depuis les caméras de la ville. Vous avancez sur l'Avenue de la Gare, persuadés d'être des stars internationales alors que vous ressemblez à des rescapés d'un naufrage.",
    instruction: "Arrêtez-vous au milieu du trottoir devant une vitrine de magasin. Posez ensemble comme des mannequins de haute couture ultra-hautains et ridicules. Regards ténébreux et positions asymétriques. Prenez une photo de groupe digne d'un magazine de mode raté.",
    type: 'photo',
    gpsCoordinates: '46.229440,7.358661',
    penalty: 'Le plus jeune du groupe doit faire 10 sauts de grenouille sur le trottoir.',
    points: 100,
  },
  {
    id: 3,
    title: 'Le Cri de Ralliement',
    context: "Vous arrivez à la Place du Midi. Le mystérieux ravisseur prétend que vous avez hurlé une incantation magique toute la nuit pour forcer les bars à rester ouverts.",
    instruction: "Activez le capteur et prouvez que vous avez encore du coffre. Remplissez la jauge à 85% en hurlant 'APÉRO !' de toutes vos forces au milieu de la place. Que tout Sion vous entende !",
    type: 'decibel',
    gpsCoordinates: '46.231629,7.361728',
    penalty: "Tout le monde fait 15 pompes pour s'excuser auprès des tympans des passants.",
    points: 100,
  },
  {
    id: 4,
    title: 'Le Registre des Coupables',
    context: "L'inconnu vous envoie vers l'Hôtel de Ville. Il prétend y avoir déposé une plainte contre vous pour 'terrorisme sonore nocturne'. Le code pour effacer le dossier est sur le bâtiment.",
    instruction: "Regardez la façade principale de l'Hôtel de Ville de Sion. Quelle est l'année historique gravée au-dessus de la porte principale ?\n(Entrez les 4 chiffres)",
    type: 'text',
    gpsCoordinates: '46.233807,7.360555',
    expectedAnswer: '1952',
    penalty: "Criez 'Je promets d'être sage, Monsieur le Président !' en saluant solennellement le bâtiment.",
    points: 100,
  },
  {
    id: 5,
    title: 'L\'Outrage au Magistrat',
    context: "Le trou noir se dissipe. L'inconnu vous rafraîchit la mémoire : hier soir, après un verre de fendant de trop, vous étiez tellement chauds que vous avez provoqué en duel un policier municipal imaginaire.",
    instruction: "Rendez-vous devant la Migros du Ritz. Reproduisez ce combat de rue légendaire au ralenti, face caméra : l'un joue le flic incorruptible, l'autre le provocateur déchaîné. Un affrontement digne de Matrix. Vidéo de 10 secondes.",
    type: 'video',
    gpsCoordinates: '46.235747,7.360069',
    penalty: 'Marchez en crabe jusqu\'à la prochaine rue.',
    points: 100,
  },
  {
    id: 6,
    title: 'La Rançon du Grand-Pont',
    context: "Vous survivez à vos cascades et débouchez sur l'Avenue du Grand-Pont, juste à côté de la belle fontaine. L'inconnu exige une preuve de votre faillite financière.",
    instruction: "Videz vos pocket sur un muret vers la fontaine : posez tout ce qu'il vous reste (pièces de 5 centimes, tickets de caisse froissés, un briquet, une chaussette) et prenez une photo ultra-artistique, style 'scène de crime', de votre rançon pathétique.",
    type: 'photo',
    gpsCoordinates: '46.234410,7.360442',
    penalty: "L'un de vous doit demander une pièce de 10 centimes à un passant en prétendant que c'est pour s'acheter un neurone.",
    points: 100,
  },
  {
    id: 7,
    title: 'Le Test de la Toupie',
    context: "Le ravisseur commence à vous apprécier, mais il doute encore de votre équilibre de montagnards. Rendez-vous au centre de la grande Place de la Planta.",
    instruction: "L'un des joueurs doit lever les yeux vers le ciel, tendre le bras, tourner 10 fois ultra-rapidement sur lui-même comme une toupie, puis essayer de courir en ligne droite pour faire un high-five au caméraman. Filmez la défaite de la gravité !",
    type: 'video',
    gpsCoordinates: '46.232680,7.357777',
    penalty: 'Le joueur qui a tourné doit faire la révérence à trois parterres de fleurs en les félicitant d\'exister.',
    points: 100,
  },
  {
    id: 8,
    title: 'La Supplication de Catherine',
    context: "après avoir vomis votre petit déj', vos pas chancelants vous mènent directement devant la statue historique de Catherine.",
    instruction: "Mettez-vous à genoux collectivement devant la statue de Catherine. Mimez une supplication dramatique et théâtrale pour qu'elle vous rende votre dignité perdue. Prenez la scène en photo.",
    type: 'photo',
    gpsCoordinates: '46.233218,7.357863',
    penalty: "Récitez l'alphabet à l'envers le plus vite possible pendant que votre équipe vous hue.",
    points: 100,
  },
  {
    id: 9,
    title: 'Le Grand Pardon',
    context: "Face à la majestueuse Cathédrale de Sion, le poids de la culpabilité de vos actes de la veille devient trop lourd. Une confession publique s'impose.",
    instruction: "Debout face caméra devant la Cathédrale, l'un de vous doit confesser avec un sérieux absolu un crime ridicule commis la veille (ex: 'J'avoue avoir mangé la raclette de mon pote avec une fourchette en plastique'). Soyez dramatiques !",
    type: 'video',
    gpsCoordinates: '46.233896,7.358841',
    penalty: 'Faites 10 burpees de pénitence sur les pavés.',
    points: 100,
  },
  {
    id: 10,
    title: 'Le Rituel de Saint Théodule',
    context: "Vous entamez la grimpette vers les sommets. Arrivés devant Saint Théodule, il est temps de rendre hommage aux protecteurs du Valais à votre manière.",
    instruction: "Improvisez une danse rituelle chamanique complètement folle, synchronisée et absurde devant Saint Théodule pendant 10 secondes. Filmez ce grand moment d'art contemporain.",
    type: 'video',
    gpsCoordinates: '46.234468,7.361884',
    penalty: "Faites la révérence aux passants en disant 'Paix et sérénité sur votre vignoble'.",
    points: 100,
  },
  {
    id: 11,
    title: 'Le Cri des Cimes',
    context: "Vous atteignez enfin la Place Maurice Zermatten, juste en dessous des géants de pierre. La vue est belle, mais vos gosiers sont plus secs que le désert du Sahara.",
    instruction: "Faites trembler les falaises de Tourbillon et Valère ! Activez le micro et hurlez 'ON A SOIF !' pour faire exploser la jauge de décibels au-dessus de 85% pendant 2 secondes complètes.",
    type: 'decibel',
    gpsCoordinates: '46.235016,7.364420',
    penalty: "Tout le monde doit se tenir par la main les 15 prochaines minutes.",
    points: 100,
  },
  {
    id: 12,
    title: 'La Délivrance de Valère',
    context: "Incroyable ! Vous êtes au sommet, pile devant le Château de Valère. Le ravisseur capitule et vous rend virtuellement vos clés de voiture. Fin du calvaire.",
    instruction: "Devant le Château de Valère, prenez l'ultime photo de groupe de la victoire : visages complètement déformés, langues tirées, yeux exorbités, en faisant le signe V avec les doigts. Vous êtes des légendes !",
    type: 'photo',
    gpsCoordinates: '46.234188,7.365279',
    penalty: 'Le dernier en bas des escaliers paie la première tournée générale au premier bistrot trouvé en bas. C\'est contractuel.',
    points: 100,
  }
]

export const TOTAL_STEPS = 12
export const POINTS_PER_STEP_BASE = 100