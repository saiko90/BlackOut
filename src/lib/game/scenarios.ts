import type { Step } from './sion-scenario'
import { SION_SCENARIO } from './sion-scenario'
import { LAUSANNE_SCENARIO } from './lausanne-scenario'

export const SCENARIOS: Record<string, Step[]> = {
  Sion: SION_SCENARIO,
  Lausanne: LAUSANNE_SCENARIO,
}

export function getScenario(city: string | undefined | null): Step[] {
  if (!city) return SION_SCENARIO
  return SCENARIOS[city] ?? SION_SCENARIO
}

export const TOTAL_STEPS = 12
