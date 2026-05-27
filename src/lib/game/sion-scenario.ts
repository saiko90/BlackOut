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
    context: 'La journée commence en douceur. Trop en douceur.',
    instruction:
      'Chantez une berceuse à genoux devant la statue de la Planta.\nFilmez la scène complète, sans coupure.',
    type: 'video',
    gpsCoordinates: '46.2333,7.3602',   // Place de la Planta, Sion
    penalty: 'Le capitaine marche à reculons jusqu\'à la prochaine étape.',
    points: 100,
  },
  {
    id: 2,
    title: 'L\'Ardoise',
    context: 'Les habitants de Sion sont généreux. En théorie.',
    instruction:
      'Approchez un inconnu Place du Midi et proposez un troc : donnez un objet de votre poche contre n\'importe quoi.\nPhoto du troc (ou du refus).',
    type: 'photo',
    gpsCoordinates: '46.2314,7.3600',   // Place du Midi, Sion
    penalty: 'Toute l\'équipe fait un handstand (ou tente) sur la place pendant 15 secondes.',
    points: 120,
  },
  {
    id: 3,
    title: 'Code Secret',
    context: 'La vieille ville garde ses secrets gravés dans la pierre.',
    instruction:
      'Trouvez le bâtiment historique indiqué sur votre carte et relevez l\'année gravée sur la porte principale.\nEntrez uniquement les 4 chiffres.',
    type: 'text',
    gpsCoordinates: '46.2343,7.3592',   // Vieille ville, Sion
    expectedAnswer: '1845',
    penalty: 'Criez "Je suis une licorne !" à pleine voix dans la prochaine rue commerçante.',
    points: 150,
  },
  // Étapes 4–10 à compléter — réserve la même structure Step
]

export const TOTAL_STEPS = 10
export const POINTS_PER_STEP_BASE = 100
