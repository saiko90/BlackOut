-- ============================================================
-- BLACK OUT ! — Migration initiale
-- À exécuter dans le SQL Editor de Supabase
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. PROFILES
-- Liée à auth.users via trigger automatique à la création
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username   TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Trigger : crée un profil vide dès qu'un user s'inscrit
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS policies — profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ────────────────────────────────────────────────────────────
-- 2. TOKENS
-- Jeton d'accès acheté par un utilisateur pour une ville
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  city       TEXT NOT NULL,
  is_used    BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  used_at    TIMESTAMPTZ
);

ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tokens"
  ON public.tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tokens"
  ON public.tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Mise à jour réservée au système (fonction server-side via service_role)
CREATE POLICY "Service role can update tokens"
  ON public.tokens FOR UPDATE
  USING (auth.role() = 'service_role');


-- ────────────────────────────────────────────────────────────
-- 3. GAME SESSIONS
-- Une partie lancée par un utilisateur (ou équipe)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_name    TEXT NOT NULL,
  city         TEXT NOT NULL,
  start_time   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  end_time     TIMESTAMPTZ,
  score        INTEGER DEFAULT 0 NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE NOT NULL
);

ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
  ON public.game_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON public.game_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.game_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- 4. MEDIA UPLOADS
-- Photos/vidéos prises lors des défis en jeu
-- Nettoyage automatique possible via cron (storage + table)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.media_uploads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  media_url   TEXT NOT NULL,
  media_type  TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.media_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own media"
  ON public.media_uploads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own media"
  ON public.media_uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Permet à Shotstack / service backend de lire les médias d'une session
CREATE POLICY "Service role can read all media"
  ON public.media_uploads FOR SELECT
  USING (auth.role() = 'service_role');


-- ────────────────────────────────────────────────────────────
-- 5. INDEXES pour les requêtes fréquentes
-- ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tokens_user_id        ON public.tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_tokens_city           ON public.tokens(city);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_media_session_id      ON public.media_uploads(session_id);
CREATE INDEX IF NOT EXISTS idx_media_user_id         ON public.media_uploads(user_id);


-- ────────────────────────────────────────────────────────────
-- 6. STORAGE BUCKET pour les médias (à activer dans le dashboard)
-- Exécute ce bloc séparément si tu veux le créer via SQL
-- ────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'game-media',
  'game-media',
  FALSE,
  52428800, -- 50 MB max par fichier
  ARRAY['image/jpeg','image/png','image/webp','video/mp4','video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

-- Policy Storage : chaque user peut lire/écrire dans son propre dossier
CREATE POLICY "Users can upload to their folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'game-media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can read their own media"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'game-media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Service role full access to game-media"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'game-media'
    AND auth.role() = 'service_role'
  );
