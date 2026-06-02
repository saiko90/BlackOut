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

export async function getAdminStats(): Promise<AdminStats | { error: string }> {
  try {
    const supabase = getSupabaseAdmin()

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayIso = todayStart.toISOString()

    const [
      usersRes,
      totalPassesRes,
      passesTodayRes,
      usedPassesRes,
      activeSessionsRes,
      completedSessionsRes,
      recentSessionsRes,
    ] = await Promise.all([
      supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      supabase.from('tokens').select('*', { count: 'exact', head: true }),
      supabase.from('tokens').select('*', { count: 'exact', head: true }).gte('created_at', todayIso),
      supabase.from('tokens').select('*', { count: 'exact', head: true }).eq('is_used', true),
      supabase.from('game_sessions').select('*', { count: 'exact', head: true }).eq('is_completed', false),
      supabase.from('game_sessions').select('*', { count: 'exact', head: true }).eq('is_completed', true),
      supabase.from('game_sessions')
        .select('id, team_name, city, score, is_completed, start_time, current_step')
        .order('start_time', { ascending: false })
        .limit(8),
    ])

    const users      = usersRes.data?.users ?? []
    const totalUsers = users.length
    const usersToday = users.filter(u => new Date(u.created_at) >= todayStart).length

    const totalPasses     = totalPassesRes.count     ?? 0
    const passesToday     = passesTodayRes.count     ?? 0
    const usedPasses      = usedPassesRes.count      ?? 0
    const activeSessions  = activeSessionsRes.count  ?? 0
    const completedSessions = completedSessionsRes.count ?? 0

    return {
      totalUsers,
      usersToday,
      totalPasses,
      passesToday,
      usedPasses,
      activeSessions,
      completedSessions,
      estimatedRevenueCHF: totalPasses * 29,
      recentSessions: (recentSessionsRes.data ?? []) as RecentSession[],
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error(`[getAdminStats] ${message}`)
    return { error: message }
  }
}
