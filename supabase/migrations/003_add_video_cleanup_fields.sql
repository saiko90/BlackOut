-- ============================================================
-- BLACK OUT ! — Migration 003 : Champs nettoyage vidéo
-- À exécuter dans le SQL Editor de Supabase
-- ============================================================

ALTER TABLE public.game_sessions
  ADD COLUMN IF NOT EXISTS shotstack_render_id TEXT,
  ADD COLUMN IF NOT EXISTS video_expires_at     TIMESTAMPTZ;

-- Index pour la requête de cleanup (filtre sur expiration + URL non nulle)
CREATE INDEX IF NOT EXISTS idx_game_sessions_video_expires_at
  ON public.game_sessions(video_expires_at)
  WHERE final_video_url IS NOT NULL;
