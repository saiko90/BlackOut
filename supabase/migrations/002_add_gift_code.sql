-- ============================================================
-- BLACK OUT ! — Migration 002 : Colonne gift_code sur tokens
-- À exécuter dans le SQL Editor de Supabase
-- ============================================================

ALTER TABLE public.tokens
  ADD COLUMN IF NOT EXISTS gift_code TEXT UNIQUE;

-- Index dédié pour la recherche par code cadeau (usage fréquent)
CREATE INDEX IF NOT EXISTS idx_tokens_gift_code ON public.tokens(gift_code)
  WHERE gift_code IS NOT NULL;

-- Policy : permettre à n'importe quel user authentifié de réclamer
--          un token via son gift_code (UPDATE limité aux colonnes nécessaires)
CREATE POLICY "Authenticated users can redeem gift tokens"
  ON public.tokens FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND gift_code IS NOT NULL
    AND is_used = FALSE
  )
  WITH CHECK (
    auth.uid() = user_id
  );
