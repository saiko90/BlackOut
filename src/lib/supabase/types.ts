export type Profile = {
  id: string
  username: string | null
  avatar_url: string | null
  created_at: string
}

export type Token = {
  id: string
  user_id: string
  city: string
  is_used: boolean
  gift_code: string | null
  created_at: string
  used_at: string | null
}

export type GameSession = {
  id: string
  user_id: string
  team_name: string
  city: string
  start_time: string
  end_time: string | null
  score: number
  is_completed: boolean
  final_video_url: string | null
}

export type MediaUpload = {
  id: string
  session_id: string
  user_id: string
  step_number: number
  media_url: string
  media_type: 'photo' | 'video'
  created_at: string
}
