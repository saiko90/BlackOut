export type StepType = 'photo' | 'video' | 'text' | 'audio'

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
    title: 'Le Réveil',
    context: 'La journée commence. Ta tête résonne. Un inconnu vous a piqué vos clés de voiture cette nuit. Il veut jouer.',
    instruction: 'Chantez une berceuse à genoux devant la statue de la Planta. Filmez la scène complète sans coupure.',
    type: 'video',
    gpsCoordinates: '46.2305,7.3592',
    penalty: "Le capitaine de l'équipe marche à reculons jusqu'au prochain défi.",
    points: 100,
  },
  {
    id: 2,
    title: 'La Rançon',
    context: "L'inconnu aime le chaos. Faut récupérer ces clés. Il vous envoie vers la zone piétonne.",
    instruction: "Abordez un inconnu à la Place du Midi et proposez-lui d'échanger un objet (stylo, caillou) contre un autre objet à lui. Prenez le troc en photo.",
    type: 'photo',
    gpsCoordinates: '46.2291,7.3597',
    penalty: 'Faites 10 pompes au milieu de la place.',
    points: 100,
  },
  {
    id: 3,
    title: 'Code Secret',
    context: 'Le contact vous envoie vers la vieille ville pour chercher un vieux code.',
    instruction: "Trouvez l'Hôtel de Ville. Quelle est l'année gravée sur la plaque/porte principale ?\n(Entrez 4 chiffres)",
    type: 'text',
    gpsCoordinates: '46.2335,7.3595',
    expectedAnswer: '1845',
    penalty: "Criez 'Je suis une licorne' à pleine voix.",
    points: 100,
  },
  {
    id: 4,
    title: "L'Expiation",
    context: 'Vous avez fait des choses sombres hier soir. Vous devez expier vos péchés près de la Cathédrale.',
    instruction: "Mettez-vous à genoux devant l'entrée et confessez face caméra un crime ridicule commis la veille (ex: vol de cervelas).",
    type: 'video',
    gpsCoordinates: '46.2331,7.3585',
    penalty: 'Faites le poirier (équilibre) contre un mur.',
    points: 100,
  },
  {
    id: 5,
    title: 'VIP Sécurité',
    context: "L'air devient lourd. L'inconnu vous observe vers la Majorie.",
    instruction: "Prenez la pose : deux d'entre vous jouent les gardes du corps (lunettes, oreillettes invisibles) pour protéger... un lampadaire.",
    type: 'photo',
    gpsCoordinates: '46.2343,7.3601',
    penalty: 'Marchez en crabe sur 20 mètres.',
    points: 100,
  },
  {
    id: 6,
    title: 'La Sérénade',
    context: 'Retour vers la civilisation. Vos cordes vocales doivent chauffer.',
    instruction: "Chantez le refrain de 'My Heart Will Go On' (Céline Dion) à un mannequin dans une vitrine de la rue du Grand-Pont.",
    type: 'video',
    gpsCoordinates: '46.2325,7.3598',
    penalty: 'Faites 15 burpees.',
    points: 100,
  },
  {
    id: 7,
    title: 'Ascension Extrême',
    context: 'Sur le chemin de Tourbillon, la fatigue se fait sentir.',
    instruction: "Prenez une photo en mode 'survie extrême', avec des têtes de gens épuisés, alors que vous êtes juste assis sur un simple banc.",
    type: 'photo',
    gpsCoordinates: '46.2355,7.3615',
    penalty: 'Le plus jeune porte le plus vieux sur son dos sur 10 mètres.',
    points: 100,
  },
  {
    id: 8,
    title: 'Gardien du Savoir',
    context: 'La culture vous sauvera. Ou pas.',
    instruction: 'Combien y a-t-il de châteaux majestueux qui dominent immédiatement la ville de Sion ?',
    type: 'text',
    gpsCoordinates: '46.2338,7.3621',
    expectedAnswer: '2',
    penalty: "Criez 'Je suis le roi du Valais' en levant les bras.",
    points: 100,
  },
  {
    id: 9,
    title: "Prise d'Otage",
    context: "Les clés sont proches. L'inconnu veut une preuve de votre soumission.",
    instruction: "Mimez une scène dramatique d'otage. L'arme doit être un objet absurde (baguette de pain, parapluie, chaussure).",
    type: 'photo',
    gpsCoordinates: '46.2340,7.3630',
    penalty: 'Roulez par terre sur 3 mètres.',
    points: 100,
  },
  {
    id: 10,
    title: 'Le Black Out',
    context: "C'est fini. Vous avez gagné le respect de l'inconnu et retrouvé vos clés.",
    instruction: "Trinquez avec ce que vous avez sous la main (même de l'eau) en hurlant 'ON A SURVÉCU AU BLACK OUT !'.",
    type: 'video',
    gpsCoordinates: '46.2315,7.3590',
    penalty: 'Payez la prochaine tournée. Obligatoire.',
    points: 100,
  },
]

export const TOTAL_STEPS = 10
export const POINTS_PER_STEP_BASE = 100
