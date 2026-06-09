-- ============================================================
-- BLACK OUT ! — Migration 004 : Colonne promo_code sur tokens
-- Permet de tracer quel code promo a servi à acheter un token
-- et ainsi bloquer la réutilisation du même code par le même user.
-- À exécuter dans le SQL Editor de Supabase
-- ============================================================

ALTER TABLE public.tokens
  ADD COLUMN IF NOT EXISTS promo_code TEXT;

CREATE INDEX IF NOT EXISTS idx_tokens_promo_code_user
  ON public.tokens(user_id, promo_code)
  WHERE promo_code IS NOT NULL;
