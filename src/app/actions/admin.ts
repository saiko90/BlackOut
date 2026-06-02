'use server'

import { getSupabaseAdmin } from '@/lib/supabase/admin'

export type AdminStats = {
  totalUsers: number
  usersToday: number
  totalPasses: number
  passesToday: number
  usedPasses: number
  activeSessions: number
  completedSessions: number
  estimatedRevenueCHF: number
  recentSessions: RecentSession[]
}

export type RecentSession = {
  id: string
  team_name: string
  city: string
  score: number
  is_completed: boolean
  start_time: string
  current_step: number
}

// Comptes à exclure des métriques de vente et de jeu (tests dev)
const TEST_EMAILS = ['m.kaeser90@gmail.com', 'contact@theblackoutgame.ch']

export async function getAdminStats(): Promise<AdminStats | { error: string }> {
  try {
    const supabase = getSupabaseAdmin()

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayIso = todayStart.toISOString()

    // ── PHASE 1 : récupérer tous les utilisateurs ─────────────────────────────
    // Nécessaire pour (a) les compteurs d'inscription et
    // (b) résoudre les UUIDs des comptes de test avant les requêtes filtrées.
    const usersRes = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
    const users    = usersRes.data?.users ?? []

    // Métriques d'inscription — PAS filtrées, tous les comptes comptent
    const totalUsers = users.length
    const usersToday = users.filter(u => new Date(u.created_at) >= todayStart).length

    // Résolution des UUIDs de test
    const testUserIds = users
      .filter(u => u.email && TEST_EMAILS.includes(u.email))
      .map(u => u.id)

    // ── PHASE 2 : requêtes filtrées (ventes & sessions) ───────────────────────
    // On exclut les comptes de test via leurs UUIDs.
    // Si aucun compte de test n'existe encore en base, aucun filtre n'est appliqué.
    const notIn = testUserIds.length > 0 ? `(${testUserIds.join(',')})` : null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const excl = (q: any) => (notIn ? q.not('user_id', 'in', notIn) : q)

    const [
      totalPassesRes,
      passesTodayRes,
      usedPassesRes,
      activeSessionsRes,
      completedSessionsRes,
      recentSessionsRes,
    ] = await Promise.all([
      excl(supabase.from('tokens').select('*', { count: 'exact', head: true })),
      excl(supabase.from('tokens').select('*', { count: 'exact', head: true }).gte('created_at', todayIso)),
      excl(supabase.from('tokens').select('*', { count: 'exact', head: true }).eq('is_used', true)),
      excl(supabase.from('game_sessions').select('*', { count: 'exact', head: true }).eq('is_completed', false)),
      excl(supabase.from('game_sessions').select('*', { count: 'exact', head: true }).eq('is_completed', true)),
      excl(
        supabase
          .from('game_sessions')
          .select('id, team_name, city, score, is_completed, start_time, current_step')
          .order('start_time', { ascending: false })
          .limit(8),
      ),
    ])

    return {
      totalUsers,
      usersToday,
      totalPasses:          totalPassesRes.count       ?? 0,
      passesToday:          passesTodayRes.count        ?? 0,
      usedPasses:           usedPassesRes.count         ?? 0,
      activeSessions:       activeSessionsRes.count     ?? 0,
      completedSessions:    completedSessionsRes.count  ?? 0,
      estimatedRevenueCHF: (totalPassesRes.count ?? 0) * 29,
      recentSessions:       (recentSessionsRes.data ?? []) as RecentSession[],
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error(`[getAdminStats] ${message}`)
    return { error: message }
  }
}
